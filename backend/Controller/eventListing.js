const cloudinary = require('../config/cloudinary'); 
const Event = require('../Models/Event'); 
const User = require('../Models/User'); 
const { uploadOnCloudinary } = require("../config/cloudinary");
const { upload2 } = require("../middleware/multer");

exports.getParticipants=async(req,res)=>{
  try{
    console.log("Participants page",req.params.eventId)
    const participants = await Event.findOne({_id:req.params.eventId}).populate({
      path: 'registrations', // Populate 'registrations' array
      populate: {
        path: 'additionalDetails', // For each user, populate 'additionalDetails'
        model: 'UserProfile', // Specify the model for nested population
      },
    });

    console.log("Participants",participants)
    // participants.registrations.populate('additionalDetails')

    console.log("Participants fetched")

    if (!participants) {
      return res
      .status(404)
      .json({ error: "Partcipant not found" });
  }
  console.log("Hyeyyy")
  res
  .status(200)
  .json({participants});


  }
  catch(err){
    res
    .status(500)
    .json({ error: "Failed to retrieve participants" });

  }
}

exports.createEvent = async (req, res) => {
  upload2(req, res, async (err) => {
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
        mode,
        venue,
        contactPersonEmail,
        contactPersonPhone,
        clubId,
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
        listedAt: new Date(), // Default to current date if not provided
        registrationStartDate: new Date(registrationStartDate),
        registrationEndDate: new Date(registrationEndDate),
        startTime: startTime || getDefaultStartTime(), // Use default function if not provided
        endTime: endTime || getDefaultEndTime(),       // Use default function if not provided
        type,
        tags: JSON.parse(tags), // Ensure tags is parsed to array
        createdBy, // Assuming createdBy is a valid ObjectId reference to CollegeRep
        mode,
        venue,
        contactPersonEmail,
        contactPersonPhone,
        clubId,
      });

      await newEvent.save();

      res.status(201).json({
        message: 'Event created successfully!',
        event: newEvent,
      });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({
        message: 'An error occurred while creating the event',
        error: error.message,
      });
    }
  });
};

// Helper functions for default times
const getDefaultStartTime = () => {
  const now = new Date();
  now.setHours(9, 0, 0, 0); // Default start time at 9:00 AM
  return now;
};

const getDefaultEndTime = () => {
  const now = new Date();
  now.setHours(17, 0, 0, 0); // Default end time at 5:00 PM
  return now;
};
