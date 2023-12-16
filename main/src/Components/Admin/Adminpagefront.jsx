// AdminPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Adminpagefront = () => {
  return (
    <div>
      <h2>Welcome to the Admin Page</h2>
      <div>
        <Link to="/admin/login">
          <button>Login Admin</button>
        </Link>
      </div>
      <div>
        <Link to="/admin/signup">
          <button>Register Admin</button>
        </Link>
      </div>
    </div>
  );
};

export default Adminpagefront;
