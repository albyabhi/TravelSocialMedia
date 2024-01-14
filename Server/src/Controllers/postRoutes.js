const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const User = require("../models/userModel");
const ProfileData = require("../models/profileDataModel");
const  Post = require('../models/postModel');
const upload = require('../uploads/upload');
const fs = require('fs');
router.post('/newposts', authenticateToken, upload.single('postImage'), async (req, res) => {
  try {
    // Get userId from authenticated user
    const userId = req.user.userId;

    // Fetch the existing user data
    const existingUser = await User.findById(userId);

    // Verify that the user exists
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Fetch the location details from the request
    const { location } = req.body;

    console.log('Location name:', location); // Add this line for logging

    // Create a new post
    const newPost = new Post({
      userId,
      postId: generatePostId(),
      description: req.body.description,
      postImage: {},
      location,
      
    });

    // Handle post image upload logic
    if (req.file) {
      // Read the file as binary data
      const fileData = fs.readFileSync(req.file.path);

      // Encode the binary data to Base64
      const base64Data = fileData.toString('base64');

      // Update post image in the format you specified
      newPost.postImage = {
        data: base64Data,
        contentType: req.file.mimetype,
      };
    }

    // Save the post to the database
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


function generatePostId() {
    return 'POST_' + Date.now();
}

// Fetch posts based on userId and postId
router.get('/posts/:userId/:postId', async (req, res) => {
    try {
      const { userId, postId } = req.params;
  
      // Fetch posts from the database based on userId and postId
      const posts = await Post.find({ userId, postId });
  
      if (!posts || posts.length === 0) {
        return res.status(404).json({ message: 'No posts found for the provided userId and postId.' });
      }
  
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });


// Fetch posts for a specific user
router.get('/posts/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch posts for the specified user from the database
    const userPosts = await Post.find({ userId })
      .populate('userId', 'username avatar profilePicture') // Populate user information
      .exec();

    res.status(200).json(userPosts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Fetch all posts
router.get('/all', async (req, res) => {
    try {
      // Fetch all posts from the database
      const posts = await Post.find();
  
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching all posts:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  

module.exports = router;
