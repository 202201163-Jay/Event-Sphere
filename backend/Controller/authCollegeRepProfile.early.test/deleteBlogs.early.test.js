
// Unit tests for: deleteBlogs




// const { deleteBlogs } = require('../authCollegeRepProfile');
const Blog = require("../../Models/Blog")
const { deleteBlogs } = require('../../Controller/authCollegeRepProfile');
jest.mock("../../Models/Blog");

describe('deleteBlogs() deleteBlogs method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                id: 'validBlogId'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Happy Paths', () => {
        it('should delete a blog and return status 200 with success message', async () => {
            // Arrange: Mock the Blog.deleteOne method to simulate successful deletion
            Blog.deleteOne.mockResolvedValue({ deletedCount: 1 });

            // Act: Call the deleteBlogs function
            await deleteBlogs(req, res);

            // Assert: Check if the response status and json methods were called with expected values
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ ok: true });
        });
    });

    describe('Edge Cases', () => {
        it('should handle the case where the blog does not exist', async () => {
            // Arrange: Mock the Blog.deleteOne method to simulate no blog found
            Blog.deleteOne.mockResolvedValue({ deletedCount: 0 });

            // Act: Call the deleteBlogs function
            await deleteBlogs(req, res);

            // Assert: Check if the response status and json methods were called with expected values
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ ok: true });
        });

        it('should handle errors gracefully and return status 500', async () => {
            // Arrange: Mock the Blog.deleteOne method to throw an error
            Blog.deleteOne.mockRejectedValue(new Error('Database error'));

            // Act: Call the deleteBlogs function
            await deleteBlogs(req, res);

            // Assert: Check if the response status and json methods were called with expected values
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Failed to retrieve Blogs information" });
        });
    });
});

// End of unit tests for: deleteBlogs
