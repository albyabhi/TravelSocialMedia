import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import Sidenav from '../Dashboard/Sidenav';
import Navbar from '../Dashboard/Navbar';
import axios from 'axios';

const Viewedit = () => {
  const [nation, setNation] = useState('');
  const [state, setState] = useState('');
  const [nations, setNations] = useState([]);
  const [selectedNation, setSelectedNation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchNations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/map/fetchnations');
        setNations(response.data);
      } catch (error) {
        console.error('Error fetching nations:', error.response ? error.response.data.message : error.message);
      }
    };

    fetchNations();
  }, []); 

  const handleNationSave = async () => {
    try {
      const nationResponse = await axios.post('http://localhost:5000/map/nations', { name: nation });
      setSelectedNation(nationResponse.data._id);
      console.log('Country saved successfully:', nationResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // HTTP status code 409 indicates a conflict, i.e., unique constraint violation
        setErrorMessage('Country already exists');
      } else {
        console.error('Error saving country:', error.response ? error.response.data.message : error.message);
      }
    }
  };

  const handleStateSave = async () => {
    try {
      const stateResponse = await axios.post('http://localhost:5000/map/states', { name: state, nation: selectedNation });
      console.log('State saved successfully:', stateResponse.data);
      // Add logic to store data in the Location model with the reference to the state
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // HTTP status code 409 indicates a conflict, i.e., unique constraint violation
        setErrorMessage('State already exists');
      } else {
        console.error('Error saving state:', error.response ? error.response.data.message : error.message);
      }
    }
  };

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {errorMessage && (
            <div style={{ color: 'red', marginBottom: '10px' }}>
              {errorMessage}
            </div>
          )}

          <TextField
            className="whitetext"
            label="Country"
            fullWidth
            value={nation}
            onChange={(e) => setNation(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{
              style: { color: '#ffffff' }
            }}
          />
          <Button variant="contained" onClick={handleNationSave}>
            Save Country
          </Button>
          <br />
          <br />
          <InputLabel>Nation</InputLabel>
          <Select value={selectedNation} label="Nation" onChange={(e) => setSelectedNation(e.target.value)}>
            {nations.map((nation) => (
              <MenuItem key={nation._id} value={nation._id}>
                {nation.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            label="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{
              style: { color: "#ffffff" },
            }}
          />
          <Button variant="contained" onClick={handleStateSave}>
            Save State
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Viewedit;
