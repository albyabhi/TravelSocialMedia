import React, { useState, useEffect } from "react";
import { Avatar, Button, TextField, Input, Typography, Autocomplete, Select, MenuItem, InputLabel } from "@mui/material";
import { PostAdd, Cancel } from "@mui/icons-material";
import { styled } from "@mui/system";
import WidgetWrapper from "../Props/WidgetWrapper";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StyledFileInput = styled(Input)(({ theme }) => ({
  display: "none",
}));

const Addpost = ({ onClose }) => {
  const [formData, setFormData] = useState({
    description: '',
    file: null,
    location: null,
  });

  const [postMessage, setPostMessage] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [locationOptions, setLocationOptions] = useState([]);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [nations, setNations] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedNation, setSelectedNation] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [typomsg, setTypoMsg] = useState("Didn't find the location you are looking for? Add it");  const [newLocationName, setNewLocationName] = useState('');
  const [alertMessage, setAlertMessage] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/map/allfetchlocations');
      const locations = response.data.map(location => ({
        value: location._id,
        label: location.name,
      }));
      setLocationOptions(locations);
    } catch (error) {
      console.error('Error fetching locations:', error.response?.data?.message);
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
    fetchStates(nationId);
    await fetchLocations(); // Fetch locations automatically when a nation is selected
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
      console.error('Error adding location:', error.response?.data?.message);
      setAlertMessage("Error adding location. Please try again.");
    }
  };

  const handleAddLocationClick = () => {
    setShowAddLocation(true);
  };

  const handleAddLocationCancel = () => {
    setShowAddLocation(false);
  };

  useEffect(() => {
    if (!showAddLocation) {
      // If showAddLocation becomes false, reset the message to 'New location added'
      setAlertMessage("New location added");
    }
  }, [showAddLocation]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const [userResponse, profileResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/profile', { headers: { Authorization: token } }),
          axios.get('http://localhost:5000/api/profiledata', { headers: { Authorization: token } }),
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
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      file: selectedFile,
    }));
  };

  const handleInputChange = (e) => {
    if (e && e.target) {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
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

  const handlePost = async () => {
    try {
      if (!formData.file) {
        setPostMessage('Please select an image before posting.');
        return;
      }
      const postData = new FormData();
      postData.append('postImage', formData.file);
      postData.append('description', formData.description);
      postData.append('location[value]', formData.location.value);
      postData.append('location[label]', formData.location.label);

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/posts/newposts', postData, {
        headers: {
          'Authorization': token,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Post created successfully:', response.data);
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
          <Avatar alt="Loading" style={{ borderRadius: "50%", marginRight: "0.5rem", width: '40px', height: '40px' }} />
        )}
      </div>

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

      {formData.file && (
        <img
          src={URL.createObjectURL(formData.file)}
          alt="Preview"
          style={{ maxWidth: "100%", maxHeight: "200px", marginBottom: "1rem" }}
        />
      )}

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

{!showAddLocation && (
        <Typography onClick={handleAddLocationClick} style={{ cursor: 'pointer', color: 'blue', marginBottom: '1rem' }}>
          {typomsg}
        </Typography>
      )}

{showAddLocation && (
  <>
    <InputLabel>Nation</InputLabel>
    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
      <Select
        value={selectedNation}
        onChange={(e) => handleNationChange(e.target.value)}
        fullWidth
        margin="normal"
        style={{ marginBottom: '1rem' }}
      >
        <MenuItem value="defaultNation">Select a nation</MenuItem>
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
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <Select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            fullWidth
            margin="normal"
            style={{ marginBottom: '1rem' }}
          >
            <MenuItem value="defaultState">Select a state</MenuItem>
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
          sx={{ marginBottom: '1rem' }}
        />

        <Button sx={{ marginBottom: '1rem' }} variant="contained" color="primary" onClick={handleAddLocation}>Add Location</Button>
        <Button sx={{ marginBottom: '1rem' }} variant="outlined" color="primary" onClick={handleAddLocationCancel} style={{ marginLeft: "1rem" }}>Cancel</Button>
      </>
    )}
  </>
)}





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

export default Addpost;
