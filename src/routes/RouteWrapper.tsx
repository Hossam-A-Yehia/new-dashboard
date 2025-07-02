import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { AppRoute } from './appRoutes';

interface RouteWrapperProps {
  route: AppRoute;
  userType: number;
}

const RouteWrapper: React.FC<RouteWrapperProps> = ({ route, userType }) => {
  const element = route.isPublic ? (
    <PublicRoute>{route.element}</PublicRoute>
  ) : (
    <ProtectedRoute userType={userType} allowedTypes={route.allowedTypes}>
      {route.element}
    </ProtectedRoute>
  );

  return <Route path={route.path} element={element} />;
};

export default RouteWrapper; 