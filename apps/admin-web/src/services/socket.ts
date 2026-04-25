import { io } from 'socket.io-client';

const API_HOST = window.location.hostname;

const SOCKET_URL = `http://${API_HOST}:5000`;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});