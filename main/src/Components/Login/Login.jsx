import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import { theme } from "../Home/theme";
import logo from "../Assets/main.png"
import Bgimage from "../Assets/loginbg.png"
import { InputLabel } from "@mui/material";

// Apply the styles using styled(Box)
const FormWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "1.5rem 1.5rem 0.75rem 1.5rem",
  backgroundColor: `rgba(255, 255, 255, 0.3)`, // Adjust the opacity as needed
  borderRadius: "0.75rem",
  backdropFilter: "blur(4px)", // Apply blur effect
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)", // Add shadow for depth
  maxWidth: "300px", // Adjust the max width as needed
  margin: "auto", // Center the Wrapper
}));

const Login = ({ setAuth }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        loginData
      );
      const { status, profileupdate } = response.data.user;

      if (status === "Inactive") {
        // Hide loading state if needed
        // You can set setIsLoading(false) here
        setErrorMessage("Authentication rejected. User is inactive.");
        return;
      }
      localStorage.setItem("token", response.data.token);
      setAuth(true);
      if (profileupdate === "Done") {
        navigate("/home");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      if (error.response.status === 401) {
        setErrorMessage("Incorrect Email or Password");
      } else if (error.response.status === 404) {
        setErrorMessage("User not found. Check your email.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      console.error("Login failed:", error.response.data.message);
    }
  };

  const handleTextFieldFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleTextFieldBlur = () => {
    setFocusedField("");
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      backgroundColor={theme.palette.primary.main}
      style={{
        backgroundImage: `url(${Bgimage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <FormWrapper>
      <img src={logo} alt="NomadGram Logo" style={{ width: "200px", marginBottom: "1rem" }} />

        
        <form className="login-form">
          <InputLabel>Email</InputLabel>
          <TextField
            type="email"
            name="email"
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <InputLabel>Password</InputLabel>
          <TextField
            type="password"
            name="password"
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            style={{
              marginLeft: "50%",
              transform: "translateX(-50%)",
              marginTop: "1rem",
            }}
          >
            Login
          </Button>
          <Box style={{ textAlign: "center" }}>
            <Typography variant="body2" style={{ marginTop: "1rem" }}>
              New user? <Link to="/">Signup</Link>
            </Typography>
          </Box>
          {errorMessage && (
            <Typography variant="body2" color="error">
              {errorMessage}
            </Typography>
          )}
        </form>
      </FormWrapper>
    </Box>
  );
};

export default Login;
