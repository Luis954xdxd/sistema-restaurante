// Importamos axios
import axios from 'axios';

// Creamos una instancia base para consumir el backend
export const api = axios.create({
  // URL base del backend
  baseURL: 'http://localhost:5000/api',
});