const CollegeRep = require('../../Models/CollegeRep');
const { getCollegeRepById } = require('../../Controller/authCollegeRepProfile');

jest.mock('../../Models/CollegeRep');

describe('getCollegeRepById() method', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: 'collegeRep123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('Happy Paths', () => {
    it('should return college rep details when found', async () => {
      // Arrange
      const mockCollegeRep = {
        _id: 'collegeRep123',
        name: 'John Doe',
        email: 'john.doe@example.com',
      };
      CollegeRep.findById.mockResolvedValue(mockCollegeRep);

      // Act
      await getCollegeRepById(req, res);

      // Assert
      expect(CollegeRep.findById).toHaveBeenCalledWith('collegeRep123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ collegeRep: mockCollegeRep });
    });
  });

  describe('Edge Cases', () => {
    it('should return 404 if college rep is not found', async () => {
      // Arrange
      CollegeRep.findById.mockResolvedValue(null);

      // Act
      await getCollegeRepById(req, res);

      // Assert
      expect(CollegeRep.findById).toHaveBeenCalledWith('collegeRep123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'College representative not found' });
    });

    it('should return 500 if there is a server error', async () => {
      // Arrange
      const error = new Error('Database error');
      CollegeRep.findById.mockRejectedValue(error);

      // Act
      await getCollegeRepById(req, res);

      // Assert
      expect(CollegeRep.findById).toHaveBeenCalledWith('collegeRep123');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve college representative' });
    });
  });
});