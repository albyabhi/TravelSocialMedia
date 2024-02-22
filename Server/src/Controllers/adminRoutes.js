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
    const { adminEmail, adminId, adminPassword } = req.body;

    // Check if admin with the same adminId already exists
    const existingAdmin = await AdminDetails.findOne({ adminId });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this ID already exists.' });
    }

    // Hash the admin password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    // Create a new admin with additional fields
    const newAdmin = new AdminDetails({
      adminEmail,
      adminId,
      adminPassword: passwordHash, // Save the hashed password
    });

    // Save the admin to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully.' });
  } catch (error) {
    console.error('Admin signup failed:', error);

    if (error.name === 'ValidationError') {
      // Handle Mongoose validation errors
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

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