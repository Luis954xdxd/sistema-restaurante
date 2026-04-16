// Importamos axios para hacer peticiones HTTP
import axios from 'axios';

// Creamos una instancia base de axios
export const api = axios.create({
  // URL base del backend
  baseURL: 'http://localhost:5000/api',
});

// Interceptor para adjuntar token automáticamente a cada petición
api.interceptors.request.use((config) => {
  // Leemos token guardado para employee
  const token = localStorage.getItem('restaurant_employee_token');

  // Si existe token, lo mandamos en Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});