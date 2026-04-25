// Importamos Server de socket.io
import { Server } from 'socket.io';

// Importamos tipo Server HTTP de Node
import type { Server as HttpServer } from 'http';

// Variable global donde guardaremos la instancia de Socket.IO
let io: Server | null = null;

// Función para inicializar Socket.IO
export function initSocket(server: HttpServer) {
  // Creamos el servidor de sockets
  io = new Server(server, {
    // Configuramos CORS para permitir conexión desde frontends
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH'],
    },
  });

  // Evento cuando un cliente se conecta
  io.on('connection', (socket) => {
    console.log('Cliente conectado a Socket.IO:', socket.id);

    // Evento cuando un cliente se desconecta
    socket.on('disconnect', () => {
      console.log('Cliente desconectado de Socket.IO:', socket.id);
    });
  });

  return io;
}

// Función para obtener la instancia de socket
export function getSocket() {
  // Si io no existe, significa que no se inicializó
  if (!io) {
    throw new Error('Socket.IO no ha sido inicializado');
  }

  // Retornamos instancia
  return io;
}