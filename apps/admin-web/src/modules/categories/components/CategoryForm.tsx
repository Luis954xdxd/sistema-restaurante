import { useEffect, useState } from 'react';
import type { Category } from '../types/categories.types';

interface Props {
  initialData?: Category | null;
  isLoading?: boolean;
  onSubmit: (values: { name: string; description: string }) => void;
  onCancel?: () => void;
}

function CategoryForm({ initialData, isLoading, onSubmit, onCancel }: Props) {
  // 🔥 inicialización directa (sin useEffect)
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');

  // 🔥 SOLO sincronizamos cuando cambia initialData (pero sin problema)
  useEffect(() => {
    setName(initialData?.name || '');
    setDescription(initialData?.description || '');
  }, [initialData]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      name: name.trim(),
      description: description.trim(),
    });
  };

  return (
    <form className="category-form-card" onSubmit={handleSubmit}>
      <div className="category-form-header">
        <h3>{initialData ? 'Editar categoría' : 'Nueva categoría'}</h3>
        <p>
          {initialData
            ? 'Actualiza la información de la categoría seleccionada.'
            : 'Agrega una nueva categoría al sistema.'}
        </p>
      </div>

      <div className="category-form-group">
        <label>Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Bebidas"
          required
        />
      </div>

      <div className="category-form-group">
        <label>Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe la categoría"
        />
      </div>

      <div className="category-form-actions">
        {onCancel && (
          <button
            type="button"
            className="button-secondary"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}

        <button type="submit" className="button-primary" disabled={isLoading}>
          {isLoading
            ? 'Guardando...'
            : initialData
            ? 'Actualizar'
            : 'Crear'}
        </button>
      </div>
    </form>
  );
}

export default CategoryForm;