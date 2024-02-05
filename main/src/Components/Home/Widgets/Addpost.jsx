// Import the necessary components and styles
import React, { useState, useEffect } from "react";
import { Avatar, Button, TextField ,Input, Typography, Autocomplete , Select, MenuItem } from "@mui/material";
import { PostAdd, Cancel } from "@mui/icons-material";
import { styled } from "@mui/system";
import WidgetWrapper from "../Props/WidgetWrapper"; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const StyledFileInput = styled(Input)(({ theme }) => ({
  display: "none", // Hide the default file input
}));

const Addpost = ({onClose}) => {
  const [formData, setFormData] = useState({
    description: '',
    file: null,
    location: null,
  });

  const [postMessage, setPostMessage] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [locationOptions, setLocationOptions] = useState([]);
  const navigate = useNavigate();
  
  
  useEffect(() => {
    // Fetch location options and update the state
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/map/allfetchlocations');
        console.log('Location Data:', response.data);
        const locations = response.data.map(location => ({
          value: location._id,
          label: location.name,
        }));
        setLocationOptions(locations);
      } catch (error) {
        console.error('Error fetching locations:', error.response?.data?.message);
      }
    };

    fetchLocations();
  }, []);
  
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem('token');

        const [userResponse, profileResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/profile', {
            headers: { Authorization: token },
          }),
          axios.get('http://localhost:5000/api/profiledata', {
            headers: { Authorization: token },
          }),
        ]);

        const userData = userResponse.data;
        const profileData = profileResponse.data;

        const userProfile = {
          userId: userData._id,
          username: userData.username,
          bio: profileData?.bio || '',
          profilePicture: profileData?.profilePicture || null,
        };

        setProfilePicture(profileData?.profilePicture || null);
        setFormData((prevData) => ({
          ...prevData,
          username: userData.username,
        }));
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data?.message);
      }
    };

    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileChange = (event) => {
    // Handle file upload logic
    const selectedFile = event.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      file: selectedFile,
    }));
  };

  const handleInputChange = (e) => {
    // Handle input changes for description, location, etc.
    if (e && e.target) {
      // Handle changes for regular input fields
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleAutocompleteChange = (event, newValue) => {
    if (newValue) {
      // Set the location directly from newValue
      setFormData((prevData) => ({
        ...prevData,
        location: newValue,
      }));
      // Log the selected location's ID and label to the console
      console.log('Selected Location ID:', newValue.value);
      console.log('Selected Location label:', newValue.label);
    } else {
      // Handle clearing the Autocomplete value
      setFormData((prevData) => ({
        ...prevData,
        location: null,
      }));
    }
  };
  

  const handlePost = async () => {
    try {
      if (!formData.file) {
        setPostMessage('Please select an image before posting.');
        return;
      }
      // Create FormData object to send the file and other data
      const postData = new FormData();
      postData.append('postImage', formData.file);  // Update the field name to 'postImage'
      postData.append('description', formData.description);
      postData.append('location[value]', formData.location.value); // Assuming formData.location is an object
      postData.append('location[label]', formData.location.label); // Assuming formData.location is an object
  
      // Send post data to the server
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/posts/newposts', postData, {
        headers: {
          'Authorization': token,
          'Content-Type': 'multipart/form-data', // Important for sending files
        },
      });

      console.log('Post created successfully:', response.data);

      // Reset form state
      setFormData({
        description: '',
        file: null,
        location: '',
      });
      setPostMessage('Post uploaded successfully!');
    } catch (error) {
      setPostMessage('Error uploading post. Please try again.');
      console.error('Error creating post:', error.response?.data?.message);
    }
  };

  const handleCancel = () => {
    
    // Handle cancel logic (e.g., clear form)
    console.log("Cancel clicked");
    // Reset form state
    setFormData({
      description: '',
      file: null,
      location: '',
    });
    setPostMessage(null);
    onClose();
    
  };

  return (
    <WidgetWrapper>
      {/* Avatar and Username */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
      {profilePicture && profilePicture.data ? (
  <div style={{ display: "flex", alignItems: "center" }}>
    <Avatar
      src={`data:${profilePicture.contentType};base64,${profilePicture.data.toString('base64')}`}
      alt={formData.username}
      style={{ borderRadius: "50%", marginRight: "0.5rem", width: '40px', height: '40px' }}
    />
    <Typography variant="subtitle1" fontWeight="500">
      {formData.username}
    </Typography>
  </div>
) : (
  // Render a loading state or default avatar
  <Avatar alt="Loading" style={{ borderRadius: "50%", marginRight: "0.5rem", width: '40px', height: '40px' }}>
    {/* You can add a loading spinner or default avatar here */}
  </Avatar>
)}
      </div>

      {/* Stylish File Upload Input */}
      <label htmlFor="file-input" style={{ marginBottom: "1rem", cursor: "pointer" }}>
        <StyledFileInput
          id="file-input"
          type="file"
          onChange={handleFileChange}
        />
        {postMessage && (
        <Typography variant="body2" color={postMessage.includes('successfully') ? 'primary' : 'error'} style={{ marginBottom: "1rem" }}>
          {postMessage}
        </Typography>
      )}
        <Button variant="outlined" component="span" color="primary" startIcon={<PostAdd />} style={{ marginRight: "0.5rem" }}>
          Post
        </Button>
        {formData.file && <Typography variant="body2" color="textSecondary">{formData.file.name}</Typography>}
      </label>

      {/* Image Preview */}
      {formData.file && (
        <img
          src={URL.createObjectURL(formData.file)}
          alt="Preview"
          style={{ maxWidth: "100%", maxHeight: "200px", marginBottom: "1rem" }}
        />
      )}

      {/* Description Input */}
      <Input
  placeholder="Type your description here"
  value={formData.description}
  onChange={(e) => handleInputChange(e)}
  name="description"
  multiline
  rows={3}
  fullWidth
  style={{ marginBottom: "1rem" }}
/>

      {/* Location Select */}
      <Autocomplete
  value={formData.location}
  onChange={handleAutocompleteChange}
  options={locationOptions}
  getOptionLabel={(option) => option.label || ''}
  isClearable={false}
  freeSolo={false}
  autoHighlight
  getOptionSelected={(option, value) => option.value === value.value}
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


      {/* Post and Cancel Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" color="primary" startIcon={<PostAdd />} onClick={handlePost}>
          Post
        </Button>
        <Button variant="outlined" color="quaternary" startIcon={<Cancel />} onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </WidgetWrapper>
  );
};

export default Addpost;