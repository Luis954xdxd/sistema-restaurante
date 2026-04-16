// Importamos Navigate y Outlet
import { Navigate, Outlet } from 'react-router-dom';

// Importamos componentes del layout
import Sidebar from './Sidebar';
import Topbar from './Topbar';

// Importamos auth
import { useAuth } from '../../hooks/useAuth';

// Importamos estilos
import './layout.css';

// Layout principal del panel de empleado
function EmployeeLayout() {
  const { isAuthenticated } = useAuth();

  // Si no hay sesión, redirigimos al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="employee-shell">
      <Sidebar />

      <div className="employee-content">
        <Topbar />

        <main className="employee-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default EmployeeLayout;