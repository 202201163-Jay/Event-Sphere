
// Unit tests for: deleteUserbyId




const { deleteUserbyId } = require('../authstudentprofile');
const User = require("../../Models/User");
const UserProfile = require("../../Models/UserProfile");
const { VERIFICATION_EMAIL_TEMPLATE } = require("../../utils/emailTemplates");
jest.mock("../../Models/User");
jest.mock("../../Models/UserProfile");

describe('deleteUserbyId() deleteUserbyId method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        userId: '12345',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('Happy Paths', () => {
    it('should delete a user and their profile successfully', async () => {
      // Arrange
      const user = { _id: '12345', additionalDetails: '67890' };
      User.findOne.mockResolvedValue(user);
      User.deleteOne.mockResolvedValue({ deletedCount: 1 });
      UserProfile.deleteOne.mockResolvedValue({ deletedCount: 1 });

      // Act
      await deleteUserbyId(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ _id: '12345' });
      expect(User.deleteOne).toHaveBeenCalledWith({ _id: '12345' });
      expect(UserProfile.deleteOne).toHaveBeenCalledWith({ _id: '67890' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });
  });

  describe('Edge Cases', () => {
    it('should return 404 if user is not found', async () => {
      // Arrange
      User.findOne.mockResolvedValue(null);

      // Act
      await deleteUserbyId(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ _id: '12345' });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
    });

    it('should handle errors during user deletion', async () => {
      // Arrange
      const user = { _id: '12345', additionalDetails: '67890' };
      User.findOne.mockResolvedValue(user);
      User.deleteOne.mockRejectedValue(new Error('Deletion error'));

      // Act
      await deleteUserbyId(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ _id: '12345' });
      expect(User.deleteOne).toHaveBeenCalledWith({ _id: '12345' });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
    });

    it('should handle errors during user profile deletion', async () => {
      // Arrange
      const user = { _id: '12345', additionalDetails: '67890' };
      User.findOne.mockResolvedValue(user);
      User.deleteOne.mockResolvedValue({ deletedCount: 1 });
      UserProfile.deleteOne.mockRejectedValue(new Error('Profile deletion error'));

      // Act
      await deleteUserbyId(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ _id: '12345' });
      expect(User.deleteOne).toHaveBeenCalledWith({ _id: '12345' });
      expect(UserProfile.deleteOne).toHaveBeenCalledWith({ _id: '67890' });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
    });
  });
});

// End of unit tests for: deleteUserbyId
