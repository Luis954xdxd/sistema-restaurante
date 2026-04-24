import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Páginas existentes
import LoginPage from '../modules/auth/pages/LoginPage';
import DashboardPage from '../modules/dashboard/pages/DashboardPage';
import CategoriesPage from '../modules/categories/pages/CategoriesPage';
import ProductsPage from '../modules/products/pages/ProductsPage';
import InventoryPage from '../modules/inventory/pages/InventoryPage';
import OrdersPage from '../modules/orders/pages/OrdersPage';
import ReportsPage from '../modules/reports/pages/ReportsPage';

// 🆕 NUEVA página de QR
import TablesQrPage from '../modules/tables/pages/TablesQrPage';

// Layout
import AdminLayout from '../components/layout/AdminLayout';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==============================
            LOGIN
        ============================== */}
        <Route path="/login" element={<LoginPage />} />

        {/* ==============================
            RUTAS PROTEGIDAS (ADMIN)
        ============================== */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/reports" element={<ReportsPage />} />

          {/* 🆕 QR DE MESAS */}
          <Route path="/tables-qr" element={<TablesQrPage />} />
        </Route>

        {/* ==============================
            REDIRECCIÓN DEFAULT
        ============================== */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}