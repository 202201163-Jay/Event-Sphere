
// Unit tests for: getBlogById




// const { getBlogById } = require('../blogcontroller');
const { uploadOnCloudinary } = require("../../config/cloudinary");
// const Blog = require('../../Models/Blog');
const {upload} = require("../../middleware/multer")
const { getBlogById } = require('../../Controller/blogcontroller');
const Blog = require('../../Models/Blog');

jest.mock("../../Models/Blog");

describe('getBlogById() getBlogById method', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: 'someBlogId' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('Happy paths', () => {
    it('should return a blog when a valid ID is provided', async () => {
      // Arrange: Mock the Blog.findById method to return a blog
      const mockBlog = { id: 'someBlogId', title: 'Test Blog' };
      Blog.findById.mockResolvedValue(mockBlog);

      // Act: Call the getBlogById function
      await getBlogById(req, res);

      // Assert: Check that the response is correct
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBlog);
    });
  });

  describe('Edge cases', () => {
    it('should return 404 if the blog is not found', async () => {
      // Arrange: Mock the Blog.findById method to return null
      Blog.findById.mockResolvedValue(null);

      // Act: Call the getBlogById function
      await getBlogById(req, res);

      // Assert: Check that the response is correct
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Blog not found' });
    });

    it('should return 500 if there is an error fetching the blog', async () => {
      // Arrange: Mock the Blog.findById method to throw an error
      Blog.findById.mockRejectedValue(new Error('Database error'));

      // Act: Call the getBlogById function
      await getBlogById(req, res);

      // Assert: Check that the response is correct
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching the blog' });
    });
  });
});

// End of unit tests for: getBlogById
