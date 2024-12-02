const User = require("../../Models/User");
const Event = require("../../Models/Event");
const { registerForEvent } = require('../../Controller/regcontroller');
jest.mock("../../Models/User");
jest.mock("../../Models/Event");

describe('registerForEvent() registerForEvent method', () => {
  let req, res, event, user;

  beforeEach(() => {
    jest.clearAllMocks();

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
      registrationStartDate: new Date(Date.now() - 1000),
      registrationEndDate: new Date(Date.now() + 1000),
      registrations: [],
      clubId: {
        college: {
          _id: 'college123',
        },
      },
      save: jest.fn(),
    };

    user = {
      _id: 'user123',
      isVerified: true,
      college: {
        _id: 'college123',
      },
      participated: [],
      save: jest.fn(),
    };

    Event.findOne.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(event),
    }));

    User.findOne.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(user),
    }));
  });

  describe('Happy Paths', () => {
    it('should register a user successfully when all conditions are met', async () => {
      await registerForEvent(req, res);

      expect(Event.findOne).toHaveBeenCalledWith({ _id: 'event123' });
      expect(User.findOne).toHaveBeenCalledWith({ _id: 'user123' });
      expect(event.registrations).toContain('user123');
      expect(user.participated).toContain('event123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Registration successful', event });
    });
  });

  // Add additional edge case tests here as required.
  describe('Edge Cases', () => {
    it('should return 404 if the event is not found', async () => {
      // Mock Event.findOne to return null
      Event.findOne.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });
  
      await registerForEvent(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
    });
  
    it('should return 404 if the user is not found', async () => {
      // Mock Event.findOne to return an event
      Event.findOne.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(event),
      });
  
      // Mock User.findOne to return null
      User.findOne.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });
  
      await registerForEvent(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  
    it('should return 400 if registration is not open', async () => {
      // Modify the event registration date
      const invalidEvent = { ...event, registrationStartDate: new Date(Date.now() + 1000) };
  
      // Mock Event.findOne to return invalidEvent
      Event.findOne.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(invalidEvent),
      });
  
      await registerForEvent(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Registration is not open for this event.' });
    });
  
    it('should return 400 if the user is already registered', async () => {
      const registeredEvent = { ...event, registrations: ['user123'] };
  
      Event.findOne.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(registeredEvent),
      });
  
      User.findOne.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(user),
      });
  
      await registerForEvent(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'You are already registered for this event.' });
    });
  
    it('should return 200 with a message if the user is not verified', async () => {
      const unverifiedUser = { ...user, isVerified: false };
  
      Event.findOne.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(event),
      });
  
      User.findOne.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(unverifiedUser),
      });
  
      await registerForEvent(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Please verify your college in profile section or Payment is required to register for this event.',
        diffCollege: true,
      });
    });
  
    it('should return 200 with a message if the user is from a different college', async () => {
      const differentCollegeUser = { ...user, college: { _id: 'differentCollege123' } };
  
      Event.findOne.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(event),
      });
  
      User.findOne.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(differentCollegeUser),
      });
  
      await registerForEvent(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'You are from a different college. Payment is required to register for this event.',
        diffCollege: true,
      });
    });
  
    it('should return 500 if an error occurs during registration', async () => {
      Event.findOne.mockImplementationOnce(() => ({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      }));
  
      await registerForEvent(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred during registration' });
    });
  });
  
});
// describe('Edge Cases', () => {
//   it('should return 404 if the event is not found', async () => {
//     // Arrange
//     Event.findOne.mockImplementation(() => ({
//       populate: jest.fn().mockReturnThis(),
//       exec: jest.fn().mockResolvedValue(null),
//     }));

//     // Act
//     await registerForEvent(req, res);

//     // Assert
//     expect(res.status).toHaveBeenCalledWith(404);
//     expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
//   });

//   it('should return 404 if the user is not found', async () => {
//     // Arrange
//     Event.findOne.mockImplementation(() => ({
//       populate: jest.fn().mockReturnThis(),
//       exec: jest.fn().mockResolvedValue(event),
//     }));
//     User.findOne.mockImplementation(() => ({
//       populate: jest.fn().mockReturnThis(),
//       exec: jest.fn().mockResolvedValue(null),
//     }));

//     // Act
//     await registerForEvent(req, res);

//     // Assert
//     expect(res.status).toHaveBeenCalledWith(404);
//     expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
//   });

//   it('should return 400 if registration is not open', async () => {
//     // Arrange
//     event.registrationStartDate = new Date(Date.now() + 1000); // Future date
//     Event.findOne.mockResolvedValue(event);
//     User.findOne.mockResolvedValue(user);

//     // Act
//     await registerForEvent(req, res);

//     // Assert
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({ error: 'Registration is not open for this event.' });
//   });

//   it('should return 400 if the user is already registered', async () => {
//     // Arrange
//     event.registrations.push('user123');
//     Event.findOne.mockResolvedValue(event);
//     User.findOne.mockResolvedValue(user);

//     // Act
//     await registerForEvent(req, res);

//     // Assert
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({ message: 'You are already registered for this event.' });
//   });

//   it('should return 200 with a message if the user is not verified', async () => {
//     // Arrange
//     user.isVerified = false;
//     Event.findOne.mockResolvedValue(event);
//     User.findOne.mockResolvedValue(user);

//     // Act
//     await registerForEvent(req, res);

//     // Assert
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       message: 'Please verify your college in profile section or Payment is required to register for this event.',
//       diffCollege: true,
//     });
//   });

//   it('should return 200 with a message if the user is from a different college', async () => {
//     // Arrange
//     user.college._id = 'differentCollege123';
//     Event.findOne.mockResolvedValue(event);
//     User.findOne.mockResolvedValue(user);

//     // Act
//     await registerForEvent(req, res);

//     // Assert
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       message: 'You are from a different college. Payment is required to register for this event.',
//       diffCollege: true,
//     });
//   });

//   it('should return 500 if an error occurs during registration', async () => {
//     // Arrange
//     Event.findOne.mockImplementation(() => ({
//       populate: jest.fn().mockReturnThis(),
//       exec: jest.fn().mockRejectedValue(new Error('Database error')),
//     }));

//     // Act
//     await registerForEvent(req, res);

//     // Assert
//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred during registration' });
//   });
// });
