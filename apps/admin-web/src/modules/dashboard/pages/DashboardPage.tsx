import PageHeader from '../../../components/ui/PageHeader';
import StatCard from '../../../components/ui/StatCard';
import { useDashboard } from '../../../hooks/useDashboard';
import '../../../components/ui/ui.css';
import '../styles/dashboard.css';

function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return <div>Cargando dashboard...</div>;
  }

  if (isError || !data) {
    return <div>No se pudo cargar el dashboard.</div>;
  }

  const summary = data.summary;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Resumen general del restaurante"
      />

      <div className="dashboard-grid">
        <StatCard title="Pedidos hoy" value={summary.totalOrdersToday} />
        <StatCard title="Pendientes" value={summary.pendingOrders} />
        <StatCard title="En preparación" value={summary.inPreparationOrders} />
        <StatCard title="Listos" value={summary.readyOrders} />
        <StatCard title="Entregados" value={summary.deliveredOrders} />
        <StatCard title="Cancelados" value={summary.cancelledOrders} />
        <StatCard title="Ventas del día" value={`$${summary.totalAmount}`} />
        <StatCard title="Propinas del día" value={`$${summary.tipAmount}`} />
        <StatCard title="Productos" value={summary.totalProducts} />
        <StatCard title="Categorías" value={summary.totalCategories} />
        <StatCard title="Usuarios" value={summary.totalUsers} />
        <StatCard title="Stock bajo" value={summary.lowStockCount} />
      </div>
    </div>
  );
}

export default DashboardPage;