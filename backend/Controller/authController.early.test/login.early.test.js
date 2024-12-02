
// Unit tests for: login




// const { login } = require('../authController');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../Models/User");
const { VERIFICATION_EMAIL_TEMPLATE } = require("../../utils/emailTemplates");
const {validateUser} = require("../../utils/Uservalidator")
const { login } = require('../../Controller/authController');
jest.mock("../../Models/User");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe('login() login method', () => {
  let req, res, user;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    user = {
      _id: 'userId123',
      email: 'test@example.com',
      password: 'hashedPassword',
      firstName: 'John',
      image: 'image_url',
    };
  });

  describe('Happy Paths', () => {
    it('should return a token and user details on successful login', async () => {
      // Arrange
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken');

      // Act
      await login(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, user.password);
      expect(jwt.sign).toHaveBeenCalledWith({ userId: user._id, type: 'student' }, 'TeamDoIt', { expiresIn: '1h' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        token: 'mockToken',
        representative: {
          id: user._id,
          email: user.email,
          name: user.firstName,
          image: user.image,
        },
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return 403 if user is not found', async () => {
      // Arrange
      User.findOne.mockResolvedValue(null);

      // Act
      await login(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 401 if password is invalid', async () => {
      // Arrange
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      // Act
      await login(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, user.password);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid password' });
    });

    it('should return 500 if there is a server error', async () => {
      // Arrange
      User.findOne.mockRejectedValue(new Error('Database error'));

      // Act
      await login(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error. Please try again later.' });
    });
  });
});

// End of unit tests for: login
