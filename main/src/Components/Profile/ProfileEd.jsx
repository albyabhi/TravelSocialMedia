import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Typography, TextField, Button } from "@mui/material";

const ProfileEd = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [bio, setBio] = useState("");
  const [highlightedPlaces, setHighlightedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

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

        if (isMounted) {
          setUserData(response.data);
          setFirstName(response.data.firstName || "");
          setLastName(response.data.lastName || "");
          setPhoneNumber(response.data.phoneNumber || "");

          
          setBio(response.data.bio || ""); 

          setHighlightedPlaces(response.data.highlightedPlaces || []);
          setLoading(false);
        }
      } catch (error) {
        console.error(
          "Failed to fetch user data:",
          error.response?.data?.message
        );
        navigate("/login");
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

  const handleProfilePictureChange = (event) => {
    // Handle profile picture file change
    const file = event.target.files[0];
    setProfilePicture(file);
  };

  const handleAddPlace = () => {
    // Handle adding a highlighted place
    const newPlace = prompt("Enter a place:");
    if (newPlace) {
      setHighlightedPlaces([...highlightedPlaces, newPlace]);
    }
  };

  const handleSubmitChanges = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("profilePicture", profilePicture);
      formData.append("bio", bio);
      formData.append("highlightedPlaces", JSON.stringify(highlightedPlaces));
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("phoneNumber", phoneNumber);

      // Send a POST request to update the profile
      await axios.post("http://localhost:5000/api/profile/update", formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

  
      navigate("/home");
    } catch (error) {
      console.error("Error updating profile:", error.response.data.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h2">Welcome, {userData.username}!</Typography>
        </Grid>

        <Grid item xs={6}>
          {/* First Name */}
          <TextField
            label="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          {/* Last Name */}
          <TextField
            label="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          {/* Phone Number */}
          <TextField
            label="Phone Number"
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
          />
        </Grid>

        {/* Profile Picture */}
        <Grid item xs={6}>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
          />
        </Grid>

        {/* Bio */}
        <Grid item xs={12}>
        <Typography variant="h5">Add new bio :</Typography>
          <TextField
            label="Bio"
            multiline
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            fullWidth
          />
          {console.log("Bio value for TextField:", bio)} {/* Add this line */}
        </Grid>

        {/* Highlighted Places */}
        <Grid item xs={12}>
          <Typography variant="h5">Highlighted Places:</Typography>
          <ul>
            {highlightedPlaces.map((place, index) => (
              <li key={index}>{place}</li>
            ))}
          </ul>
          <Button variant="contained" color="primary" onClick={handleAddPlace}>
            Add Place
          </Button>
        </Grid>

        {/* Submit button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitChanges}
          >
            Save Changes
          </Button>
        </Grid>

        {/* Logout button */}
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