const College = require('../Models/College');
const CollegeRep = require('../Models/CollegeRep');
const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'TeamDoIt';

exports.loginAsCollege = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if both email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details carefully",
            });
        }

        // Check if the email exists in CollegeRep schema
        let collegeRep = await CollegeRep.findOne({ repId: email }).populate('collegeId');
        if (!collegeRep) {
            return res.status(401).json({
                success: false,
                message: "College representative does not exist",
            });
        }

        const isPasswordvalid = await collegeRep.comparePassword(password)
        if(isPasswordvalid){
            const token = await collegeRep.generateToken()
            return res.status(200).json({message: "College representative logged in successfully", token, userId: collegeRep._id.toString()})
        }
        else{
            return res.status(401).json({message: "Invalid email or password"})
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
};

exports.loginAsUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details carefully",
            });
        }

        const userExist = await User.findOne({ email });
        const name = userExist.name
        if (!userExist) {
            return res.status(401).json({
                success: false,
                message: "User does not exist",
            });
        }
        const isPasswordvalid = await userExist.comparePassword(password)
        if(isPasswordvalid){
            const token = await userExist.generateToken()
            return res.status(200).json({message: "User Login Successful!!", token, name, userId: userExist._id.toString()})
        }
        else{
            return res.status(401).json({message: "Invalid email or password"})
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
};