const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        require: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    thumbnail: {
        type: String,
    },
    listedAt: {
        type: Date,
        require: true,
    },
    lastDate: {
        type: Date,
        require: true,
    },
    eventType: {
        type: String,
        enum: ["Competition", "Concert", "Other"],
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CollegeRep",
        type: String,
        require: true,
    },
    registrations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }]
    
});

module.exports = mongoose.model("Event", eventSchema);