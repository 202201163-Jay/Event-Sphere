const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");

router.post("/signup", authController.signup);
router.post("/studentverify", authController.verifyCollegeAndSendOtp);
router.post("/verify-otp", authController.verifyOtp);

module.exports = router;
