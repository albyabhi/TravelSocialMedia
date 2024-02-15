import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Container,
  Paper,
  Autocomplete,
} from "@mui/material";
import { styled } from "@mui/material";
import Navbar from "../Navbar";
import axios from "axios";

const DayContainer = ({
  day,
  destinations = [],
  addDestination,
  addNewDay,
}) => {
  const navigate = useNavigate();
  const [showDestinationForm, setShowDestinationForm] = useState(
    destinations.length === 0
  );

  const handleAddDestination = () => {
    addDestination(day); // Pass the current day to addDestination
    setShowDestinationForm(true); // Show the destination form after adding a destination
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        p: 3,
        mb: 3,
        bgcolor: "#0002",
        textAlign: "center",
        width: "100%",
        borderRadius: 8, // Adding border radius
      }}
    >
      {" "}
      <Typography variant="h4" gutterBottom>
        Day {day}
      </Typography>
      {destinations.map((destination, index) => (
        <DestinationForm
          key={index}
          day={day} // Pass the day prop
          destinationNumber={index + 1}
          onSubmit={(destinationData) => addDestination(day, destinationData)} // Pass day along with destinationData
        />
      ))}
      {showDestinationForm && (
        <DestinationForm
          day={day}
          destinationNumber={destinations.length + 1}
          onSubmit={(destinationData) => addDestination(day, destinationData)}
        />
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddDestination}
        sx={{ mt: 2 }}
      >
        Add Destination
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={addNewDay}
        sx={{ mt: 2, ml: 2 }}
      >
        Next Day
      </Button>
    </Container>
  );
};

const DestinationForm = ({ day, destinationNumber, onSubmit }) => {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [transport, setTransport] = useState("");
  const [visitingTime, setVisitingTime] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = () => {
    // Prepare the destination data
    const destinationData = {
      location,
      description,
      image,
      transport,
      visitingTime,
      duration,
    };
    // Pass the destination data to the parent component for submission
    onSubmit(destinationData, day);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ mt: 4, bgcolor: "secondary.main", borderRadius: 8, p: 3 }}
    >
      <Typography variant="h6" gutterBottom>
        Day {day} - Destination {destinationNumber}
      </Typography>
      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel id={`location-label-${day}-${destinationNumber}`}>
          Location
        </InputLabel>
        <Select
          labelId={`location-label-${day}-${destinationNumber}`}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          {/* Add menu items for locations */}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ my: 2 }}
      />
      <TextField
        fullWidth
        label="Image"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        sx={{ my: 2 }}
      />
      <TextField
        fullWidth
        label="Mode of Transport"
        value={transport}
        onChange={(e) => setTransport(e.target.value)}
        sx={{ my: 2 }}
      />
      <TextField
        fullWidth
        label="Visiting Time"
        value={visitingTime}
        onChange={(e) => setVisitingTime(e.target.value)}
        sx={{ my: 2 }}
      />
      <TextField
        fullWidth
        label="Duration"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        sx={{ my: 2 }}
      />
    </Container>
  );
};

const TravelGuideAdd = () => {
  const token = localStorage.getItem("token");
  const [days, setDays] = useState([{ destinations: [] }]);
  const navigate = useNavigate();
  const [mainDestination, setMainDestination] = useState("");
  const [selectedMainImg, setSelectedMainImg] = useState(null);
  const [mainDescription, setMainDescription] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [currentDay, setCurrentDay] = useState(1); // Maintain the current day index
  const [locationOptions, setLocationOptions] = useState([]);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [selectedNation, setSelectedNation] = useState("defaultNation");
  const [selectedState, setSelectedState] = useState("defaultState");
  const [typomsg, setTypoMsg] = useState(
    "Didn't find the location you are looking for? Add it"
  );
  const [location, setLocation] = useState("");
  const [nations, setNations] = useState([]);
  const [states, setStates] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [formData, setFormData] = useState({
    location: null,
  });

  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/map/allfetchlocations"
      );
      const locations = response.data.map((location) => ({
        value: location._id,
        label: location.name,
      }));
      setLocationOptions(locations);
    } catch (error) {
      console.error("Error fetching locations:", error.response?.data?.message);
    }
  };

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
    fetchLocations(); // Fetch locations when the component mounts
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

  const handleNationChange = async (nationId) => {
    setSelectedNation(nationId);
    await fetchStates(nationId);
    await fetchLocations();
  };

  const handleAddLocationClick = () => {
    setShowAddLocation(true);
  };

  const handleAddLocationCancel = () => {
    setShowAddLocation(false);
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
      console.error("Error adding location:", error.response?.data?.message);
      setAlertMessage("Error adding location. Please try again.");
    }
  };

  const handleAutocompleteChange = (event, newValue) => {
    if (newValue) {
      setFormData((prevData) => ({
        ...prevData,
        location: newValue,
      }));
      console.log('Selected Location ID:', newValue.value);
      console.log('Selected Location label:', newValue.label);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        location: null,
      }));
    }
  };


  useEffect(() => {
    fetchLocations();
  }, []);

  const handleChange = (event) => {
    setMainDestination(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedMainImg(file);
    // Preview the selected image
    setPreviewImage(URL.createObjectURL(file)); // Update the previewImage state
  };

  const handleDescriptionChange = (event) => {
    setMainDescription(event.target.value);
  };

  const handleAddDestination = (day, destinationData) => {
    const updatedDays = [...days];
    const targetDayIndex = day - 1; // Adjust the day index to 0-based
    updatedDays[targetDayIndex].destinations.push(destinationData);
    setDays(updatedDays);
  };

  const handleAddNewDay = () => {
    setDays([...days, { destinations: [] }]);
    setCurrentDay(currentDay + 1); // Increment the current day index
  };

  const handleSubmit = () => {
    const formData = new FormData();
  
    // Append mainDestination with label and value
    formData.append('mainDestination[value]', formData.location.value);
    formData.append('mainDestination[label]', formData.location.label);
    // Append mainDescription and mainImage
    formData.append("mainDescription", mainDescription);
    formData.append("mainImage", selectedMainImg);
  
    // Logging the data in formData
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <div>
      <Navbar />
      <Container>
        <div style={{ marginBottom: "20px" }}>
          <Container
            maxWidth="sm"
            sx={{ mt: 4, bgcolor: "secondary.main", borderRadius: 8, p: 3 }}
          >
            <Typography variant="h4" gutterBottom>
              Add Travel Guide
            </Typography>
            <FormControl fullWidth sx={{ my: 2 }}>
              <Autocomplete
                value={formData.location}
                onChange={handleAutocompleteChange}
                options={locationOptions}
                getOptionLabel={(option) => option.label || ""}
                isClearable={false}
                freeSolo={false}
                autoHighlight
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="location"
                    label="Select or Type Location"
                    margin="normal"
                  />
                )}
                style={{ marginBottom: "1rem" }}
              />

              {!showAddLocation && (
                <Typography
                  onClick={handleAddLocationClick}
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    marginBottom: "1rem",
                  }}
                >
                  {typomsg}
                </Typography>
              )}

              {showAddLocation && (
                <>
                  
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    
                    <Select
                      value={selectedNation}
                      onChange={(e) => handleNationChange(e.target.value)}
                      fullWidth
                      margin="normal"
                      style={{ marginBottom: "1rem" }}
                    >
                      <MenuItem value="defaultNation">Select a Country</MenuItem>
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
                      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                        <Select
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                          fullWidth
                          margin="normal"
                          style={{ marginBottom: "1rem" }}
                        >
                          <MenuItem value="defaultState">
                            Select a state
                          </MenuItem>
                          {states.map((state) => (
                            <MenuItem key={state._id} value={state._id}>
                              {state.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>

                      <TextField
                        fullWidth
                        label="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        sx={{ marginBottom: "1rem" }}
                      />

                      <Button
                        sx={{ marginBottom: "1rem" }}
                        variant="contained"
                        color="primary"
                        onClick={handleAddLocation}
                      >
                        Add Location
                      </Button>
                      <Button
                        sx={{ marginBottom: "1rem" }}
                        variant="outlined"
                        color="primary"
                        onClick={handleAddLocationCancel}
                        style={{ marginLeft: "1rem" }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </>
              )}
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={4}
              id="main-description"
              label="Description"
              value={mainDescription}
              onChange={handleDescriptionChange}
              sx={{ my: 2 }}
            />
            <label
              htmlFor="image-upload"
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <Button
                variant="outlined"
                component="span"
                color="quaternary"
                sx={{ mr: 1 }}
              >
                Choose Image
              </Button>
              {previewImage && (
                <Typography variant="body1" component="span">
                  {selectedMainImg.name}
                </Typography>
              )}
            </label>
            
          </Container>
        </div>
        <Container>
          {/* Day containers */}
          {days.map((day, index) => (
            <DayContainer
              key={index}
              day={index + 1}
              destinations={day.destinations}
              addDestination={handleAddDestination}
              addNewDay={handleAddNewDay}
            />
          ))}
          
        </Container>
      
      </Container>
      <Button
  variant="contained"
  color="primary"
  fullWidth
  onClick={handleSubmit}
  sx={{ mt: 2, padding: '12px 24px' }} // Adjust the padding as needed
>
  Upload Travel guide
</Button>
    </div>
  );
};

export default TravelGuideAdd;
