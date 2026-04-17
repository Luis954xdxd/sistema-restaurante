// Importamos componentes de react-router-dom
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Importamos la página principal del menú
import MenuPage from '../modules/menu/pages/MenuPage';

// Router principal
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal del menú */}
        <Route path="/" element={<MenuPage />} />

        {/* Ruta para futuro menú por mesa */}
        <Route path="/menu/mesa/:mesaId" element={<MenuPage />} />

        {/* Cualquier otra ruta redirige al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}