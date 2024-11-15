const express = require('express');
const router = express.Router();
const homepageController = require('../Controller/homepage');

// Route to get trending events
router.get('/trending', homepageController.getTrendingEvents);

module.exports = router;
