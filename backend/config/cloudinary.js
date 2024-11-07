// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Ensure dotenv is loaded to access environment variables

// Configure Cloudinary with credentials from .env
cloudinary.config({
    cloud_name: "dggywuuhe",
    api_key: "325745837459845",
    api_secret: "Jsykss5EK86X6K0vTPbA8-eZR8s",
});

module.exports = cloudinary;
