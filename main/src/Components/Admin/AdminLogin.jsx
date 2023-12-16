import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  
  const handleLogin = async () =>{
    try{
        console.log('Login data:', loginData);
        const response = await axios.post('http://localhost:5000/admin/login', loginData);
        localStorage.setItem('token', response.data.token); 
    }catch (error) {  
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
    <div>
    <div className="login-container">
      <div className="Card-container admin-form-container"> {/* Add the admin form class */}
        <h2 className="admin-form-heading">Admin Login</h2>
        <form className="login-form admin-form">
          <label>Admin ID:</label>
          <input
            type="text"
            name="adminId"
            onChange={handleInputChange}
          />

          <label>Password:</label>
          <input
            type="password"
            name="adminPassword"
            onChange={handleInputChange}
          />

          <button
            type="button"
            onClick={handleLogin}
          >
            Login
          </button>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
      </div>
    </div>
  </div>
  );
};

export default AdminLogin;
