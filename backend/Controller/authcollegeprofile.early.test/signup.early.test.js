
// Unit tests for: signup




const { signup } = require('../authcollegeprofile');
const bcrypt = require("bcrypt");
const CollegeRep = require("../../Models/CollegeRep")
const { VERIFICATION_EMAIL_TEMPLATE } = require("../../utils/emailTemplates");
const nodemailer = require("nodemailer")
const {validateUser} = require("../../utils/Uservalidator")
jest.mock("bcrypt");
jest.mock("../../Models/CollegeRep");
jest.mock("../../Models/OTP");
jest.mock("../../utils/Uservalidator");
jest.mock("nodemailer");

describe('signup() signup method', () => {
  let req, res, transporterMock;

  beforeEach(() => {
    req = {
      body: {
        clubName: 'Test Club',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        collegeId: 'college123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    transporterMock = {
      sendMail: jest.fn().mockResolvedValue(true),
    };

    nodemailer.createTransport.mockReturnValue(transporterMock);
  });

  describe('Happy Paths', () => {
    it('should successfully sign up a new club', async () => {
      // Mocking bcrypt hash
      bcrypt.hash.mockResolvedValue('hashedPassword');

      // Mocking CollegeRep.findOne to return null (no existing club)
      CollegeRep.findOne.mockResolvedValue(null);

      // Mocking validateUser to return no error
      validateUser.mockReturnValue({ error: null });

      // Mocking CollegeRep.save to resolve successfully
      CollegeRep.prototype.save = jest.fn().mockResolvedValue({
        _id: 'newClubId',
        email: 'test@example.com',
      });

      await signup(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(CollegeRep.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(validateUser).toHaveBeenCalledWith({ password: 'password123' });
      expect(CollegeRep.prototype.save).toHaveBeenCalled();
      expect(transporterMock.sendMail).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        status: 'PENDING',
        message: 'Verification otp email sent',
        data: {
          userId: 'newClubId',
          email: 'test@example.com',
        },
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return error if passwords do not match', async () => {
      req.body.confirmPassword = 'differentPassword';

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Passwords do not match' });
    });

    it('should return error if club already exists', async () => {
      CollegeRep.findOne.mockResolvedValue({ email: 'test@example.com' });

      await signup(req, res);

      expect(CollegeRep.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Club already exists' });
    });

    it('should return error if password validation fails', async () => {
      validateUser.mockReturnValue({
        error: {
          details: [{ context: { key: 'password' }, message: 'Password is too weak' }],
        },
      });

      await signup(req, res);

      expect(validateUser).toHaveBeenCalledWith({ password: 'password123' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password is too weak' });
    });

    it('should handle errors during club save', async () => {
      bcrypt.hash.mockResolvedValue('hashedPassword');
      CollegeRep.findOne.mockResolvedValue(null);
      validateUser.mockReturnValue({ error: null });
      CollegeRep.prototype.save = jest.fn().mockRejectedValue(new Error('Save error'));

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Sign up error!!!!' });
    });

    it('should handle server errors', async () => {
      const error = new Error('Server error');
      CollegeRep.findOne.mockRejectedValue(error);

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error registering club' });
    });
  });
});

// End of unit tests for: signup
