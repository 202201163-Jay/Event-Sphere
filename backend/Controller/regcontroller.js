const User = require("../Models/User");
const Event = require("../Models/Event");
const UserProfile = require("../Models/UserProfile");
const CollegeRep = require("../Models/CollegeRep"); // Import CollegeRep model

// Event Registration Controller
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id; // Assumes the user ID is provided by the auth middleware

    // Fetch event details
    const event = await Event.findById(eventId).populate("clubId"); // Populate clubId to get the CollegeRep details
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check registration dates
    const currentDate = new Date();
    if (currentDate < event.registrationStartDate || currentDate > event.registrationEndDate) {
      return res.status(400).json({ error: "Registration is not open for this event." });
    }

    // Fetch user details
    const user = await User.findById(userId).populate("college");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user is already registered
    if (event.registrations.includes(userId)) {
      return res.status(400).json({ error: "You are already registered for this event." });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({ error: "User is not verified. Verification required to register for this event." });
    }

    // Check if the user's college matches the event's club's college
    const userCollege = user.college?._id.toString();
    const eventCollege = event.clubId.college?._id.toString(); // Get the college from the CollegeRep (clubId)

    if (userCollege !== eventCollege) {
      return res.status(200).json({
        message: "You are from a different college. Payment is required to register for this event."
      });
    }

    // Register the user
    event.registrations.push(userId);
    await event.save();

    // Add the event to the user's participated array
    const userProfile = await UserProfile.findOne({ user: userId }); // Assuming you have a user reference in UserProfile
    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    userProfile.participated.push(eventId);
    await userProfile.save();

    res.status(200).json({ message: "Registration successful", event });
  } catch (error) {
    console.error("Error during event registration:", error);
    res.status(500).json({ error: "An error occurred during registration" });
  }
};
