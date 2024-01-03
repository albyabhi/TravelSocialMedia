const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'], // Add other possible values if needed
    default: 'Active',
  },
  profileupdate: {
    type: String,
    enum: ['Done', 'Undone'], // Add other possible values if needed
    default: 'Undone',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
