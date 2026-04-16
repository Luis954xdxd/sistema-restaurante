import { useEffect, useRef, useState } from 'react';
import type { Product } from '../types/products.types';

interface CategoryOption {
  id: number;
  name: string;
}

interface Props {
  categories: CategoryOption[];
  initialData?: Product | null;
  isLoading?: boolean;
  onSubmit: (values: {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    image: File | null;
  }) => void;
  onCancel?: () => void;
}

function ProductForm({
  categories,
  initialData,
  isLoading,
  onSubmit,
  onCancel,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData ? Number(initialData.price) : 0);
  const [categoryId, setCategoryId] = useState(
    initialData ? String(initialData.categoryId) : ''
  );
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    setName(initialData?.name || '');
    setDescription(initialData?.description || '');
    setPrice(initialData ? Number(initialData.price) : 0);
    setCategoryId(initialData ? String(initialData.categoryId) : '');
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [initialData]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      categoryId: Number(categoryId),
      image,
    });
  };

  return (
    <form className="product-form-card" onSubmit={handleSubmit}>
      <div className="product-form-header">
        <h3>{initialData ? 'Editar producto' : 'Nuevo producto'}</h3>
        <p>
          {initialData
            ? 'Actualiza la información del producto seleccionado.'
            : 'Agrega un nuevo producto al sistema.'}
        </p>
      </div>

      <div className="product-form-group">
        <label htmlFor="product-name">Nombre</label>
        <input
          id="product-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Coca-Cola 600ml"
          required
        />
      </div>

      <div className="product-form-group">
        <label htmlFor="product-description">Descripción</label>
        <textarea
          id="product-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe el producto"
          rows={4}
        />
      </div>

      <div className="product-form-group">
        <label htmlFor="product-price">Precio</label>
        <input
          id="product-price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="0.00"
          required
        />
      </div>

      <div className="product-form-group">
        <label htmlFor="product-category">Categoría</label>
        <select
          id="product-category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={String(category.id)}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="product-form-group">
        <label htmlFor="product-image">Imagen</label>

        <div className="custom-file-upload">
          <input
            ref={fileInputRef}
            id="product-image"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="hidden-file-input"
          />

          <button
            type="button"
            className="button-secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            Seleccionar archivo
          </button>

          <span className="file-name-text">
            {image ? image.name : 'Ningún archivo seleccionado'}
          </span>
        </div>
      </div>

      <div className="product-form-actions">
        {onCancel && (
          <button
            type="button"
            className="button-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
        )}

        <button type="submit" className="button-primary" disabled={isLoading}>
          {isLoading
            ? 'Guardando...'
            : initialData
            ? 'Guardar cambios'
            : 'Crear producto'}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;