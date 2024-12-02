
// Unit tests for: signup




const { signup } = require('../authCollege');
const College = require("../../Models/College");
const bcrypt = require("bcrypt");
const { VERIFICATION_EMAIL_TEMPLATE } = require("../../utils/emailTemplates");
const {validateUser} = require("../../utils/Uservalidator")
const { sendotpVerificationEmail } = require('../../Controller/authCollege');
jest.mock("../../Models/College");
jest.mock("../../Models/CollegeRep");
jest.mock("bcrypt");
jest.mock("nodemailer");
jest.mock("../../utils/Uservalidator");
jest.mock("../../Controller/authCollege", () => ({
  ...jest.requireActual("../../Controller/authCollege"),
  sendotpVerificationEmail: jest.fn(),
}));

describe('signup() signup method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: 'Test College',
        email: 'test@college.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        emailDomain: 'college.com',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    College.findOne.mockClear();
    bcrypt.hash.mockClear();
    sendotpVerificationEmail.mockClear();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should successfully register a new college', async () => {
      // Arrange
      College.findOne.mockResolvedValueOnce(null); // No existing college
      bcrypt.hash.mockResolvedValueOnce('hashedPassword');
      validateUser.mockReturnValueOnce({ error: null });

      // Act
      await signup(req, res);

      // Assert
      expect(College.findOne).toHaveBeenCalledTimes(2);
      expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 10);
      expect(sendotpVerificationEmail).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalledWith(400);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return 400 if required fields are missing', async () => {
      // Arrange
      req.body = {};

      // Act
      await signup(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required.' });
    });

    it('should return 400 if passwords do not match', async () => {
      // Arrange
      req.body.confirmPassword = 'DifferentPassword';

      // Act
      await signup(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Passwords do not match.' });
    });

    it('should return 400 if college email is already registered', async () => {
      // Arrange
      College.findOne.mockResolvedValueOnce({}); // Existing college found

      // Act
      await signup(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'College email already registered.' });
    });

    it('should return 400 if college email domain is already registered', async () => {
      // Arrange
      College.findOne.mockResolvedValueOnce(null); // No existing college email
      College.findOne.mockResolvedValueOnce({}); // Existing college domain found

      // Act
      await signup(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'College email domain already registered.' });
    });

    it('should return 400 if password validation fails', async () => {
      // Arrange
      validateUser.mockReturnValueOnce({ error: { details: [{ context: { key: 'password' }, message: 'Invalid password' }] } });

      // Act
      await signup(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid password' });
    });

    it('should handle internal server errors gracefully', async () => {
      // Arrange
      College.findOne.mockRejectedValueOnce(new Error('Database error'));

      // Act
      await signup(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});

// End of unit tests for: signup
