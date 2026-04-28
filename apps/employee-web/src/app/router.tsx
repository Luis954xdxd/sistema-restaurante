// Importamos componentes del router
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Importamos páginas
import LoginPage from '../modules/auth/pages/LoginPage';
import DashboardPage from '../modules/dashboard/pages/DashboardPage';
import OrdersPage from '../modules/orders/pages/OrdersPage';
import InventoryPage from '../modules/inventory/pages/InventoryPage';

// Importamos nuevas páginas operativas
import KitchenPage from '../modules/kitchen/pages/KitchenPage';
import WaiterPage from '../modules/waiter/Pages/WaiterPage';

// Importamos layout protegido
import EmployeeLayout from '../components/layout/EmployeeLayout';

// Router principal de la app
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública de login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas bajo el layout */}
        <Route element={<EmployeeLayout />}>
          {/* Si entra a la raíz, lo mandamos al dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Pantallas ya existentes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/inventory" element={<InventoryPage />} />

          {/* Nuevas pantallas */}
          <Route path="/kitchen" element={<KitchenPage />} />
          <Route path="/waiter" element={<WaiterPage />} />
        </Route>

        {/* Cualquier otra ruta redirige al dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}