// Importamos el proveedor global de la aplicación
import { AppProviders } from './app/providers';

// Importamos el router principal
import { AppRouter } from './app/router';

// Componente principal de la app
function App() {
  return (
    // Envolvemos toda la app con los providers globales
    <AppProviders>
      {/* Renderizamos las rutas */}
      <AppRouter />
    </AppProviders>
  );
}

// Exportamos el componente para usarlo en main.tsx
export default App;