// controllers/blogController.js
const cloudinary = require('../config/cloudinary'); // Import the Cloudinary config
const Blog = require('../Models/Blog'); // Import your Blog model

cloudinary.config({
  cloud_name: "dggywuuhe",
  api_key: "325745837459845",
  api_secret: "Jsykss5EK86X6K0vTPbA8-eZR8s",
});

// Function to create a new blog post
const createBlog = async (req, res) => {
  try {
    // Extract data from the request body
    const { title, content, date, college } = req.body;
    const images = req.files; // The uploaded images will be in req.files

    // Handle image uploads to Cloudinary
    const imageUrls = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload_stream(
        {
          resource_type: 'image', // Ensure the resource is an image
          folder: 'eventSphere/blogs', // Optional: Set a folder in Cloudinary to organize your images
        },
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ message: 'Image upload failed' });
          } else {
            // Save the image URL in the array
            imageUrls.push(result.secure_url); // Store the Cloudinary URL of the uploaded image
          }
        }
      );
      images[i].stream.pipe(result); // Upload the image stream to Cloudinary
    }

    // Create a new blog post and save it to the database
    const newBlog = new Blog({
      title,
      content,
      date,
      college,
      images: imageUrls, // Store the array of image URLs
    });

    // Save the blog post
    await newBlog.save();

    // Return the response
    res.status(201).json({
      message: 'Blog created successfully!',
      blog: newBlog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred while creating the blog',
      error: error.message,
    });
  }
};

// Function to get all blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find(); // Retrieve all blog posts
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs' });
  }
};

// Function to get a single blog by its ID
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching the blog' });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
};
