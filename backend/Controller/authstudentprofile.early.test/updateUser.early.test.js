
// Unit tests for: updateUser




const { updateUser } = require('../authstudentprofile');
const User = require("../../Models/User");
const { VERIFICATION_EMAIL_TEMPLATE } = require("../../utils/emailTemplates");
jest.mock("../../Models/User");

describe('updateUser() updateUser method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { userId: '123' },
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashedpassword',
        image: 'imageurl',
        isVerified: true,
        additionalDetails: 'Some details'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('Happy paths', () => {
    it('should update the user successfully and return the updated user', async () => {
      // Arrange
      const updatedUser = { ...req.body, _id: req.params.userId };
      User.findByIdAndUpdate.mockResolvedValue(updatedUser);

      // Act
      await updateUser(req, res);

      // Assert
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        req.params.userId,
        req.body,
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'SUCCESS',
        message: 'User updated successfully',
        data: updatedUser
      });
    });
  });

  describe('Edge cases', () => {
    it('should return 404 if the user is not found', async () => {
      // Arrange
      User.findByIdAndUpdate.mockResolvedValue(null);

      // Act
      await updateUser(req, res);

      // Assert
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        req.params.userId,
        req.body,
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle errors gracefully and return 500', async () => {
      // Arrange
      const errorMessage = 'Database error';
      User.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

      // Act
      await updateUser(req, res);

      // Assert
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        req.params.userId,
        req.body,
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating user' });
    });

    // it('should handle missing userId in params', async () => {
    //   // Arrange
    //   req.params.userId = undefined;

    //   // Act
    //   await updateUser(req, res);

    //   // Assert
    //   expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith({ message: 'Error updating user' });
    // });

    it('should handle missing fields in the request body', async () => {
      // Arrange
      req.body = {};

      // Act
      await updateUser(req, res);

      // Assert
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        req.params.userId,
        req.body,
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating user' });
    });
  });
});

// End of unit tests for: updateUser
