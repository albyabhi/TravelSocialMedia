// models/locationModels.js
const mongoose = require('mongoose');

// Nation Schema
const nationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,  
    unique: true,
    
  },
});

const Nation = mongoose.model('Nation', nationSchema);

// State Schema
const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    
  },
  nation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nation',
    required: true,
  },
});

const State = mongoose.model('State', stateSchema);

// Location Schema
const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: true,
  },
  nation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nation',
    required: true,
  },
  image: {
    data: String, // Store binary image data
    contentType: String, // Store the MIME type of the image
  },
});

const Location = mongoose.model('Location', locationSchema);

module.exports = {
  Nation,
  State,
  Location,
};

