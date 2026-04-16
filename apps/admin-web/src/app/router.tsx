import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../modules/auth/pages/LoginPage';
import DashboardPage from '../modules/dashboard/pages/DashboardPage';
import CategoriesPage from '../modules/categories/pages/CategoriesPage';
import ProductsPage from '../modules/products/pages/ProductsPage';
import InventoryPage from '../modules/inventory/pages/InventoryPage';
import OrdersPage from '../modules/orders/pages/OrdersPage';
import ReportsPage from '../modules/reports/pages/ReportsPage';
import AdminLayout from '../components/layout/AdminLayout';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}