// Importamos React para que JSX funcione correctamente
import React from 'react';

// Importamos ReactDOM para renderizar la aplicación en el navegador
import ReactDOM from 'react-dom/client';

// Importamos el componente principal de la aplicación
import App from './App';

// Importamos variables globales de estilos
import './styles/variables.css';

// Importamos estilos globales de toda la app
import './styles/global.css';

// Buscamos el elemento con id "root" en el HTML y montamos la app ahí
ReactDOM.createRoot(document.getElementById('root')!).render(
  // StrictMode ayuda a detectar problemas en desarrollo
  <React.StrictMode>
    {/* Renderizamos la app principal */}
    <App />
  </React.StrictMode>
);