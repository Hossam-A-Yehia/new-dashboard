import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client-Type': 'dashboard',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const lang = typeof window !== 'undefined' ? localStorage.getItem('I18N_LANGUAGE') || 'en' : 'en';
    const token = Cookies.get('authToken') ;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Accept-Language'] = lang;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export default apiClient;
