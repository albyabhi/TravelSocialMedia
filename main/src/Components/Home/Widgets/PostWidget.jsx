// PostWidget.js
import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import { theme } from "../theme"; // Adjust the import path as needed
import { ThumbUpOutlined, ChatBubbleOutline, Share } from "@mui/icons-material";

const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: "1.5rem",
  backgroundColor: theme.palette.secondary.main,
  borderRadius: "0.75rem",
}));

const PostWidget = () => {
  // Demo data
  const demoUser = {
    username: "John Doe",
    avatar: "https://placekitten.com/40/40", // Placeholder avatar image
  };

  const demoPost = {
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel nisi vitae mi accumsan fermentum. Proin vel justo nec mi euismod facilisis.",
    mediaUrl: "https://placekitten.com/400/300", // Placeholder image URL
  };

  // Placeholder data for likes, comments, and shares
  const likesCount = 50;
  const commentsCount = 10;
  const sharesCount = 5;

  return (
    <WidgetWrapper theme={theme}>
      {/* Avatar and Username */}
      <Box display="flex" alignItems="center" mb="1rem">
        <img src={demoUser.avatar} alt="User Avatar" style={{ borderRadius: "50%", marginRight: "0.5rem" }} />
        <Typography variant="subtitle1" fontWeight="500">
          {demoUser.username}
        </Typography>
      </Box>

      {/* Description */}
      <Typography variant="body1" mb="1rem">
        {demoPost.description}
      </Typography>

      {/* Media (Image/Video) */}
      {demoPost.mediaUrl && (
        <Box mb="1rem">
          {/* Assuming mediaUrl is the URL of the image or video */}
          <img src={demoPost.mediaUrl} alt="Media" style={{ width: "100%", borderRadius: "0.5rem" }} />
        </Box>
      )}

      {/* Like, Comment, Share Icons */}
      <Box display="flex" justifyContent="center" alignItems="center">
        <IconButton>
          <ThumbUpOutlined />
          <Typography variant="caption" ml="0.5rem">
            {likesCount} Likes
          </Typography>
        </IconButton>
        <IconButton>
          <ChatBubbleOutline />
          <Typography variant="caption" ml="0.5rem">
            {commentsCount} Comments
          </Typography>
        </IconButton>
        <IconButton>
          <Share />
          <Typography variant="caption" ml="0.5rem">
            {sharesCount} Shares
          </Typography>
        </IconButton>
      </Box>
    </WidgetWrapper>
    
  );
};

export default PostWidget;
