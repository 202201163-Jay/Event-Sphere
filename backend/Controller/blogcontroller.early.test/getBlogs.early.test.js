// Import necessary modules and mock dependencies
const { getBlogs } = require('../../Controller/blogcontroller');
const Blog = require('../../Models/Blog');

// Mock the Blog model
jest.mock("../../Models/Blog");

describe('getBlogs() method', () => {
  let req, res;

  beforeEach(() => {
    req = {}; // Simulating request object
    res = {
      status: jest.fn().mockReturnThis(), // Mock response status
      json: jest.fn(), // Mock response json
    };
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return a list of blogs with populated club details and status 200', async () => {
      // Arrange: Mock the Blog.find() and populate() methods
      const mockBlogs = [
        { 
          title: 'Blog 1', 
          content: 'Content 1', 
          clubId: { _id: '123', name: 'Club 1' }
        },
        { 
          title: 'Blog 2', 
          content: 'Content 2', 
          clubId: { _id: '456', name: 'Club 2' }
        },
      ];

      // Mock Blog.find() and chain populate
      Blog.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockBlogs), // Mock the populate chain
      });

      // Act: Call the getBlogs function
      await getBlogs(req, res);

      // Assert: Verify that the response status and json were set correctly
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBlogs);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle errors and return status 500', async () => {
      // Arrange: Mock Blog.find() to throw an error in the populate chain
      Blog.find.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Database error')), // Mock a rejection
      });

      // Act: Call the getBlogs function
      await getBlogs(req, res);

      // Assert: Verify that the error was handled and response status is 500
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching blogs' });
    });

    it('should return an empty array if no blogs are found', async () => {
      // Arrange: Mock Blog.find() and populate to return an empty array
      Blog.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([]), // Mock empty result
      });

      // Act: Call the getBlogs function
      await getBlogs(req, res);

      // Assert: Verify that the response status is 200 and json is an empty array
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });
});