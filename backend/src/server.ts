// Importamos http para crear servidor compatible con Socket.IO
import http from 'http';

// Importamos app de Express
import app from './app';

// Importamos config dotenv si ya la usas
import dotenv from 'dotenv';

// Importamos inicializador de socket
import { initSocket } from './socket';

// Activamos variables de entorno
dotenv.config();

// Definimos puerto
const PORT = process.env.PORT || 5000;

// Creamos servidor HTTP usando Express
const server = http.createServer(app);

// Inicializamos Socket.IO con el servidor HTTP
initSocket(server);

// Levantamos servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});