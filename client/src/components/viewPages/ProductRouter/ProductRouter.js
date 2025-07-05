import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProductRouter = ({ children }) => {
  const authState = useSelector((state) => state.auth);

  if (!authState) {
    return <div>Loading...</div>;
  }

  const isAuthenticated = authState.isAuthenticated;

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProductRouter;
