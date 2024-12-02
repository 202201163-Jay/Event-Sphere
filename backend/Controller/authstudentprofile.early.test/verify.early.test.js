const { verify } = require('../authstudentprofile');
const bcrypt = require("bcrypt");
const User = require("../../Models/User");
const OTP = require("../../Models/OTP");
const College = require("../../Models/College");
const { VERIFICATION_EMAIL_TEMPLATE } = require("../../utils/emailTemplates");
const nodemailer = require("nodemailer");
jest.mock("../../Models/User");
jest.mock("../../Models/OTP");
jest.mock("../../Models/College");
jest.mock("nodemailer");
jest.mock("bcrypt");

describe('verify() verify method', () => {
    let req, res, sendMailMock;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                userId: '12345',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        sendMailMock = jest.fn();
        nodemailer.createTransport.mockReturnValue({
            sendMail: sendMailMock,
        });
    });

    describe('Happy paths', () => {
        it('should send OTP verification email when user is not verified', async () => {
            // Arrange
            User.findOne.mockResolvedValue({ isVerified: false });
            College.findOne.mockResolvedValue({ emailDomain: 'example' });
            bcrypt.hash.mockResolvedValue('hashedOTP');
            OTP.prototype.save.mockResolvedValue();

            // Act
            await verify(req, res);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ _id: '12345' });
            expect(College.findOne).toHaveBeenCalledWith({ emailDomain: 'example' });
            expect(bcrypt.hash).toHaveBeenCalled();
            expect(sendMailMock).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({
                status: 'PENDING',
                message: 'Verification otp email sent',
                data: {
                    userId: '12345',
                    email: 'test@example.com',
                },
            });
        });
    });

    describe('Edge cases', () => {
        it('should return 400 if email or userId is missing', async () => {
            // Arrange
            req.body.email = '';

            // Act
            await verify(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'FAILED',
                message: 'Email and User ID are required.',
            });
        });

        it('should return error if user is already verified', async () => {
            // Arrange
            User.findOne.mockResolvedValue({ isVerified: true });

            // Act
            await verify(req, res);

            // Assert
            expect(res.json).toHaveBeenCalledWith({
                status: 'PENDING',
                message: 'User already verified!!!',
            });
        });

        it('should return error if college does not exist', async () => {
            // Arrange
            User.findOne.mockResolvedValue({ isVerified: false });
            College.findOne.mockResolvedValue(null);

            // Act
            await verify(req, res);

            // Assert
            expect(res.json).toHaveBeenCalledWith({
                status: 'FAILED',
                message: 'Oops, Your college is not exist!!!',
            });
        });

        it('should handle unexpected errors gracefully', async () => {
            // Arrange
            User.findOne.mockRejectedValue(new Error('Unexpected error'));

            // Act
            await verify(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error registering user',
            });
        });
    });
});

// End of unit tests for: verify
