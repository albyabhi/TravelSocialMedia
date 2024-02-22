import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, CssBaseline, Grid, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Center } from '../Admin/Adminmain/Center';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    adminEmail: '',
    adminId: '',
    adminPassword: '',
  });

  const handleInputChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault(); // Prevent default form submission
      
      const response = await axios.post('http://localhost:5000/admin/signup', adminData);
      console.log('Response:', response.data);

      if (response.data.message === 'Admin registered successfully.') {
        navigate('/adminlogin');
      }
    } catch (error) {
      console.error('Admin registration failed:', error.response.data.message);
      // Handle error display or other actions here
    }
  };

  return (
    <Center>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper elevation={3} style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5" component="div" gutterBottom>
            Admin Registration
          </Typography>
          <form style={{ width: '100%', marginTop: '8px' }} onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Admin Email"
                  type="email"
                  name="adminEmail"
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Admin ID"
                  type="text"
                  name="adminId"
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Admin Password"
                  type="password"
                  name="adminPassword"
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: '16px', alignSelf: 'flex-end' }}
            >
              Register Admin
            </Button>
          </form>
        </Paper>
      </Container>
    </Center>
  );
};

export default AdminSignup;
