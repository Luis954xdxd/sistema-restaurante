// Importamos cliente de Socket.IO
import { io } from 'socket.io-client';

// Detectamos el host desde donde se abrió admin-web
const API_HOST = window.location.hostname;

// Creamos URL del backend
const SOCKET_URL = `http://${API_HOST}:5000`;

// Creamos conexión socket
export const socket = io(SOCKET_URL, {
  autoConnect: false,
});