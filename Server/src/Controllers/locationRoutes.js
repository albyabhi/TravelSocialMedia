// routes/locations.js
const express = require('express');
const router = express.Router();
const { Nation, State, Location } = require('../models/locationModels');

// Endpoint to create a new location
router.post('/', async (req, res) => {
  const { nationName, stateName, locationName } = req.body;

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
      const newState = new State({ name, nation });
      await newState.save();
      res.status(201).json(newState);
    } catch (error) {
      console.error('Error creating state:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });

module.exports = router;
