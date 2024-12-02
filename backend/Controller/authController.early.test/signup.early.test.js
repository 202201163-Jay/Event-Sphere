const bcrypt = require("bcrypt");
const User = require("../../Models/User");
const UserProfile = require("../../Models/UserProfile");
const { signup } = require('../../Controller/authController');
jest.mock("../../Models/User");
jest.mock("../../Models/UserProfile");
jest.mock("bcrypt");
jest.mock("../../utils/mailsender");
jest.mock("../../utils/Uservalidator");

describe('signup() method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the behavior of bcrypt and other functions
    bcrypt.hash.mockResolvedValue('hashedPassword');
    User.findOne.mockResolvedValue(null);  // No user found initially
    UserProfile.create.mockResolvedValue({ _id: 'profileId' });
    // Mock User.prototype.save
    User.prototype.save = jest.fn().mockResolvedValue({ _id: 'userId' });
    // Mock the validation function to always return no errors
    require("../../utils/Uservalidator").validateUser.mockReturnValue({ error: null });
  });

  describe('Happy Path', () => {
    it('should successfully create a new user and send verification email', async () => {
      // Call the signup function with the mocked req and res
      await signup(req, res);

      // Assert that the methods are called correctly
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
      expect(UserProfile.create).toHaveBeenCalled();
      expect(User.prototype.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        status: 'PENDING',
        message: 'Verification otp email sent',
        data: {
          userId: 'userId',
          email: req.body.email,
        },
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return error if passwords do not match', async () => {
      req.body.confirmPassword = 'DifferentPassword'; // Simulate password mismatch

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Passwords do not match' });
    });

    it('should return error if user already exists', async () => {
      User.findOne.mockResolvedValue({ _id: 'existingUserId' }); // Simulate existing user

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User with this email already exists' });
    });

    it('should return error if password validation fails', async () => {
      require("../../utils/Uservalidator").validateUser.mockReturnValue({
        error: {
          details: [{ context: { key: 'password' }, message: 'Password is too weak' }],
        },
      });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password is too weak' });
    });

    it('should return error if profile creation fails', async () => {
      UserProfile.create.mockRejectedValue(new Error('Profile creation failed')); // Simulate profile creation error

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error registering user' });
    });

    it('should handle server errors gracefully when saving user', async () => {
      User.prototype.save.mockRejectedValue(new Error('Database error')); // Simulate database error during user save

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error registering user' });
    });
  });
});
