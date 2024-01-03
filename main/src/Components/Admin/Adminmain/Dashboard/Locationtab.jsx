import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Select, MenuItem, InputLabel, Alert, AlertTitle } from '@mui/material';
import Sidenav from '../Dashboard/Sidenav';
import Navbar from '../Dashboard/Navbar';
import axios from 'axios';

const Locationtab = () => {
  const [nations, setNations] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedNation, setSelectedNation] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [location, setLocation] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchNations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/map/fetchnations');
        setNations(response.data);
        console.log('Fetched Nations:', response.data);
      } catch (error) {
        console.error('Error fetching nations:', error.response ? error.response.data.message : error.message);
      }
    };

    fetchNations();
  }, []); 

  const fetchStates = async (nationId) => {
    try {
      const response = await axios.get(`http://localhost:5000/map/fetchstates?nation=${nationId}`);
      setStates(response.data);
      console.log('Fetched States:', response.data);
    } catch (error) {
      console.error('Error fetching states:', error.response ? error.response.data.message : error.message);
    }
  };

  const handleNationChange = (nationId) => {
    setSelectedNation(nationId);
    fetchStates(nationId);
  };

  const handleAddLocation = async () => {
    console.log('Selected Nation:', selectedNation);
    console.log('Selected State:', selectedState);
    console.log('Location:', location);
  
    if (!selectedNation) {
      console.log('No selected nation');
      setAlertMessage('Please select a nation before choosing a state.');
      return;
    }
  
    if (!selectedState) {
      console.log('No selected state');
      setAlertMessage('Please select a state before adding a location.');
      return;
    }
  
    try {
      console.log('Sending request to add location');
      const response = await axios.post('http://localhost:5000/map/locations', {
        nationName: selectedNation, // Make sure the correct property names are used
        stateName: selectedState,
        locationName: location,
      });
  
      console.log('Location added successfully:', response.data);
      // Clear the form after successful submission
      setSelectedNation('');
      setSelectedState('');
      setLocation('');
      setAlertMessage('Location added successfully.'); // Clear any existing alert
    } catch (error) {
      console.error('Error adding location:', error.response ? error.response.data.message : error.message);
      setAlertMessage('Error adding location. Please try again.'); // Update the alert message
    }
  };

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {alertMessage && (
            <Alert severity="info">
              <AlertTitle></AlertTitle>
              {alertMessage}
            </Alert>
          )}

          <InputLabel>Nation</InputLabel>
          <Select value={selectedNation} label="Nation" onChange={(e) => handleNationChange(e.target.value)}>
            {nations.map((nation) => (
              <MenuItem key={nation._id} value={nation._id}>
                {nation.name}
              </MenuItem>
            ))}
          </Select>

          <InputLabel>State</InputLabel>
          <Select value={selectedState} label="State" onChange={(e) => setSelectedState(e.target.value)}>
            {states.map((state) => (
              <MenuItem key={state._id} value={state._id}>
                {state.name}
              </MenuItem>
            ))}
          </Select>

          <TextField
            fullWidth
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button variant="contained" onClick={handleAddLocation}>
            Add Location
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Locationtab;
