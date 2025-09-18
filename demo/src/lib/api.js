import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://erp-portal-messages-1.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
   if (error.response?.status === 401) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // If user was on student pages → send to student login
  if (window.location.pathname.startsWith('/student')) {
    window.location.href = '/student/login';
  } 
  // If user was on admin pages → send to admin login
  else if (window.location.pathname.startsWith('/admin')) {
    window.location.href = '/admin/login';
  } 
  // Default fallback
  else {
    window.location.href = '/login';
  }
}
    return Promise.reject(error);
  }
);

export default api;