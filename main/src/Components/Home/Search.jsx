import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Avatar,
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

const SearchAppBar = ({ onSearch, selectedCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');

  useEffect(() => {
    // Set placeholder text based on the selected tab
    switch (selectedCategory) {
      case 'Users':
        setPlaceholderText('Search Users');
        break;
      case 'Locations':
        setPlaceholderText('Search Locations');
        break;
      case 'Travel Guides':
        setPlaceholderText('Search Travel Guides');
        break;
      default:
        setPlaceholderText('Search');
        break;
    }
  }, [selectedCategory]);

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
          placeholder={placeholderText}
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

const LocationSearchResultItem = ({ locationId, locationName, onClick }) => {
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

const TravelGuideSearchResultItem = ({ guideId, userId, title, description, image, onClick }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data using userId
        const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
        const userData = response.data;
        // Update state with user name and profile picture
        setUserName(userData.username);
        setProfilePicture(userData.profilePicture);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleNavigate = () => {
    navigate(`/travelguideView/${guideId}/${userId}`);
  };

  return (
    <Container
      style={{
        backgroundColor: theme.palette.secondary.main,
        marginTop: '20px',
        borderRadius: '18px',
        padding: '16px',
      }}
    >
      <div>
        {/* Display the profile picture and user name */}
        <Box
          display="flex"
          alignItems="center"
          bg="grey.200"
          borderRadius="8px"
          p={2}
          mb={2}
        >
          {profilePicture && (
            <Avatar
              alt="Profile"
              src={`data:${profilePicture.contentType};base64,${profilePicture.data}`}
              sx={{
                width: '50px',
                height: '50px',
                marginRight: '16px',
                borderRadius: '50%',
              }}
            />
          )}
          {userName && <Typography variant="subtitle1">{userName}</Typography>}
        </Box>

        {/* Display the travel guide information */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bg="grey.200"
          borderRadius="8px"
          p={2}
          mb={2}
          onClick={handleNavigate}
          style={{
            cursor: 'pointer',
            backgroundImage: image ? `url(data:${image.contentType};base64,${image.data})` : 'none',
            backgroundSize: 'cover',
            height: '150px',
          }}
        >
          <div>
            <Typography variant="h6">{title}</Typography>
            {/* Display the description */}
            <Typography variant="body1">{description}</Typography>
          </div>
        </Box>
      </div>
    </Container>
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
    const fetchData = async () => {
      try {
        let response;
        if (selectedCategory === 'Users') {
          response = await axios.get(`http://localhost:5000/api/users/search?username=${searchQuery}`);
        } else if (selectedCategory === 'Locations') {
          response = await axios.get(`http://localhost:5000/map/locations/search?locationName=${searchQuery}`);
        } else if (selectedCategory === 'Travel Guides') {
          response = await axios.get(`http://localhost:5000/tg/search?destinationName=${searchQuery}`);
          console.log('Travel Guides Data:', response.data);
        }
        const searchResultsArray = Array.isArray(response.data) ? response.data : [response.data];
        setSearchResults(searchResultsArray);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
      }
    };

    if (searchQuery) {
      fetchData();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, selectedCategory]);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleUserClick = (userId) => {
    navigate(`/profileview/${userId}`);
  };

  const handleLocationClick = (locationId) => {
    navigate(`/LocationView/${locationId}`);
  };

  return (
    <div>
      <SearchAppBar onSearch={(query) => setSearchQuery(query)} selectedCategory={selectedCategory} />

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
                locationId={item._id}
                locationName={item.name}
                onClick={handleLocationClick}
              />
            ))
          )}

          {selectedCategory === 'Travel Guides' && (
            searchResults.map((guide) => (
              <TravelGuideSearchResultItem
                key={guide._id}
                userId={guide.userId}
                guideId={guide._id}
                title={guide.featureDestination ? guide.featureDestination.name : ' '}
                description={guide.featureDestination ? guide.featureDestination.description : ''}
                image={guide.featureDestination ? guide.featureDestination.image : null}
              />
            ))
          )}
        </Box>
      </Container>
    </div>
  );
};

export default Search;
