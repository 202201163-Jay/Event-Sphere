// Import Mongoose 
const mongoose = require('mongoose');

// Helper function to set the default start and end times
function getDefaultStartTime() 
{
    const now = new Date();
    now.setMinutes(0, 0, 0); // Round up to the nearest hour
    now.setHours(now.getHours() + 1); // Set to the next full hour
    return now.toTimeString().slice(0, 5); // Format as "HH:MM"
}

function getDefaultEndTime() 
{
    const start = new Date();
    start.setMinutes(0, 0, 0);
    start.setHours(start.getHours() + 3); // Default to 3 hours from the next hour
    return start.toTimeString().slice(0, 5); // Format as "HH:MM"
}

const eventSchema = new mongoose.Schema({
    
    eventName: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    price: {
        type: Number,
        required: true,
        default: 0
    },

    thumbnail: {
        type: String,
    },

    listedAt: {
        type: Date,
        required: true,
    },

    startDate: {
        type: Date,
        required: true,
    },

    lastDate: { //The last date to register for the event.
        type: Date,
        required: true,
    },

    startTime: {
        type: String,  
        default: getDefaultStartTime,  // Sets startTime to the next hour by default
    },

    endTime: {
        type: String,  
        default: getDefaultEndTime,  // Sets endTime to 3 hours after the next hour
    },

    eventType: {
        type: String,
        enum: ["Competition", "Concert", "Other"],
        required: true,
    },

    tags: [{
        type: String
    }],
       
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CollegeRep",
        type: String,
        require: true,
    },
       
    registrations: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],

    occasion: {
        type: String
    },

    mode: {
        type: String,
        enum: ['online', 'offline'], 
        required: true
    },

    pointOfContact: [{
        email: {
            type: String,
            required: true
        },
        contact: {
            type: String, 
            required: true,
        }
    }]
});

module.exports = mongoose.model("Event", eventSchema);