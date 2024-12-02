const User = require("../Models/User");
const Event = require("../Models/Event");
const UserProfile = require("../Models/UserProfile");
const CollegeRep = require("../Models/CollegeRep");
const College = require("../Models/College"); // Import CollegeRep model

// Helper function to check if registration dates are valid
const isRegistrationOpen = (event, currentDate) => {
  return currentDate >= event.registrationStartDate && currentDate <= event.registrationEndDate;
};

// Event Registration Controller
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    console.log(1);

    // Fetch event details
    const event = await Event.findOne({ _id: eventId }).populate("clubId").exec();
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check registration dates
    const currentDate = new Date();
    if (!isRegistrationOpen(event, currentDate)) {
      return res.status(400).json({ error: "Registration is not open for this event." });
    }

    // Fetch user details
    const user = await User.findOne({ _id: userId }).populate("college").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already registered
    if (event.registrations.includes(userId)) {
      return res.status(400).json({ message: "You are already registered for this event." });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(200).json({
        message: "Please verify your college in profile section or Payment is required to register for this event.",
        diffCollege: true
      });
    }

    // Check if the user's college matches the event's club's college
    const userCollege = user?.college?._id ? user.college._id.toString() : null;
    const eventCollege = event?.clubId?.college?._id ? event.clubId.college._id.toString() : null;

    if (userCollege !== eventCollege) {
      return res.status(200).json({
        message: "You are from a different college. Payment is required to register for this event.",
        diffCollege: true
      });
    }

    // Register the user
    event.registrations.push(userId);
    await event.save();

    // Add the event to the user's participated array
    user.participated.push(eventId);
    await user.save();

    res.status(200).json({ message: "Registration successful", event });
  } catch (error) {
    console.error("Error during event registration:", error);
    res.status(500).json({ error: "An error occurred during registration" });
  }
};

exports.registerForEvent2 = async (req, res) => {
  try {
    const { eventId, userId } = req.params;

    // Fetch event details
    const event = await Event.findOne({ _id: eventId }).populate("clubId").exec();
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const user = await User.findOne({ _id: userId }).populate("college").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (event.registrations.includes(userId)) {
      return res.status(400).json({ message: "You are already registered for this event." });
    }

    event.registrations.push(userId);
    await event.save();

    // Add the event to the user's participated array
    const userProfile = await User.findOne({ _id: userId });
    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    user.participated.push(eventId);
    await user.save();

    res.status(200).json({ message: "Registration successful", event });
  } catch (error) {
    console.error("Error during event registration:", error);
    res.status(500).json({ error: "An error occurred during registration" });
  }
};