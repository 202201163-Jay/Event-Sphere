const User = require("../../Models/User");
const Event = require("../../Models/Event");
const { registerForEvent2 } = require('../../Controller/regcontroller');
jest.mock("../../Models/User");
jest.mock("../../Models/Event");

describe('registerForEvent2() method', () => {
  let req, res, event, user;

  beforeEach(() => {
    req = {
      params: {
        eventId: 'event123',
        userId: 'user123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    event = {
      _id: 'event123',
      registrations: [],
      save: jest.fn(),
    };

    user = {
      _id: 'user123',
      participated: [],
      save: jest.fn(),
    };

    // Mock the populate method
    const mockPopulate = jest.fn().mockReturnThis();
    const mockExec = jest.fn().mockResolvedValue(event);
    const mockQuery = {
      populate: mockPopulate,
      exec: mockExec,
    };

    Event.findOne.mockImplementation(() => mockQuery);
    User.findOne.mockImplementation(() => mockQuery);
  });

  describe('Happy Paths', () => {
    it('should register a user for an event successfully', async () => {
      // Test that a user can register for an event successfully
      await registerForEvent2(req, res);

      expect(Event.findOne).toHaveBeenCalledWith({ _id: 'event123' });
      expect(User.findOne).toHaveBeenCalledWith({ _id: 'user123' });
      expect(event.registrations).toContain('user123');
      expect(user.participated).toContain('event123');
      expect(event.save).toHaveBeenCalled();
      expect(user.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Registration successful', event });
    });
  });

  describe('Edge Cases', () => {
    it('should return 404 if the event is not found', async () => {
      // Test that a 404 error is returned if the event is not found
      Event.findOne().exec.mockResolvedValue(null);

      await registerForEvent2(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
    });

    it('should return 404 if the user is not found', async () => {
      // Test that a 404 error is returned if the user is not found
      User.findOne().exec.mockResolvedValue(null);

      await registerForEvent2(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
    });

    it('should return 400 if the user is already registered for the event', async () => {
      // Test that a 400 error is returned if the user is already registered
      event.registrations.push('user123');

      await registerForEvent2(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'You are already registered for this event.' });
    });

    it('should return 404 if the user profile is not found', async () => {
      // Test that a 404 error is returned if the user profile is not found
      User.findOne().exec.mockResolvedValueOnce(user).mockResolvedValueOnce(null);

      await registerForEvent2(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle unexpected errors gracefully', async () => {
      // Test that unexpected errors are handled gracefully
      const error = new Error('Unexpected error');
      Event.findOne().exec.mockRejectedValue(error);

      await registerForEvent2(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred during registration' });
    });
  });
});