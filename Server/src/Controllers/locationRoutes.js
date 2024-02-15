// routes/locations.js
const express = require('express');
const router = express.Router();
const { Nation, State, Location } = require('../models/locationModels');
const mongoose = require('mongoose');



router.post('/nations', async (req, res) => {
    try {
      const { name } = req.body;
      const newNation = new Nation({ name });
      await newNation.save();
      res.status(201).json(newNation);
    } catch (error) {
      console.error('Error creating nation:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  
  // Create a new state
  router.post('/states', async (req, res) => {
    try {
      const { name, nation } = req.body;
  
      // Check if the state with the same name and nation already exists
      const existingState = await State.findOne({ name, nation });
      if (existingState) {
        return res.status(409).json({ message: 'State with the same name and nation already exists.' });
      }
  
      // If not, create a new state
      const newState = new State({ name, nation });
      await newState.save();
      res.status(201).json(newState);
    } catch (error) {
      console.error('Error creating state:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });

// Create a new location

router.post('/locations', async (req, res) => {
  const { nationid, stateid, locationName } = req.body;
  
  try {
    // Check if the nation exists or create a new one
    let nation = await Nation.findById(nationid);
    if (!nation) {
      return res.status(404).json({ message: 'Nation not found.' });
    }

    // Check if the state exists
    let state = await State.findById(stateid);

    if (!state) {
      return res.status(404).json({ message: 'State not found.' });
    }

    // Create a new location
    const location = new Location({ name: locationName, state: stateid, nation: nationid });
    await location.save();

    res.status(201).json({ message: 'Location created successfully.' });
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

//delete location
router.delete('/locations/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the location by ID and remove it
    const deletedLocation = await Location.findByIdAndDelete(id);

    if (!deletedLocation) {
      return res.status(404).json({ message: 'Location not found.' });
    }

    res.status(200).json({ message: 'Location deleted successfully.' });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// DELETE a nation 
router.delete('/nations/:id', async (req, res) => {
  const nationId = req.params.id;

  try {
    // Check if the nation exists
    const existingNation = await Nation.findById(nationId);
    if (!existingNation) {
      return res.status(404).json({ message: 'Nation not found' });
    }

    // Remove the nation
    await Nation.deleteOne({ _id: nationId });
    res.status(200).json({ message: 'Nation deleted successfully' });
  } catch (error) {
    console.error('Error deleting nation:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Fetch all locations
router.get('/allfetchlocations', async (req, res) => {
  try {
    const locations = await Location.find().populate('state nation');

    // locations will now have the details of state and nation along with their IDs
    res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching all locations:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// search page 
router.get("/locations/search", async (req, res) => {
  try {
    const { locationName } = req.query;

    // Ensure that the locationName parameter is not empty
    if (!locationName || locationName.trim() === "") {
      return res.status(400).json({ message: "Invalid locationName parameter." });
    }

    // Use a case-insensitive regular expression for partial match
    const locations = await Location.find({ name: new RegExp(locationName, 'i') });

    if (locations.length === 0) {
      return res.status(404).json({ message: "No locations found." });
    }

    res.json(locations);
  } catch (error) {
    console.error("Error searching for locations:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

   // fetch data (Nation and State)
  router.get('/fetchnations', async (req, res) => {
    try {
      const nations = await Nation.find();
      res.status(200).json(nations);
    } catch (error) {
      console.error('Error fetching nations:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  
  // Endpoint to get all states
  router.get('/fetchstates', async (req, res) => {
    try {
      const { nation } = req.query;
  
      // Check if the nation parameter is provided
      if (!nation) {
        return res.status(400).json({ message: 'Nation parameter is missing.' });
      }
  
      // Fetch states based on the provided nation ID
      const states = await State.find({ nation });
      res.status(200).json(states);
    } catch (error) {
      console.error('Error fetching states:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });

// Delete a state by ID
router.delete('/states/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the state exists
    const state = await State.findById(id);

    if (!state) {
      return res.status(404).json({ message: 'State not found.' });
    }

    // Delete the state
    await State.deleteOne({ _id: id });

    res.status(200).json({ message: 'State deleted successfully.' });
  } catch (error) {
    console.error('Error deleting state by ID:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

 
// Fetch state details by ID
router.get('/state/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const state = await State.findById(id);
    if (!state) {
      return res.status(404).json({ message: 'State not found.' });
    }
    res.status(200).json(state);
  } catch (error) {
    console.error('Error fetching state by ID:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Fetch nation details by ID
router.get('/nation/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const nation = await Nation.findById(id);
    if (!nation) {
      return res.status(404).json({ message: 'Nation not found.' });
    }
    res.status(200).json(nation);
  } catch (error) {
    console.error('Error fetching nation by ID:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.get('/getIdByName/:name', async (req, res) => {
  try {
    const location = await Location.findOne({ label: req.params.name });
   
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Assuming the ID you want to fetch is in the _id field
    const locationId = location._id;

    res.json({ locationId });
  } catch (error) {
    console.error('Error fetching location ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
