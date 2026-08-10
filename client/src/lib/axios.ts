import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optionally handle unauthorized globally
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        // Don't redirect for public pages
      }
    }
    return Promise.reject(error);
  }
);

export default api;
