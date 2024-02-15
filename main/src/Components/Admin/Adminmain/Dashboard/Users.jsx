// Users.jsx
import React, { useState, useEffect } from 'react';
import Sidenav from '../Dashboard/Sidenav';
import Navbar from '../Dashboard/Navbar';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Users = () => {
  const [userData, setUserData] = useState([]);

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
      await axios.delete(`http://localhost:5000/api/usersdel/${userId}`);
      console.log(`Delete user with ID: ${userId}`);
      fetchUserData();
    } catch (error) {
      console.error('Error deleting user:', error.response ? error.response.data.message : error.message);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await axios.put(`http://localhost:5000/api/users/${userId}/status`, { status: newStatus });
      console.log(`User status updated for ID ${userId} to ${newStatus}`);
      fetchUserData();
    } catch (error) {
      console.error('Error updating user status:', error.response ? error.response.data.message : error.message);
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

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userData?.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <button onClick={() => handleDeleteUser(user._id)}><DeleteForeverIcon /></button>
                    </TableCell>
                    <TableCell>
                      <button onClick={() => handleStatusToggle(user._id, user.status)}>
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
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
