import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
});

// In dev, you can set VITE_API_URL="" and rely on Vite proxy for /api.
// In production, set VITE_API_URL to your Render backend URL.


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nimbus_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
