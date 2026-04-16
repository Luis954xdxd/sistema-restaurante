import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar-user">
        <strong className="topbar-name">
          {user?.firstName} {user?.lastName}
        </strong>
        <div className="topbar-role">Administración</div>
      </div>

      <button onClick={handleLogout} className="topbar-logout-button">
        <LogOut size={18} />
        <span>Cerrar sesión</span>
      </button>
    </header>
  );
}

export default Topbar;