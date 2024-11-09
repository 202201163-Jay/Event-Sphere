const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary'); 
const blogController = require('../Controller/blogcontroller');
const { upload } = require("../middleware/multer"); 


const router = express.Router();

router.post("/upload", upload.fields([
  {
    name: "posters",
    maxCount: 10
  }
]), blogController.createBlog);

router.get('/', blogController.getBlogs);  
router.get('/:id', blogController.getBlogById); 


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
