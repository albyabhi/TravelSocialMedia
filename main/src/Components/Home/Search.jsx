import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Avatar ,
  Box,
  Typography,
  Container,
  Tab,
  Tabs,
  Paper,
  AppBar,
  Toolbar,
  InputBase,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import { theme } from "./theme";
import { ArrowBack } from '@mui/icons-material';

const SearchAppBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    // Pass the search query to the parent component
    onSearch(query);
  };

  const handleGoBack = () => {
    // Implement navigation to the previous page
    // You can use window.history.back() or any other navigation method you prefer
    window.history.back();
  };

  return (
    <AppBar position="sticky">
       <Toolbar style={{ display: 'flex', justifyContent: 'center' }}>
       <IconButton onClick={handleGoBack} edge="start" color="inherit" aria-label="back">
          <ArrowBack />
        </IconButton>
        <InputBase
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            backgroundColor: theme.palette.secondary.main, // Add your desired background color here
            borderRadius: '4px', // Add border radius
            padding: '8px', // Add padding
            width: '30%',
            
          }}
        />
      </Toolbar>
    </AppBar>
  );
};

const SearchResultItem = ({ userId, username, profilePicture, onClick }) => {
  console.log('userId:', userId); // Log the userId
  
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      bg="grey.200"
      borderRadius="8px"
      p={2}
      my={2}
      onClick={() => onClick(userId)} // Call onClick function with userId as argument
      style={{ cursor: 'pointer' }}
    >
      <Box display="flex" alignItems="center">
        {profilePicture && (
          <Avatar
            alt="Profile"
            src={`data:${profilePicture.contentType};base64,${profilePicture.data}`}
            sx={{
              width: '50px',
              height: '50px',
            }}
          />
        )}
        <Box ml={2}>
          <Typography>{username}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

const LocationSearchResultItem = ({  locationId , locationName, onClick }) => {
  
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      bg="grey.200"
      borderRadius="8px"
      p={2}
      my={2}
      onClick={() => onClick(locationId)}
      style={{ cursor: 'pointer' }}
    >
      <Typography>{locationName}</Typography>
    </Box>
  );
};

const Search = () => {
  const [selectedCategory, setSelectedCategory] = useState('Users');
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  useEffect(() => {
    // Fetch usernames based on the search query when the component mounts or searchQuery changes
    const fetchData = async () => {
      try {
        let response;
        if (selectedCategory === 'Users') {
          response = await axios.get(`http://localhost:5000/api/users/search?username=${searchQuery}`);
        } else if (selectedCategory === 'Locations') {
          response = await axios.get(`http://localhost:5000/map/locations/search?locationName=${searchQuery}`);
        }
        const searchResultsArray = Array.isArray(response.data) ? response.data : [response.data];
        setSearchResults(searchResultsArray);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
      }
    };

    fetchData();
  }, [searchQuery, selectedCategory]);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleUserClick = (userId) => {
    // Navigate to the user's profile view
    navigate(`/profileview/${userId}`);
    
  };

  const handleLocationClick = (locationId) => {
    // Navigate to LocationView with locationId as parameter
    navigate(`/LocationView/${locationId}`);
  };
  

  

  return (
    <div>
    <SearchAppBar onSearch={(query) => setSearchQuery(query)} />

    <Container maxWidth="sm">
      <Box mt={2}>
        <Paper>
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            centered
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.secondary.main,
              },
              '& .Mui-selected': {
                backgroundColor: theme.palette.secondary.main,
              },
            }}
          >
            <Tab label="Users" value="Users" />
            <Tab label="Travel Guides" value="Travel Guides" />
            <Tab label="Locations" value="Locations" />
          </Tabs>
        </Paper>

        {selectedCategory === 'Users' && (
  searchResults.map((item) => (
    <SearchResultItem
  key={item.userId}
  userId={item.userId}
  username={item.username}
  profilePicture={item.profilePicture}
  onClick={handleUserClick}
/>
    ))
  )}
 
 {searchQuery && selectedCategory === 'Locations' && (
          searchResults.map((item) => (
            <LocationSearchResultItem
  key={item._id}
  locationId={item._id} // Pass the location _id
  locationName={item.name}
  onClick={handleLocationClick} // Pass the onClick handler
/>
          ))
        )}

      </Box>
    </Container>
  </div>
  );
};

export default Search;