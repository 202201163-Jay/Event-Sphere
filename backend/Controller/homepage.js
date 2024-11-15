const User = require('../Models/User');
const Event = require('../Models/Event');



// Fetch trending events
exports.getTrendingEvents = async (req, res) => {
    try {
        console.log("vgoroeee");
        // Adjust criteria as per your trending logic, e.g., events with high registration or recent listing
        const trendingEvents = await Event.find({ /* your criteria for trending */ })
            .sort({ listedAt: -1 }) // Example: Sort by latest listed
            .limit(3); // Limit the number of events
        console.log("afaf");
        res.status(200).json({trendingEvents,status:"ok"});
    } catch (error) {
        res.status(500).json({ error: 'Error fetching trending events' });
    }
};






// // Fetch New Events (recently listed)
// exports.getNewEvents = async (req, res) => {
//     try {
//         // Find events that are active and ensure required fields are set
//         const newEvents = await Event.find(
//             {
//                 listedAt: { $exists: true, $ne: null }, // Ensure the 'listedAt' field exists and is not null
//                 startDate: { $exists: true, $ne: null }, // Ensure startDate exists
//                 lastDate: { $exists: true, $ne: null } // Ensure lastDate exists
//             },
//             {
//                 eventName: 1,
//                 description: 1,
//                 price: 1,
//                 poster: 1, // Ensure the image URL is included
//                 listedAt: 1,
//                 startDate: 1,
//                 lastDate: 1,
//                 startTime: 1,
//                 endTime: 1,
//                 eventType: 1,
//                 tags: 1,
//                 mode: 1,
//                 pointOfContact: 1
//             }
//         )
//         .sort({ listedAt: -1 }) // Sort by listedAt in descending order (newest first)
//         .limit(3); // Limit to 3 new events

//         // If no new events found
//         if (newEvents.length === 0) {
//             return res.status(404).json({
//                 message: 'No new events found'
//             });
//         }
        
//         res.status(200).json({
//             message: 'New events fetched successfully',
//             events: newEvents
//         });
//     } catch (error) {
//         console.error('Error fetching new events:', error);
//         res.status(500).json({
//             message: 'An error occurred while fetching new events',
//             error: error.message
//         });
//     }
// };


// exports.getTrendingEvents = async (req, res) => {
//     try {
//         // Fetch events and populate the 'registrations' field
//         const events = await Event.find()
//             .populate('registrations')  // Populate the registrations with User data
//             .exec();

//         // Sort events by the length of the 'registrations' array in descending order
//         events.sort((a, b) => b.registrations.length - a.registrations.length); // Sort by registration count

//         // Limit to the top 5 events (you can change this number if needed)
//         const topTrendingEvents = events.slice(0, 5);

//         // Check if no events found
//         if (topTrendingEvents.length === 0) {
//             return res.status(404).json({ message: 'No trending events found' });
//         }

//         // Send the response with events and populated user data
//         res.status(200).json({
//             message: 'Trending events fetched successfully',
//             events: topTrendingEvents
//         });
//     } catch (error) {
//         console.error('Error fetching trending events:', error);
//         res.status(500).json({
//             message: 'An error occurred while fetching trending events',
//             error: error.message
//         });
//     }
// };

