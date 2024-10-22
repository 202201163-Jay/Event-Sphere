const mongoose = require("mongoose");
const hashvalue = 10
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
  },
});

userSchema.pre('save', async function (next) {
  const user = this;
  console.log(user)
  if (!user.isModified('password')) return next();

  try {
      const saltRound = await bcrypt.genSalt(hashvalue);
      const hashedPassword = await bcrypt.hash(user.password, saltRound);
      user.password = hashedPassword;
      next();
  } catch (error) {
      console.error(error);
      next(error);
  }
});

userSchema.methods.generateToken = async function () {
  try {
      return jwt.sign({
          name: this.name,
          userId: this._id.toString(),
          email: this.email,
      }, "Smit", {
          expiresIn: "30d",
      });
  } catch (error) { 
      console.error(error);
  }
};

userSchema.methods.comparePassword = async function (password) {
  // console.log(password)
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
