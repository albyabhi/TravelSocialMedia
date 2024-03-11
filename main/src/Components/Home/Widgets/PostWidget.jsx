import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Input,
  Grow,
  Avatar,
  Grid,
  CircularProgress,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import CommentSection from "./CommentSection";

import LikeIcon from "../Icons/Like.png";
import LikedIcon from "../Icons/Liked.png";
import CommentIcon from "../Icons/comment.png";

const PostWidget = ({ post }) => {
  const { userId, postId, postImage, description } = post;
  const [loading, setLoading] = useState(true); // State to track loading
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
        setLoading(false); // Update loading state once data is fetched
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
  
      // Toggle likeStatus locally
      const updatedLikeStatus = likeStatus === 'like' ? 'liked' : 'like';
      setLikeStatus(updatedLikeStatus);
  
      // Adjust likeCount locally based on likeStatus
      const updatedLikeCount = likeCount + (likeStatus === 'like' ? 1 : -1);
      setLikeCount(updatedLikeCount);
  
      // Send request to the server to update the like status
      await axios.post(`http://localhost:5000/posts/like/${post._id}`, null, {
        headers: { Authorization: token },
      });
  
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
      {loading ? ( // Display CircularProgress if loading is true
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Display post details */}
          {userData && profileData && (
            <Grow in={!loading} timeout={500}>
            <Grid container alignItems="center" marginBottom="1rem">
              {/* Clickable profile picture */}
              <Grid item>
                <Avatar
                  alt={userData.username}
                  src={`data:${
                    profileData.profilePicture.contentType
                  };base64,${profileData.profilePicture.data.toString(
                    "base64"
                  )}`}
                  onClick={navigateToProfile} // Navigate on click
                  style={{ cursor: "pointer" }} // Change cursor to pointer
                />
              </Grid>
              {/* Clickable username */}
              <Grid item>
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
            </Grow>
          )}

          <Typography variant="body1" marginBottom="1rem">
            {description}
          </Typography>

          {/* Display post image if available */}
          <Grow in={!loading} timeout={500}>

          {postImage && (
            <Grid
              item
              xs={12}
              marginBottom="1rem"
              overflow="hidden"
              borderRadius="0.5rem"
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "100%",
              }}
            >
              <img
                src={`data:${postImage.contentType};base64,${postImage.data}`}
                alt="Post"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Grid>
          )}
          </Grow>

          {/* Like and Comment Section */}
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            marginBottom="1rem"
          >
            {/* Like Button */}
            <Grid item>
              <img
                src={likeStatus === "like" ? LikeIcon : LikedIcon}
                alt="Like Icon"
                style={{
                  width: "24px",
                  height: "24px",
                  verticalAlign: "middle",
                  marginRight: "4px",
                  cursor: "pointer", // Set cursor to pointer
                  transition: "transform 0.2s", // Add transition for animation
                  transform: likeStatus === "like" ? "scale(1)" : "scale(1.2)", // Scale animation
                }}
                onClick={handleLike} // Add onClick handler
              />
              {/* Display like count */}
              {likeCount}
            </Grid>
            {/* Comment Button */}
            <Grid item>
              <img
                src={CommentIcon}
                alt="Comment Icon"
                style={{
                  width: "24px",
                  height: "24px",
                  verticalAlign: "middle",
                  marginRight: "4px",
                  cursor: "pointer", // Set cursor to pointer
                  transition: "transform 0.2s", // Add transition for animation
                  transform: "scale(1)", // Initial scale
                }}
                onClick={toggleCommentSection} // Add onClick handler
              />
            </Grid>
          </Grid>

          {/* Location Section */}
          {post.location && post.location.length > 0 && (
            <Grid item xs={12} textAlign="right">
              <Typography variant="body3" color="textSecondary">
                Locations: {post.location.map((loc) => loc.label).join(", ")}
              </Typography>
            </Grid>
          )}

          {/* Comment Section */}
          {showCommentSection && (
            <CommentSection comments={comments} onAddComment={handleComment} />
          )}
        </>
      )}
    </Grid>
    
  );
};

export default PostWidget;
