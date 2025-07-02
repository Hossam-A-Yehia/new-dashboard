import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Login from '../Login/Login';
import ForgetPassword from '../ForgetPassword/ForgetPassword';
import ResetPassword from '../ResetPassword/ResetPassword';
import Header from '@/components/organisms/Header/Header';
import Drawer from '@/components/organisms/Drawer/Drawer';
import appRoutes from '@/routes/appRoutes';
import { useUser } from '@/context/UserContext';
import ProtectedRoute from '@/routes/ProtectedRoute';
import PublicRoute from '@/routes/PublicRoute';

const Dashboard: React.FC = () => {
  const { userData } = useUser();
  const userType = userData?.user_type;
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const authRoutes = ['/login', '/forget-password', '/reset-password'];
  const isAuthRoute = authRoutes.includes(location.pathname);

  return (
    <div>
      {isAuthRoute ? (
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/forget-password"
            element={
              <PublicRoute>
                <ForgetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
        </Routes>
      ) : (
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Header onMenuClick={handleDrawerOpen} isDrawerOpen={isDrawerOpen} />
          <Drawer isOpen={isDrawerOpen} onClose={handleDrawerClose} />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <div style={{ height: '64px' }} />
            <Routes>
              {appRoutes
                .filter(route => !authRoutes.includes(route.path))
                .map(route => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <ProtectedRoute userType={userType} allowedTypes={route.allowedTypes}>
                        {route.element}
                      </ProtectedRoute>
                    }
                  />
                ))}
            </Routes>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default Dashboard;
