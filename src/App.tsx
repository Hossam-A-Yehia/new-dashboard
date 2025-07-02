import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard/Dashboard';
import { UserProvider } from '@/context/UserContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import '@/il8n/index';
import { useTranslation } from 'react-i18next';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    const lang = localStorage.getItem('I18N_LANGUAGE') || 'en';
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    setDirection(dir);
    document.body.dir = dir;
  }, []);

  const theme = createTheme({
    direction,
    typography: {
      fontFamily: direction === 'rtl' ? 'Tajawal, Arial' : 'Roboto, Arial',
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <UserProvider>
          <Router>
            <div className={i18n.language === 'ar' ? 'dir-rtl' : 'dir-ltr'}>
              <Dashboard />
            </div>
          </Router>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
