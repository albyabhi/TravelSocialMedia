import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, Typography, styled, AppBar, Toolbar } from "@mui/material";
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
  position: "relative",
  padding: "1.5rem 1.5rem 0.75rem 1.5rem",
  width: "100%",
  maxWidth: "600px", // Adjust the max width as needed
  margin: "auto", // Center the Wrapper
  transform: "scale(1.3)", // Use transform to scale
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.palette.primary.main,
    borderRadius: "0.75rem",
    opacity: 0.7, // Adjust the opacity value as needed
    zIndex: -1,
  },
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
              <FormContainer>
                <Input
                  placeholder="Username"
                  type="text"
                  name="username"
                  className="sign-up-input"
                  onChange={handleInputChange}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  name="email"
                  className="sign-up-input"
                  onChange={handleInputChange}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  name="password"
                  className="sign-up-input"
                  onChange={handleInputChange}
                />
                <Button
                  variant="contained"
                  color="primary"
                  className="sign-up-button"
                  onClick={handleSignup}
                >
                  Sign Up
                </Button>
              </FormContainer>
            </Wrapper>
          </Box>
        </Box>
      </StyledBgImage>
    </>
  );
};

export default Signup;
