const Event = require('../../Models/Event');
const { getLatest } = require('../../Controller/homepage');
jest.mock("../../Models/Event");

describe('getLatest() method', () => {
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
    it('should return the latest 3 events sorted by listedAt in descending order', async () => {
      // Arrange
      const mockEvents = [
        { id: 1, listedAt: new Date('2023-10-10') },
        { id: 2, listedAt: new Date('2023-10-09') },
        { id: 3, listedAt: new Date('2023-10-08') }
      ];
      
      // Mock the find, sort, and limit methods to return the mockEvents
      Event.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockEvents)
        })
      });

      // Act
      await getLatest(req, res);

      // Assert
      expect(Event.find).toHaveBeenCalledWith({});
      expect(Event.find().sort).toHaveBeenCalledWith({ listedAt: -1 });
      expect(Event.find().sort().limit).toHaveBeenCalledWith(3);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ latestevent: mockEvents, status: "ok" });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle no events found gracefully', async () => {
      // Arrange
      Event.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([])
        })
      });

      // Act
      await getLatest(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ latestevent: [], status: "ok" });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const errorMessage = 'Database error';
      Event.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockRejectedValue(new Error(errorMessage))
        })
      });

      // Act
      await getLatest(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching latest events' });
    });
  });
});
