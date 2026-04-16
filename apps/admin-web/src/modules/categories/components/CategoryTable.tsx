import { PenSquare, Power } from 'lucide-react';
import type { Category } from '../types/categories.types';

interface Props {
  categories: Category[];
  onEdit: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
}

function CategoryTable({ categories, onEdit, onToggleStatus }: Props) {
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
                  {category.isActive ? 'Activa' : 'Inactiva'}
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
                    className={category.isActive ? 'button-danger' : 'button-primary'}
                    onClick={() => onToggleStatus(category)}
                  >
                    <Power size={16} />
                    <span>{category.isActive ? 'Desactivar' : 'Activar'}</span>
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