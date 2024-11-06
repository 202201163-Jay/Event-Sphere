const College = require("../Models/College");
const CollegeRep = require("../Models/CollegeRep");
const bcrypt = require("bcrypt");

exports.Repsignup = async (req, res) => {
    try {
        const {
            name, // College name
            email, // College email
            password, // College password
            confirmPassword, // Confirm password
            emailDomain, // College email domain
            representatives // Array of representatives
        } = req.body;

        // Validate that all required fields are provided
        if (!name || !email || !password || !confirmPassword || !emailDomain) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Validate password match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // Check if a college with this email already exists
        const existingCollege = await College.findOne({ email });
        if (existingCollege) {
            return res.status(400).json({ message: "College email already registered." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the college document
        const college = new College({
            name,
            email,
            password: hashedPassword,
            emailDomain,
            collegeRepresentatives: representatives || [] // Set representatives if provided
        });

        // Save college details
        await college.save();

        // Loop through each representative in the request and create a CollegeRep document for each
        if (representatives && representatives.length > 0) {
            for (const rep of representatives) {
                const { repname, repId, password } = rep;
                const hashedRepPassword = await bcrypt.hash(password, 10);

                // Create and save CollegeRep document
                await CollegeRep.create({
                    repId,
                    password: hashedRepPassword,
                    collegeId: college._id,
                });
            }
        }

        // Send success response
        res.status(201).json({ message: "College registered successfully." });

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.repLogin = async (req, res) => {
    try {
        const { repId, password } = req.body;

        // Find the representative by repId
        const collegeRep = await CollegeRep.findOne({ repId }).populate("collegeId");
        if (!collegeRep) {
            return res.status(404).json({ error: "Representative not found" });
        }

        // Check password

        const isPasswordValid = await bcrypt.compare(password, CollegeRep.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Generate JWT token
        const token = await collegeRep.generateToken();

        res.status(200).json({
            message: "Login successful",
            token,
            representative: {
                id: collegeRep._id,
                repId: collegeRep.repId,
                college: collegeRep.collegeId.name,
            },
        });
    } catch (error) {
        console.error("Error in representative login:", error);
        res.status(500).json({ error: "Server error" });
    }
};
