import { EyeOff, PenSquare, Power, Trash2 } from 'lucide-react';
import type { Category } from '../types/categories.types';

interface Props {
  categories: Category[];
  onEdit: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
  onDelete: (category: Category) => void;
}

function CategoryTable({
  categories,
  onEdit,
  onToggleStatus,
  onDelete,
}: Props) {
  if (categories.length === 0) {
    return (
      <div className="category-empty-state">
        No se encontraron categorías con los filtros actuales.
      </div>
    );
  }

  return (
    <div className="category-table-wrapper">
      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.description || 'Sin descripción'}</td>
              <td>
                <span
                  className={
                    category.isActive
                      ? 'status-badge status-active'
                      : 'status-badge status-inactive'
                  }
                >
                  {category.isActive ? 'Activa' : 'Oculta'}
                </span>
              </td>
              <td>
                <div className="category-actions">
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => onEdit(category)}
                  >
                    <PenSquare size={16} />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    className={category.isActive ? 'button-warning' : 'button-primary'}
                    onClick={() => onToggleStatus(category)}
                  >
                    {category.isActive ? <EyeOff size={16} /> : <Power size={16} />}
                    <span>{category.isActive ? 'Ocultar' : 'Mostrar'}</span>
                  </button>

                  <button
                    type="button"
                    className="button-danger"
                    onClick={() => onDelete(category)}
                  >
                    <Trash2 size={16} />
                    <span>Eliminar</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoryTable;