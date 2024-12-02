
// Unit tests for: Deletecolleges




// const { Deletecolleges } = require('../authCollege');
const College = require("../../Models/College");
const { VERIFICATION_EMAIL_TEMPLATE } = require("../../utils/emailTemplates");
const {validateUser} = require("../../utils/Uservalidator")
const { Deletecolleges } = require('../../Controller/authCollege');
jest.mock("../../Models/College");

describe('Deletecolleges() Deletecolleges method', () => {
  
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should delete colleges with isdb set to false and return a success message', async () => {
      // Arrange: Mock the deleteMany method to simulate successful deletion
      College.deleteMany.mockResolvedValue({ deletedCount: 3 });

      // Act: Call the Deletecolleges function
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await Deletecolleges(req, res);

      // Assert: Check if the response is as expected
      expect(College.deleteMany).toHaveBeenCalledWith({ isdb: false });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'colleges with isDb = false have been deleted successfully.',
      });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle errors gracefully and return a server error message', async () => {
      // Arrange: Mock the deleteMany method to simulate an error
      College.deleteMany.mockRejectedValue(new Error('Database error'));

      // Act: Call the Deletecolleges function
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await Deletecolleges(req, res);

      // Assert: Check if the error is handled correctly
      expect(College.deleteMany).toHaveBeenCalledWith({ isdb: false });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error. Please try again later.',
      });
    });

    it('should handle the case where no colleges are deleted', async () => {
      // Arrange: Mock the deleteMany method to simulate no deletions
      College.deleteMany.mockResolvedValue({ deletedCount: 0 });

      // Act: Call the Deletecolleges function
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await Deletecolleges(req, res);

      // Assert: Check if the response is as expected
      expect(College.deleteMany).toHaveBeenCalledWith({ isdb: false });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'colleges with isDb = false have been deleted successfully.',
      });
    });
  });
});

// End of unit tests for: Deletecolleges
