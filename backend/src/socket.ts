// Importamos Server de Socket.IO
import { Server } from 'socket.io';

// Importamos tipo del servidor HTTP
import type { Server as HttpServer } from 'http';

// Guardamos la instancia global de Socket.IO
let io: Server | null = null;

// Inicializamos Socket.IO
export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Cliente conectado a Socket.IO:', socket.id);

    socket.on('disconnect', () => {
      console.log('Cliente desconectado de Socket.IO:', socket.id);
    });
  });

  return io;
}

// Obtenemos Socket.IO desde otros archivos
export function getSocket() {
  if (!io) {
    throw new Error('Socket.IO no ha sido inicializado');
  }

  return io;
}