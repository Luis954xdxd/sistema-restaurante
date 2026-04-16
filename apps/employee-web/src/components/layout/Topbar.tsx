// Importamos icono
import { LogOut } from 'lucide-react';

// Importamos navegación
import { useNavigate } from 'react-router-dom';

// Importamos auth
import { useAuth } from '../../hooks/useAuth';

// Topbar del panel
function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Función para cerrar sesión
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="employee-topbar">
      <div className="employee-topbar-user">
        <strong className="employee-topbar-name">
          {user?.firstName} {user?.lastName}
        </strong>
        <div className="employee-topbar-role">Operación</div>
      </div>

      <button onClick={handleLogout} className="employee-topbar-logout-button">
        <LogOut size={18} />
        <span>Cerrar sesión</span>
      </button>
    </header>
  );
}

export default Topbar;