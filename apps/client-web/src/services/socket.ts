// Importamos el cliente de Socket.IO.
import { io } from 'socket.io-client';

// Tomamos el host desde donde se abrió la página.
// Si estás en laptop será localhost.
// Si estás en celular será 192.168.x.x.
const API_HOST = window.location.hostname;

// El backend corre en el puerto 5000.
const SOCKET_URL = `http://${API_HOST}:5000`;

// Creamos la conexión socket.
// autoConnect false significa que nosotros decidimos cuándo conectarlo.
export const socket = io(SOCKET_URL, {
  autoConnect: false,
});