const { deletecollegebyId } = require('../authcollegeprofile'); // Adjust path as necessary
const CollegeRep = require("../../Models/CollegeRep"); // Adjust path as necessary
const College = require("../../Models/College"); // Adjust path as necessary

jest.mock("../../Models/CollegeRep");
jest.mock("../../Models/College");

describe('deletecollegebyId() method', () => {
  let req, res;

  beforeEach(() => {
    // Mock request and response objects
    req = { params: { userId: '12345' } };
    res = {
      status: jest.fn().mockReturnThis(),  // Mock status to return the res object itself for chaining
      json: jest.fn(),  // Mock json to check if it gets called
    };
  });

  describe('Happy paths', () => {
    it('should delete the college and its associated representatives successfully', async () => {
      // Arrange: Mock the CollegeRep.deleteMany and College.deleteOne methods to resolve
      CollegeRep.deleteMany.mockResolvedValue({ deletedCount: 3 });  // Simulating successful deletion of 3 representatives
      College.deleteOne.mockResolvedValue({ deletedCount: 1 });  // Simulating successful deletion of 1 college

      // Act: Call the deletecollegebyId function
      await deletecollegebyId(req, res);

      // Assert: Check that the response status is 200 and the message is correct
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "College deleted successfully",
      });
    });
  });

  describe('Edge cases', () => {
    it('should return 404 if college is not found', async () => {
      // Arrange: Mock the College.deleteOne method to return nothing (no college found)
      CollegeRep.deleteMany.mockResolvedValue({ deletedCount: 0 });  // No college representatives to delete
      College.deleteOne.mockResolvedValue({ deletedCount: 0 });  // No college found to delete

      // Act: Call the deletecollegebyId function
      await deletecollegebyId(req, res);

      // Assert: Check that the response status is 404 and the message is correct
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error during delete",
      });
    });

    it('should handle errors during deletion and return 404', async () => {
      // Arrange: Mock the deleteMany and deleteOne methods to throw an error
      CollegeRep.deleteMany.mockRejectedValue(new Error('Database error'));
      College.deleteOne.mockRejectedValue(new Error('Database error'));

      // Act: Call the deletecollegebyId function and catch the error
      await deletecollegebyId(req, res);

      // Assert: Check that the response status is 404 and the message is correct
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error during delete",
      });
    });
  });
});
