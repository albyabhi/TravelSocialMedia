
import React, { useState } from 'react';
import axios from 'axios';
import './style/Admsignup.css';
import { useNavigate } from "react-router-dom";



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
      e.preventDefault();
      console.log('Sending data:', adminData);
  
      const response = await axios.post('http://localhost:5000/admin/signup', adminData);
      console.log('Response:', response.data);
      
      if (response.data.message === 'Admin registered successfully.') {
        navigate('/adminlogin');
      }
      
    } catch (error) {
      console.error('Admin registration failed:', error.response.data.message);
    }
  };

  return (
    <div className="admin-form-container">
      <h2 className="admin-form-heading">Admin Registration</h2>
      <form className="admin-form">
        <label>
          Admin Email:
          <input
            type="email"
            name="adminEmail"
            onChange={handleInputChange}
          />
        </label>

        <label>
          Admin ID:
          <input
            type="text"
            name="adminId"
            onChange={handleInputChange}
          />
        </label>

        <label>
          Admin Password:
          <input
            type="password"
            name="adminPassword"
            onChange={handleInputChange}
          />
        </label>

        <button
          type="button"
          onClick={handleFormSubmit}
        >
          Register Admin
        </button>
      </form>
    </div>
  );
};

export default AdminSignup;
