
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
       
        {/* Add other routes as needed */}
      </Routes>
    </Router>
    </div>
  );
}

export default App;
