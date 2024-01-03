// routes/locations.js
const express = require('express');
const router = express.Router();
const { Nation, State, Location } = require('../models/locationModels');



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
    const location = new Location({ name: locationName, state: state._id });
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
      const states = await State.find();
      res.status(200).json(states);
    } catch (error) {
      console.error('Error fetching states:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });

module.exports = router;
