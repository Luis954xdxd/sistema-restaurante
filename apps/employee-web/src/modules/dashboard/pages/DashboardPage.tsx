// Importamos componentes UI
import PageHeader from '../../../components/ui/PageHeader';
import StatCard from '../../../components/ui/StatCard';

// Importamos hook de dashboard
import { useEmployeeDashboard } from '../../../hooks/useEmployeeDashboard';

// Importamos estilos
import '../../../components/ui/ui.css';
import '../styles/dashboard.css';

// Página principal del dashboard del empleado
function DashboardPage() {
  const { data, isLoading, isError } = useEmployeeDashboard();

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
        title="Panel de Empleado"
        subtitle="Resumen operativo del restaurante"
      />

      <div className="employee-dashboard-grid">
        <StatCard title="Pedidos hoy" value={summary.totalOrdersToday} />
        <StatCard title="Pendientes" value={summary.pendingOrders} />
        <StatCard title="En preparación" value={summary.inPreparationOrders} />
        <StatCard title="Listos" value={summary.readyOrders} />
        <StatCard title="Entregados" value={summary.deliveredOrders} />
        <StatCard title="Stock bajo" value={summary.lowStockCount} />
      </div>
    </div>
  );
}

export default DashboardPage;