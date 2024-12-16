import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../Auth/Firebase';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem ('token');
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
