import React from 'react';

import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Sidenav from '../Dashboard/Sidenav';
import Navbar from '../Dashboard/Navbar';

const Locationtab = () => {
  return (
    <>
      <Navbar />
      <Box height={30} />

      <Box sx={{ display: 'flex' }}>
        <Sidenav />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <form>
            <h1>Add Location</h1>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="nation-select">Nation</InputLabel>
              <Select label="Nation" id="nation-select">
                {/* Add options for Nation */}
                <MenuItem value="nation1">Nation 1</MenuItem>
                <MenuItem value="nation2">Nation 2</MenuItem>
                {/* Add more options as needed */}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="state-select">State</InputLabel>
              <Select label="State" id="state-select">
                {/* Add options for State */}
                <MenuItem value="state1">State 1</MenuItem>
                <MenuItem value="state2">State 2</MenuItem>
                {/* Add more options as needed */}
              </Select>
            </FormControl>

            <h3>Location</h3>
            <TextField fullWidth label="Location" id="Location" />
            <br /><br />
            <Button variant="contained">ADD</Button>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default Locationtab;
