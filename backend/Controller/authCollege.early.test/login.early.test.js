
// Unit tests for: login




// const { login } = require('../authCollege');
const College = require("../../Models/College");
const CollegeRep = require("../../Models/CollegeRep");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { VERIFICATION_EMAIL_TEMPLATE } = require("../../utils/emailTemplates");
const {validateUser} = require("../../utils/Uservalidator")
const { login } = require('../../Controller/authCollege');
jest.mock("../../Models/College");
jest.mock("../../Models/CollegeRep");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe('login() login method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                email: '',
                password: ''
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Happy Paths', () => {
        it('should login a college successfully with valid credentials', async () => {
            // Arrange
            req.body.email = 'college@example.com';
            req.body.password = 'password123';
            const mockCollege = { _id: 'collegeId', email: 'college@example.com', password: 'hashedPassword', name: 'College Name' };
            College.findOne.mockResolvedValue(mockCollege);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('jwtToken');

            // Act
            await login(req, res);

            // Assert
            expect(College.findOne).toHaveBeenCalledWith({ email: 'college@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
            expect(jwt.sign).toHaveBeenCalledWith({ userId: 'collegeId', type: 'college' }, 'TeamDoIt', { expiresIn: '1h' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Login successful',
                token: 'jwtToken',
                representative: {
                    id: 'collegeId',
                    email: 'college@example.com',
                    college: 'College Name'
                }
            });
        });

        it('should login a club representative successfully with valid credentials', async () => {
            // Arrange
            req.body.email = 'club@example.com';
            req.body.password = 'password123';
            const mockClub = { _id: 'clubId', clubemail: 'club@example.com', password: 'hashedPassword', clubName: 'Club Name' };
            College.findOne.mockResolvedValue(null);
            CollegeRep.findOne.mockResolvedValue(mockClub);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('jwtToken');

            // Act
            await login(req, res);

            // Assert
            expect(CollegeRep.findOne).toHaveBeenCalledWith({ email: 'club@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
            expect(jwt.sign).toHaveBeenCalledWith({ userId: 'clubId', type: 'club' }, 'TeamDoIt', { expiresIn: '1h' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Login successful',
                token: 'jwtToken',
                representative: {
                    id: 'clubId',
                    email: 'club@example.com',
                    club: 'Club Name'
                }
            });
        });
    });

    describe('Edge Cases', () => {
        it('should return 404 if college and club are not found', async () => {
            // Arrange
            req.body.email = 'nonexistent@example.com';
            College.findOne.mockResolvedValue(null);
            CollegeRep.findOne.mockResolvedValue(null);

            // Act
            await login(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Club not found!' });
        });

        it('should return 401 if password is invalid for college', async () => {
            // Arrange
            req.body.email = 'college@example.com';
            req.body.password = 'wrongPassword';
            const mockCollege = { _id: 'collegeId', email: 'college@example.com', password: 'hashedPassword' };
            College.findOne.mockResolvedValue(mockCollege);
            bcrypt.compare.mockResolvedValue(false);

            // Act
            await login(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid password' });
        });

        it('should return 401 if password is invalid for club', async () => {
            // Arrange
            req.body.email = 'club@example.com';
            req.body.password = 'wrongPassword';
            const mockClub = { _id: 'clubId', clubemail: 'club@example.com', password: 'hashedPassword' };
            College.findOne.mockResolvedValue(null);
            CollegeRep.findOne.mockResolvedValue(mockClub);
            bcrypt.compare.mockResolvedValue(false);

            // Act
            await login(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid password' });
        });

        it('should return 500 if there is a server error', async () => {
            // Arrange
            req.body.email = 'college@example.com';
            College.findOne.mockRejectedValue(new Error('Server error'));

            // Act
            await login(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
        });
    });
});

// End of unit tests for: login
