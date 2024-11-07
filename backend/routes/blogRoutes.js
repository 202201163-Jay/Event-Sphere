// routes/blogRoutes.js
const express = require('express');
const multer = require('multer'); // Import multer
const blogController = require('../Controller/blogcontroller'); // Ensure correct path for your controller

const router = express.Router();

// Set up multer storage configuration (no file system storage needed)
const storage = multer.memoryStorage(); // Use memory storage to keep the file in memory

// Filter to allow only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// Initialize multer with the memory storage and file filter options
const upload = multer({ storage, fileFilter });

// Route to create a new blog with image upload to Cloudinary
router.post('/', upload.array('images', 5), blogController.createBlog); // Maximum of 5 images

// Route to get all blogs
router.get('/', blogController.getBlogs);

// Route to get a single blog by ID
router.get('/:id', blogController.getBlogById);

module.exports = router;
