// const { createEvent } = require('../eventListing');
// const { uploadOnCloudinary } = require("../../config/cloudinary");
// const Event = require('../../Models/Event');
// const { upload2 } = require("../../middleware/multer");
const { createEvent } = require('../../Controller/eventListing');
const Event = require('../../Models/Event');
const { uploadOnCloudinary } = require('../../config/cloudinary');
const { upload2 } = require('../../middleware/multer');

jest.mock("../../Models/Event");
jest.mock("../../config/cloudinary");
jest.mock("../../middleware/multer");

describe('createEvent() createEvent method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        eventName: 'Test Event',
        description: 'This is a test event',
        price: 100,
        registrationStartDate: '2023-10-01',
        registrationEndDate: '2023-10-10',
        startTime: '10:00',
        endTime: '12:00',
        type: 'Conference',
        tags: JSON.stringify(['test', 'event']),
        createdBy: 'userId123',
        mode: 'Online',
        venue: 'Virtual',
        contactPersonEmail: 'test@example.com',
        contactPersonPhone: '1234567890',
        clubId: 'clubId123',
      },
      file: {
        path: 'path/to/file.jpg',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    upload2.mockImplementation((req, res, callback) => callback(null));
    uploadOnCloudinary.mockResolvedValue({ url: 'http://cloudinary.com/image.jpg' });
    Event.prototype.save.mockResolvedValue();
  });

  describe('Happy paths', () => {
    it('should create an event successfully with all valid inputs', async () => {
      // Test to ensure the event is created successfully
      await createEvent(req, res);

      expect(upload2).toHaveBeenCalled();
      expect(uploadOnCloudinary).toHaveBeenCalledWith('path/to/file.jpg', '/eventsphere/events');
      expect(Event.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Event created successfully!',
        event: expect.any(Object),
      });
    });

    it('should create an event without a poster file', async () => {
      // Test to ensure the event is created successfully even without a poster file
      req.file = null;

      await createEvent(req, res);

      expect(upload2).toHaveBeenCalled();
      expect(uploadOnCloudinary).not.toHaveBeenCalled();
      expect(Event.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Event created successfully!',
        event: expect.any(Object),
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle file upload error gracefully', async () => {
      // Test to ensure file upload errors are handled
      upload2.mockImplementation((req, res, callback) => callback(new Error('Upload error')));

      await createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'File upload error',
        error: expect.any(Error),
      });
    });

    it('should handle cloudinary upload failure', async () => {
      // Test to ensure cloudinary upload failures are handled
      uploadOnCloudinary.mockRejectedValue(new Error('Cloudinary error'));

      await createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'An error occurred while creating the event',
        error: 'Cloudinary error',
      });
    });

    it('should handle database save error', async () => {
      // Test to ensure database save errors are handled
      Event.prototype.save.mockRejectedValue(new Error('Database error'));

      await createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'An error occurred while creating the event',
        error: 'Database error',
      });
    });

    it('should handle invalid JSON in tags', async () => {
      // Test to ensure invalid JSON in tags is handled
      req.body.tags = 'invalid JSON';

      await createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'An error occurred while creating the event',
        error: expect.any(String),
      });
    });
  });
});

// End of unit tests for: createEvent
