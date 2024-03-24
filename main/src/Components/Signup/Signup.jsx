import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  styled,
  AppBar,
  Toolbar,
  TextField,
  InputLabel,
} from "@mui/material";
import Logo from "../Assets/main.png";
import Bgimage from "../Assets/pg.png";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

const StyledBgImage = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${Bgimage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  width: "100%",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center", // Center items horizontally
  alignItems: "center", // Center items vertically
  margin: 0,
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

const AboutSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main, // Set the maximum width of the About section
  margin: "2rem auto", // Center the About Section
  padding: "1.5rem",
  margin: 0,
}));

const AboutContent = styled(Box)({
  textAlign: "center", // Center align content
});

const CenteredLogo = styled("div")({
  display: "flex",
  alignItems: "center",
  flexGrow: 1, // Grow to fill the available space
});

const Signup = () => {
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setsignupSuccess] = useState(false);
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
      // Password validation
      if (userData.password.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
      }
  
      const response = await axios.post(
        "http://localhost:5000/api/signup",
        userData
      );
  
      if (response && response.data) {
        setsignupSuccess(true);
        console.log(response.data);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        console.error("Signup failed: No data in response");
      }
    } catch (error) {
      console.error(
        "Signup failed:",
        error.response ? error.response.data.message : error.message
      );
      setSignupError(error.message); // Assuming you have state for signupError
    }
  };

  return (
    <>
      <StyledAppBar position="static">
        <Toolbar>
          <Box flexGrow={1} />
          <CenteredLogo>
            <img
              src={Logo}
              alt="My Logo"
              style={{ height: "40px", marginRight: "20px" }}
            />
          </CenteredLogo>
        </Toolbar>
      </StyledAppBar>

      <StyledBgImage>
        <Box
          display="flex"
          flexDirection="column"
          minHeight="100vh"
          position="relative" // Add position relative to the parent container
        >
          {" "}
          {/* Content */}
          <Box position="absolute" top="10px" width="100%" zIndex="9999">
  <Slide
    direction="down"
    in={signupSuccess}
    mountOnEnter
    unmountOnExit
    timeout={{ enter: 1000, exit: 500 }}
    style={{ display: "flex", justifyContent: "center", margin: "30px" }}
  >
    <Alert variant="filled" severity="success" color="secondary">
      Signup Successful
    </Alert>
  </Slide>
  
</Box>
          <Box
            display="flex"
            flex={1}
            justifyContent="center"
            alignItems="center"
          >
            <Wrapper>
              <Typography variant="h5" gutterBottom>
                Sign Up
              </Typography>

              <FormContainer>
                <InputLabel>username</InputLabel>
                <TextField
                  type="text"
                  name="username"
                  className="sign-up-input"
                  onChange={handleInputChange}
                  variant="outlined" // Add outlined variant
                  fullWidth // Take full width
                />
                <InputLabel>Email</InputLabel>
                <TextField
                  type="email"
                  name="email"
                  className="sign-up-input"
                  onChange={handleInputChange}
                  variant="outlined" // Add outlined variant
                  fullWidth // Take full width
                />
                <InputLabel>password</InputLabel>
                <TextField
                  type="password"
                  name="password"
                  className="sign-up-input"
                  onChange={handleInputChange}
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

                {signupError && (
    <Typography variant="body2" >
      {signupError}
    </Typography>
  )}

                <Typography variant="body2" style={{ textAlign: "center" }}>
                  Already a user? <Link to="/login">Login</Link>
                </Typography>
              </FormContainer>
            </Wrapper>
          </Box>
        </Box>
      </StyledBgImage>
      {/* About Section */}
      <AboutSection>
        <AboutContent>
          <Typography variant="h6" gutterBottom>
            About NomadGram
          </Typography>
        </AboutContent>
        <AboutContent>
          <Typography variant="body1" gutterBottom>
            NomadGram is a social media platform for travelers, allowing users
            to share posts with images, location descriptions, and travel
            guides.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Developed by Final Year BCA students Alby AB, Aswin Suresh, and
            Amith Prem.
          </Typography>
          <Typography variant="body2">© 2024 From NomadGram</Typography>
        </AboutContent>
      </AboutSection>
    </>
  );
};

export default Signup;
