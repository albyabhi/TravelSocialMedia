import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Typography, Input , TextField, Button,} from "@mui/material";
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
      formData.append("bio", bio);
      formData.append("highlightedPlaces", JSON.stringify(highlightedPlaces));
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
  
      navigate("/home");
    } catch (error) {
      console.error("Error updating profile:", error.response.data.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
console.log(setSavedImage);
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h2">Welcome, {userData.username}!</Typography>
        </Grid>

         {/* File Input */}
         <Grid item xs={12} align="center">
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
                width: "120px",
                height: "120px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="subtitle1">Upload Image</Typography>
            </Button>
          </label>
        </Grid>
 {/* Saved Image Display */}

 <Grid item xs={12} align="center">
 <Typography variant="subtitle1" >Saved Profile Picture</Typography>
  {savedImage && (
    <img
      src={savedImage}
      alt="Saved Profile"
      style={{
        maxWidth: "100%",
        maxHeight: "200px",
        borderRadius: "8px", // Add border-radius for a rounded look
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add box shadow for a subtle effect
      }}
    />
  )}
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
  
       
        
         
      </Grid>
    </Container>
  );
};

export default ProfileEd;
