// Importamos componentes de React Router.
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Importamos la página del menú.
import MenuPage from '../modules/menu/pages/MenuPage';

// Creamos el router principal del cliente.
export function AppRouter() {
  // Retornamos las rutas.
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta normal del menú */}
        <Route path="/menu" element={<MenuPage />} />

        {/* Ruta que abre el menú con número de mesa */}
        <Route path="/menu/mesa/:mesaId" element={<MenuPage />} />

        {/* Si la ruta no existe, mandamos al menú */}
        <Route path="*" element={<Navigate to="/menu" replace />} />
      </Routes>
    </BrowserRouter>
  );
}