// const { getcontests } = require('../eventListing');
const { uploadOnCloudinary } = require("../../config/cloudinary");
// const Event = require('../../Models/Event');
const { upload2 } = require("../../middleware/multer");
const { getcontests } = require('../../Controller/eventListing');
const Event = require('../../Models/Event');

jest.mock("../../Models/Event");

describe('getcontests() getcontests method', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('Happy paths', () => {
    it('should return a list of concerts with their posters', async () => {
      // Arrange: Mock the Event.find method to return a list of concerts
      const mockConcerts = [
        { poster: 'poster1.jpg' },
        { poster: 'poster2.jpg' },
      ];
      Event.find.mockResolvedValue(mockConcerts);

      // Act: Call the getcontests function
      await getcontests(req, res);

      // Assert: Check that the response is correct
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockConcerts);
    });
  });

  describe('Edge cases', () => {
    it('should handle no concerts found gracefully', async () => {
      // Arrange: Mock the Event.find method to return an empty array
      Event.find.mockResolvedValue([]);

      // Act: Call the getcontests function
      await getcontests(req, res);

      // Assert: Check that the response is correct
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange: Mock the Event.find method to throw an error
      const mockError = new Error('Database error');
      Event.find.mockRejectedValue(mockError);

      // Act: Call the getcontests function
      await getcontests(req, res);

      // Assert: Check that the response is correct
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch concert events" });
    });
  });
});

// End of unit tests for: getcontests
