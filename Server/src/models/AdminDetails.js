// src/models/AdminDetails.js

const mongoose = require('mongoose');

const adminDetailsSchema = new mongoose.Schema({
  adminEmail: String,
  adminId: String,
  adminPassword: String,
});

const AdminDetails = mongoose.model('AdminDetails', adminDetailsSchema);

module.exports = AdminDetails;
