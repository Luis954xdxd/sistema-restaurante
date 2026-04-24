// 🔗 Importamos cliente API
import { api } from '../../../services/api';

// ===============================
// 📊 RESUMEN PRINCIPAL
// ===============================
export async function getDashboardSummary() {
  const { data } = await api.get('/dashboard/summary');
  return data;
}

// ===============================
// 📉 STOCK BAJO
// ===============================
export async function getDashboardLowStock() {
  const { data } = await api.get('/dashboard/low-stock');
  return data;
}

// ===============================
// 🏆 PRODUCTOS MÁS VENDIDOS
// ===============================
export async function getDashboardTopProducts() {
  const { data } = await api.get('/dashboard/top-products');
  return data;
}

// ===============================
// 🧾 PEDIDOS RECIENTES
// ===============================
export async function getDashboardRecentOrders() {
  const { data } = await api.get('/dashboard/recent-orders');
  return data;
}