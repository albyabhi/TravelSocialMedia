// src/models/userModel.js
const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema);
module.exports = User;
