
// Unit tests for: deletecollegebyId




const { deletecollegebyId } = require('../authcollegeprofile');
const College = require("../../Models/College");
const CollegeRep = require("../../Models/CollegeRep")
const { VERIFICATION_EMAIL_TEMPLATE } = require("../../utils/emailTemplates");
const {validateUser} = require("../../utils/Uservalidator")
jest.mock("../../Models/College");
jest.mock("../../Models/CollegeRep");

describe('deletecollegebyId() deletecollegebyId method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        userId: '12345', // Example userId
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('Happy paths', () => {
    it('should delete the college and its representatives successfully', async () => {
      // Mock the delete operations to resolve successfully
      CollegeRep.deleteMany.mockResolvedValue({ deletedCount: 1 });
      College.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await deletecollegebyId(req, res);

      // Verify that the correct status and message are returned
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'College deleted successfully' });

      // Verify that the delete operations were called with the correct parameters
      expect(CollegeRep.deleteMany).toHaveBeenCalledWith({ collegeId: req.params.userId });
      expect(College.deleteOne).toHaveBeenCalledWith({ _id: req.params.userId });
    });
  });

  describe('Edge cases', () => {
    it('should handle errors during deletion of college representatives', async () => {
      // Mock the delete operation for CollegeRep to throw an error
      CollegeRep.deleteMany.mockRejectedValue(new Error('Deletion error'));

      await deletecollegebyId(req, res);

      // Verify that the correct status and message are returned
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error during delete' });
    });

    it('should handle errors during deletion of the college', async () => {
      // Mock the delete operation for CollegeRep to resolve successfully
      CollegeRep.deleteMany.mockResolvedValue({ deletedCount: 1 });
      // Mock the delete operation for College to throw an error
      College.deleteOne.mockRejectedValue(new Error('Deletion error'));

      await deletecollegebyId(req, res);

      // Verify that the correct status and message are returned
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error during delete' });
    });

    it('should handle the case where no college representatives are found', async () => {
      // Mock the delete operation for CollegeRep to resolve with no deletions
      CollegeRep.deleteMany.mockResolvedValue({ deletedCount: 0 });
      // Mock the delete operation for College to resolve successfully
      College.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await deletecollegebyId(req, res);

      // Verify that the correct status and message are returned
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'College deleted successfully' });
    });

    it('should handle the case where no college is found', async () => {
      // Mock the delete operation for CollegeRep to resolve successfully
      CollegeRep.deleteMany.mockResolvedValue({ deletedCount: 1 });
      // Mock the delete operation for College to resolve with no deletions
      College.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await deletecollegebyId(req, res);

      // Verify that the correct status and message are returned
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'College deleted successfully' });
    });
  });
});

// End of unit tests for: deletecollegebyId
