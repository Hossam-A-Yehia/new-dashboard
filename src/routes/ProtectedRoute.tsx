import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useUser } from '@/context/UserContext';

interface ProtectedRouteProps {
  userType: number;
  allowedTypes: number[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ userType, allowedTypes, children }) => {
  const isAuthenticated = !!Cookies.get('authToken');
  const location = useLocation();
  const { isLoading } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If still loading user data, don't redirect
  if (isLoading) {
    return <>{children}</>;
  }

  if (!allowedTypes.includes(userType)) {
    return <Navigate to="/wallets" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
