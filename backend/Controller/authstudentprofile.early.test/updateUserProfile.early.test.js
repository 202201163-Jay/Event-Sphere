
// Unit tests for: updateUserProfile




// const { updateUserProfile } = require('../authstudentprofile');
// const UserProfile = require("../../Models/UserProfile");
const { VERIFICATION_EMAIL_TEMPLATE } = require("../../utils/emailTemplates");
const { updateUserProfile } = require('../../Controller/authstudentprofile');
const UserProfile = require('../../Models/UserProfile');

jest.mock("../../Models/UserProfile");

describe('updateUserProfile() updateUserProfile method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'userProfileId' },
      body: {
        gender: 'male',
        dateOfBirth: '1990-01-01',
        about: 'About me',
        participated: ['event1', 'event2']
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('Happy paths', () => {
    it('should update the user profile successfully', async () => {
      // Arrange
      const updatedUserProfile = {
        _id: 'userProfileId',
        gender: 'male',
        dateOfBirth: '1990-01-01',
        about: 'About me',
        participated: ['event1', 'event2']
      };
      UserProfile.findByIdAndUpdate.mockResolvedValue(updatedUserProfile);

      // Act
      await updateUserProfile(req, res);

      // Assert
      expect(UserProfile.findByIdAndUpdate).toHaveBeenCalledWith(
        'userProfileId',
        {
          gender: 'male',
          dateOfBirth: '1990-01-01',
          about: 'About me',
          participated: ['event1', 'event2']
        },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'SUCCESS',
        message: 'User profile updated successfully',
        data: updatedUserProfile
      });
    });
  });

  describe('Edge cases', () => {
    it('should return 404 if user profile is not found', async () => {
      // Arrange
      UserProfile.findByIdAndUpdate.mockResolvedValue(null);

      // Act
      await updateUserProfile(req, res);

      // Assert
      expect(UserProfile.findByIdAndUpdate).toHaveBeenCalledWith(
        'userProfileId',
        {
          gender: 'male',
          dateOfBirth: '1990-01-01',
          about: 'About me',
          participated: ['event1', 'event2']
        },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User profile not found' });
    });

    it('should handle errors gracefully and return 500', async () => {
      // Arrange
      const errorMessage = 'Error updating user profile';
      UserProfile.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

      // Act
      await updateUserProfile(req, res);

      // Assert
      expect(UserProfile.findByIdAndUpdate).toHaveBeenCalledWith(
        'userProfileId',
        {
          gender: 'male',
          dateOfBirth: '1990-01-01',
          about: 'About me',
          participated: ['event1', 'event2']
        },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating user profile' });
    });
  });
});

// End of unit tests for: updateUserProfile
