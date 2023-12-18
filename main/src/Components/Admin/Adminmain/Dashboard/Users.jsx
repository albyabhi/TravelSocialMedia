// Users.jsx
import React, { useState, useEffect } from 'react';
import Sidenav from '../Dashboard/Sidenav';
import Navbar from '../Dashboard/Navbar';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const Users = () => {
  const [userData, setUserData] = useState([]);

  // Define fetchUserData function here
  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error.response ? error.response.data.message : error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      console.log(`Delete user with ID: ${userId}`);
      // After deletion, fetch the updated user data
      fetchUserData();
    } catch (error) {
      console.error('Error deleting user:', error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <>
      <Navbar />
      <Box height={30} />

      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h1>User Management</h1>

          {/* Display User List in a Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(userData) && userData.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {/* Button to Delete User */}
                      <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default Users;
