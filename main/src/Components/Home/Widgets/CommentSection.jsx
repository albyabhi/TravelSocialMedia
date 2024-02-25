import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Box, Avatar } from '@mui/material';
import axios from 'axios';

const CommentSection = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [profilePictures, setProfilePictures] = useState({});

  const fetchProfilePicture = async (userId) => {
    try {
      const profileResponse = await axios.get(`http://localhost:5000/api/user/${userId}`);
      return profileResponse.data.profilePicture;
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchProfilePictures = async () => {
      const newProfilePictures = {};
      for (const comment of comments) {
        if (!profilePictures[comment.userId]) {
          const profilePicture = await fetchProfilePicture(comment.userId);
          newProfilePictures[comment.userId] = profilePicture;
        }
      }
      setProfilePictures((prevProfilePictures) => ({ ...prevProfilePictures, ...newProfilePictures }));
    };
    fetchProfilePictures();
  }, [comments, profilePictures]);

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      // Call the onAddComment function to add the new comment
      onAddComment(newComment);
      // Clear the input field after adding the comment
      setNewComment('');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>
      {/* Display existing comments */}
      {comments.map((comment, index) => (
        <Box key={index} marginBottom={2} display="flex" alignItems="center">
         <Avatar 
  alt={comment.username} 
  src={
    profilePictures[comment.userId] && profilePictures[comment.userId].contentType
      ? `data:${profilePictures[comment.userId].contentType};base64,${profilePictures[comment.userId].data}`
      : ''
  } 
/>

          <Box marginLeft={2}>
            <Typography variant="subtitle2" fontWeight="bold">{comment.username}</Typography>
            <Typography variant="body1">{comment.text}</Typography>
          </Box>
        </Box>
      ))}
      {/* Add new comment */}
      <Box display="flex" alignItems="center" marginTop={2}>
        <TextField
          label="Add a comment"
          variant="outlined"
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          multiline
          rows={3}
          size="small"
        />
        <Button variant="contained" color="primary" onClick={handleAddComment} style={{ marginLeft: '8px' }}>
          Comment
        </Button>
      </Box>
    </Box>
  );
};

export default CommentSection;
