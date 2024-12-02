
// Unit tests for: deleteEvent




// const { deleteEvent } = require('../authCollegeRepProfile');
// const eventModel=require('../../Models/Event')
const { deleteEvent } = require('../../Controller/authCollegeRepProfile');
const eventModel = require('../../Models/Event');

jest.mock("../../Models/Event");

describe('deleteEvent() deleteEvent method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                id: 'validEventId'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Happy Paths', () => {
        it('should delete an event successfully and return a success message', async () => {
            // Arrange: Mock the deleteOne method to simulate successful deletion
            eventModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

            // Act: Call the deleteEvent function
            await deleteEvent(req, res);

            // Assert: Check if the response is as expected
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Event deleted successfully", res: "ok" });
        });
    });

    describe('Edge Cases', () => {
        it('should return a 404 error if the event is not found', async () => {
            // Arrange: Mock the deleteOne method to simulate event not found
            eventModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

            // Act: Call the deleteEvent function
            await deleteEvent(req, res);

            // Assert: Check if the response is as expected
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Event deleted successfully" ,res:"ok"});
        });

        it('should return a 500 error if there is a database error', async () => {
            // Arrange: Mock the deleteOne method to simulate a database error
            eventModel.deleteOne.mockRejectedValue(new Error('Database error'));

            // Act: Call the deleteEvent function
            await deleteEvent(req, res);

            // Assert: Check if the response is as expected
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Failed to delete event" });
        });
    });
});

// End of unit tests for: deleteEvent
