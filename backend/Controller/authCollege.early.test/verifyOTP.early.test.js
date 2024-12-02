
// Unit tests for: verifyOTP




const { verifyOTP } = require('../authCollege');
const College = require("../../Models/College");
const bcrypt = require("bcrypt");
const OTP = require("../../Models/OTP");
const { VERIFICATION_EMAIL_TEMPLATE } = require("../../utils/emailTemplates");
const {validateUser} = require("../../utils/Uservalidator")
jest.mock("../../Models/OTP");
jest.mock("../../Models/College");
jest.mock("bcrypt");

describe('verifyOTP() verifyOTP method', () => {
    // Happy Path Tests
    describe('Happy Paths', () => {
        it('should verify OTP successfully and update college verification status', async () => {
            // Arrange
            const req = {
                body: {
                    userId: '12345',
                    otp: '1234'
                }
            };
            const res = {
                json: jest.fn()
            };

            const mockOTPRecord = {
                userId: '12345',
                otp: 'hashedOTP',
                expiresAt: Date.now() + 3600000 // 1 hour in the future
            };

            OTP.find.mockResolvedValue([mockOTPRecord]);
            bcrypt.compare.mockResolvedValue(true);
            College.findByIdAndUpdate.mockResolvedValue({});

            // Act
            await verifyOTP(req, res);

            // Assert
            expect(OTP.find).toHaveBeenCalledWith({ userId: '12345' });
            expect(bcrypt.compare).toHaveBeenCalledWith('1234', 'hashedOTP');
            expect(College.findByIdAndUpdate).toHaveBeenCalledWith('12345', { $set: { isdb: true } }, { new: true });
            expect(OTP.deleteMany).toHaveBeenCalledWith({ userId: '12345' });
            expect(res.json).toHaveBeenCalledWith({
                status: 'VERIFIED',
                message: 'College email verified successfully.'
            });
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        it('should return an error if userId or otp is missing', async () => {
            // Arrange
            const req = {
                body: {
                    userId: '',
                    otp: ''
                }
            };
            const res = {
                json: jest.fn()
            };

            College.deleteOne.mockResolvedValue({});

            // Act
            await verifyOTP(req, res);

            // Assert
            expect(College.deleteOne).toHaveBeenCalledWith({ _id: '' });
            expect(res.json).toHaveBeenCalledWith({
                status: 'FAILED',
                message: 'Empty OTP details are not allowed'
            });
        });

        it('should return an error if no OTP records are found', async () => {
            // Arrange
            const req = {
                body: {
                    userId: '12345',
                    otp: '1234'
                }
            };
            const res = {
                json: jest.fn()
            };

            OTP.find.mockResolvedValue([]);

            // Act
            await verifyOTP(req, res);

            // Assert
            expect(OTP.find).toHaveBeenCalledWith({ userId: '12345' });
            expect(res.json).toHaveBeenCalledWith({
                status: 'FAILED',
                message: "Account record doesn't exist or has been verified already. Please sign up or log in."
            });
        });

        it('should return an error if OTP has expired', async () => {
            // Arrange
            const req = {
                body: {
                    userId: '12345',
                    otp: '1234'
                }
            };
            const res = {
                json: jest.fn()
            };

            const mockOTPRecord = {
                userId: '12345',
                otp: 'hashedOTP',
                expiresAt: Date.now() - 3600000 // 1 hour in the past
            };

            OTP.find.mockResolvedValue([mockOTPRecord]);
            OTP.deleteMany.mockResolvedValue({});

            // Act
            await verifyOTP(req, res);

            // Assert
            expect(OTP.find).toHaveBeenCalledWith({ userId: '12345' });
            expect(OTP.deleteMany).toHaveBeenCalledWith({ userId: '12345' });
            expect(res.json).toHaveBeenCalledWith({
                status: 'FAILED',
                message: 'Code has expired. Please request again.'
            });
        });

        it('should return an error if OTP is invalid', async () => {
            // Arrange
            const req = {
                body: {
                    userId: '12345',
                    otp: '1234'
                }
            };
            const res = {
                json: jest.fn()
            };

            const mockOTPRecord = {
                userId: '12345',
                otp: 'hashedOTP',
                expiresAt: Date.now() + 3600000 // 1 hour in the future
            };

            OTP.find.mockResolvedValue([mockOTPRecord]);
            bcrypt.compare.mockResolvedValue(false);
            College.deleteOne.mockResolvedValue({});

            // Act
            await verifyOTP(req, res);

            // Assert
            expect(OTP.find).toHaveBeenCalledWith({ userId: '12345' });
            expect(bcrypt.compare).toHaveBeenCalledWith('1234', 'hashedOTP');
            expect(College.deleteOne).toHaveBeenCalledWith({ _id: '12345' });
            expect(res.json).toHaveBeenCalledWith({
                status: 'FAILED',
                message: 'Invalid OTP. Please try again.'
            });
        });
    });
});

// End of unit tests for: verifyOTP
