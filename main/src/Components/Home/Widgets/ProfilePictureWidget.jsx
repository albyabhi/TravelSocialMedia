import React, { useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { styled } from "@mui/system";
import { theme } from "../theme"; // Adjust the import path as needed
import { ThumbUpOutlined, ChatBubbleOutline, Share } from "@mui/icons-material";

const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: "1.5rem",
  backgroundColor: theme.palette.secondary.main,
  borderRadius: "0.75rem",
}));

const ProfilePictureWidget = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

  };

  return (
    <WidgetWrapper theme={theme}>
      {/* Avatar and Username */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding="2rem"
        
        borderRadius="8px"
      >
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Selected"
            style={{
              borderRadius: "50%",
              marginBottom: "1rem",
              marginRight: "1rem",
              width: "70px",
              height: "70px",
            }}
          />
        ) : (
          <Typography variant="subtitle1" fontWeight="500">
            Select a profile picture
          </Typography>
        )}
      </Box>

      {/* Input for selecting profile picture */}
      <input
        type="file"
        accept="image/*"
        id="profile-picture-input"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      <label htmlFor="profile-picture-input">
        <Button variant="contained" color="primary" component="span">
          Upload Profile Picture
        </Button>
      </label>

      {/* Additional content */}
      <Box mt="1rem">
        {/* Add your additional content here */}
        {/* For example: description, media, like/comment/share icons */}
      </Box>
    </WidgetWrapper>
  );
};

export default ProfilePictureWidget;
