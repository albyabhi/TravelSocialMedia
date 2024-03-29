const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/authMiddleware');
const User = require("../models/userModel");
const ProfileData = require("../models/profileDataModel");
const  Post = require('../models/postModel');
const upload = require('../uploads/upload');
const fs = require('fs');
const Location = require('../models/locationModels'); // Adjust the import path as needed

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

    console.log('Received Request Body:', req.body);
  console.log('Received File:', req.file);


    // Create a new post
    const newPost = new Post({
      userId,
      postId: generatePostId(),
      description: req.body.description,
      postImage: {},
      location: req.body.location,  // Use locationDetails instead of locationId
    });

    // Handle post image upload logic
    if (req.file) {
      console.log('File Size:', req.file.size);
      console.log('File Path:', req.file.path);
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
  const timestamp = (new Date()).getTime();
  return mongoose.Types.ObjectId.createFromTime(timestamp).toString();
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
router.get('/user/:userId', async (req, res) => {
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
  

  // Delete a post by postId
  router.delete('/deleteposts/:postId', authenticateToken, async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = req.user;
  
      // Validate if postId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'Invalid post ID format.' });
      }
  
      // Find the post by postId
      const post = await Post.findById(postId);
  
      // Check if the post exists
      if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
      }
  
      // Check if the authenticated user is the owner of the post
      if (!post.userId.equals(userId)) {
        return res.status(403).json({ message: 'Unauthorized: You are not the owner of this post.' });
      }
  
      // Delete the post
      await Post.deleteOne({ _id: postId });
  
      res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });

  

// Like a post
router.post('/like/:Id', authenticateToken, async (req, res) => {
  try {
    const { Id } = req.params;
    const { userId } = req.user;

    // Validate if Id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(Id)) {
      return res.status(400).json({ message: 'Invalid post ID format.' });
    }

    const post = await Post.findById(Id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const existingLikeIndex = post.likes.findIndex(like => like.userId.equals(userId));

    if (existingLikeIndex !== -1) {
      // User already liked the post, remove the like
      post.likes.splice(existingLikeIndex, 1);
      await post.save();
      console.log('unliked');
      return res.status(200).json({ message: 'Post unliked successfully.' });
    } else {
      // User hasn't liked the post, add the like
      post.likes.push({ userId });
      await post.save();
      console.log('liked');
      return res.status(200).json({ message: 'Post liked successfully.' });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Comment on a post
router.post('/comment/:postId', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.user;
    const { text } = req.body;

    const post = await Post.findById(postId); // Use Post model instead of PostModel

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    post.comments.push({ userId, text });
    await post.save();
    console.log('Comment added:', text);

    res.status(200).json({ message: 'Comment added successfully.' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


//fetch comments
router.get('/fetchcomments/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the post by ID
    const post = await Post.findById(postId).populate({
      path: 'comments',
      populate: {
        path: 'userId',
        model: 'User', // Reference the User model
        select: 'username profilePicture', // Select only the username and profilePicture fields
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Extract relevant comment information along with username and profile picture
    const comments = post.comments.map(comment => ({
      text: comment.text,
      userId: comment.userId._id, // Add userId
      username: comment.userId.username,
      profilePicture: comment.userId.profilePicture,
    }));

    res.status(200).json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



router.get('/like/count/:postId', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.user;

    // Validate if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post ID format.' });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const likeCount = post.likes.length;

    // Check if the user has already liked the post
    const alreadyLiked = post.likes.some(like => like.userId.equals(userId));
    const likeStatus = alreadyLiked ? 'liked' : 'like';

    res.status(200).json({ count: likeCount, likeStatus });
  } catch (error) {
    console.error('Error fetching like count:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


// Fetch posts by location ID
router.get('/location/:locationId', async (req, res) => {
  try {
    const { locationId } = req.params;

    // Fetch posts from the database based on location ID
    const posts = await Post.find({ 'location.value': locationId });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for the provided location ID.' });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts by location:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
