const express = require('express')
const router = express.Router();

const {student_register, college_register} = require("../Controller/RegAuth");
const { loginAsCollege, loginAsUser } = require("../Controller/LogAuth");
const { generateOtp, verifyOtp } = require('../Controller/verificationController');

router.route("/student-register").post(student_register);
router.route("/college-register").post(college_register);

router.route('/college-login').post(loginAsCollege);
router.route('/student-login').post(loginAsUser);


router.post('/generate-otp', generateOtp);
router.post('/verify-otp', verifyOtp);
module.exports = router;