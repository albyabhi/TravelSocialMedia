import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Typography, TextField, Button, Modal, Box } from "@mui/material";
import ProfilePictureWidget from "../Home/Widgets/ProfilePictureWidget"; // Adjust the import path as needed

const ProfileEd = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [bio, setBio] = useState("");
  const [highlightedPlaces, setHighlightedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

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

  const handleOpenUploadModal = () => {
    setUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
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

      const requestData = {
        bio,
        highlightedPlaces,
        firstName,
        lastName,
        phoneNumber,
      };

      // Send a POST request to update the profile
      await axios.post(
        "http://localhost:5000/api/profile/update",
        requestData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

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
  
        {/* New Upload Profile Picture Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenUploadModal}
          >
            Upload Profile Picture
          </Button>
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
          {console.log("Bio value for TextField:", bio)}
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Grid>
  
        {/* Modal for uploading profile picture */}
        <Modal
          open={isUploadModalOpen}
          onClose={handleCloseUploadModal}
          aria-labelledby="upload-profile-modal"
          aria-describedby="upload-profile-description"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box>
            <ProfilePictureWidget />
          </Box>
        </Modal>
      </Grid>
    </Container>
  );
};

export default ProfileEd;
