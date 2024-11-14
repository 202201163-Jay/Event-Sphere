const express = require("express");
const router = express.Router();
const controller = require('../Controller/eventListing');

//router.post("/club-verify", controller.verifyOTP);
router.post("/listing", eventListing.createEvent);


module.exports = router;