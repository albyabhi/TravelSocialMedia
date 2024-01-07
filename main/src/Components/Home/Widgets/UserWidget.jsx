import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Divider, Typography } from '@mui/material';
import FlexBetween from '../Props/FlexBetween';
import WidgetWrapper from '../Props/WidgetWrapper';
import { Buffer } from 'buffer';

const UserWidget = () => {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();

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
      console.log('Profile Picture Data:', profileData?.profilePicture);
      
      setUser(userProfile);
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data?.message);
      navigate('/login');
    }
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

 
   

  if (!user) {
    return null;
  }
  

  

  const { username, bio } = user;

  return (
    <WidgetWrapper>
      {/* UPPER ROW (Centered) */}
      <FlexBetween
        gap="0.5rem"
        pb="0.5rem"
        justifyContent="center"
        alignItems="center"
      >
        {/* Display profile picture */}
        {profilePicture && profilePicture.data && (
  <img
    src={`data:${profilePicture.contentType};base64,${Buffer.from(profilePicture.data)}`}
    alt={username}
    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
  />
)}
      </FlexBetween>

      {/* FIRST ROW (Centered) */}
      <FlexBetween
        gap="0.5rem"
        pb="0.5rem"
        justifyContent="center"
        alignItems="center"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/profile')}
      >
        <Typography variant="h4" fontWeight="500">
          {username}
        </Typography>
      </FlexBetween>

      {/* SECOND ROW (Centered) */}
      <FlexBetween gap="1rem" justifyContent="center" alignItems="center">
        <Box>
          {/* Display bio */}
          <Typography>{bio}</Typography>
        </Box>
      </FlexBetween>

      <Divider />
    </WidgetWrapper>
  );
};

export default UserWidget;
