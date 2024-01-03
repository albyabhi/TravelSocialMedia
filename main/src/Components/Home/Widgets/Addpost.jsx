import React, { useState } from "react";
import { Avatar, Button, Input, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { PostAdd, Cancel } from "@mui/icons-material";
import WidgetWrapper from "../Props/WidgetWrapper"; // Adjust the import path as needed

const StyledFileInput = styled(Input)(({ theme }) => ({
  display: "none", // Hide the default file input
}));

const Addpost = () => {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    // Handle file upload logic
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handlePost = () => {
    // Handle post logic (e.g., send data to the server)
    console.log("Post clicked:", { description, file });
    // Reset form state
    setDescription("");
    setFile(null);
  };

  const handleCancel = () => {
    // Handle cancel logic (e.g., clear form)
    console.log("Cancel clicked");
    // Reset form state
    setDescription("");
    setFile(null);
  };

  return (
    <WidgetWrapper>
      {/* Avatar and Username */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar src="https://placekitten.com/40/40" alt="User Avatar" style={{ borderRadius: "50%", marginRight: "0.5rem" }} />
          <Typography variant="subtitle1" fontWeight="500">
            Username
          </Typography>
        </div>
      </div>

      {/* Stylish File Upload Input */}
      <label htmlFor="file-input" style={{ marginBottom: "1rem", cursor: "pointer" }}>
        <StyledFileInput
          id="file-input"
          type="file"
          onChange={handleFileChange}
        />
        <Button variant="outlined" component="span" color="primary" startIcon={<PostAdd />} style={{ marginRight: "0.5rem" }}>
          Upload File
        </Button>
        {file && <Typography variant="body2" color="textSecondary">{file.name}</Typography>}
      </label>

      {/* Description Input */}
      <Input
        placeholder="Type your description here"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={3}
        fullWidth
        style={{ marginBottom: "1rem" }}
      />

      {/* Post and Cancel Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" color="primary" startIcon={<PostAdd />} onClick={handlePost}>
          Post
        </Button>
        <Button variant="outlined" color="quaternary" startIcon={<Cancel />} onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </WidgetWrapper>
  );
};

export default Addpost;
