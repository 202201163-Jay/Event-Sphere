// models/Blog.js
const mongoose = require('mongoose');

// Blog Schema
const blogSchema = new mongoose.Schema(
  {
    college_id: {
      type: mongoose.Schema.Types.ObjectId, // This will reference the College model
      ref: 'CollegeRep', // Ensure you have a College model set up
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String, // Each image will be stored as a URL string (path to the image)
      },
    ],
    created_at: {
      type: Date,
      default: Date.now, // Automatically sets the creation date to the current date
    },
    updated_at: {
      type: Date,
      default: Date.now, // Automatically sets the update date to the current date
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Create the Blog model
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
