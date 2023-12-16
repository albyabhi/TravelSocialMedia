
import AdminLogin from "./Components/Admin/AdminLogin";
import AdminSignup from "./Components/Admin/AdminSignup";

import Login from "./Components/Login/Login";
import ProfileEd from "./Components/Profile/ProfileEd";


import Signup from "./Components/Signup/Signup";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';




function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfileEd /> } />
        <Route path="/Adminsignup" element={<AdminSignup /> } />
        <Route path="/Adminlogin" element={<AdminLogin/>}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
