import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Grid,
  Button,
  TextField,
  Input,
  Typography,
  Autocomplete,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import axios from 'axios';

export const LocationAddform = ({ fetchLocations }) => {
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [typomsg, setTypoMsg] = useState("Didn't find the location you are looking for? Add it");
  const [newLocationName, setNewLocationName] = useState('');
  const [selectedNation, setSelectedNation] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [nations, setNations] = useState([]);
  const [states, setStates] = useState([]);
  const [location, setLocation] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleNationChange = async (nationId) => {
    setSelectedNation(nationId);
    fetchStates(nationId);
    await fetchLocations();
  };

  useEffect(() => {
    const fetchNations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/map/fetchnations");
        setNations(response.data);
        console.log("Fetched Nations:", response.data);
      } catch (error) {
        console.error("Error fetching nations:", error.response ? error.response.data.message : error.message);
      }
    };

    fetchNations();
    fetchLocations();
  }, []);

  const fetchStates = async (nationId) => {
    try {
      const response = await axios.get(`http://localhost:5000/map/fetchstates?nation=${nationId}`);
      setStates(response.data);
      console.log("Fetched States:", response.data);
    } catch (error) {
      console.error("Error fetching states:", error.response ? error.response.data.message : error.message);
    }
  };

  const handleAddLocation = async () => {
    if (!selectedNation || selectedNation === "defaultNation") {
      setAlertMessage("Please select a nation before choosing a state.");
      return;
    }

    if (!selectedState || selectedState === "defaultState") {
      setAlertMessage("Please select a state before adding a location.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/map/locations", {
        nationid: selectedNation,
        stateid: selectedState,
        locationName: location,
      });

      setAlertMessage("Location added successfully.");
      setSelectedNation("defaultNation");
      setSelectedState("defaultState");
      setLocation("");
      setTypoMsg("New location added");
      setShowAddLocation(false);
      await fetchLocations();
    } catch (error) {
      console.error('Error adding location:', error.response?.data?.message);
      setAlertMessage("Error adding location. Please try again.");
    }
  };

  const handleAddLocationClick = () => {
    setShowAddLocation(true);
  };

  const handleAddLocationCancel = () => {
    setShowAddLocation(false);
  };

  useEffect(() => {
    if (!showAddLocation) {
      setAlertMessage("New location added");
    }
  }, [showAddLocation]);

  return (
    <div>
      {!showAddLocation && (
        <Typography
          onClick={handleAddLocationClick}
          style={{ cursor: "pointer", color: "blue" }}
        >
          {typomsg}
        </Typography>
      )}

      {showAddLocation && (
        <>
          <InputLabel>Country</InputLabel>
          <div>
            <Select
              value={selectedNation}
              onChange={(e) => handleNationChange(e.target.value)}
              fullWidth
              margin="normal"
            >
              <MenuItem value="defaultNation">Select a nation</MenuItem>
              {nations.map((nation) => (
                <MenuItem key={nation._id} value={nation._id}>
                  {nation.name}
                </MenuItem>
              ))}
            </Select>
          </div>

          {selectedNation && (
            <>
              <InputLabel>State</InputLabel>
              <div>
                <Select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="defaultState">Select a state</MenuItem>
                  {states.map((state) => (
                    <MenuItem key={state._id} value={state._id}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              <InputLabel>Enter location new name</InputLabel>
              <TextField
                fullWidth
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleAddLocation}
              >
                Add Location
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleAddLocationCancel}
              >
                Cancel
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
};
