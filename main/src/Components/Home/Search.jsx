import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import axios from 'axios';
import { theme } from "./theme";

const SearchAppBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    // Pass the search query to the parent component
    onSearch(query);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <InputBase
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Toolbar>
    </AppBar>
  );
};

const SearchResultItem = ({ username, profilePicture }) => (
 <Box
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    bg="grey.200"
    borderRadius="8px"
    p={2}
    my={2}
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

const Search = () => {
  const [selectedCategory, setSelectedCategory] = useState('Users');
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch usernames based on the search query when the component mounts or searchQuery changes
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/search?username=${searchQuery}`);
        const searchResultsArray = Array.isArray(response.data) ? response.data : [response.data];
    
        setSearchResults(searchResultsArray);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
      }
    };

    fetchData();
  }, [searchQuery]);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
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
                color: 'black',
              },
            }}
          >
            <Tab label="Users" value="Users" />
            <Tab label="Travel Guides" value="Travel Guides" />
            <Tab label="Locations" value="Locations" />
          </Tabs>
        </Paper>

        {searchResults.map((item) => (
          <SearchResultItem
            key={item.userId}
            username={item.username}
            profilePicture={item.profilePicture}
          />
        ))}
      </Box>
    </Container>
  </div>
  );
};

export default Search;