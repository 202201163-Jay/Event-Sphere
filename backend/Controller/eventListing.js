const cloudinary = require('../config/cloudinary'); 
const Event = require('../Models/Event'); 
const User = require('../Models/User'); 
const { uploadOnCloudinary } = require("../config/cloudinary");
const { upload } = require("../middleware/multer");

const createEvent = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'File upload error', error: err });
    }

    try {
      const {
        eventName,
        description,
        price,
        registrationStartDate,
        registrationEndDate,
        startTime,
        endTime,
        type,
        tags,
        createdBy,
        occasion,
        mode,
        venue,
        pointOfContact,
      } = req.body;

      

      // Access uploaded poster file
      const posterFile = req.file;

      // Upload poster to Cloudinary and get URL
      let posterUrl = null;
      if (posterFile) {
        const uploadResult = await uploadOnCloudinary(posterFile.path, "/eventsphere/events");
        posterUrl = uploadResult ? uploadResult.url : null;
      }

      // Create a new event and save it to the database
      const newEvent = new Event({
        eventName,
        description,
        price,
        poster: posterUrl,
        listedAt: listedAt ? new Date(listedAt) : new Date(), // Default to current date if not provided
        registrationStartDate: new Date(registrationStartDate),
        registrationEndDate: new Date(registrationEndDate),
        startTime: startTime || getDefaultStartTime(), // Use default function if not provided
        endTime: endTime || getDefaultEndTime(),       // Use default function if not provided
        type,
        tags: JSON.parse(tags), // Ensure tags is parsed to array
        createdBy, // Assuming `createdBy` is a valid `ObjectId` reference to `CollegeRep`
        occasion,
        mode,
        venue,
        pointOfContact: JSON.parse(pointOfContact), // Ensure pointOfContact is parsed to array
        
      });

      await newEvent.save();

      res.status(201).json({
        message: 'Event created successfully!',
        event: newEvent,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'An error occurred while creating the event',
        error: error.message,
      });
    }
  });
};

module.exports = { createEvent };
