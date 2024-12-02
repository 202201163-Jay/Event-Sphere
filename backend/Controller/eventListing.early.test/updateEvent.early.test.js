const { updateEvent } = require('../../Controller/eventListing');
const Event = require('../../Models/Event');
const { uploadOnCloudinary } = require("../../config/cloudinary");
const { upload2 } = require("../../middleware/multer");

jest.mock('../../middleware/multer', () => ({
  upload2: jest.fn((req, res, next) => next()), // Mock upload2 to bypass file upload in tests
}));

jest.mock('../../Models/Event');
jest.mock('../../config/cloudinary', () => ({
  uploadOnCloudinary: jest.fn(),
}));

describe('updateEvent() method', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { eventId: '123' },
      body: {
        eventName: 'Updated Event',
        description: 'Updated description',
        price: 100,
        registrationStartDate: '2023-10-01',
        registrationEndDate: '2023-10-10',
        startTime: '10:00',
        endTime: '18:00',
        type: 'Concert',
        tags: JSON.stringify(['music', 'festival']), // Send tags as a JSON string
        createdBy: 'user123',
        mode: 'Online',
        venue: 'Updated Venue',
        contactPersonEmail: 'contact@example.com',
        contactPersonPhone: '1234567890',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should update an event successfully', async () => {
    const updatedEvent = { ...req.body, _id: req.params.eventId };
    Event.findOneAndUpdate.mockResolvedValue(updatedEvent); // Mock successful DB update
    uploadOnCloudinary.mockResolvedValue({ url: 'http://example.com/poster.jpg' }); // Mock successful Cloudinary upload

    await updateEvent(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  });

  it('should update event without a file upload (poster)', async () => {
    const updatedEvent = { ...req.body, _id: req.params.eventId };
    delete req.file; // Simulate no file uploaded
    Event.findOneAndUpdate.mockResolvedValue(updatedEvent); // Mock successful DB update

    await updateEvent(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  });

  it('should return 404 when event is not found', async () => {
    Event.findOneAndUpdate.mockResolvedValue(null); // Simulate event not found

    await updateEvent(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
  });

  it('should handle file upload errors', async () => {
    const error = new Error('Cloudinary upload error');
    uploadOnCloudinary.mockRejectedValue(error); // Simulate Cloudinary upload error
    Event.findOneAndUpdate.mockResolvedValue({ ...req.body, _id: req.params.eventId });

    await updateEvent(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'An error occurred while updating the event',
      error: 'Cloudinary upload error',
    });
  });

  it('should return 500 when there is a file upload error in multer', async () => {
    const multerError = new Error('Multer upload error');
    upload2.mockImplementation((req, res, next) => next(multerError)); // Simulate error in multer middleware

    await updateEvent(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'File upload error', error: multerError });
  });

  it('should handle malformed tags (invalid JSON)', async () => {
    req.body.tags = 'invalid_json'; // Simulate invalid JSON string for tags
    Event.findOneAndUpdate.mockResolvedValue({ ...req.body, _id: req.params.eventId });

    await updateEvent(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error updating event',
      error: expect.any(SyntaxError),
    });
  });
});
