import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Input, Avatar } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import axios from 'axios';

const PostWidget = ({ post }) => {
  const { userId, postId, postImage, description } = post;
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, profileDataResponse, likeCountResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/user/${userId}`),
          axios.get(`http://localhost:5000/api/profiledata/${userId}`),
          axios.get(`http://localhost:5000/posts/like/count/${post._id}`),
        ]);

        const user = userResponse.data;
        const likeCount = likeCountResponse.data.count;
        const profileData = profileDataResponse.data;

        setUserData(user);
        setProfileData(profileData);
        setLikeCount(likeCount);
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data?.message);
      }
    };

    fetchUserData();
  }, [userId, post._id]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/posts/like/${post._id}`, null, {
        headers: { 'Authorization': token },
      });

      const likeCountResponse = await axios.get(`http://localhost:5000/posts/like/count/${post._id}`);
      const updatedLikeCount = likeCountResponse.data.count;
      setLikeCount(updatedLikeCount);

    } catch (error) {
      console.error('Error liking post:', error.response?.data?.message);
    }
  };

  const handleComment = async (commentText) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/posts/comment/${post._id}`, { text: commentText }, {
        headers: { 'Authorization': token },
      });

      // Refresh post data after commenting
      // Assuming fetchUserData also fetches post data
    } catch (error) {
      console.error('Error adding comment:', error.response?.data?.message);
    }
  };

  return (
    <Box
      boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
      borderRadius="0.75rem"
      marginBottom="1.5rem"
      backgroundColor="secondary.main"
      padding="1.5rem"
      zIndex={1}
      position="relative"
    >
      {userData && profileData && (
        <Box display="flex" alignItems="center" marginBottom="1rem">
          <Avatar
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
        </Box>
      )}

      <Typography variant="body1" marginBottom="1rem">
        {description}
      </Typography>

      {postImage && (
        <Box marginBottom="1rem" overflow="hidden" borderRadius="0.5rem">
          <img src={`data:${postImage.contentType};base64,${postImage.data}`} alt="Post" style={{ width: "100%", height: "auto", display: "block" }} />
        </Box>
      )}

      {/* Like and Comment Section */}
      <Box display="flex" alignItems="center" marginBottom="1rem">
        <Button startIcon={<FavoriteIcon />} onClick={handleLike}>
          {likeCount} Like
        </Button>
        <Button startIcon={<CommentIcon />} color="primary">
          Comment
        </Button>
      </Box>

    
    </Box>
  );
};

export default PostWidget;
