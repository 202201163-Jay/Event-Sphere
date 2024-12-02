
// Unit tests for: verifyOTP




const { verifyOTP } = require('../authstudentprofile');
const bcrypt = require("bcrypt");
const User = require("../../Models/User");
const OTP = require("../../Models/OTP");
const { VERIFICATION_EMAIL_TEMPLATE } = require("../../utils/emailTemplates");
jest.mock("../../Models/OTP");
jest.mock("../../Models/User");
jest.mock("bcrypt");

describe('verifyOTP() verifyOTP method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        userId: 'testUserId',
        otp: '1234',
      },
    };

    res = {
      json: jest.fn(),
    };
  });

  describe('Happy Paths', () => {
    it('should verify the OTP successfully and update user verification status', async () => {
      // Arrange
      const hashedOTP = 'hashedOTP';
      OTP.find.mockResolvedValue([{ otp: hashedOTP, expiresAt: Date.now() + 10000 }]);
      bcrypt.compare.mockResolvedValue(true);
      User.updateOne.mockResolvedValue({});

      // Act
      await verifyOTP(req, res);

      // Assert
      expect(OTP.find).toHaveBeenCalledWith({ userId: 'testUserId' });
      expect(bcrypt.compare).toHaveBeenCalledWith('1234', hashedOTP);
      expect(User.updateOne).toHaveBeenCalledWith({ _id: 'testUserId' }, { isVerified: true });
      expect(OTP.deleteMany).toHaveBeenCalledWith({ userId: 'testUserId' });
      expect(res.json).toHaveBeenCalledWith({
        status: 'VERIFIED',
        message: 'User email verified successfully.',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return an error if OTP details are empty', async () => {
      // Arrange
      req.body = {};

      // Act
      await verifyOTP(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        status: 'FAILED',
        message: 'Empty OTP details are not allowed',
      });
    });

    it('should return an error if no OTP records are found', async () => {
      // Arrange
      OTP.find.mockResolvedValue([]);

      // Act
      await verifyOTP(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        status: 'FAILED',
        message: "Account record doesn't exist or has been verified already. Please sign up or log in.",
      });
    });

    // it('should return an error if the OTP has expired', async () => {
    //   // Arrange
    //   OTP.find.mockResolvedValue([{ expiresAt: Date.now() - 10000 }]);

    //   // Act
    //   await verifyOTP(req, res);

    //   // Assert
    //   expect(OTP.deleteMany).toHaveBeenCalledWith({ userId: 'testUserId' });
    //   expect(res.json).toHaveBeenCalledWith({
    //     status: 'FAILED',
    //     message: 'Code has expired. Please request again.',
    //   });
    // });

    it('should return an error if the OTP is invalid', async () => {
      // Arrange
      const hashedOTP = 'hashedOTP';
      OTP.find.mockResolvedValue([{ otp: hashedOTP, expiresAt: Date.now() + 10000 }]);
      bcrypt.compare.mockResolvedValue(false);

      // Act
      await verifyOTP(req, res);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith('1234', hashedOTP);
      expect(res.json).toHaveBeenCalledWith({
        status: 'FAILED',
        message: 'Invalid OTP. Please try again.',
      });
    });
  });
});

// End of unit tests for: verifyOTP
