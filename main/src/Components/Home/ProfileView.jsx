import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Grid, Paper, Avatar, Typography, Box, Tab, Tabs } from '@mui/material';
import styled from '@emotion/styled';
import { theme } from './theme'; // Import the theme object

const StyledPaper = styled(Paper)`
  padding: ${theme.spacing(3)};
  margin-bottom: ${theme.spacing(3)};
  background-color: ${theme.palette.secondary.main};
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledAvatar = styled(Avatar)`
  width: ${theme.spacing(20)};
  height: ${theme.spacing(20)};
  margin: auto;
`;

const StyledTypography = styled(Typography)`
  margin-bottom: ${theme.spacing(2)};
`;

const ProfileView = () => {
  const [profileData, setProfileData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [posts, setPosts] = useState([]);
  const [hoveredPost, setHoveredPost] = useState(null);

  const { userId } = useParams();
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    const fetchUserPosts = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/posts/user/${userId}`);
          console.log('User Posts:', response.data);
          setPosts(response.data);
        } catch (error) {
          console.error('Error fetching user posts:', error);
        }
      };

    fetchProfileData();
    fetchUserPosts();
  }, [userId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!userId) {
    return <p>No user ID provided.</p>;
  }

  return (
    <Box m={{ xs: 2, md: 0 }}> {/* Add margin for extra small and medium breakpoints */}
      
      {profileData ? (
        <Grid container justifyContent="center" spacing={4}>
          <Grid item xs={12} md={8}>
            <StyledPaper>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={4}>
                  <StyledAvatar 
                    alt="Profile Picture" 
                    src={`data:${profileData.profilePicture.contentType};base64,${profileData.profilePicture.data}`} 
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <StyledTypography variant="h5" gutterBottom style={{ color: '#333', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Personal Information</StyledTypography>
                  <StyledTypography variant="subtitle1"><strong>Username:</strong> {profileData.username}</StyledTypography>
                  <StyledTypography variant="subtitle1"><strong>Bio:</strong> {profileData.bio}</StyledTypography>
                  <StyledTypography variant="subtitle1"><strong>Email:</strong> {profileData.email}</StyledTypography>
                  <StyledTypography variant="subtitle1"><strong>Phone Number:</strong> {profileData.phoneNumber}</StyledTypography>
                </Grid>
              </Grid>
            </StyledPaper>
            <StyledPaper>
              <StyledTypography variant="h5" gutterBottom style={{ color: '#333', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Highlighted Places</StyledTypography>
              {profileData.highlightedPlaces && profileData.highlightedPlaces.length > 0 ? (
  <ul>
    {profileData.highlightedPlaces.map((place, index) => (
      <li key={index}>
        {typeof place === 'object' ? place.label : place}
      </li>
    ))}
  </ul>
) : (
  <StyledTypography variant="subtitle1">No highlighted places found.</StyledTypography>
)}
            </StyledPaper>
            {/* Third Section with Tabs */}
            <StyledPaper>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Posts" />
                <Tab label="Travel Guides" />
              </Tabs>
              {tabValue === 0 && (
                  <div>
                    <Typography variant="h5" gutterBottom style={{ color: '#333', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Posts</Typography>
                    <Grid container spacing={3}>
                      {posts.map((post) => (
                        <Grid item xs={12} sm={6} md={4} key={post.postId}>
                          <Paper
                            style={{
                              marginBottom: '10px',
                              borderRadius: '15px',
                              overflow: 'hidden',
                              position: 'relative',
                            }}
                            onMouseEnter={() => setHoveredPost(post.postId)}
                            onMouseLeave={() => setHoveredPost(null)}
                          >
                            {post.postImage && (
                              <div
                                style={{
                                  position: 'relative',
                                  width: '100%',
                                  paddingTop: '100%',
                                  overflow: 'hidden',
                                }}
                              >
                                <img
                                  src={`data:${post.postImage.contentType};base64,${post.postImage.data}`}
                                  alt="Post"
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '15px',
                                    filter: hoveredPost === post.postId ? 'blur(5px)' : 'none',
                                    transition: 'filter 0.3s ease-in-out',
                                  }}
                                />
                                {hoveredPost === post.postId && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: '50%',
                                      left: '50%',
                                      transform: 'translate(-50%, -50%)',
                                      padding: '5px',
                                    }}
                                  >
                                    <Typography variant="body2" style={{ color: 'white' }}>{post.likes.length} Likes </Typography>
                                  </div>
                                )}
                              </div>
                            )}
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                )}
              {tabValue === 1 && (
                <div>
                  {/* Content for Travel Guides tab */}
                  <Typography variant="h5" gutterBottom style={{ color: '#333', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Travel Guides</Typography>
                  {/* Add content for the Travel Guides tab */}
                </div>
              )}
            </StyledPaper>
          </Grid>
        </Grid>
      ) : (
        <p>Loading profile data...</p>
      )}
    </Box>
  );
};

export default ProfileView;
