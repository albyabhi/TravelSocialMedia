// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware and Configurations
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('public/uploads'));



// Connect to MongoDB
mongoose.connect('mongodb+srv://Albyabhi:Albyabhi4645@cluster0.prdylvt.mongodb.net/TSM?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });


// Define User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  profilePicture: String, 
  bio: String,
  highlightedPlaces: [String],
});


const User = mongoose.model('User', userSchema);


// Define the ProfileData Schema
const profileDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bio: String,
  highlightedPlaces: [String],
  profilePicture: String,
});



const ProfileData = mongoose.model('ProfileData', profileDataSchema);

// Configure Multer for profile picture uploads
const storage = multer.diskStorage({
  destination: './public/uploads/', // Define the directory where profile pictures will be stored
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded profile picture
    cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });



// Signup Endpoint
app.post('/api/signup', async (req, res) => {

  try {
    const { username, email, password } = req.body;

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Signup failed:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



// web token 

const jwt = require('jsonwebtoken');

// Secret key for JWT (use a strong and secure key)
const secretKey = 'your_secret_key';

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
};


// Login Endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists and if the password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


// Protected Profile Endpoint
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch user data from the database using userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Assuming your user schema has properties like 'username', 'email', etc.
    const userProfile = {
      userId: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      highlightedPlaces: user.highlightedPlaces,
    };

    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



// Update Profile Endpoint
app.post('/api/profile/update', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.user.userId;

    // Update user data based on the received data
    const updateUser = {
      bio: req.body.bio,
      highlightedPlaces: req.body.highlightedPlaces,
    };

    // If a profile picture is uploaded, add it to the updateUser object
    if (req.file) {
      updateUser.profilePicture = req.file.filename;
    }

    // Save the updated user data to the database
    await User.findByIdAndUpdate(userId, updateUser);

    // Update or create ProfileData entry
    const updatedProfileData = await ProfileData.findOneAndUpdate({ userId: userId }, updateUser, { upsert: true, new: true });

    console.log('Updated User:', updateUser);
    console.log('Updated ProfileData:', updatedProfileData);

    res.json({ message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});




// Profile Picture Upload Endpoint
app.post('/api/profile/upload', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  try {
    const profilePictureFilename = req.file.filename;
    const userId = req.user.userId;

    // Update the user's profile picture field in the database
    await User.findByIdAndUpdate(userId, { profilePicture: profilePictureFilename });

    console.log('Profile Picture Uploaded:', profilePictureFilename);

    res.json({ message: 'Profile picture uploaded successfully.' });
  } catch (error) {
    console.error('Profile picture upload failed:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



module.exports = ProfileData;

function generateToken(user) {
    return `${user.username}:${user.email}`;
  }


  // Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});