import React from 'react'; // Importamos React para que JSX funcione correctamente

// Importamos ReactDOM para renderizar la aplicación
import ReactDOM from 'react-dom/client';

// Importamos el componente principal
import App from './App';

// Importamos estilos globales
import './styles/variables.css';
import './styles/global.css';

// Renderizamos la aplicación dentro del elemento root
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Renderizamos la app completa */}
    <App />
  </React.StrictMode>
);