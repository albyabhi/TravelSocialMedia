import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { Center } from '../Admin/Adminmain/Center';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [loginData, setLoginData] = useState({
    adminId: '',
    adminPassword: '',
  });

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/admin/login', loginData);
      localStorage.setItem('adminToken', response.data.token);
      navigate('/admindashboard');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('Incorrect Admin ID or Password');
        } else if (error.response.status === 404) {
          setErrorMessage('Admin not found. Check your Admin ID.');
        } else {
          setErrorMessage('An unexpected error occurred. Please try again.');
        }
        console.error('Login failed:', error.response.data.message);
      } else {
        setErrorMessage('Network error. Please try again later.');
        console.error('Network error:', error.message);
      }
    }
  };

  return (
    <Center>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} className="admin-form-container">
          <Typography variant="h5" component="div" className="admin-form-heading">
            Admin Login
          </Typography>
          <form className="login-form admin-form" noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Admin ID"
              name="adminId"
              autoComplete="adminId"
              autoFocus
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              name="adminPassword"
              autoComplete="current-password"
              onChange={handleInputChange}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleLogin}
              style={{ marginTop: '20px' }}
            >
              Login
            </Button>
            {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}
          </form>
        </Paper>
      </Container>
    </Center>
  );
};

export default AdminLogin;
