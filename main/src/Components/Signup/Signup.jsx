// Signup.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import Logo from "../Assets/main.png";
import SecondImage from "../Assets/pg.png";

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

  // Signup.js

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/signup", userData);

  
      if (response && response.data) {
        console.log(response.data); // You can handle success or redirect to login page
        navigate("/login");
      } else {
        console.error("Signup failed: No data in response");
      }
    } catch (error) {
      console.error("Signup failed:", error.response ? error.response.data.message : error.message);
    }
  };
  
    const handleHover = () => {
        const heading = document.querySelector('.left-heading');
        const paragraph = document.querySelector('.left-paragraph');

        heading.classList.toggle('show');
        paragraph.classList.toggle('show');
    };

  

  return (
    <div className="content">
      <img src={Logo} alt="My Logo" className="logo" />
      <img src={SecondImage} alt="Second" className="second-image" />
      
      <h1 className="left-heading">Welcome to Nomad Gram</h1>
      <p className="left-paragraph">
        your passport to a world of wanderlust and
        adventure! connect you with fellow nomads and travel
        enthusiasts from around the globe. With NomadGram, the possibilities are
        endless as you share your experiences, discover hidden gems, and forge
        new connections with like-minded travelers.Sign up now and let the adventures
        begin!
      </p>

      <div className="sign-up-container" onMouseEnter={handleHover}>
        <h2 className="sign-up-heading">Sign Up</h2>
        <form className="sign-up-form">
          <input
            placeholder="Username"
            type="text"
            name="username"
            className="sign-up-input"
            onChange={handleInputChange}
          />

          <input
            placeholder="Email"
            type="email"
            name="email"
            className="sign-up-input"
            onChange={handleInputChange}
          />

          <input
            placeholder="Password"
            type="password"
            name="password"
            className="sign-up-input"
            onChange={handleInputChange}
          />

          <button
            type="button"
            className="sign-up-button"
            onClick={handleSignup}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default Signup;
