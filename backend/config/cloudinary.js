// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Ensure dotenv is loaded to access environment variables
const fs = require("fs");


        cloudinary.config({
            cloud_name: "dggywuuhe",
            api_key: "325745837459845",
            api_secret: "Jsykss5EK86X6K0vTPbA8-eZR8s",
        });

        exports.uploadOnCloudinary = (fileBuffer, resourceType) => {
            return new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: resourceType },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
              uploadStream.end(fileBuffer);
          });
        };

