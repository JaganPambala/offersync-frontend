import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { navigationLinks } from '../utils/constants';

// This is a simple authentication check - you can enhance this with your actual auth logic
const useAuth = () => {
  // For now, we'll use localStorage to check if user is logged in
  // You can replace this with your actual authentication logic (Redux, Context, etc.)
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  
  return {
    isAuthenticated: !!token && !!user,
    user: user ? JSON.parse(user) : null,
    token
  };
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with the current location as state
    // This allows us to redirect back after successful login
    return <Navigate to={navigationLinks.login.path} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
