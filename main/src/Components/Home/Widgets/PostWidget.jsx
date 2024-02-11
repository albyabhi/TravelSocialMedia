import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Input, Avatar , Grid} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const PostWidget = ({ post }) => {
  const { userId, postId, postImage, description } = post;
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const navigate = useNavigate();

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

  const navigateToProfile = () => {
    navigate(`/profileview/${userData.userId}`); // Navigate to profile view
  };

  return (
     <Grid
      container
      boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
      borderRadius="0.75rem"
      marginBottom="1.5rem"
      backgroundColor="secondary.main"
      padding="1.5rem"
    >
      {userData && profileData && (
         <Grid container alignItems="center" marginBottom="1rem">
         <Grid item>
           {/* Clickable profile picture */}
           <Avatar 
             alt={userData.username} 
             src={`data:${profileData.profilePicture.contentType};base64,${profileData.profilePicture.data.toString('base64')}`} 
             onClick={navigateToProfile} // Navigate on click
             style={{ cursor: 'pointer' }} // Change cursor to pointer
           />
         </Grid>
         <Grid item>
           {/* Clickable username */}
           <Typography 
             variant="subtitle1" 
             fontWeight="500" 
             onClick={navigateToProfile} // Navigate on click
             style={{ cursor: 'pointer', marginLeft: '0.5rem' }} // Change cursor to pointer
           >
             {userData.username}
           </Typography>
         </Grid>
       </Grid>
      )}

      <Typography variant="body1" marginBottom="1rem">
        {description}
      </Typography>

      {postImage && (
        <Grid item xs={12} marginBottom="1rem" overflow="hidden" borderRadius="0.5rem">
          <img src={`data:${postImage.contentType};base64,${postImage.data}`} alt="Post" style={{ width: "100%", height: "auto", display: "block" }} />
        </Grid>
      )}

      {/* Like and Comment Section */}
      <Grid container justifyContent="space-between" alignItems="center" marginBottom="1rem">
        <Grid item>
          <Button startIcon={<FavoriteIcon />} onClick={handleLike}>
            {likeCount} Like
          </Button>
        </Grid>
        <Grid item>
          <Button startIcon={<CommentIcon />} color="primary">
            Comment
          </Button>
        </Grid>
      </Grid>

      {/* Location Section */}
      {post.location && post.location.length > 0 && (
        <Grid
          item
          xs={12}
          textAlign="right"
        >
          <Typography variant="body2" color="textSecondary">
            Locations: {post.location.map(loc => loc.label).join(', ')}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default PostWidget;
