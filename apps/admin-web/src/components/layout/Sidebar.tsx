import { LayoutDashboard, Shapes, Package, Boxes, ClipboardList, FileText } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { to: '/categories', label: 'Categorías', icon: Shapes },
  { to: '/products', label: 'Productos', icon: Package },
  { to: '/inventory', label: 'Inventario', icon: Boxes },
  { to: '/orders', label: 'Pedidos', icon: ClipboardList },
  { to: '/reports', label: 'Informes', icon: FileText },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-badge">RS</div>

        <div className="sidebar-brand-copy">
          <h2 className="sidebar-logo">Administración del restaurante</h2>
          <p className="sidebar-subtitle">Panel de control</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink key={item.to} to={item.to}>
              <span className="sidebar-link-icon">
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