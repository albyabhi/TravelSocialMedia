import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Input, Avatar, Grid } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import CommentSection from "./CommentSection";

import LikeIcon from "../Icons/Like.png";
import LikedIcon from "../Icons/Liked.png";
import CommentIcon from "../Icons/comment.png";

const PostWidget = ({ post }) => {
  const { userId, postId, postImage, description } = post;
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [likeStatus, setLikeStatus] = useState("");
  const [showCommentSection, setShowCommentSection] = useState(false); // State to control visibility of comment section
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, profileDataResponse, likeCountResponse] =
          await Promise.all([
            axios.get(`http://localhost:5000/api/user/${userId}`),
            axios.get(`http://localhost:5000/api/profiledata/${userId}`),
            axios.get(`http://localhost:5000/posts/like/count/${post._id}`, {
              headers: { Authorization: token },
            }),
          ]);

        const user = userResponse.data;
        const likeCount = likeCountResponse.data.count;
        const profileData = profileDataResponse.data;
        const likeStatus = likeCountResponse.data.likeStatus;
        setUserData(user);
        setLikeStatus(likeStatus);
        setProfileData(profileData);
        setLikeCount(likeCount);
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error.response?.data?.message
        );
      }
    };

    fetchUserData();
  }, [userId, post._id]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/posts/fetchcomments/${post._id}`
      );

      setComments(response.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  useEffect(() => {
    fetchComments();
  }, [post._id]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/posts/like/${post._id}`, null, {
        headers: { Authorization: token },
      });

      const likeCountResponse = await axios.get(
        `http://localhost:5000/posts/like/count/${post._id}`,
        {
          headers: { Authorization: token }, // Include authorization header
        }
      );
      const updatedlikeStatus = likeCountResponse.data.likeStatus;
      const updatedLikeCount = likeCountResponse.data.count;
      setLikeCount(updatedLikeCount);
      setLikeStatus(updatedlikeStatus);
    } catch (error) {
      console.error("Error liking post:", error.response?.data?.message);
    }
  };

  const handleComment = async (commentText) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/posts/comment/${post._id}`,
        { text: commentText },
        {
          headers: { Authorization: token },
        }
      );

      // Refresh post data after commenting
      fetchComments();
      // Assuming fetchUserData also fetches post data
    } catch (error) {
      console.error("Error adding comment:", error.response?.data?.message);
    }
  };

  const navigateToProfile = () => {
    navigate(`/profileview/${userData.userId}`); // Navigate to profile view
  };
  const toggleCommentSection = () => {
    setShowCommentSection(!showCommentSection); // Toggle visibility of comment section
  };

  return (
    <Grid
      container
      direction="column"
      boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
      borderRadius="0.75rem"
      backgroundColor="secondary.main"
      padding="1.5rem"
      sx={{
        maxWidth: "100%", // Set maximum width to 100% for responsiveness
        width: "100%", // Ensure the width is also set to 100% to fill the parent container
        margin: "auto", // Center the widget horizontally
        boxSizing: "border-box", // Include padding and border in the width calculation
        "@media (min-width: 600px)": {
          // Apply different styles for larger screens
          maxWidth: "600px", // Limit the maximum width to 400px on larger screens
          marginBottom: "1rem", // Add space below each PostWidget on larger screens
        },
      }}
      marginBottom={{ xs: "1rem", md: 0 }} // Add space below each PostWidget for small screens
    >
      {userData && profileData && (
        <Grid container alignItems="center" marginBottom="1rem">
          <Grid item>
            {/* Clickable profile picture */}
            <Avatar
              alt={userData.username}
              src={`data:${
                profileData.profilePicture.contentType
              };base64,${profileData.profilePicture.data.toString("base64")}`}
              onClick={navigateToProfile} // Navigate on click
              style={{ cursor: "pointer" }} // Change cursor to pointer
            />
          </Grid>
          <Grid item>
            {/* Clickable username */}
            <Typography
              variant="subtitle1"
              fontWeight="500"
              onClick={navigateToProfile} // Navigate on click
              style={{ cursor: "pointer", marginLeft: "0.5rem" }} // Change cursor to pointer
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
        <Grid
          item
          xs={12}
          marginBottom="1rem"
          overflow="hidden"
          borderRadius="0.5rem"
        >
          <img
            src={`data:${postImage.contentType};base64,${postImage.data}`}
            alt="Post"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </Grid>
      )}

      {/* Like and Comment Section */}
      <Grid
  container
  justifyContent="space-between"
  alignItems="center"
  marginBottom="1rem"
>
  <Grid item>
    {/* Like Button */}
    <img
      src={likeStatus === "like" ? LikeIcon : LikedIcon}
      alt="Like Icon"
      style={{
        width: '24px',
        height: '24px',
        verticalAlign: 'middle',
        marginRight: '4px',
        cursor: 'pointer' // Set cursor to pointer
      }}
      onClick={handleLike} // Add onClick handler
    />
    {/* Display like count */}
    {likeCount}
  </Grid>
  <Grid item>
    {/* Comment Button */}
    <img
      src={CommentIcon}
      alt="Comment Icon"
      style={{
        width: '24px',
        height: '24px',
        verticalAlign: 'middle',
        marginRight: '4px',
        cursor: 'pointer' // Set cursor to pointer
      }}
      onClick={toggleCommentSection} // Add onClick handler
    />
  </Grid>
</Grid>

      {/* Location Section */}
      {post.location && post.location.length > 0 && (
        <Grid item xs={12} textAlign="right">
          <Typography variant="body2" color="textSecondary">
            Locations: {post.location.map((loc) => loc.label).join(", ")}
          </Typography>
        </Grid>
      )}

      {/* Comment Section */}
      {showCommentSection && (
        <CommentSection comments={comments} onAddComment={handleComment} />
      )}
    </Grid>
  );
};

export default PostWidget;
