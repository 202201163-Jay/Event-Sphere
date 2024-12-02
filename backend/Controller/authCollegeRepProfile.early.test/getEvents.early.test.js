
// Unit tests for: getEvents




// const { getEvents } = require('../authCollegeRepProfile');
const { getEvents } = require('../../Controller/authCollegeRepProfile');
const event = require('../../Models/Event');

jest.mock("../../Models/Event");

describe('getEvents() getEvents method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                id: 'testClubId'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Happy Paths', () => {
        it('should return a list of events when events are found', async () => {
            // Arrange: Mock the event model to return a list of events
            const mockEvents = [{ name: 'Event 1' }, { name: 'Event 2' }];
            event.find.mockResolvedValue(mockEvents);

            // Act: Call the getEvents function
            await getEvents(req, res);

            // Assert: Check that the response is correct
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ events: mockEvents });
        });
    });

    describe('Edge Cases', () => {
        it('should return a 404 error when no events are found', async () => {
            // Arrange: Mock the event model to return an empty array
            event.find.mockResolvedValue([]);

            // Act: Call the getEvents function
            await getEvents(req, res);

            // Assert: Check that the response is correct
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({  events: [] });
        });

        it('should return a 500 error when an exception is thrown', async () => {
            // Arrange: Mock the event model to throw an error
            event.find.mockRejectedValue(new Error('Database error'));

            // Act: Call the getEvents function
            await getEvents(req, res);

            // Assert: Check that the response is correct
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Failed to retrieve events" });
        });
    });
});

// End of unit tests for: getEvents
