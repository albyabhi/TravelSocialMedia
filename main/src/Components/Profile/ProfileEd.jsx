import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Typography, Input , TextField, Button, InputLabel,} from "@mui/material";
import Select from "react-select";
const ProfileEd = () => {
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
    
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: token },
        });
    
        setUserData(response.data);
        setUserName(response.data.username || "");
        setFirstName(response.data.firstName || "");
        setLastName(response.data.lastName || "");
        setPhoneNumber(response.data.phoneNumber || "");
        setBio(response.data.bio || "");
        setHighlightedPlaces(response.data.highlightedPlaces || "");
    
        try {
          const profileResponse = await axios.get("http://localhost:5000/api/profiledata", {
            headers: { Authorization: token },
          });
    
          setProfilePicture(profileResponse.profilePicture || null);
    
          if (profileResponse.data && profileResponse.data.profilePicture) {
            const imageDataUri = `data:${profileResponse.data.profilePicture.contentType};base64,${profileResponse.data.profilePicture.data.toString("base64")}`;
            setSavedImage(imageDataUri);
          } else {
            console.log("No Profile Picture Found in the Response");
          }
        } catch (profileError) {
          if (profileError.response && profileError.response.status === 404) {
            console.log("No profile data found");
          } else {
            console.error("Failed to fetch profile data:", profileError.response?.data?.message);
          }
        }
    
        try {
          const savedLocationsResponse = await axios.get("http://localhost:5000/api/profiledata/savedlocations", {
            headers: { Authorization: token },
          });
    
          if (savedLocationsResponse.data && savedLocationsResponse.data.length > 0) {
            const savedLocationsData = savedLocationsResponse.data.map(location => ({
              value: location,
              label: location,
            }));
            setSavedLocations(savedLocationsData);
          } else {
            console.log("No Saved Locations Found in the Response");
          }
        } catch (savedLocationsError) {
          if (savedLocationsError.response && savedLocationsError.response.status === 404) {
            console.log("No saved locations found");
          } else {
            console.error("Failed to fetch saved locations:", savedLocationsError.response?.data?.message);
          }
        }
    
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user data:", error.response?.data?.message);
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

      formData.append("bio", bio);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("phoneNumber", phoneNumber);

      // Append highlightedPlaces individually
      selectedLocations.forEach((location, index) => {
        formData.append(`highlightedPlaces[${index}][value]`, location.value);
        formData.append(`highlightedPlaces[${index}][label]`, location.label);
      });

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

      navigate("/home");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data?.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Container style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>
      <Grid container spacing={2}>
        {/* Displaying username */}
        <Grid item xs={12} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px' }}>
  <Typography variant="h6">Welcome to Nomadgram {username}</Typography>
  <Typography>
    Feel free to explore and share your travel tales, mesmerizing photographs, and invaluable travel tips with fellow wanderers. Nomadgram is your canvas; paint it with your wanderlust-filled experiences!
  </Typography>
  <Typography>
    As you set up your profile, don't forget to add a captivating bio and a stunning profile picture. Let the world know a little more about the adventurous soul behind the screen!
  </Typography>
  <Typography>
    And remember, in the realm of travel, every journey is a story waiting to be told. We're excited to be part of yours.
  </Typography>
</Grid>
        <Grid item xs={12} container direction="column" alignItems="center">
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
              <Typography variant="subtitle2" style={{ textAlign:"center" }}>Profile Pic</Typography>
            </Button>
          </label>
        </Grid>


        <Grid item xs={12}>
          <InputLabel>First Name</InputLabel>
          <TextField
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
        <InputLabel>Last Name</InputLabel>

          <TextField
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
        <InputLabel>Phone Number</InputLabel>

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

        <Grid item xs={12}>
          {savedLocations.length > 0 && (
            <div>
              <Typography variant="h5">Saved Locations:</Typography>
              <ul>
                {savedLocations.map((place, index) => (
                  <li key={index}>{place.label}</li>
                ))}
              </ul>
            </div>
          )}
          <InputLabel>Add your Visited lcations</InputLabel>

          {/* Use react-select for autocomplete input */}
          <Select
            isMulti
            options={locations}
            value={selectedLocations}
            onChange={handleLocationSelect}
            placeholder="Type to search or add locations"
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitChanges}
          >
            Save Changes
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileEd;
