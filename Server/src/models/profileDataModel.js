const mongoose = require('mongoose');

const profileDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bio: String,
  highlightedPlaces: [
    {
      value: String,
      label: String,
    }
  ],
  profilePicture: {
    data: String,
    contentType: String, // MIME type
  },
  firstName: String,
  lastName: String,
  phoneNumber: String,
});


const ProfileData = mongoose.model('ProfileData', profileDataSchema);

module.exports = ProfileData;