const express = require("express");
const router = express.Router();
const controller = require('../Controller/authcollegeprofile')

router.get('/:userId', controller.getCollegeById);

router.post("/club-signup", controller.signup);
router.post("/club-verify", controller.verifyOTP);

module.exports = router;