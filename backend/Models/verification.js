const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  otpExpires: { type: Date, required: true },
  verified: { type: Boolean, default: false }
});

const verification = mongoose.model('verification', verificationSchema);

module.exports = verification;
