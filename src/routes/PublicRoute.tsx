import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const isAuthenticated = !!Cookies.get('authToken');

  if (isAuthenticated) {
    return <Navigate to="/wallets" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute; 