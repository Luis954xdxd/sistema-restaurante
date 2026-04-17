// Importamos providers globales
import { AppProviders } from './app/providers';

// Importamos el router
import { AppRouter } from './app/router';

// Componente raíz
function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;