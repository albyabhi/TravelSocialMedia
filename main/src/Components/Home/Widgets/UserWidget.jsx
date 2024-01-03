// UserWidget.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Divider, Typography } from '@mui/material';
import FlexBetween from '../Props/FlexBetween';
import WidgetWrapper from '../Props/WidgetWrapper';

import Avatar from '@mui/material/Avatar';

const UserWidget = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        // Redirect to login if not authenticated
        navigate('/login');
        return;
      }
  
      // Fetch user data and profile data from the server
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
  
      // Combine user and profile data into a single object
      const userProfile = {
        userId: userData._id,
        username: userData.username,
        // Use profileData for profilePicture and bio
        profilePicture: profileData?.profilePicture || "",
        bio: profileData?.bio || "",
      };
  
      setUser(userProfile);
      setProfileData(profileData); // Optionally, set profileData in state for future use
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data?.message);
      // Redirect to login in case of an error
      navigate('/login');
    }
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const { username, bio, profilePicture } = user;

  return (
    <WidgetWrapper>
      {/* UPPER ROW (Centered) */}
      <FlexBetween
        gap="0.5rem"
        pb="0.5rem" // Adjust the spacing between rows
        justifyContent="center" // Center the content
        alignItems="center" // Center vertically
      >
        {/* Display profile picture using MUI Avatar component */}
        
        <img src={profilePicture} alt={username} style={{ width: '64px', height: '64px' }} />
      </FlexBetween>

      {/* FIRST ROW (Centered) */}
      <FlexBetween
        gap="0.5rem"
        pb="0.5rem" // Adjust the spacing between rows
        justifyContent="center" // Center the content
        alignItems="center" // Center vertically
        onClick={() => navigate(`/profile/${username}`)}
      >
        <FlexBetween gap="1rem">
          {/* Display username */}
          <Box>
            <Typography
              variant="h4"
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: "primary.main",
                  cursor: "pointer",
                },
              }}
            >
              {username}
            </Typography>
          </Box>
        </FlexBetween>
        {/* If you want to display additional icons, you can add them here */}
      </FlexBetween>

      {/* SECOND ROW (Centered) */}
      <FlexBetween gap="1rem" justifyContent="center" alignItems="center">
        <Box>
          {/* Display bio */}
          <Typography>{bio}</Typography>
        </Box>
        {/* You can add more components here for the second row */}
      </FlexBetween>

      <Divider />

      {/* You can continue adding more sections for additional information */}
    </WidgetWrapper>
  );
};

export default UserWidget;