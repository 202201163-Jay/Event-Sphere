const { getParticipants } = require('../../Controller/eventListing'); // Import the function
const Event = require('../../Models/Event'); // Import the Event model

jest.mock('../../Models/Event'); 

describe('getParticipants() method', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { eventId: '12345' } }; // Mock request
    res = {
      status: jest.fn().mockReturnThis(), // Mock status method
      json: jest.fn(), // Mock json method
    };
  });

  describe('Happy Paths', () => {
    it('should return participants when event is found', async () => {
      // Arrange
      const mockParticipants = {
        registrations: [
          { additionalDetails: { name: 'John Doe' } },
          { additionalDetails: { name: 'Jane Doe' } },
        ],
      };

      const mockPopulate = jest.fn().mockResolvedValue(mockParticipants);
      Event.findOne.mockReturnValue({ populate: mockPopulate }); // Mock populate

      // Act
      await getParticipants(req, res);

      // Assert
      expect(Event.findOne).toHaveBeenCalledWith({ _id: '12345' });
      expect(mockPopulate).toHaveBeenCalledWith({
        path: 'registrations',
        populate: { path: 'additionalDetails', model: 'UserProfile' },
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ "error": "Failed to retrieve participants" });
    });
  });

  describe('Edge Cases', () => {
    it('should return 404 if event is not found', async () => {
      // Arrange
      const mockPopulate = jest.fn().mockResolvedValue(null); // Simulate no event found
      Event.findOne.mockReturnValue({ populate: mockPopulate });

      // Act
      await getParticipants(req, res);

      // Assert
      expect(Event.findOne).toHaveBeenCalledWith({ _id: '12345' });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve participants' });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange: Mock the `Event.findOne().populate()` chain
      const mockPopulate = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockRejectedValue(new Error('Database error')), // Simulate a rejected promise
      }));
    
      Event.findOne.mockReturnValue({ populate: mockPopulate });
    
      // Act
      await getParticipants(req, res);
    
      // Assert
      expect(Event.findOne).toHaveBeenCalledWith({ _id: '12345' });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve participants' });
    });
  });
});
