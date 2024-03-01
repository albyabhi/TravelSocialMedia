import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import Sidenav from "../Dashboard/Sidenav";
import Navbar from "../Dashboard/Navbar";
import axios from "axios";

const State = () => {
  const [nation, setNation] = useState("");
  const [state, setState] = useState("");
  const [nations, setNations] = useState([]);
  const [states, setStates] = useState([]); // Added states state
  const [selectedNation, setSelectedNation] = useState("default");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const nationResponse = await axios.get(
          "http://localhost:5000/map/fetchnations"
        );
        setNations(nationResponse.data);
      } catch (error) {
        console.error(
          "Error fetching nations:",
          error.response ? error.response.data.message : error.message
        );
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const stateResponse = await axios.get(
          `http://localhost:5000/map/fetchstates?nation=${selectedNation}`
        );
        setStates(stateResponse.data);
      } catch (error) {
        console.error(
          "Error fetching states:",
          error.response ? error.response.data.message : error.message
        );
      }
    };

    fetchStates();
  }, [selectedNation]);

  const handleNationSave = async () => {
    try {
      const nationResponse = await axios.post(
        "http://localhost:5000/map/nations",
        { name: nation }
      );
      setSelectedNation(nationResponse.data._id);
      console.log("Country saved successfully:", nationResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("Country already exists");
      } else {
        console.error(
          "Error saving country:",
          error.response ? error.response.data.message : error.message
        );
      }
    }
  };

  const handleStateSave = async () => {
    try {
      const stateResponse = await axios.post(
        "http://localhost:5000/map/states",
        { name: state, nation: selectedNation }
      );
      console.log("State saved successfully:", stateResponse.data);
      // Add logic to store data in the Location model with the reference to the state
      const refreshedStateResponse = await axios.get(
        `http://localhost:5000/map/fetchstates?nation=${selectedNation}`
      );
      setStates(refreshedStateResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("State already exists");
      } else {
        console.error(
          "Error saving state:",
          error.response ? error.response.data.message : error.message
        );
      }
    }
  };

  const handleDeleteState = async (stateId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/map/states/${stateId}`
      );
      console.log("State deleted successfully:", response.data);

      // Remove the deleted state from the local state
      setStates((prevStates) =>
        prevStates.filter((state) => state._id !== stateId)
      );
    } catch (error) {
      console.error(
        "Error deleting state:",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {errorMessage && (
            <div style={{ color: "red", marginBottom: "10px" }}>
              {errorMessage}
            </div>
          )}
          <br />

          <InputLabel>Select Country</InputLabel>

          <Select
            value={selectedNation}
            label="Nation"
            onChange={(e) => setSelectedNation(e.target.value)}
          >
            <MenuItem value="default">Select a Country</MenuItem>
            {nations.map((nation) => (
              <MenuItem key={nation._id} value={nation._id}>
                {nation.name}
              </MenuItem>
            ))}
          </Select>

          <InputLabel>State</InputLabel>
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

          <h1>Country Management</h1>

          {/* New Select box for selecting nation */}
          <InputLabel>Select Nation to Filter States</InputLabel>
          <Select
            value={selectedNation}
            label="Nation"
            onChange={(e) => setSelectedNation(e.target.value)}
          >
            {nations.map((nation) => (
              <MenuItem key={nation._id} value={nation._id}>
                {nation.name}
              </MenuItem>
            ))}
          </Select>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>State Name</TableCell>
                  <TableCell>Nation</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {states.map((state) => (
                  <TableRow key={state._id}>
                    <TableCell>{state.name}</TableCell>
                    <TableCell>
                      {
                        nations.find((nation) => nation._id === state.nation)
                          ?.name
                      }
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDeleteState(state._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
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

export default State;
