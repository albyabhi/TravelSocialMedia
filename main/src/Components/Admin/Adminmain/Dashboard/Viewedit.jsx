import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import Sidenav from '../Dashboard/Sidenav';
import Navbar from '../Dashboard/Navbar';
import axios from 'axios';

const Viewedit = () => {
  const [nation, setNation] = useState('');
  const [state, setState] = useState('');

  // Function to handle storing data in the database
  const handleSave = async () => {
    try {
      // Create a new nation
      const nationResponse = await axios.post('http://localhost:5000/map/nations', { name: nation });
      const nationId = nationResponse.data._id;
  
      // Create a new state with the reference to the nation
      const stateResponse = await axios.post('http://localhost:5000/map/states', { name: state, nation: nationId });
      
  
      // Add logic to store data in the Location model with the reference to the state
      
  
      console.log('Data saved successfully:', stateResponse.data);
    } catch (error) {
      console.error('Error saving data:', error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <TextField
            fullWidth
            label="Nation"
            value={nation}
            onChange={(e) => setNation(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Viewedit;
