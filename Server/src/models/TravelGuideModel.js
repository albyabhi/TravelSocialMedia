const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { authenticateToken } = require('../middleware/authMiddleware');

// Define the Destination Schema
const destinationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        data: String, // Store image data as binary Buffer
        contentType: String // Store content type of the image
    },
    location_id: {
        type: String,
        required: true
    },
    transportation: {
        type: String,
        enum: ['car', 'bus', 'train', 'bike', 'plane'],
        default: 'car'
    },
    visitingTime: {
        type: String,
        enum: ['morning', 'afternoon', 'evening'],
        default: 'morning'
    },
    visitingDuration: {
        type: Number,
        default: 1
    }
});

const travelGuideSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itinerary: {
        type: Object,
        required: true
    },
    featureDestination: {
        type: Object,
        required: true
    }
});

// Create and export the TravelGuide model
const TravelGuide = mongoose.model('TravelGuide', travelGuideSchema);
module.exports = TravelGuide;
