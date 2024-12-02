
// Unit tests for: verifyOTP




const { verifyOTP } = require('../authcollegeprofile');
const bcrypt = require("bcrypt");
const OTP = require("../../Models/OTP");
const College = require("../../Models/College");
const CollegeRep = require("../../Models/CollegeRep")
const { VERIFICATION_EMAIL_TEMPLATE } = require("../../utils/emailTemplates");
const {validateUser} = require("../../utils/Uservalidator")
jest.mock("../../Models/OTP");
jest.mock("../../Models/CollegeRep");
jest.mock("../../Models/College");
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
    it('should verify OTP successfully and update college representatives', async () => {
      // Arrange
      const hashedOTP = 'hashedOTP';
      OTP.find.mockResolvedValue([{ otp: hashedOTP, expiresAt: Date.now() + 10000 }]);
      bcrypt.compare.mockResolvedValue(true);
      CollegeRep.findOne.mockResolvedValue({ _id: 'testUserId', collegeId: 'testCollegeId' });
      College.findOne.mockResolvedValue({ _id: 'testCollegeId' });
      College.findByIdAndUpdate.mockResolvedValue({});

      // Act
      await verifyOTP(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        status: 'VERIFIED',
        message: 'club email verified successfully.',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return error if userId or otp is missing', async () => {
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

    it('should return error if OTP record does not exist', async () => {
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

    it('should return error if OTP has expired', async () => {
      // Arrange
      OTP.find.mockResolvedValue([{ expiresAt: Date.now() - 10000 }]);

      // Act
      await verifyOTP(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        status: 'FAILED',
        message: 'Code has expired. Please request again.',
      });
    });

    it('should return error if OTP is invalid', async () => {
      // Arrange
      const hashedOTP = 'hashedOTP';
      OTP.find.mockResolvedValue([{ otp: hashedOTP, expiresAt: Date.now() + 10000 }]);
      bcrypt.compare.mockResolvedValue(false);

      // Act
      await verifyOTP(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        status: 'FAILED',
        message: 'Invalid OTP. Please try again.',
      });
    });
  });
});

// End of unit tests for: verifyOTP
