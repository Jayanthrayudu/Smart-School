// src/components/common/PrivateRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Loader from './Loader.jsx'; // Optional: if you have a loader component

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  // Show loader while checking user
  if (loading) {
    return <Loader />; // Or replace with <div>Loading...</div>
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role is passed and user role doesn't match, redirect or show error page
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />; // Create this page or change path
  }

  // Authorized and ready
  return children;
};

export default PrivateRoute;
