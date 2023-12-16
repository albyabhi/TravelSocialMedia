// src/routes/authRoutes.js
// src/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ProfileData = require('../models/profileDataModel');
const AdminDetails = require('../models/AdminDetails'); // Correct casing
const { authenticateToken, authenticateAdminToken } = require('../middleware/authMiddleware');
const config = require('../config/config');
const upload = require('../uploads/upload');
const router = express.Router();
const secretKey = config.secretKey;
const adminRouter = express.Router();



// Signup Endpoint
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      password, // Save the plain text password
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

// Protected Profile Endpoint
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

// Admin Signup Endpoint


router.post('/admin/signup', async (req, res) => {
  try {
    const { adminEmail, adminId, adminPassword } = req.body;

    // Check if admin with the same email or ID already exists
    const existingAdmin = await AdminDetails.findOne({ $or: [{ adminEmail }, { adminId }] });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email or ID already exists.' });
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create a new admin
    const newAdmin = new AdminDetails({
      adminEmail,
      adminId,
      adminPassword: hashedPassword,
    });

    // Save the new admin to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully.' });
  } catch (error) {
    console.error('Error in admin signup:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});




// Admin Login Endpoint
router.post('/admin/login', async (req, res) => {
  try {
    const { adminId, adminPassword } = req.body;

    // Find the admin by adminId
    const admin = await AdminDetails.findOne({ adminId });

    // Check if the admin exists and if the password is correct
    if (!admin || !(await bcrypt.compare(adminPassword, admin.adminPassword))) {
      return res.status(401).json({ message: 'Invalid admin ID or password.' });
    }

    // Generate a JWT token
    const token = jwt.sign({ adminId: admin.id }, 'your_secret_key', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Admin login failed:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


module.exports = router;
