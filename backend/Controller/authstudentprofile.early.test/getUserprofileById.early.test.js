
// Unit tests for: getUserprofileById




const { getUserprofileById } = require('../authstudentprofile');
const UserProfile = require("../../Models/UserProfile");
const { VERIFICATION_EMAIL_TEMPLATE } = require("../../utils/emailTemplates");
jest.mock("../../Models/UserProfile");

describe('getUserprofileById() getUserprofileById method', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: '12345' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('Happy Paths', () => {
    it('should return user profile when user is found', async () => {
      // Arrange: Mock UserProfile.findOne to return a user object
      const mockUser = { _id: '12345', name: 'John Doe' };
      UserProfile.findOne.mockResolvedValue(mockUser);

      // Act: Call the function
      await getUserprofileById(req, res);

      // Assert: Check if the response is as expected
      expect(UserProfile.findOne).toHaveBeenCalledWith({ _id: '12345' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'SUCCESS',
        message: 'User found',
        data: mockUser,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return 404 when user is not found', async () => {
      // Arrange: Mock UserProfile.findOne to return null
      UserProfile.findOne.mockResolvedValue(null);

      // Act: Call the function
      await getUserprofileById(req, res);

      // Assert: Check if the response is as expected
      expect(UserProfile.findOne).toHaveBeenCalledWith({ _id: '12345' });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 500 when there is a server error', async () => {
      // Arrange: Mock UserProfile.findOne to throw an error
      UserProfile.findOne.mockRejectedValue(new Error('Database error'));

      // Act: Call the function
      await getUserprofileById(req, res);

      // Assert: Check if the response is as expected
      expect(UserProfile.findOne).toHaveBeenCalledWith({ _id: '12345' });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving user data' });
    });
  });
});

// End of unit tests for: getUserprofileById
