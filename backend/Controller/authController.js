// controllers/authController.js
const User = require("../Models/User");
const UserProfile = require("../Models/UserProfile");
const OTP = require("../Models/OTP");
const College = require("../Models/College");
const mailSender = require("../utils/mailsender");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the provided password matches the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Set token expiry as needed
    });

    // Respond with the token and user information if needed
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }

};

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validate password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const profileDetails = await UserProfile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumer: null,
    });

    // Create the new user but don't save college verification data yet
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", userId: newUser._id });

    // Send OTP if college email provided
    // if (collegeEmail) {
    //   await verifyCollegeAndSendOtp(collegeEmail);
    // }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Helper function to verify college and send OTP
exports.verifyCollegeAndSendOtp = async (req, res) => {
  // Extract domain from collegeEmail (everything after '@' up to the first '.')
  const { collegeEmail } = req.body;
  const emailDomain = collegeEmail.split('@')[1].split('.')[0];

  // Check if a college with this domain exists
  console.log(`${emailDomain}`);
  const college = await College.findOne({ emailDomain });

  if (!college) {
    throw new Error("Invalid college domain");
  }

  // Generate OTP and save it
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await OTP.create({ email: collegeEmail, otp });

  // Send OTP via email
  await mailSender(collegeEmail, "Verification OTP", `Your OTP is ${otp}`);
};

// Function to verify OTP and complete registration
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark the user as verified and associate college if needed
    const user = await User.findOneAndUpdate(
      { collegeEmail: email },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    await OTP.deleteOne({ _id: otpRecord._id }); // Delete OTP after successful verification
    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};
