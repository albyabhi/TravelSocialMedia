// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Login/Login.css'

const Login = () => {

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      console.log('Login data:', loginData);
      const response = await axios.post('http://localhost:5000/api/login', loginData);
      localStorage.setItem('token', response.data.token);
      console.log(response.data); // You can handle success or redirect to the main page
      navigate('/profile');
    } catch (error) {  
      if (error.response.status === 401) {
        setErrorMessage('incorrect Email or Password');
      } else if (error.response.status === 404) {
        setErrorMessage('User not found. Check your email.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      console.error('Login failed:', error.response.data.message);
    }
  };

  return (
    <div className="login-container">
      <div className='Card-container' 
      
      
      >
  <h2>Login</h2>
  <form className="login-form">
    <label>Email:</label>
    <input type="email" name="email" className="login-input" onChange={handleInputChange} />

    <label>Password:</label>
    <input type="password" name="password" className="login-input" onChange={handleInputChange} />

    <button type="button" className="login-button" onClick={handleLogin}>
      Login
    </button>
    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
  </form>
  </div>
</div>

  );
};

export default Login;
