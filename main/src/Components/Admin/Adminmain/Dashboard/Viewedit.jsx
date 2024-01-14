import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, InputLabel } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidenav from '../Dashboard/Sidenav';
import Navbar from '../Dashboard/Navbar';
import { Delete } from '@mui/icons-material';

const Viewedit = () => {
  const [nation, setNation] = useState('');
  const [nations, setNations] = useState([]);
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
      setNations([...nations, nationResponse.data]);
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

          <br />
          <InputLabel>Country</InputLabel>
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
        </Box>
      </Box>

      <Box height={30} />

      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h1>Country Management</h1>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Country Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nations.map((nation) => (
                  <TableRow key={nation._id}>
                    <TableCell>{nation.name}</TableCell>
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default Viewedit;