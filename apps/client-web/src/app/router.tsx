// Importamos componentes de React Router.
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Importamos la página del menú.
import MenuPage from '../modules/menu/pages/MenuPage';

// Importamos la página para ver el estado del pedido.
import OrderStatusPage from '../modules/order-status/pages/OrderStatusPage';

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

        {/* Ruta para que el cliente vea el estado de su pedido */}
        <Route path="/order-status/:orderId" element={<OrderStatusPage />} />

        {/* Si la ruta no existe, mandamos al menú */}
        <Route path="*" element={<Navigate to="/menu" replace />} />
      </Routes>
    </BrowserRouter>
  );
}