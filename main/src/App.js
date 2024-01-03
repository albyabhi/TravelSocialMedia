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
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { theme } from './Components/Home/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProfileEd />} />
            <Route path="/Adminsignup" element={<AdminSignup />} />
            <Route path="/Adminlogin" element={<AdminLogin />} />
            <Route path="/" element={<Users />} />
            <Route path="/location" element={<Locationtab />} />
            <Route path="/viewedit" element={<Viewedit />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
