import React, { useState, useEffect } from "react";
import { Box, Typography,Paper } from "@mui/material";
import { styled } from "@mui/system";
import axios from 'axios';

const WidgetWrapper = styled(Paper)(({ theme }) => ({
  padding: "1.5rem",
  borderRadius: "0.75rem",
  marginBottom: "1.5rem",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  backgroundColor: theme.palette.secondary.main, // Adding a subtle box shadow
}));

const UserInfoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginBottom: "1rem",
});

const PostImage = styled(Box)({
  marginBottom: "1rem",
  overflow: "hidden",
  borderRadius: "0.5rem",
  "& img": {
    width: "100%",
    height: "auto",
    display: "block",
  },
});



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

  return (
    <WidgetWrapper elevation={3} style={{ zIndex: 1 }}  >
      {userData && profileData && (
        <UserInfoContainer>
          <img
            src={`data:${profileData.profilePicture.contentType};base64,${profileData.profilePicture.data.toString('base64')}`}
            alt={userData.username}
            style={{ borderRadius: "50%", marginRight: "0.5rem", width: '40px', height: '40px' }}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight="500">
              {userData.username}
            </Typography>
            {/* Other user information */}
          </Box>
        </UserInfoContainer>
      )}

      <Typography variant="body1" mb="1rem">
        {description}
      </Typography>

      {postImage && (
        <PostImage>
          <img src={`data:${postImage.contentType};base64,${postImage.data}`} alt="Post" />
        </PostImage>
      )}

      
    </WidgetWrapper>
  );
};

export default PostWidget;
