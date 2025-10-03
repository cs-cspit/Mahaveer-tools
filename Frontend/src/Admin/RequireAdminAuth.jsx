import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RequireAdminAuth = () => {
  const { user } = useAuth();
  
  // Check if user is logged in and has admin role
  const isAdmin = user && user.role === 'admin';
  
  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default RequireAdminAuth;