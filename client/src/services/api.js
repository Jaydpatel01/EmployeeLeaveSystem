import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses & errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        const currentPath = window.location.pathname;
        // Don't redirect if already on login/register
        if (currentPath !== '/login' && currentPath !== '/register') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }

      // Normalize error message
      const message =
        error.response.data?.message ||
        error.response.data?.errors?.[0]?.msg ||
        'Something went wrong';
      error.normalizedMessage = message;
    } else if (error.code === 'ECONNABORTED') {
      error.normalizedMessage = 'Request timed out. Please try again.';
    } else {
      error.normalizedMessage = 'Network error. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

export default api;
