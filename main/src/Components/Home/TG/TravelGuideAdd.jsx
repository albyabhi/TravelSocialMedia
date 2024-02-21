import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import LocationAutocomplete from "./LocationAutocomplete";
import Navbar from "../Navbar";
import Divider from "@mui/material/Divider";



const TravelGuideAdd = () => {
  const [itinerary, setItinerary] = useState([{ day: 1, destinations: [] }]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [featureDestination, setFeatureDestination] = useState({
    location_id: "",
    name: "",
    description: "",
    image: null,
  });
  const [isAddDestinationClicked, setIsAddDestinationClicked] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

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

  const addDestination = (dayIndex) => {
    const newItinerary = [...itinerary];
    const newDestination = {
      day: dayIndex + 1, // Adding day number
      destination: newItinerary[dayIndex].destinations.length + 1, // Adding destination number
      location_id: "",
      name: "",
      description: "",
      image: null,
      transportation: "car",
      visitingTime: "morning",
      visitingDuration: 1,
    };
    newItinerary[dayIndex].destinations.push(newDestination);
    setItinerary(newItinerary);
    setIsAddDestinationClicked(true);
  };

  const addDay = () => {
    const newDay = { day: itinerary.length + 1, destinations: [] };
    setItinerary([...itinerary, newDay]);
  };

  const handleAutocompleteChange = (dayIndex, destinationIndex, newValue) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].destinations[destinationIndex].location_id =
      newValue.value;
    newItinerary[dayIndex].destinations[destinationIndex].name = newValue.label;
    setItinerary(newItinerary);
  };

  const handleDestinationChange = (
    dayIndex,
    destinationIndex,
    field,
    value
  ) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].destinations[destinationIndex][field] = value;
    setItinerary(newItinerary);
  };

  const handleImageChange = (dayIndex, destinationIndex, event) => {
    const newItinerary = [...itinerary];
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onloadend = () => {
      const imageData = reader.result;
      newItinerary[dayIndex].destinations[destinationIndex].image = imageData;
      setItinerary(newItinerary);
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([ab], { type: mimeString });
  }

  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Create the itinerary object from the current itinerary
      const itineraryObject = {};
      itinerary.forEach((day, index) => {
        itineraryObject[`Day ${index + 1}`] = day.destinations;
      });
  
      // Create the feature destination object
      const featureDestinationObject = {
        location_id: featureDestination.location_id,
        name: featureDestination.name,
        description: featureDestination.description,
        image: featureDestination.image,
      };
  
      // Log the FormData object
      const formData = new FormData();
      formData.append("itinerary", JSON.stringify(itineraryObject));
      formData.append(
        "FeatureDestination",
        JSON.stringify(featureDestinationObject)
      );
  
      // Append feature destination image
      formData.append("FeatureDestinationImage", featureDestination.image);
  
      // Append destination images
      itinerary.forEach((day, dayIndex) => {
        day.destinations.forEach((destination, destinationIndex) => {
          // Log the index of the destination image being appended
          console.log(`Day ${dayIndex + 1}, Destination ${destinationIndex + 1}`);
          formData.append("DestinationImages", dataURItoBlob(destination.image));

        });
      });
  
      console.log("FormData before sending:", formData);
  
      const token = localStorage.getItem("token");
      // Send a POST request with FormData
      const response = await axios.post(
        "http://localhost:5000/tg/upload",
        formData,
        {
          headers: {
            Authorization: token, // Include the user's JWT token for authentication
            "Content-Type": "multipart/form-data", // Set proper content type
          },
        }
      );
  
      console.log("Travel guide uploaded successfully:", response.data);
  
      // Optionally, you can handle success scenarios here, such as displaying a success message or redirecting the user
    } catch (error) {
      console.error(
        "Error uploading travel guide:",
        error.response?.data?.message
      );
      // Optionally, you can handle error scenarios here, such as displaying an error message to the user
    }
};

  const handleResetDay = (dayIndex) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].destinations = [];
    setItinerary(newItinerary);
    setIsAddDestinationClicked(false);
  };

  return (
    <div>
      <Navbar sx={{ mb: 2 }} />
      <Container maxWidth="sm" sx={{ pt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Container
            sx={{
              backgroundColor: "secondary.main",
              borderRadius: 4,
              padding: 2,
              marginBottom: 4,
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Add Feature Destination
            </Typography>
            <LocationAutocomplete
              value={
                featureDestination.name
                  ? { label: featureDestination.name }
                  : null
              }
              onChange={(event, newValue) => {
                setFeatureDestination({
                  ...featureDestination,
                  location_id: newValue.value,
                  name: newValue.label,
                });
              }}
              options={locationOptions}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Description"
              multiline
              color="secondary"
              rows={2}
              variant="outlined"
              fullWidth
              value={featureDestination.description}
              onChange={(e) =>
                setFeatureDestination({
                  ...featureDestination,
                  description: e.target.value,
                })
              }
              sx={{ marginBottom: 2 }}
            />
            <Box sx={{ position: "relative", marginBottom: 3 }}>
              <Button variant="outlined" component="label">
                Upload Image
                <input
                  accept="image/*"
                  type="file"
                  name="FeatureDestinationImage" // Ensure the name attribute matches the field name expected by Multer
                  onChange={(e) =>
                    setFeatureDestination({
                      ...featureDestination,
                      image: e.target.files[0],
                    })
                  }
                  style={{ display: "none" }}
                />
              </Button>
            </Box>
          </Container>
          {itinerary.map((day, dayIndex) => (
            <Container
              key={dayIndex}
              sx={{ mb: 4, backgroundColor: "secondary.main", borderRadius: 4 }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Day {day.day}
                  </Typography>
                  {isAddDestinationClicked && (
                    <Box>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleResetDay(dayIndex)}
                        sx={{ mb: 2 }}
                      >
                        Reset Destinations
                      </Button>
                    </Box>
                  )}
                </Box>
                {day.destinations.map((destination, destinationIndex) => (
                  <Box key={destinationIndex} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Destination {destinationIndex + 1}
                    </Typography>
                    <LocationAutocomplete
                      value={
                        destination.name ? { label: destination.name } : null
                      }
                      onChange={(event, newValue) =>
                        handleAutocompleteChange(
                          dayIndex,
                          destinationIndex,
                          newValue
                        )
                      }
                      options={locationOptions}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Description"
                      multiline
                      color="secondary"
                      rows={2}
                      variant="outlined"
                      fullWidth
                      value={destination.description}
                      onChange={(e) =>
                        handleDestinationChange(
                          dayIndex,
                          destinationIndex,
                          "description",
                          e.target.value
                        )
                      }
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ position: "relative", mb: 3 }}>
                      <Button variant="outlined" component="label">
                        Upload Image
                        <input
                          accept="image/*"
                          id={`image-input-${dayIndex}-${destinationIndex}`}
                          name="DestinationImages"
                          type="file"
                          onChange={(e) =>
                            handleImageChange(dayIndex, destinationIndex, e)
                          }
                          style={{ display: "none" }}
                        />
                      </Button>
                    </Box>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Transportation</InputLabel>
                      <Select
                        value={destination.transportation}
                        onChange={(e) =>
                          handleDestinationChange(
                            dayIndex,
                            destinationIndex,
                            "transportation",
                            e.target.value
                          )
                        }
                      >
                        <MenuItem value="car">Car</MenuItem>
                        <MenuItem value="bus">Bus</MenuItem>
                        <MenuItem value="train">Train</MenuItem>
                        <MenuItem value="bike">Bike</MenuItem>
                        <MenuItem value="plane">Plane</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Visiting Time</InputLabel>
                      <Select
                        value={destination.visitingTime}
                        onChange={(e) =>
                          handleDestinationChange(
                            dayIndex,
                            destinationIndex,
                            "visitingTime",
                            e.target.value
                          )
                        }
                      >
                        <MenuItem value="morning">Morning</MenuItem>
                        <MenuItem value="afternoon">Afternoon</MenuItem>
                        <MenuItem value="evening">Evening</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="Visiting Duration (hours)"
                      type="number"
                      color="secondary"
                      variant="outlined"
                      fullWidth
                      value={destination.visitingDuration}
                      onChange={(e) =>
                        handleDestinationChange(
                          dayIndex,
                          destinationIndex,
                          "visitingDuration",
                          e.target.value
                        )
                      }
                      sx={{ mb: 2 }}
                    />
                    <Divider sx={{ my: 2, borderWidth: "2px" }} />
                  </Box>
                ))}
                <Button
                  color="primary"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => addDestination(dayIndex)}
                  sx={{ my: 2 }}
                >
                  Add Destination
                </Button>
              </CardContent>
            </Container>
          ))}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="contained" color="primary" onClick={addDay}>
              Add Day
            </Button>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              endIcon={<SendIcon />}
            >
              Submit Itinerary
            </Button>
          </Box>
        </form>
      </Container>
    </div>
  );
};

export default TravelGuideAdd;
