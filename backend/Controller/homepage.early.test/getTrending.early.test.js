// const { getTrending } = require('../homepage');
const Event = require('../../Models/Event');
const { getTrending } = require('../../Controller/homepage');
jest.mock("../../Models/Event");

describe('getTrending() getTrending method', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return the top 3 trending events based on registration count', async () => {
      // Arrange: Mock the Event.aggregate method to return a list of events
      const mockEvents = [
        { name: 'Event 1', registrationCount: 100 },
        { name: 'Event 2', registrationCount: 80 },
        { name: 'Event 3', registrationCount: 60 }
      ];
      Event.aggregate.mockResolvedValue(mockEvents);

      // Act: Call the getTrending function
      await getTrending(req, res);

      // Assert: Check that the response is correct
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ trendingEvents: mockEvents, status: "ok" });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle no events gracefully', async () => {
      // Arrange: Mock the Event.aggregate method to return an empty list
      Event.aggregate.mockResolvedValue([]);

      // Act: Call the getTrending function
      await getTrending(req, res);

      // Assert: Check that the response is correct
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ trendingEvents: [], status: "ok" });
    });

    it('should handle events with no registrations', async () => {
      // Arrange: Mock the Event.aggregate method to return events with no registrations
      const mockEvents = [
        { name: 'Event 1', registrationCount: 0 },
        { name: 'Event 2', registrationCount: 0 },
        { name: 'Event 3', registrationCount: 0 }
      ];
      Event.aggregate.mockResolvedValue(mockEvents);

      // Act: Call the getTrending function
      await getTrending(req, res);

      // Assert: Check that the response is correct
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ trendingEvents: mockEvents, status: "ok" });
    });

    it('should return a 500 error if there is a database error', async () => {
      // Arrange: Mock the Event.aggregate method to throw an error
      Event.aggregate.mockRejectedValue(new Error('Database error'));

      // Act: Call the getTrending function
      await getTrending(req, res);

      // Assert: Check that the response is a 500 error
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching trending events' });
    });
  });
});

