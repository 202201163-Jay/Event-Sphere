// Unit tests for: temp

const Event = require("../../Models/Event");
const { temp } = require('../../Controller/temp');
jest.mock("../../Models/Event");

describe('temp() temp method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  // Happy Path Tests
  describe('Happy Path Tests', () => {
    test('should return events when no filters are applied', async () => {
      // Arrange
      const mockEvents = [{ eventName: 'Event1' }, { eventName: 'Event2' }];
      Event.find.mockResolvedValue(mockEvents);

      // Act
      await temp(req, res);

      // Assert
      expect(Event.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ events: mockEvents });
    });

    test('should return events filtered by tags', async () => {
      // Arrange
      req.query.selectedTags = JSON.stringify(['tag1', 'tag2']);
      const mockEvents = [{ eventName: 'Event1', tags: ['tag1'] }];
      Event.find.mockResolvedValue(mockEvents);

      // Act
      await temp(req, res);

      // Assert
      expect(Event.find).toHaveBeenCalledWith({ tags: { $in: ['tag1', 'tag2'] } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ events: mockEvents });
    });

    test('should return events filtered by types', async () => {
      // Arrange
      req.query.selectedTypes = JSON.stringify(['type1']);
      const mockEvents = [{ eventName: 'Event2', type: 'type1' }];
      Event.find.mockResolvedValue(mockEvents);

      // Act
      await temp(req, res);

      // Assert
      expect(Event.find).toHaveBeenCalledWith({ type: { $in: ['type1'] } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ events: mockEvents });
    });

    test('should return events filtered by search query', async () => {
      // Arrange
      req.query.searchQuery = 'event';
      const mockEvents = [{ eventName: 'Event1' }];
      Event.find.mockResolvedValue(mockEvents);

      // Act
      await temp(req, res);

      // Assert
      expect(Event.find).toHaveBeenCalledWith({ eventName: { $regex: 'event', $options: 'i' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ events: mockEvents });
    });
  });

  // Edge Case Tests
  describe('Edge Case Tests', () => {
    // test('should handle invalid JSON in selectedTags gracefully', async () => {
    //   // Arrange
    //   req.query.selectedTags = 'invalidJSON';  // Invalid JSON input
    //   const mockEvents = [];
    //   Event.find.mockResolvedValue(mockEvents);

    //   // Act
    //   await temp(req, res);

    //   // Assert
    //   expect(Event.find).toHaveBeenCalledWith({});  // Default empty query when JSON is invalid
    //   expect(res.status).toHaveBeenCalledWith(200);
    //   expect(res.json).toHaveBeenCalledWith({ events: mockEvents });
    // });

    // test('should handle invalid JSON in selectedTypes gracefully', async () => {
    //   // Arrange
    //   req.query.selectedTypes = 'invalidJSON';  // Invalid JSON input
    //   const mockEvents = [];
    //   Event.find.mockResolvedValue(mockEvents);

    //   // Act
    //   await temp(req, res);

    //   // Assert
    //   expect(Event.find).toHaveBeenCalledWith({});  // Default empty query when JSON is invalid
    //   expect(res.status).toHaveBeenCalledWith(200);
    //   expect(res.json).toHaveBeenCalledWith({ events: mockEvents });
    // });

    test('should return 500 status on database error', async () => {
      // Arrange
      Event.find.mockRejectedValue(new Error('Database error'));

      // Act
      await temp(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error fetching events" });
    });
  });
});

// End of unit tests for: temp
