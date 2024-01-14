import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  Input,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import WidgetWrapper from "../Props/WidgetWrapper"; // Adjust the import path as needed

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

        const [response, profileResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/profile", {
            headers: { Authorization: token },
          }),
          axios.get("http://localhost:5000/api/profiledata", {
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
            const imageDataUri = `data:${profileResponse.data.profilePicture.contentType};base64,${profileResponse.data.profilePicture.data.toString(
              "base64"
            )}`;
            setSavedImage(imageDataUri);
          } else {
            console.log("No Profile Picture Found in the Response");
          }
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
      formData.append("username", username);


      formData.append("bio", bio);
      formData.append(
        "highlightedPlaces",
        JSON.stringify(highlightedPlaces)
      );
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("phoneNumber", phoneNumber);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      // Send a POST request to update the profile
      await axios.post(
        "http://localhost:5000/api/profile/update",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onClose();
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response.data.message
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <WidgetWrapper style={{ maxWidth: '60vw', marginTop: '60px'}}>
     
        <Grid container spacing={2}>
          

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
      <Typography variant="subtitle2">Upload</Typography>
    </Button>
  </label>
</Grid>

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
            <Typography variant="subtitle2">Add new bio :</Typography>
            <TextField
              label="Bio"
              multiline
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2">Highlighted Places:</Typography>
            <ul>
              {highlightedPlaces.map((place, index) => (
                <li key={index}>{place}</li>
              ))}
            </ul>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPlace}
            >
              Add Place
            </Button>
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
     
      <IconButton
        style={{ position: "absolute", top: "8px", right: "8px" }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    </WidgetWrapper>
  );
};

export default ProfileEdWidget;
