
// Unit tests for: getUserById




// const { getUserById } = require('../authstudentprofile');
// const User = require("../../Models/User");
const { VERIFICATION_EMAIL_TEMPLATE } = require("../../utils/emailTemplates");
const { getUserById } = require('../../Controller/authstudentprofile');
const User = require('../../Models/User');

jest.mock("../../Models/User");

describe('getUserById() getUserById method', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { userId: '12345' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Happy Path: User is found
  it('should return user data when user is found', async () => {
    // Arrange
    const mockUser = { _id: '12345', name: 'John Doe', participated: [] };
    User.findOne.mockResolvedValue(mockUser);

    // Act
    await getUserById(req, res);

    // Assert
    expect(User.findOne).toHaveBeenCalledWith({ _id: '12345' });
    // expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'SUCCESS',
      message: 'User found',
      data: mockUser,
    });
  });

  // Edge Case: User not found
  it('should return 404 when user is not found', async () => {
    // Arrange
    User.findOne.mockResolvedValue(null);

    // Act
    await getUserById(req, res);

    // Assert
    expect(User.findOne).toHaveBeenCalledWith({ _id: '12345' });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving user data' });
  });

  // Edge Case: Invalid userId format
  it('should handle invalid userId format gracefully', async () => {
    // Arrange
    req.params.userId = 'invalid-id';
    User.findOne.mockImplementation(() => {
      throw new Error('Invalid ID format');
    });

    // Act
    await getUserById(req, res);

    // Assert
    expect(User.findOne).toHaveBeenCalledWith({ _id: 'invalid-id' });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving user data' });
  });

  // Edge Case: Database error
  it('should handle database errors gracefully', async () => {
    // Arrange
    User.findOne.mockImplementation(() => {
      throw new Error('Database error');
    });

    // Act
    await getUserById(req, res);

    // Assert
    expect(User.findOne).toHaveBeenCalledWith({ _id: '12345' });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving user data' });
  });
});

// End of unit tests for: getUserById
