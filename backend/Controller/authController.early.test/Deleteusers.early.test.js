
// Unit tests for: Deleteusers




// const { Deleteusers } = require('../authController');
// const User = require("../../Models/User");
const { VERIFICATION_EMAIL_TEMPLATE } = require("../../utils/emailTemplates");
const {validateUser} = require("../../utils/Uservalidator")
const { Deleteusers } = require('../../Controller/authController');
const User = require('../../Models/User');

jest.mock("../../Models/User");

describe('Deleteusers() Deleteusers method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Paths', () => {
    it('should delete users with isdb set to false and return a success message', async () => {
      // Arrange: Mock the User.deleteMany method to simulate successful deletion
      User.deleteMany.mockResolvedValue({ deletedCount: 3 });

      // Act: Call the Deleteusers function
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await Deleteusers(req, res);

      // Assert: Verify that the correct response is sent
      expect(User.deleteMany).toHaveBeenCalledWith({ isdb: false });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'users with isDb = false have been deleted successfully.',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors gracefully and return a server error message', async () => {
      // Arrange: Mock the User.deleteMany method to simulate an error
      User.deleteMany.mockRejectedValue(new Error('Database error'));

      // Act: Call the Deleteusers function
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await Deleteusers(req, res);

      // Assert: Verify that the error response is sent
      expect(User.deleteMany).toHaveBeenCalledWith({ isdb: false });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error. Please try again later.',
      });
    });
  });
});

// End of unit tests for: Deleteusers
