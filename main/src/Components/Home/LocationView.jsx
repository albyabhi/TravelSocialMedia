import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Grid, Typography, CircularProgress } from '@mui/material';
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
  const [loading, setLoading] = useState(true);
  const { locationId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/posts/location/${locationId}`);
        setPosts(response.data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchPosts();
  }, [locationId]);

  return (
    <div >
      {/* Display location name instead of ID */}
      <Navbar />
      <div style={{ marginTop: '20px' }}>
      {loading ? ( // Display CircularProgress if loading is true
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress  sx={{ color: 'black' }} />
        </div>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {posts.length === 0 ? (
            <Typography variant="body1" align="center">No post posted on this Location</Typography>
          ) : (
            // Map through the posts array and render PostWidget for each post
            posts.map((post) => (
              <Grid item key={post._id} xs={12} sm={6} md={4} lg={3}>
                {/* Render the PostWidget component and pass the post data as props */}
                <PostWidget post={post} />
              </Grid>
            ))
          )}
        </Grid>
      )}
      </div>
    </div>
  );
};

export default LocationView;
