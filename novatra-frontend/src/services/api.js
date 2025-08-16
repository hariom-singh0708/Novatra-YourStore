import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
  withCredentials: true,
});

// Attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('novatra_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;