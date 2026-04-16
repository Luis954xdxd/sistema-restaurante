import { useEffect, useState } from 'react';
import type { InventoryItem } from '../types/inventory.types';

interface ProductOption {
  id: number;
  name: string;
}

interface Props {
  products: ProductOption[];
  initialData?: InventoryItem | null;
  isLoading?: boolean;
  onSubmitCreate: (values: {
    productId: number;
    stockCurrent: number;
    stockMinimum: number;
    unit: string;
  }) => void;
  onSubmitUpdate: (values: {
    stockMinimum: number;
    unit: string;
  }) => void;
  onCancel?: () => void;
}

function InventoryForm({
  products,
  initialData,
  isLoading,
  onSubmitCreate,
  onSubmitUpdate,
  onCancel,
}: Props) {
  const [productId, setProductId] = useState(initialData ? String(initialData.productId) : '');
  const [stockCurrent, setStockCurrent] = useState(initialData?.stockCurrent ?? 0);
  const [stockMinimum, setStockMinimum] = useState(initialData?.stockMinimum ?? 0);
  const [unit, setUnit] = useState(initialData?.unit ?? '');

  useEffect(() => {
    setProductId(initialData ? String(initialData.productId) : '');
    setStockCurrent(initialData?.stockCurrent ?? 0);
    setStockMinimum(initialData?.stockMinimum ?? 0);
    setUnit(initialData?.unit ?? '');
  }, [initialData]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (initialData) {
      onSubmitUpdate({
        stockMinimum: Number(stockMinimum),
        unit: unit.trim(),
      });
      return;
    }

    onSubmitCreate({
      productId: Number(productId),
      stockCurrent: Number(stockCurrent),
      stockMinimum: Number(stockMinimum),
      unit: unit.trim(),
    });
  };

  return (
    <form className="inventory-form-card" onSubmit={handleSubmit}>
      <div className="inventory-form-header">
        <h3>{initialData ? 'Editar inventario' : 'Nuevo inventario'}</h3>
        <p>
          {initialData
            ? 'Actualiza stock mínimo y unidad del inventario seleccionado.'
            : 'Crea un registro de inventario para un producto.'}
        </p>
      </div>

      {!initialData && (
        <>
          <div className="inventory-form-group">
            <label htmlFor="inventory-product">Producto</label>
            <select
              id="inventory-product"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              <option value="">Selecciona un producto</option>
              {products.map((product) => (
                <option key={product.id} value={String(product.id)}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="inventory-form-group">
            <label htmlFor="inventory-stock-current">Stock actual</label>
            <input
              id="inventory-stock-current"
              type="number"
              min="0"
              value={stockCurrent}
              onChange={(e) => setStockCurrent(Number(e.target.value))}
              required
            />
          </div>
        </>
      )}

      <div className="inventory-form-group">
        <label htmlFor="inventory-stock-minimum">Stock mínimo</label>
        <input
          id="inventory-stock-minimum"
          type="number"
          min="0"
          value={stockMinimum}
          onChange={(e) => setStockMinimum(Number(e.target.value))}
          required
        />
      </div>

      <div className="inventory-form-group">
        <label htmlFor="inventory-unit">Unidad</label>
        <input
          id="inventory-unit"
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Ej. piezas, botellas, kg"
          required
        />
      </div>

      <div className="inventory-form-actions">
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
            : 'Crear inventario'}
        </button>
      </div>
    </form>
  );
}

export default InventoryForm;