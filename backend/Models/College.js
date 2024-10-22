const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true, 
  },
  emailDomain: {
    type: String,
    required: true,
    trim: true,
  },
  collegeRepresentatives: {
    type: [
      {
        repname: {
          type: String,
          required: true,
        },
        repId: {
          type: String,
          required: true,
          trim: true,
        },
        password: {
          type: String,
          required: true, // Ensure this is hashed before saving
        },
      },
    ],
    default: [], // Set default to an empty array if no representatives are provided
    validate: {
      validator: function (v) {
        return v.length <= 10;
      },
      message: "You can add a maximum of 10 batch representatives.",
    },
  },
});

collegeSchema.pre('save', async function(next) {
  const college = this;

  if (college.collegeRepresentatives.length > 0) {
    for (let rep of college.collegeRepresentatives) {
      if (rep.isModified('password')) {
        rep.password = await bcrypt.hash(rep.password, 10);
      }
    }
  }

  next();
});

module.exports = mongoose.model("College", collegeSchema);
