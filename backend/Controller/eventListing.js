const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const User = require('../models/User');  // Assuming you have a User model
const Event = require('../models/Event');
const streamifier = require('streamifier');

// Configure Cloudinary
cloudinary.config({
    cloud_name: "ddotijfyk",
    api_key: "443941747313975",
    api_secret: "KdC_vltbDsWjYeMniMtvjUOpINA",
});

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.createEvent = [
    upload.single('thumbnail'), // Expecting the thumbnail image file in form data
    async (req, res) => {
        try {
            const {
                eventName,            
                description,          
                price,                
                listedAt,             
                startDate,            
                lastDate,             
                startTime,            
                endTime,              
                eventType,            
                createdBy,            
                tags,                 
                occasion,             
                mode,                 
                pointOfContact,           
            } = req.body;

            // Validate required fields
            if (!eventName || !listedAt || !startDate || !lastDate || !eventType || !mode || !pointOfContact) {
                return res.status(400).json({ message: 'Please provide all required fields.' });
            }

            let thumbnailUrl = '';  // Initialize thumbnail URL

            // Handle file upload if a thumbnail is provided
            if (req.file) {
                // Upload the image to Cloudinary
                const uploadResult = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: 'event_thumbnails' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });

                // Get the secure URL from Cloudinary's response
                thumbnailUrl = uploadResult.secure_url;
            }

            // Handle registrations if provided (should be an array of user IDs in JSON string format)
            let registrationIds = [];
            if (registrations) {
                try {
                    registrationIds = JSON.parse(registrations);  // Parse registrations if it's a JSON string
                    // Validate user IDs if necessary
                    const users = await User.find({ '_id': { $in: registrationIds } });
                    if (users.length !== registrationIds.length) {
                        return res.status(400).json({ message: 'One or more user IDs are invalid.' });
                    }
                } catch (error) {
                    return res.status(400).json({ message: 'Invalid registrations data.' });
                }
            }

            // Create event in the database
            const newEvent = new Event({
                eventName,
                description,
                price: price || 0,
                thumbnail: thumbnailUrl,
                listedAt,
                startDate,
                lastDate,
                startTime,
                endTime,
                eventType,
                createdBy,
                tags: JSON.parse(tags),  // Parse tags if they are sent as a JSON string
                occasion,
                mode,
                pointOfContact: JSON.parse(pointOfContact), // Parse JSON data if sent as a string
                registrations: registrationIds,
            });

            // Save the event to the database
            const savedEvent = await newEvent.save();
            console.log("Event created successfully:", savedEvent);

            // Return the response to the client
            res.status(201).json({
                message: 'Event created successfully',
                event: savedEvent
            });

        } catch (error) {
            console.error("Error creating event:", error);
            res.status(500).json({
                message: 'An error occurred while creating the event.',
                error: error.message
            });
        }
    }
];
