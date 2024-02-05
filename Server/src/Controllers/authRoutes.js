const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Import the User model
const { authenticateToken } = require("../middleware/authMiddleware.js");
const ProfileData = require("../models/profileDataModel");
const config = require("../config/config");
const secretKey = config.secretKey;
const upload = require("../uploads/upload");
const fs = require('fs');
const { Location } = require("../models/locationModels");


const router = express.Router();

// Signup Endpoint
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // Hash the user password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: passwordHash, // Save the hashed password
    });

    // Save the user to the database (password will be automatically hashed)
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Signup failed:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Login Endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists and if the password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });

    // Include additional user information in the response
    res.json({
      token,
      user: {
        status: user.status,
        profileupdate: user.profileupdate,
      },
    });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Protected route for testing authentication
router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Protected route accessed successfully." });
});

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch user data from the User collection using userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Fetch profile data from the ProfileData collection using userId
    const profileData = await ProfileData.findOne({ userId });

    // Combine user and profile data into a single object
    const userProfile = {
      userId: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: profileData?.bio || "", // Use profileData for bio
      highlightedPlaces: user.highlightedPlaces,
      firstName: profileData?.firstName || "",
      lastName: profileData?.lastName || "",
      phoneNumber: profileData?.phoneNumber || "",
    };

    res.json(userProfile);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});



// update profile
router.post("/profile/update",authenticateToken,upload.single("profilePicture"),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      console.log('Received Request Body:', req.body);
      // Fetch the existing user data
      const existingUser = await User.findById(userId);

      // Verify that the user exists
      if (!existingUser) {
        return res.status(404).json({ message: "User not found." });
      }

      if (req.body.username !== undefined && req.body.username.trim() !== "") {
        existingUser.username = req.body.username.trim();
      }

      // Update user data based on the received data
      if (req.body.bio !== undefined && req.body.bio.trim() !== "") {
        existingUser.bio = req.body.bio.trim();
      }

      if (req.file) {
        // Read the file as binary data
        const fileData = fs.readFileSync(req.file.path);
  
        // Encode the binary data to Base64
        const base64Data = fileData.toString('base64');
  
        // Update profile picture in the format you specified
        existingUser.profilePicture = {
          data: base64Data,
          contentType: req.file.mimetype,
        };
       
      }
      const highlightedPlaces = req.body.highlightedPlaces || [];
      const highlightedPlaceIds = highlightedPlaces.map((location) => location.value);

      // Save the updated user data to the database
      existingUser.profileupdate = 'Done';
      await existingUser.save();

      // Update or create ProfileData entry
      const updatedProfileData = await ProfileData.findOneAndUpdate(
        { userId: userId },
        {
          bio:
            req.body.bio !== undefined && req.body.bio.trim() !== ""
              ? req.body.bio.trim()
              : existingUser.bio,
              username:
              req.body.username !== undefined
                ? req.body.username
                : existingUser.username, 
                highlightedPlaces:
                req.body.highlightedPlaces !== undefined &&
                req.body.highlightedPlaces.length > 0
                  ? req.body.highlightedPlaces.map((location) => ({
                      value: location.value,
                      label: location.label,
                    }))
                  : existingUser.highlightedPlaces,
          profilePicture: existingUser.profilePicture,
          firstName:
            req.body.firstName !== undefined
              ? req.body.firstName
              : existingUser.firstName,
          lastName:
            req.body.lastName !== undefined
              ? req.body.lastName
              : existingUser.lastName,
          phoneNumber:
            req.body.phoneNumber !== undefined
              ? req.body.phoneNumber
              : existingUser.phoneNumber,
        },
        { upsert: true, new: true }
      );

      
      

      res.json({
        message: "Profile updated successfully.",
        updatedUser: existingUser,
        updatedProfileData,
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res
        .status(500)
        .json({ message: "Internal server error.", error: error.message });
    }
  }
);


// Fetch details of saved locations based on IDs
router.get('/profiledata/savedlocations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch the ProfileData for the user
    const profileData = await ProfileData.findOne({ userId });

    // Check if the profileData exists and has highlightedPlaces
    if (!profileData || !profileData.highlightedPlaces || profileData.highlightedPlaces.length === 0) {
      console.log("No highlighted places found for user:", userId);
      return res.status(200).json([]); // Return an empty array if no highlighted places are found
    }

    // Extract the labels from highlightedPlaces
    const savedLocationLabels = profileData.highlightedPlaces.map(location => location.label);

    console.log("Saved location labels for user:", userId, savedLocationLabels);
    res.status(200).json(savedLocationLabels);
  } catch (error) {
    console.error('Error fetching saved location labels:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

//fetctprofiledata
router.get('/profiledata', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch profile data from the ProfileData collection using userId
    const profileData = await ProfileData.findOne({ userId });

    if (!profileData) {
      return res.status(404).json({ message: 'Profile data not found.' });
    }

    res.json(profileData);
  } catch (error) {
    console.error('Error fetching profile data:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Fetch profilepicture data by user ID
router.get('/profiledata/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch profile data from the ProfileData collection using userId
    const profileData = await ProfileData.findOne({ userId });

    if (!profileData) {
      return res.status(404).json({ message: 'Profile data not found.' });
    }

    res.json(profileData);
  } catch (error) {
    console.error('Error fetching profile data by user ID:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

//fetch by userId
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch user data from the User collection using userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Fetch profile data from the ProfileData collection using userId
    const profileData = await ProfileData.findOne({ userId });

    // Combine user and profile data into a single object
    const userProfile = {
      userId: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: profileData?.bio || "", // Use profileData for bio
      highlightedPlaces: user.highlightedPlaces,
      firstName: profileData?.firstName || "",
      lastName: profileData?.lastName || "",
      phoneNumber: profileData?.phoneNumber || "",
    };

    res.json(userProfile);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

//search user by username
router.get("/users/search", async (req, res) => {
  try {
    const { username } = req.query;

    // Ensure that the username parameter is not empty
    if (!username || username.trim() === "") {
      return res.status(400).json({ message: "Invalid username parameter." });
    }

    // Use a case-insensitive regular expression for partial match
    const users = await User.find({ username: new RegExp(username, 'i') });

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    // Create an array of simplified user objects with relevant details
    const foundUsers = await Promise.all(users.map(async (user) => {
      // Fetch profile data from the ProfileData collection using userId
      const profileData = await ProfileData.findOne({ userId: user._id });

      return {
        userId: user._id,
        username: user.username,
        profilePicture: profileData?.profilePicture || user.profilePicture,
      };
    }));

    res.json(foundUsers);
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


// user fetch for admin
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

//delete user by id database

router.delete("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Perform deletion in the database
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.put("/users/:userId/status", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Toggle the user's status
    user.status = user.status === 'Active' ? 'Inactive' : 'Active';

    // Save the updated user status to the database
    await user.save();

    res.json({ message: `User status toggled successfully. New status: ${user.status}` });
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});



module.exports = router;