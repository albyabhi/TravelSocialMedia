
import React from 'react';
import './Home.css'; 

const Home = () => {
  return (
    <div className="home-container">
      {/* Top Bar */}
      <div className="top-bar">
        {/* Logo */}
        <div className="logo">Your Logo</div>

        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search by username" />
          {/* You can add search functionality here */}
        </div>

        {/* Add Post Button */}
        <button className="add-post-button">Add Post</button>

        {/* User Profile */}
        <div className="user-profile">
          <img src="path_to_user_image" alt="User Avatar" />
          <span>User Name</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Add your main content here */}
      </div>
    </div>
  );
};

export default Home;
