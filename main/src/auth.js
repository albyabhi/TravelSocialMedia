// utils/auth.js

export const isAuthenticated = () => {
   
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
   
    return !!token;
  };
  