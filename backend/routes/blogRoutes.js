const express = require('express');
const multer = require('multer');
const blogController = require('../Controller/blogcontroller');
const { upload } = require("../middleware/multer"); 
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Blog creation route - only accessible by colleges
router.post("/create", authMiddleware, upload.fields([
  {
    name: "posters",
    maxCount: 10
  }
]), blogController.createBlog);

// Get all blogs (public access)
router.get('/', blogController.getBlogs);  

// Get a single blog by its ID (public access)
router.get('/:id', blogController.getBlogById); 

// Handle errors related to file upload or server issues
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
  next();
});

module.exports = router;
