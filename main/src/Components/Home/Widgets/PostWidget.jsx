// PostWidget.js
import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Avatar } from "@mui/material";
import { styled } from "@mui/system";
import { ThumbUpOutlined } from "@mui/icons-material";
import axios from 'axios';

const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: "1.5rem",
  backgroundColor: theme.palette.secondary.main,
  borderRadius: "0.75rem",
}));

const PostWidget = ({ post }) => {
  const { userId, postId, postImage, description } = post;
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, profileDataResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/user/${userId}`),
          axios.get(`http://localhost:5000/api/profiledata/${userId}`)
        ]);

        const user = userResponse.data;
        const profileData = profileDataResponse.data;
        
        setUserData(user);
        setProfileData(profileData);
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data?.message);
      }
    };

    fetchUserData();
  }, [userId]);

  // Convert ObjectID to string for rendering
  const userIdString = userId.toString();
 
  return (
    <WidgetWrapper>
      {/* UserId, PostId, etc. */}
      {userData && profileData && (
        <Box>
          <Avatar
            src={`data:${profileData.profilePicture.contentType};base64,${profileData.profilePicture.data.toString('base64')}`}
            alt={userData.username}
            style={{ borderRadius: "50%", marginRight: "0.5rem", width: '40px', height: '40px' }}
          />
          <Typography variant="subtitle1" fontWeight="500">
            {userData.username}
          </Typography>
          {/* Other user information */}
        </Box>
      )}

      {/* Description */}
      <Typography variant="body1" mb="1rem">
        {description}
      </Typography>

      {/* PostImage */}
      {postImage && (
        <Box mb="1rem">
          <img src={`data:${postImage.contentType};base64,${postImage.data}`} alt="Post" style={{ width: "100%", borderRadius: "0.5rem" }} />
        </Box>
      )}

      {/* Like, Comment, Share Icons */}
      <Box display="flex" justifyContent="center" alignItems="center">
        <IconButton>
          <ThumbUpOutlined />
          {/* Likes count or other information */}
        </IconButton>
        {/* Other icons... */}
      </Box>
    </WidgetWrapper>
  );
};

export default PostWidget;
