const express = require("express");
const router = express.Router();
const controller = require('../Controller/admin');

router.get('/colleges', controller.getColleges);
router.get('/clubs/:id', controller.getClubs);
router.get('/events/:id', controller.getEvents)
router.get('/blogs/:id', controller.getBlogs)

module.exports = router;