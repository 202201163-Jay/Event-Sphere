const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const collegeController = require("../Controller/authCollege")

router.post("/student-signup", authController.signup);
// router.post("/studentverify", authController.verifyCollegeAndSendOtp);
router.post("/verify-otp", authController.verifyOTP);
router.post("/college-register", collegeController.signup)
router.post("/student-login", authController.login)
router.post("/college-login", collegeController.login)
module.exports = router;
