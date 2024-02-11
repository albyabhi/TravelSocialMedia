import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { theme } from "../theme";

import {
  Grid,
  Typography,
  Input,
  TextField,
  Button,
  IconButton,
  Container,
  Box,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";


const ProfileEdWidget = ({ onClose }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [bio, setBio] = useState("");
  const [highlightedPlaces, setHighlightedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [savedImage, setSavedImage] = useState(null);
  const [username, setUserName] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [savedLocations, setSavedLocations] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const [response, profileResponse, savedLocationsResponse] =
          await Promise.all([
            axios.get("http://localhost:5000/api/profile", {
              headers: { Authorization: token },
            }),
            axios.get("http://localhost:5000/api/profiledata", {
              headers: { Authorization: token },
            }),
            axios.get("http://localhost:5000/api/profiledata/savedlocations", {
              headers: { Authorization: token },
            }),
          ]);

        if (isMounted) {
          setUserData(response.data);
          setUserName(response.data.username || "");

          setFirstName(response.data.firstName || "");
          setLastName(response.data.lastName || "");
          setPhoneNumber(response.data.phoneNumber || "");
          setBio(response.data.bio || "");
          setHighlightedPlaces(response.data.highlightedPlaces || []);
          setProfilePicture(profileResponse.profilePicture || null);
          setLoading(false);
          if (profileResponse.data && profileResponse.data.profilePicture) {
            const imageDataUri = `data:${
              profileResponse.data.profilePicture.contentType
            };base64,${profileResponse.data.profilePicture.data.toString(
              "base64"
            )}`;
            setSavedImage(imageDataUri);
          } else {
            console.log("No Profile Picture Found in the Response");
          }

          if (
            savedLocationsResponse.data &&
            savedLocationsResponse.data.length > 0
          ) {
            const savedLocationsData = savedLocationsResponse.data.map(
              (location) => ({
                value: location,
                label: location,
              })
            );
            setSavedLocations(savedLocationsData);
          } else {
            console.log("No Saved Locations Found in the Response");
          }

          setLoading(false);
        }
      } catch (error) {
        console.error(
          "Failed to fetch user data:",
          error.response?.data?.message
        );
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Navigate to the login page
    navigate("/login");
  };

  const handleLocationSelect = (selectedOption) => {
    setSelectedLocations(selectedOption);
  };

  useEffect(() => {
    // Fetch locations when the component mounts
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/map/allfetchlocations"
        );
        const locationsData = response.data;
        const locationsOptions = locationsData.map((location) => ({
          value: location._id,
          label: location.name,
        }));
        // Corrected: Use setLocations to update state
        setLocations(locationsOptions);
      } catch (error) {
        console.error(
          "Error fetching locations:",
          error.response?.data?.message
        );
      }
    };

    fetchLocations();
  }, [navigate]);

  const handleSubmitChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      console.log("Username sent in request body:", username);
      console.log(formData.username);
      formData.append("bio", bio);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("phoneNumber", phoneNumber);

      // Append highlightedPlaces individually
      selectedLocations.forEach((location, index) => {
        formData.append(`highlightedPlaces[${index}][value]`, location.value);
        formData.append(`highlightedPlaces[${index}][label]`, location.label);
      });
      formData.append("username", username);

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      // Send a POST request to update the profile
      await axios.post("http://localhost:5000/api/profile/update", formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      onClose();
    } catch (error) {
      console.error("Error updating profile:", error.response?.data?.message);
    }
  };

  const Closing =()=>{
    onClose();
  }
  
  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <Box
      style={{
        marginTop: "9rem", // Adjust the top margin as needed
        marginBottom: "2rem", // Adjust the margin as needed
        display: "flex",
        justifyContent: "center",
        paddingLeft: "1rem", // Add left padding for spacing
        paddingRight: "1rem", // Add right padding for spacing
      }}
    >
<Container
    maxWidth="md"
    style={{
      padding: "1.5rem",
      backgroundColor: theme.palette.secondary.main ,
      borderRadius: "0.75rem",
    }}
  >
    <Grid container spacing={2}>
      {/* Left Column */}
      <Grid item xs={12} sm={6}>
        {/* Profile Picture and Upload Button */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} container justifyContent="center">
            {savedImage && (
              <img
                src={savedImage}
                alt="Saved Profile"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100px",
                  borderRadius: "8px",
                  marginBottom: "8px",
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <label htmlFor="profile-picture-upload">
              <Input
                type="file"
                id="profile-picture-upload"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <Button
                component="span"
                variant="contained"
                color="primary"
                style={{
                  borderRadius: "50%",
                  width: "100px",
                  height: "100px",
                }}
              >
                <Typography variant="subtitle2">Upload</Typography>
              </Button>
            </label>
          </Grid>
        </Grid>

        {/* Personal Information Fields */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Add new bio:</Typography>
            <TextField
              label="Bio"
              multiline
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Right Column */}
      <Grid item xs={12} sm={6}>
        {/* Saved Highlighted Places */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {savedLocations.length > 0 && (
              <div>
                <Typography>Saved Highlighted Places:</Typography>
                <ul>
                  {savedLocations.map((place, index) => (
                    <li key={index}>{place.label}</li>
                  ))}
                </ul>
              </div>
            )}
            <Typography variant="h5">Add Highlighted Places:</Typography>
            {/* Use react-select for autocomplete input */}
            <Select
              isMulti
              options={locations}
              value={selectedLocations}
              onChange={handleLocationSelect}
              placeholder="Type to search or add locations"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>

    {/* Buttons */}
    <Grid container spacing={2} justifyContent="center" style={{ marginTop: "1rem" }}>
  {/* Button Container */}
  <Grid item>
    <Button
      variant="contained"
      color="primary"
      onClick={handleSubmitChanges}
    >
      Save Changes
    </Button>
  </Grid>
  <Grid item>
    <Button
      variant="contained"
      color="primary"
      onClick={Closing}
    >
     Close
    </Button>
  </Grid>
  <Grid item>
    <Button variant="contained" color="primary" onClick={handleLogout}>
      Logout
    </Button>
  </Grid>
</Grid>

    {/* Close Icon */}
    <IconButton
      style={{ position: "absolute", top: "8px", right: "8px" }}
      onClick={onClose}
    >
      <CloseIcon />
    </IconButton>
  </Container>
</Box>
  );
};

export default ProfileEdWidget;
