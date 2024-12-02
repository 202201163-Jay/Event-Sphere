// const { getEvent } = require('../eventListing');
const { uploadOnCloudinary } = require("../../config/cloudinary");
// const Event = require('../../Models/Event');
const { upload2 } = require("../../middleware/multer");
const { getEvent } = require('../../Controller/eventListing');
const Event = require('../../Models/Event');

jest.mock("../../Models/Event");

describe('getEvent() getEvent method', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: 'validEventId' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('Happy paths', () => {
    it('should return the event when a valid ID is provided', async () => {
      // Arrange
      const mockEvent = { id: 'validEventId', name: 'Sample Event' };
      Event.findById.mockResolvedValue(mockEvent);

      // Act
      await getEvent(req, res);

      // Assert
      expect(Event.findById).toHaveBeenCalledWith('validEventId');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('Edge cases', () => {
    it('should return 404 if the event is not found', async () => {
      // Arrange
      Event.findById.mockResolvedValue(null);

      // Act
      await getEvent(req, res);

      // Assert
      expect(Event.findById).toHaveBeenCalledWith('validEventId');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
    });

    it('should return 500 if there is a server error', async () => {
      // Arrange
      const errorMessage = 'Server error';
      Event.findById.mockRejectedValue(new Error(errorMessage));

      // Act
      await getEvent(req, res);

      // Assert
      expect(Event.findById).toHaveBeenCalledWith('validEventId');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });

    it('should handle invalid ID format gracefully', async () => {
      // Arrange
      req.params.id = 'invalidIdFormat';
      Event.findById.mockResolvedValue(null);

      // Act
      await getEvent(req, res);

      // Assert
      expect(Event.findById).toHaveBeenCalledWith('invalidIdFormat');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
    });
  });
});

