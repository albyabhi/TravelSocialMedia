import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import PostWidget from './Widgets/PostWidget';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

// Styled Typography component for location title
const LocationTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  textAlign: 'center',
}));

const LocationView = () => {
  const [posts, setPosts] = useState([]);
  const { locationId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  useEffect(() => {
    console.log('Location ID:', locationId);
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/posts/location/${locationId}`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [locationId]);

  return (
    
    <div>
       
      {/* Display location name instead of ID */}
      <Navbar />
      <LocationTitle variant="h4" gutterBottom>
        Location: {/* Replace locationId with the actual location name */}
      </LocationTitle>
      <Grid container spacing={2} justifyContent="center">
        {/* Map through the posts array and render PostWidget for each post */}
        {posts.map((post) => (
          <Grid item key={post._id} xs={12} sm={6} md={4} lg={3}>
            {/* Render the PostWidget component and pass the post data as props */}
            <PostWidget post={post} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default LocationView;
