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
  const { nationName, stateName, locationName } = req.body;
  console.log('Received data:', { nationName, stateName, locationName });

  try {
    // Check if the nation exists or create a new one
    let nation = await Nation.findOne({ name: nationName });
    if (!nation) {
      nation = new Nation({ name: nationName });
      await nation.save();
    }

    // Check if the state exists or create a new one
    let state = await State.findOne({ name: stateName, nation: nation._id });
    if (!state) {
      state = new State({ name: stateName, nation: nation._id });
      await state.save();
    }

    // Create a new location
    const location = new Location({ name: locationName, state: state._id, nation: nation._id });
    await location.save();

    res.status(201).json({ message: 'Location created successfully.' });
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ message: 'Internal server error.' });
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

  // Add this route in routes/locations.js
  router.get('/locations/suggestions', async (req, res) => {
    try {
        const { input } = req.query;

        // Use a regex to perform a case-insensitive search for location names
        const locations = await Location.find({ name: { $regex: new RegExp(input, 'i') } })
            .populate({
                path: 'state',
                select: 'name', // Only select the 'name' property
            })
            .populate({
                path: 'nation',
                select: 'name', // Only select the 'name' property
            })
            .limit(10); // Limit the number of suggestions returned

        const suggestions = locations.map((location) => ({
            label: location.name,
            state: location.state ? location.state.name : '', // Check if state is populated
            nation: location.nation ? location.nation.name : '', // Check if nation is populated
        }));

        res.status(200).json(suggestions);
    } catch (error) {
        console.error('Error fetching location suggestions:', error);
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
