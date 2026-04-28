// Importamos iconos
import {Boxes,ChefHat,ClipboardList,HandPlatter,LayoutDashboard,} from 'lucide-react';

// Importamos NavLink para navegación con estado activo
import { NavLink } from 'react-router-dom';

// Lista de navegación del sidebar
const navItems = [
  { to: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { to: '/orders', label: 'Pedidos', icon: ClipboardList },
  { to: '/inventory', label: 'Inventario', icon: Boxes },
  { to: '/kitchen', label: 'Cocina', icon: ChefHat },
  { to: '/waiter', label: 'Mesero', icon: HandPlatter },
];

// Sidebar del panel de empleado
function Sidebar() {
  return (
    <aside className="employee-sidebar">
      <div className="employee-sidebar-brand">
        <div className="employee-sidebar-brand-badge">EM</div>

        <div className="employee-sidebar-brand-copy">
          <h2 className="employee-sidebar-logo">Panel de Empleado</h2>
          <p className="employee-sidebar-subtitle">Operación diaria</p>
        </div>
      </div>

      <nav className="employee-sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink key={item.to} to={item.to}>
              <span className="employee-sidebar-link-icon">
                <Icon size={18} />
              </span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;