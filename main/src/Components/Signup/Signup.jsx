import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Typography, styled, AppBar, Toolbar, TextField } from "@mui/material";
import Logo from "../Assets/main.png";
import Bgimage from "../Assets/pg.png";

const StyledBgImage = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${Bgimage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  width: "100%",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}));

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "1.5rem 1.5rem 0.75rem 1.5rem",
  backgroundColor: `rgba(255, 255, 255, 0.3)`, // Adjust the opacity as needed
  borderRadius: "0.75rem",
  backdropFilter: "blur(4px)", // Apply blur effect
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)", // Add shadow for depth
  maxWidth: "300px", // Match the maxWidth of the login form
  margin: "auto", // Center the Wrapper
}));

const FormContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: "transparent", // Set the background to transparent
  boxShadow: "none", // Remove the box shadow
  zIndex: theme.zIndex.drawer + 1,
}));

const CenteredLogo = styled("div")({
  display: "flex",
  alignItems: "center",
  flexGrow: 1, // Grow to fill the available space
});

const Signup = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [focusedField, setFocusedField] = useState('');
  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/signup", userData);

      if (response && response.data) {
        console.log(response.data);
        navigate("/login");
      } else {
        console.error("Signup failed: No data in response");
      }
    } catch (error) {
      console.error("Signup failed:", error.response ? error.response.data.message : error.message);
    }
  };

  const handleTextFieldFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleTextFieldBlur = () => {
    setFocusedField('');
  };

  return (
    <>
      <StyledAppBar position="static">
        <Toolbar>
          <Box flexGrow={1} />
          <CenteredLogo>
            <img src={Logo} alt="My Logo" style={{ height: "40px", marginRight: "20px" }} />
          </CenteredLogo>
        </Toolbar>
      </StyledAppBar>

      <StyledBgImage>
        <Box display="flex" flexDirection="column" minHeight="100vh">
          {/* Content */}
          <Box display="flex" flex={1} justifyContent="center" alignItems="center">
            <Wrapper>
              <Typography variant="h5" gutterBottom>
                Sign Up
              </Typography>
              {focusedField && (
                <Typography
                  variant="body2"
                  style={{
                    marginTop: '0.5rem',
                    textAlign: 'center',
                    opacity: focusedField ? 1 : 0,
                    visibility: focusedField ? 'visible' : 'hidden',
                    transition: 'opacity 0.5s ease-in-out, visibility 0.5s ease-in-out', // Add transition property
                  }}
                >
                  Enter {focusedField.toLowerCase()}
                </Typography>
              )}
              <FormContainer>
                <TextField
                  label="Username"
                  type="text"
                  name="username"
                  className="sign-up-input"
                  onChange={handleInputChange}
                  onFocus={() => handleTextFieldFocus('Username')}
                  onBlur={handleTextFieldBlur}
                  variant="outlined" // Add outlined variant
                  fullWidth // Take full width
                />
                <TextField
                  label="Email"
                  type="email"
                  name="email"
                  className="sign-up-input"
                  onChange={handleInputChange}
                  onFocus={() => handleTextFieldFocus('Email')}
                  onBlur={handleTextFieldBlur}
                  variant="outlined" // Add outlined variant
                  fullWidth // Take full width
                />
                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  className="sign-up-input"
                  onChange={handleInputChange}
                  onFocus={() => handleTextFieldFocus('Password')}
                  onBlur={handleTextFieldBlur}
                  variant="outlined" // Add outlined variant
                  fullWidth // Take full width
                />
                <Button
                  variant="contained"
                  color="primary"
                  className="sign-up-button"
                  onClick={handleSignup}
                >
                  Sign Up
                </Button>

                <Typography variant="body2" style={{ textAlign: "center" }}>
                  Already a user? <Link to="/login">Login</Link>
                </Typography>
              </FormContainer>
            </Wrapper>
          </Box>
        </Box>
      </StyledBgImage>
    </>
  );
};

export default Signup;
