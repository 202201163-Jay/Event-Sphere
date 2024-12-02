
const { uploadOnCloudinary } = require("../../config/cloudinary");
const Blog = require('../../Models/Blog');
const {upload} = require("../../middleware/multer")
const { createBlog } = require('../../Controller/blogcontroller');
jest.mock("../../Models/Blog");
jest.mock("../../config/cloudinary");
jest.mock("../../middleware/multer");

describe('createBlog() createBlog method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        title: 'Test Blog',
        content: 'This is a test blog content',
        date: '2023-10-01',
        college: 'Test College',
        clubId: '12345',
      },
      files: [
        { path: 'path/to/image1.jpg' },
        { path: 'path/to/image2.jpg' },
      ],
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    upload.mockImplementation((req, res, callback) => callback(null));
    uploadOnCloudinary.mockResolvedValue({ url: 'http://cloudinary.com/image.jpg' });
  });

  describe('Happy Paths', () => {
    it('should create a blog successfully with valid inputs', async () => {
      
      Blog.prototype.save = jest.fn().mockResolvedValue();

      await createBlog(req, res);

      expect(upload).toHaveBeenCalledWith(req, res, expect.any(Function));
      expect(uploadOnCloudinary).toHaveBeenCalledTimes(req.files.length);
      expect(Blog.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Blog created successfully!',
        blog: expect.any(Object),
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle file upload error', async () => {
   
      upload.mockImplementation((req, res, callback) => callback(new Error('Upload error')));

    
      await createBlog(req, res);

      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'File upload error',
        error: expect.any(Error),
      });
    });

    it('should handle cloudinary upload failure', async () => {
      
      uploadOnCloudinary.mockRejectedValue(new Error('Cloudinary error'));

      
      await createBlog(req, res);

      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'An error occurred while creating the blog',
        error: 'Cloudinary error',
      });
    });

    it('should handle database save error', async () => {
      
      Blog.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      await createBlog(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'An error occurred while creating the blog',
        error: 'Database error',
      });
    });

    it('should handle missing fields in request body', async () => {
      
      req.body = {}; 

     await createBlog(req, res);

      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'An error occurred while creating the blog',
        error: expect.any(String),
      });
    });
  });
});

