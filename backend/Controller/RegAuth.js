const bcrypt = require('bcrypt');
const User = require("../Models/User");
const College = require('../Models/College');
const CollegeRep = require("../Models/CollegeRep")
const jwt = require("jsonwebtoken")

require("dotenv").config()

exports.student_register = async (req, res) => {
    try {
        const { name, email, password} = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists",
            })
        }

        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            })
        }

        let user = await User.create({
            name,email,password:hashedPassword
        });

        return res.status(200).json({
            success : true,
            message : "User Created Successfully",
            data : user
        });
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "User cannot be register,Please try again later",
        })
    }
}

exports.college_register = async (req, res) => {
  try {
    
    const { name, email, password, emailDomain, collegeRepresentatives } = req.body;

    const existingCollege = await College.findOne({ email });

    if (existingCollege) {
      return res.status(400).json({
        success: false,
        message: "College Already Registered",
      });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error in hashing password",
      });
    }

    let hashedRepresentatives = [];
    if (collegeRepresentatives && collegeRepresentatives.length > 0) {
      for (let rep of collegeRepresentatives) {
        const hashedRepPassword = await bcrypt.hash(rep.password, 10);
        hashedRepresentatives.push({
          ...rep,
          password: hashedRepPassword,
        });
      }
    }

    const college = await College.create({
      name,
      email,
      password: hashedPassword,
      emailDomain,
      collegeRepresentatives: hashedRepresentatives,
    });


    if (collegeRepresentatives && collegeRepresentatives.length > 0) {
        const representatives = await Promise.all(collegeRepresentatives.map(async (rep) => ({
          repId: rep.repId,
          password: await bcrypt.hash(rep.password, 10),
          collegeId: college._id,
        })));
  
        await CollegeRep.insertMany(representatives);
      }


    return res.status(200).json({
      success: true,
      message: "College Registered Successfully",
      data: college,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "College registration failed. Please try again later.",
    });
  }
};

// Login
exports.login = async (req,res) => {
    try
    {
        const {email,password} = req.body;
        if(!email || !password)
        {
            return res.status(400).json({
                success:false,
                message : "Please fill all the details carefully",
            })
        }

        // check for register user 
        let user = await User.findOne({email});
        if(!user)
        {
            return res.status(401).json({
                success : false,
                message : "User does not exist",
            });
        }

        // Verify password & generate a JWT token

        const payload = {
            email : user.email,
            id : user._id,
            role : user.role,
        };


        if(await bcrypt.compare(password,user.password)){
            // password match
            let token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn : "2h",
            });

            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly : true,
            }

            res.cookie("token",token,options).status(200).json({
                success : true,
                token,
                user,
                message:"User logged in successfully"
            });
        }
        else {
            // password not match
            return res.status(403).json({
                success : false,
                message : "Password does not match",
            })
        }
    }
    catch(err){
        console.error(err)
        return res.status(500).json({
            success : false,
            message : "Login false" 
        })
    }
}