import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Alert,
  AlertTitle,
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

const Locationtab = () => {
  const [nations, setNations] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedNation, setSelectedNation] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  

  useEffect(() => {
    const fetchNations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/map/fetchnations"
        );
        setNations(response.data);
        console.log("Fetched Nations:", response.data);
      } catch (error) {
        console.error(
          "Error fetching nations:",
          error.response ? error.response.data.message : error.message
        );
      }
    };

    fetchNations();
  }, []);

  const fetchStates = async (nationId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/map/fetchstates?nation=${nationId}`
      );
      setStates(response.data);
      console.log("Fetched States:", response.data);
    } catch (error) {
      console.error(
        "Error fetching states:",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  const handleNationChange = (nationId) => {
    setSelectedNation(nationId);
    fetchStates(nationId);
  };

  const handleAddLocation = async () => {
    console.log("Selected Nation:", selectedNation);
    console.log("Selected State:", selectedState);
    console.log("Location:", location);

    if (!selectedNation) {
      console.log("No selected nation");
      setAlertMessage("Please select a nation before choosing a state.");
      return;
    }

    if (!selectedState) {
      console.log("No selected state");
      setAlertMessage("Please select a state before adding a location.");
      return;
    }

    try {
      console.log("Sending request to add location");
      const response = await axios.post("http://localhost:5000/map/locations", {
        nationid: selectedNation, // Make sure the correct property names are used
        stateid: selectedState,
        locationName: location,
      });

      console.log("Location added successfully:", response.data);
      // Clear the form after successful submission
      setSelectedNation("");
      setSelectedState("");
      setLocation("");
      setAlertMessage("Location added successfully."); // Clear any existing alert
    } catch (error) {
      console.error(
        "Error adding location:",
        error.response ? error.response.data.message : error.message
      );
      setAlertMessage("Error adding location. Please try again."); // Update the alert message
    }
  };
  const fetchLocations = async (stateId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/map/allfetchlocations`
      );
      console.log("Fetched locations:", response.data); // Assuming response.data is an array of locations
      setLocations(response.data); // Update the state with the fetched locations
    } catch (error) {
      console.error(
        "Error fetching locations:",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  const handleDeleteLocation = async (locationId) => {
    try {
      // Send a request to delete the location by ID
      await axios.delete(`http://localhost:5000/map/locations/${locationId}`);

      // Update the locations state after deletion
      setLocations((prevLocations) =>
        prevLocations.filter((location) => location._id !== locationId)
      );

      setAlertMessage("Location deleted successfully.");
    } catch (error) {
      console.error(
        "Error deleting location:",
        error.response ? error.response.data.message : error.message
      );
      setAlertMessage("Error deleting location. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {alertMessage && (
            <Alert severity="info">
              <AlertTitle></AlertTitle>
              {alertMessage}
            </Alert>
          )}

          <InputLabel>Nation</InputLabel>
          <Select
            value={selectedNation}
            label="Nation"
            onChange={(e) => handleNationChange(e.target.value)}
          >
            {nations.map((nation) => (
              <MenuItem key={nation._id} value={nation._id}>
                {nation.name}
              </MenuItem>
            ))}
          </Select>

          <InputLabel>State</InputLabel>
          <Select
            value={selectedState}
            label="State"
            onChange={(e) => setSelectedState(e.target.value)}
          >
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
          <Button
            variant="contained"
            onClick={() => fetchLocations(selectedNation, selectedState)}
          >
            Fetch Locations
          </Button>
          <Box mt={4}>
          <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Location</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(locations) && locations.length > 0 ? (
                locations.map((location) => (
                  <TableRow key={location._id}>
                    <TableCell>{location.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteLocation(location._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2}>No locations found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
</Box>
        </Box>
      </Box>
    </>
  );
};

export default Locationtab;