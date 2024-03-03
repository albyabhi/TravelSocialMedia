const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const fs = require('fs');
const upload = require('../uploads/upload');

const TravelGuide = require('../models/TravelGuideModel');

// Route to upload travel guide data
router.post('/upload', authenticateToken, upload.fields([{ name: 'FeatureDestinationImage', maxCount: 1 }]), async (req, res) => {
    try {
        // Extract userId from the token
        const userId = req.user.userId;

        // Extract itinerary from the request body
        const itinerary = JSON.parse(req.body.itinerary);

        // Extract FeatureDestination from the request body
        const FeatureDestination = JSON.parse(req.body.FeatureDestination);

        // Check if FeatureDestination is missing
        if (!FeatureDestination) {
            throw new Error('FeatureDestination is missing in the request body.');
        }

        // Handle feature destination image
        let featureDestinationImageData = null;
        if (req.files && req.files['FeatureDestinationImage']) {
            const featureDestinationImage = req.files['FeatureDestinationImage'][0];
            featureDestinationImageData = {
                data: fs.readFileSync(featureDestinationImage.path).toString('base64'),
                contentType: featureDestinationImage.mimetype
            };
        }

        console.log('Received Feature Destination Image Data:', featureDestinationImageData);

        // Ensure Day 1 field is present in the itinerary
        if (!itinerary['Day 1']) {
            throw new Error('Day 1 is required in the itinerary.');
        }

        // Create a new travel guide document
        const newTravelGuide = new TravelGuide({
            userId,
            itinerary,
            featureDestination: {
                ...FeatureDestination,
                image: featureDestinationImageData
            }
        });

        // Save the travel guide to the database
        await newTravelGuide.save();
        console.log('New Travel Guide:', newTravelGuide);

        res.status(201).json({ message: 'Travel guide uploaded successfully.', travelGuide: newTravelGuide });
    } catch (error) {
        console.error('Error uploading travel guide:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/fetch/:destinationName', async (req, res) => {
    try {
        const destinationName = req.params.destinationName;
        const travelGuides = await TravelGuide.find({ 'featureDestination.name': destinationName });
        res.status(200).json({ travelGuides });
    } catch (error) {
        console.error('Error fetching travel guides:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/fetchbyLid/:locationId', async (req, res) => {
    try {
        const locationId = req.params.locationId;
        const travelGuides = await TravelGuide.find({ 'featureDestination.location_id': locationId });
        res.status(200).json({ travelGuides });
    } catch (error) {
        console.error('Error fetching travel guides:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/fetchById/:travelGuideId', async (req, res) => {
    try {
        const travelGuideId = req.params.travelGuideId;
        const travelGuide = await TravelGuide.findById(travelGuideId);
        if (!travelGuide) {
            return res.status(404).json({ message: 'Travel guide not found.' });
        }
        res.status(200).json({ travelGuide });
    } catch (error) {
        console.error('Error fetching travel guide by ID:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Route to fetch travel guides by userId
router.get('/fetchByUserId/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const travelGuides = await TravelGuide.find({ userId: userId });
        res.status(200).json({ travelGuides });
    } catch (error) {
        console.error('Error fetching travel guides by userId:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/search', async (req, res) => {
    try {
        // Retrieve the search query from request query parameters
        const { destinationName } = req.query;

        // Check if the destinationName query parameter is provided
        if (!destinationName) {
            return res.status(400).json({ message: 'No search query provided.' });
        }

        // Use a regular expression for a case-insensitive and partial match search
        const searchRegex = new RegExp(destinationName, 'i');

        // Find travel guides where the featureDestination.name matches the search query
        const travelGuides = await TravelGuide.find({
            'featureDestination.name': { $regex: searchRegex }
        });

        // Return the search results
        res.status(200).json(travelGuides);
    } catch (error) {
        console.error('Error searching for travel guides:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Route to delete a travel guide by _id
router.delete('/delete/:guideId', authenticateToken, async (req, res) => {
    try {
      // Extract the guideId from the request parameters
      const guideId = req.params.guideId;
  
      // Find the travel guide by _id
      const travelGuide = await TravelGuide.findById(guideId);
      if (!travelGuide) {
        return res.status(404).json({ message: 'Travel guide not found.' });
      }
  
      // Check if the authenticated user is the owner of the travel guide
      // Here you need to implement your own logic to check ownership, if required
      // For simplicity, assuming the authenticated user can delete any travel guide
      // You might want to restrict this based on your application's requirements
  
      // Delete the travel guide
      await TravelGuide.deleteOne({ _id: guideId });  
      // Respond with success message
      res.status(200).json({ message: 'Travel guide deleted successfully.' });
    } catch (error) {
      console.error('Error deleting travel guide:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });


module.exports = router;
