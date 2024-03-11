import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Divider, Typography, Grow } from '@mui/material';
import FlexBetween from '../Props/FlexBetween';
import WidgetWrapper from '../Props/WidgetWrapper';
import { CenteredContainer } from '../Props/CenteredContainer';
import ProfileEdWidget from './ProfileEdWidget';

const UserWidget = () => {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isProfileEdWidgetVisible, setProfileEdWidgetVisible] = useState(false);

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
      setUser(userProfile);
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data?.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const { username, bio } = user;

  const openWidget = () => {
    setProfileEdWidgetVisible((prevVisibility) => !prevVisibility);
  };
  const closeWidget = () => {
    setProfileEdWidgetVisible(false);
  };

  return (
    <Grow in={true}>
      <WidgetWrapper>
        {/* UPPER ROW (Centered) */}
        <FlexBetween
          gap="0.5rem"
          pb="0.5rem"
          justifyContent="center"
          alignItems="center"
          style={{ flexDirection: 'column', textAlign: 'center' }}
        >
          {/* Display profile picture */}
          {profilePicture && profilePicture.data && (
            <img
              src={`data:${profilePicture.contentType};base64,${profilePicture.data.toString('base64')}`}
              alt={username}
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
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
          onClick={openWidget}
        >
          <Typography variant="h4" fontWeight="500" style={{ textAlign: 'center' }}>
            {username}
          </Typography>
        </FlexBetween>
        <Divider />
        {/* SECOND ROW (Centered) */}
        <FlexBetween gap="1rem" justifyContent="center" alignItems="center">
          <Box style={{ textAlign: 'center' }}>
            {/* Display bio */}
            <Typography style={{ margin: '0' }}>{bio}</Typography>
          </Box>
        </FlexBetween>

        {/* Render ProfileEdWidget inside CenteredContainer */}
        {isProfileEdWidgetVisible && (
          <CenteredContainer>
            <ProfileEdWidget onClose={closeWidget} />
          </CenteredContainer>
        )}
      </WidgetWrapper>
    </Grow>
  );
};

export default UserWidget;
