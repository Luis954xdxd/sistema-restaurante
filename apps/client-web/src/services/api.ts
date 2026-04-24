import axios from 'axios';

const API_HOST = window.location.hostname;
const API_BASE_URL = `http://${API_HOST}:5000/api`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('restaurant_admin_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});