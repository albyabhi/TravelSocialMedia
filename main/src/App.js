import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material";
import AdminLogin from "./Components/Admin/AdminLogin";
import AdminSignup from "./Components/Admin/AdminSignup";
import Locationtab from "./Components/Admin/Adminmain/Dashboard/Locationtab";
import Users from "./Components/Admin/Adminmain/Dashboard/Users";
import Viewedit from "./Components/Admin/Adminmain/Dashboard/Viewedit";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import ProfileEd from "./Components/Profile/ProfileEd";
import Signup from "./Components/Signup/Signup";
import {
  Navigate,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { theme } from "./Components/Home/theme";
import State from "./Components/Admin/Adminmain/Dashboard/State";
import Search from "./Components/Home/Search";
import ProfileView from "./Components/Home/ProfileView";
import LocationView from "./Components/Home/LocationView";
import axios from "axios";
import TravelGuideAdd from "./Components/Home/TG/TravelGuideAdd";
import TravelGuideView from "./Components/Home/TG/TravelGuideView";
import MainProfile from "./Components/Home/MainProfile";

function App() {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Verify token with the backend
          const response = await axios.post(
            "http://localhost:5000/api/verifyToken",
            { token }
          );
          if (response.data.success) {
            setAuth(true);
          } else {
            setAuth(false);
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          setAuth(false);
        }
      } else {
        setAuth(false);
      }
      setLoading(false);
    };

    checkToken();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator while checking the token
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login setAuth={setAuth} />} />

            {/* user authentication required routes */}
            <Route
              path="/profile"
              element={auth ? <ProfileEd /> : <Navigate to="/login" />}
            />
            <Route
              path="/profileview/:userId"
              element={auth ? <ProfileView /> : <Navigate to="/login" />}
            />
            <Route
              path="/home"
              element={auth ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/search"
              element={auth ? <Search /> : <Navigate to="/login" />}
            />
            <Route
              path="/LocationView/:locationId"
              element={auth ? <LocationView /> : <Navigate to="/login" />}
            />
             <Route
              path="/TravelGuideAdd"
              element={auth ? <TravelGuideAdd /> : <Navigate to="/login" />}
            />
            {/* user authentication required routes */}
           
            <Route
              path="/mainview/:userId"
              element={auth ? <MainProfile /> : <Navigate to="/login" />}
            />
            
            <Route 
              path="/travelguideView/:guideId/:userId"
              element={auth ? <TravelGuideView /> : <Navigate to="/login" /> }
              />

            {/* Admin routes */}
            <Route path="/admindashboard" element={<Users />} />
                   
            <Route path="/location" element={<Locationtab />} />
            <Route path="/viewedit" element={<Viewedit />} />
            <Route path="/state" element={<State />} />
            <Route path="/Adminsignup" element={<AdminSignup />} />
            <Route path="/Adminlogin" element={<AdminLogin />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
