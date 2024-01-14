import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import { theme } from '../Home/theme';

// Apply the styles using styled(Box)
const FormWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: "1.5rem 1.5rem 0.75rem 1.5rem",
  backgroundColor: theme.palette.secondary.main,
  borderRadius: "0.75rem",
  boxShadow: "none",  // Remove the shadow
  maxWidth: "300px", // Adjust the max width as needed
  margin: "auto", // Center the Wrapper
}));

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      
      const response = await axios.post('http://localhost:5000/api/login', loginData);
      const { status, profileupdate } = response.data.user;
      
      if (status === 'Inactive') {
        // Hide loading state if needed
        // You can set setIsLoading(false) here
        setErrorMessage('Authentication rejected. User is inactive.');
        return;
      }
      localStorage.setItem('token', response.data.token);
      if (profileupdate === 'Done') {
        navigate('/home');
      } else {
        navigate('/profile');
      }

    } catch (error) {
      if (error.response.status === 401) {
        setErrorMessage('Incorrect Email or Password');
      } else if (error.response.status === 404) {
        setErrorMessage('User not found. Check your email.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      console.error('Login failed:', error.response.data.message);
    }
  };
  const handleTextFieldFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleTextFieldBlur = () => {
    setFocusedField('');
  };
  return (
    <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    height="100vh"
    backgroundColor={theme.palette.primary.main}
  >
    <FormWrapper>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {focusedField && (
  <Typography variant="body2" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
    Enter {focusedField.toLowerCase()}
  </Typography>
)}
      <form className="login-form">
        <TextField
          label="Email"
          type="email"
          name="email"
          onChange={handleInputChange}
          onFocus={() => handleTextFieldFocus('Email')}
          onBlur={handleTextFieldBlur}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          onChange={handleInputChange}
          onFocus={() => handleTextFieldFocus('Password')}
          onBlur={handleTextFieldBlur}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleLogin} style={{ marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '1rem' }}>
          Login
        </Button>
       
      
        {errorMessage && <Typography variant="body2" color="error">{errorMessage}</Typography>}
      </form>
    </FormWrapper>
    
  </Box>
  
  );
};

export default Login;







