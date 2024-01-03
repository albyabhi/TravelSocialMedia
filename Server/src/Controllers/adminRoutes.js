const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express'); // don't forget to import express
const { authenticateAdminToken } = require('../middleware/authMiddleware.js');
const AdminDetails = require('../models/AdminDetails');
const config = require('../config/config');
const secretKey = config.secretKey;

const router = express.Router();

// Admin Signup Endpoint
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

    // Create a new user with additional fields
    const newUser = new User({
      username,
      email,
      password: passwordHash,
      status: 'Active',        // Set status to 'Active'
      profileupdate: 'Undone', // Set profileupdate to 'Undone'
    });

    // Save the user to the database (password will be automatically hashed)
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Signup failed:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Admin Login Endpoint
router.post('/login', async (req, res) => {
  try {
    const { adminId, adminPassword } = req.body;

    // Find the admin by adminId
    const admin = await AdminDetails.findOne({ adminId });

    // Check if the admin exists and if the password is correct
    if (!admin || !(await bcrypt.compare(adminPassword, admin?.adminPassword || ''))) {
      return res.status(401).json({ message: 'Invalid admin ID or password.' });
    }
    // Generate a JWT token
    const token = jwt.sign({ adminId: admin.id }, secretKey , { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Admin login failed:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Protected route for testing authentication
router.get('/protected', authenticateAdminToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully.' });
});

module.exports = router;

