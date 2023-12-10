// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();

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
      console.error('Login failed:', error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form>
        <label>Email:</label>
        <input type="email" name="email" onChange={handleInputChange} />

        <label>Password:</label>
        <input type="password" name="password" onChange={handleInputChange} />

        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
