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
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";


const ProfileEdWidget = ({ onClose }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
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

  // Update background image of the button
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      setSavedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }
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

  useEffect(() => {
    if (userData) {
      console.log("Logged-in user ID:", userData.userId);
      setUserId(userData.userId);
    }
  }, [userData]);

  const viewProfileHandle = () => {
    // Navigate to the user's profile view
    navigate(`/mainview/${userId}`);
    
  };

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
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <CircularProgress  size={40} />
      </Box>
    );
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
      overflowY: "auto",
      maxHeight: "80vh",
      scrollbarWidth: "none",
      WebkitOverflowScrolling: "touch",
      msOverflowStyle: "none", // Hide scrollbar for IE/Edge
          "&::-webkit-scrollbar": {
            display: "none", // Hide scrollbar for WebKit browsers
          },
    }}
  >
    <Grid container spacing={2}>
      {/* Left Column */}
      <Grid item xs={12} sm={6}>
        {/* Profile Picture and Upload Button */}




        <Grid item xs={12} container justifyContent="center">
  {/* Saved Profile Picture Button */}
  <Button
    component="label"
    htmlFor="profile-picture-upload"
    variant="contained"
    color="primary"
    style={{
      borderRadius: "50%", // Set border radius to 50% for a round button
      width: "100px",
      height: "100px",
      marginBottom: "25px",
      backgroundImage: `url(${savedImage})`, // Set background image
      backgroundSize: "100% 100%", // Fill the button completely
      backgroundPosition: "center",
      position: "relative",
    }}
  >
    {/* Overlaying Typography */}
    <Typography
      variant="subtitle2"
      align="center"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "white", // Adjust text color as needed
      }}
    >
      Change Profile Picture
    </Typography>
    {/* File Input Field */}
    <input
      type="file"
      id="profile-picture-upload"
      accept="image/*"
      onChange={handleFileChange}
      style={{ display: "none" }}
    />
  </Button>
</Grid>



        {/* Personal Information Fields */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputLabel>username</InputLabel>
            <TextField
              
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel>First name</InputLabel>
            <TextField
              
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
          <InputLabel>last name</InputLabel>

            <TextField
              
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
          <InputLabel>phone number</InputLabel>

            <TextField
              
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
          <InputLabel>Bio</InputLabel>
            <TextField
              
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
            <InputLabel>saved locations</InputLabel>
                <ul>
                  {savedLocations.map((place, index) => (
                    <li key={index}>{place.label}</li>
                  ))}
                </ul>
              </div>
            )}
                        <InputLabel>Edit your locations</InputLabel>

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
      onClick={viewProfileHandle}
      
    >
      View your profile
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
