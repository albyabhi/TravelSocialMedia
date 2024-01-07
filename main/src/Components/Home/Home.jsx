import React, { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Feed from './Feed';
import Sidebar from './Sidebar';
import { Box, Stack } from '@mui/material';
import Navbar from './Navbar';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = location.state?.token || localStorage.getItem('token');

  // Wrap fetchData in useCallback to memoize it
  const fetchData = useCallback(async () => {
    try {
      // If the token is not available, navigate to the login page
      if (!token) {
        navigate('/login');
        return;
      }

      // If there's a token, you can perform your data fetching logic here
      // For example, you can make an authenticated API request using the token

      console.log('Fetching data with token:', token);

    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors based on your application's requirements
    }
  }, [navigate, token]);

  useEffect(() => {
    // Call fetchData when the component mounts
    fetchData();
  }, [fetchData, token]); // Ensure the effect runs whenever the token changes

  return (
    <Box sx={{ margin: 0, padding: 0 }}>
      <Navbar />
      <Stack direction="row" spacing={1} justifyContent="space-between">
        <Sidebar />
        <Feed token={token} />
      </Stack>
    </Box>
  );
};

export default Home;
