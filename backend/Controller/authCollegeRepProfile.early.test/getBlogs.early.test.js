
// Unit tests for: getBlogs




// const { getBlogs } = require('../authCollegeRepProfile');
const Blog = require("../../Models/Blog")
const { getBlogs } = require('../../Controller/authCollegeRepProfile');
jest.mock("../../Models/Blog");

describe('getBlogs() getBlogs method', () => {
    let req, res;

    beforeEach(() => {
        req = { params: { id: 'testClubId' } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Happy Paths', () => {
        it('should return blogs when they exist for the given clubId', async () => {
            // Arrange: Mock the Blog.find method to return a list of blogs
            const mockBlogs = [{ title: 'Blog 1' }, { title: 'Blog 2' }];
            Blog.find.mockResolvedValue(mockBlogs);

            // Act: Call the getBlogs function
            await getBlogs(req, res);

            // Assert: Check that the response is correct
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBlogs);
        });

        it('should return an empty array when no blogs exist for the given clubId', async () => {
            // Arrange: Mock the Blog.find method to return an empty array
            Blog.find.mockResolvedValue([]);

            // Act: Call the getBlogs function
            await getBlogs(req, res);

            // Assert: Check that the response is correct
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });
    });

    describe('Edge Cases', () => {
        it('should return a message when blogs is null', async () => {
            // Arrange: Mock the Blog.find method to return null
            Blog.find.mockResolvedValue(null);

            // Act: Call the getBlogs function
            await getBlogs(req, res);

            // Assert: Check that the response is correct
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Blogs is not found", isBlog: false });
        });

        it('should handle errors gracefully and return a 500 status', async () => {
            // Arrange: Mock the Blog.find method to throw an error
            Blog.find.mockRejectedValue(new Error('Database error'));

            // Act: Call the getBlogs function
            await getBlogs(req, res);

            // Assert: Check that the response is correct
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Failed to retrieve Blogs information" });
        });
    });
});

// End of unit tests for: getBlogs
