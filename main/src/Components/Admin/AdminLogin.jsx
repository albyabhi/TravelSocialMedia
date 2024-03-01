import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { InputLabel } from "@mui/material";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [loginData, setLoginData] = useState({
    adminId: "",
    adminPassword: "",
  });

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginNavigate = () => {
    navigate('/adminsignup');
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/admin/login",
        loginData
      );
      localStorage.setItem("adminToken", response.data.token);
      navigate("/admindashboard");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage("Incorrect Admin ID or Password");
        } else if (error.response.status === 404) {
          setErrorMessage("Admin not found. Check your Admin ID.");
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
        console.error("Login failed:", error.response.data.message);
      } else {
        setErrorMessage("Network error. Please try again later.");
        console.error("Network error:", error.message);
      }
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        
      }}
    >
      <Paper elevation={3} style={{ padding: "20px" , backgroundColor: "#ADD2C9" }}>
        <Typography
          variant="h5"
          component="div"
          style={{ marginBottom: "20px" ,  textAlign: "center"   }}
        >
         NomadGram Admin Login
        </Typography>
        <form className="login-form admin-form" noValidate>
        <InputLabel>Admin ID</InputLabel>
        <TextField
  fullWidth
  required
  id="adminId"
  name="adminId"
  type="text"
  
  onChange={handleInputChange}
  value={loginData.adminId}
  style={{ marginBottom: '20px' }}
  InputLabelProps={{
    shrink: true,
  }}
/>
<InputLabel>Password</InputLabel>
<TextField
  fullWidth
  required
  id="adminPassword"
  name="adminPassword"
  type="password"
  
  onChange={handleInputChange}
  value={loginData.adminPassword}
  style={{ marginBottom: '20px' }}
  InputLabelProps={{
    shrink: true,
  }}
/>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogin}
            style={{ marginTop: "20px" }}
          >
            Login
          </Button>
          <Typography variant="body2"  onClick={handleLoginNavigate} style={{ cursor: 'pointer', marginTop: '8px' }}>
                Not Registered ? Signup
              </Typography>
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </form>
      </Paper>
    </Container>
  );
};

export default AdminLogin;
