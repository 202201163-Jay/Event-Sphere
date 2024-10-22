const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Verification = require('../Models/verification');

// Generate OTP
const generateOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Find if an OTP request already exists for this email
    let verification = await Verification.findOne({ email });

    // Implement rate limiting (prevent multiple OTP requests in a short time)
    if (verification && new Date() < verification.otpExpires) {
      return res.status(429).json({ message: 'OTP was recently sent. Please wait before requesting another.' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiration time to 5 minutes from now
    const otpExpires = new Date(Date.now() + 5 * 60000);

    // If verification entry exists, update it. Otherwise, create a new one.
    if (verification) {
      verification.otp = otp;
      verification.otpExpires = otpExpires;
      verification.verified = false;
    } else {
      verification = new Verification({
        email,
        otp,
        otpExpires,
      });
    }

    // Save the OTP and expiration in the database
    await verification.save();

    // Send OTP to user's email using Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // set to true if using port 465
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // App password for Gmail
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your OTP for Verification',
      text: `Your OTP for verification is ${otp}. This OTP will expire in 5 minutes.`,
    };

    // Send mail and handle errors
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'OTP sent to email' });

  } catch (error) {
    console.error('Error in generateOtp:', error);
    return res.status(500).json({ message: 'Failed to generate OTP' });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the OTP for the given email
    const verification = await Verification.findOne({ email });

    // Check if a verification request exists
    if (!verification) {
      return res.status(400).json({ message: 'No OTP request found for this email' });
    }

    // Check if the OTP has expired
    if (verification.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Check if the OTP is correct
    if (verification.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Mark the OTP as verified and nullify the old OTP to prevent reuse
    verification.verified = true;
    verification.otp = null; // Invalidate OTP after use
    await verification.save();

    return res.status(200).json({ message: 'OTP verified successfully' });

  } catch (error) {
    console.error('Error in verifyOtp:', error);
    return res.status(500).json({ message: 'Failed to verify OTP' });
  }
};

module.exports = {
  generateOtp,
  verifyOtp,
};
