// src/models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  profilePicture: String,
  bio: String,
  highlightedPlaces: [String],
  firstName: String,     
  lastName: String,     
  phoneNumber: String, 
});
userSchema.pre('save', async function (next) {
  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;