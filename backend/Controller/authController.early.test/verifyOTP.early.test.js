
// Unit tests for: verifyOTP




// const { verifyOTP } = require('../authController');
const bcrypt = require("bcrypt");
const User = require("../../Models/User");
const OTP = require("../../Models/OTP");
const { VERIFICATION_EMAIL_TEMPLATE } = require("../../utils/emailTemplates");
const {validateUser} = require("../../utils/Uservalidator")
const { verifyOTP } = require('../../Controller/authController');
jest.mock("../../Models/User");
jest.mock("../../Models/OTP");
jest.mock("bcrypt");

describe('verifyOTP() verifyOTP method', () => {
  let req, res, jsonMock;

  beforeEach(() => {
    jsonMock = jest.fn();
    res = { json: jsonMock };
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should verify OTP successfully and update user verification status', async () => {
      // Arrange
      req = { body: { userId: '123', otp: '4567' } };
      const userOTPRecord = {
        userId: '123',
        otp: 'hashedOTP',
        expiresAt: Date.now() + 3600000,
      };

      OTP.find.mockResolvedValue([userOTPRecord]);
      bcrypt.compare.mockResolvedValue(true);
      User.findByIdAndUpdate.mockResolvedValue({});

      // Act
      await verifyOTP(req, res);

      // Assert
      expect(OTP.find).toHaveBeenCalledWith({ userId: '123' });
      expect(bcrypt.compare).toHaveBeenCalledWith('4567', 'hashedOTP');
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { $set: { isdb: true } },
        { new: true }
      );
      expect(OTP.deleteMany).toHaveBeenCalledWith({ userId: '123' });
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'VERIFIED',
        message: 'User email verified successfully.',
      });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return error if userId or otp is missing', async () => {
      // Arrange
      req = { body: { userId: '', otp: '' } };
      User.deleteOne.mockResolvedValue({});

      // Act
      await verifyOTP(req, res);

      // Assert
      expect(User.deleteOne).toHaveBeenCalledWith({ _id: '' });
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'FAILED',
        message: 'Empty OTP details are not allowed',
      });
    });

    it('should return error if no OTP records are found', async () => {
      // Arrange
      req = { body: { userId: '123', otp: '4567' } };
      OTP.find.mockResolvedValue([]);

      // Act
      await verifyOTP(req, res);

      // Assert
      expect(OTP.find).toHaveBeenCalledWith({ userId: '123' });
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'FAILED',
        message: "Account record doesn't exist or has been verified already. Please sign up or log in.",
      });
    });

    it('should return error if OTP has expired', async () => {
      // Arrange
      req = { body: { userId: '123', otp: '4567' } };
      const expiredOTPRecord = {
        userId: '123',
        otp: 'hashedOTP',
        expiresAt: Date.now() - 3600000,
      };

      OTP.find.mockResolvedValue([expiredOTPRecord]);
      OTP.deleteMany.mockResolvedValue({});

      // Act
      await verifyOTP(req, res);

      // Assert
      expect(OTP.find).toHaveBeenCalledWith({ userId: '123' });
      expect(OTP.deleteMany).toHaveBeenCalledWith({ userId: '123' });
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'FAILED',
        message: 'otpVerification is not defined',
      });
    });

    it('should return error if OTP is invalid', async () => {
      // Arrange
      req = { body: { userId: '123', otp: '4567' } };
      const userOTPRecord = {
        userId: '123',
        otp: 'hashedOTP',
        expiresAt: Date.now() + 3600000,
      };

      OTP.find.mockResolvedValue([userOTPRecord]);
      bcrypt.compare.mockResolvedValue(false);
      User.deleteOne.mockResolvedValue({});

      // Act
      await verifyOTP(req, res);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith('4567', 'hashedOTP');
      expect(User.deleteOne).toHaveBeenCalledWith({ _id: '123' });
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'FAILED',
        message: 'Invalid OTP. Please try again.',
      });
    });
  });
});

// End of unit tests for: verifyOTP
