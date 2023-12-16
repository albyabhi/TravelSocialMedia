const express = require('express');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Import the User model
const { authenticateToken } = require('../middleware/authMiddleware.js');
const ProfileData = require('../models/profileDataModel');
const config = require('../config/config');
const secretKey = config.secretKey;
const upload = require('../uploads/upload');




const router = express.Router();

// Signup Endpoint
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash the user password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: passwordHash, // Save the hashed password
    });

    // Save the user to the database (password will be automatically hashed)
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Signup failed:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
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

// Protected route for testing authentication
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully.' });
});

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch user data from the User collection using userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Fetch profile data from the ProfileData collection using userId
    const profileData = await ProfileData.findOne({ userId });

    // Combine user and profile data into a single object
    const userProfile = {
      userId: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      highlightedPlaces: user.highlightedPlaces,
      firstName: profileData?.firstName || '', 
      lastName: profileData?.lastName || '', 
      phoneNumber: profileData?.phoneNumber || '', 
    };

    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


// update profile
router.post('/profile/update', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch the existing user data
    const existingUser = await User.findById(userId);

    // Verify that the user exists
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update user data based on the received data
    existingUser.bio = req.body.bio;
    existingUser.highlightedPlaces = req.body.highlightedPlaces;

    // If a profile picture is uploaded, update it
    if (req.file) {
      existingUser.profilePicture = req.file.filename;
    }

    // Save the updated user data to the database
    await existingUser.save();

    // Update or create ProfileData entry
    const updatedProfileData = await ProfileData.findOneAndUpdate(
      { userId: userId },
      {
        bio: existingUser.bio,
        highlightedPlaces: existingUser.highlightedPlaces,
        profilePicture: existingUser.profilePicture,
        firstName: req.body.firstName,     // Add this line
        lastName: req.body.lastName,       // Add this line
        phoneNumber: req.body.phoneNumber, // Add this line
      },
      { upsert: true, new: true }
    );

    console.log('Updated User:', existingUser);
    console.log('Updated ProfileData:', updatedProfileData);

    res.json({ message: 'Profile updated successfully.', updatedUser: existingUser, updatedProfileData });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});



// Profile Picture Upload Endpoint
router.post('/profile/upload', authenticateToken, async (req, res) => {
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



module.exports = router;