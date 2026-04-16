import { useState } from 'react';
import type { InventoryItem, InventoryMovementType } from '../types/inventory.types';

interface Props {
  inventoryItems: InventoryItem[];
  isLoading?: boolean;
  onSubmit: (values: {
    productId: number;
    movementType: InventoryMovementType;
    quantity: number;
    reason: string;
  }) => void;
}

function InventoryMovementForm({ inventoryItems, isLoading, onSubmit }: Props) {
  const [productId, setProductId] = useState('');
  const [movementType, setMovementType] = useState<InventoryMovementType>('ENTRY');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      productId: Number(productId),
      movementType,
      quantity: Number(quantity),
      reason: reason.trim(),
    });

    setQuantity(1);
    setReason('');
  };

  return (
    <form className="inventory-form-card" onSubmit={handleSubmit}>
      <div className="inventory-form-header">
        <h3>Registrar movimiento</h3>
        <p>Registra entradas, salidas o ajustes de inventario.</p>
      </div>

      <div className="inventory-form-group">
        <label htmlFor="movement-product">Producto</label>
        <select
          id="movement-product"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        >
          <option value="">Selecciona un producto</option>
          {inventoryItems.map((item) => (
            <option key={item.productId} value={String(item.productId)}>
              {item.product.name}
            </option>
          ))}
        </select>
      </div>

      <div className="inventory-form-group">
        <label htmlFor="movement-type">Tipo de movimiento</label>
        <select
          id="movement-type"
          value={movementType}
          onChange={(e) => setMovementType(e.target.value as InventoryMovementType)}
        >
          <option value="ENTRY">Entrada</option>
          <option value="EXIT">Salida</option>
          <option value="ADJUSTMENT">Ajuste</option>
        </select>
      </div>

      <div className="inventory-form-group">
        <label htmlFor="movement-quantity">Cantidad</label>
        <input
          id="movement-quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
      </div>

      <div className="inventory-form-group">
        <label htmlFor="movement-reason">Motivo</label>
        <textarea
          id="movement-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ej. Reposición, venta, ajuste de conteo..."
          rows={3}
        />
      </div>

      <div className="inventory-form-actions">
        <button type="submit" className="button-primary" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar movimiento'}
        </button>
      </div>
    </form>
  );
}

export default InventoryMovementForm;