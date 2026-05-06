// Importamos hooks.
import { useState } from 'react';

// Importamos tipos.
import type {
  InventoryItem,
  InventoryMovementType,
} from '../types/inventory.types';

// Props del modal.
interface Props {
  item: InventoryItem | null;
  movementType: InventoryMovementType | null;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (values: {
    productId: number;
    movementType: InventoryMovementType;
    quantity: number;
    reason: string;
  }) => void;
}

// Convertimos tipo técnico a texto.
function getMovementTitle(movementType: InventoryMovementType | null) {
  if (movementType === 'ENTRY') return 'Registrar entrada';
  if (movementType === 'EXIT') return 'Registrar salida';
  if (movementType === 'ADJUSTMENT') return 'Registrar ajuste';

  return 'Movimiento de inventario';
}

// Modal para registrar movimiento.
function InventoryMovementModal({
  item,
  movementType,
  isLoading,
  onClose,
  onSubmit,
}: Props) {
  // Cantidad.
  const [quantity, setQuantity] = useState('');

  // Motivo.
  const [reason, setReason] = useState('');

  // Si no hay producto seleccionado, no mostramos modal.
  if (!item || !movementType) return null;

  // Enviar formulario.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const quantityNumber = Number(quantity);

    if (!Number.isInteger(quantityNumber) || quantityNumber <= 0) {
      window.alert('La cantidad debe ser un número entero mayor a 0.');
      return;
    }

    onSubmit({
      productId: item.productId,
      movementType,
      quantity: quantityNumber,
      reason,
    });

    setQuantity('');
    setReason('');
  };

  return (
    <div className="employee-inventory-modal-overlay">
      <form className="employee-inventory-modal" onSubmit={handleSubmit}>
        <div className="employee-inventory-modal-header">
          <div>
            <h3>{getMovementTitle(movementType)}</h3>
            <p>{item.product.name}</p>
          </div>

          <button type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="employee-inventory-current">
          <span>Stock actual</span>
          <strong>
            {item.stockCurrent} {item.unit}
          </strong>
        </div>

        <div className="employee-inventory-form-group">
          <label htmlFor="movement-quantity">Cantidad</label>
          {movementType === 'ADJUSTMENT' && (
           <small className="employee-inventory-help-text">
            En ajuste, la cantidad será el nuevo stock exacto del producto.
            </small>
            )}

          <input
            id="movement-quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder="Ej. 10"
            required
          />
        </div>

        <div className="employee-inventory-form-group">
          <label htmlFor="movement-reason">Motivo</label>

          <textarea
            id="movement-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Ej. Compra semanal, merma, corrección de inventario..."
            rows={4}
          />
        </div>

        <div className="employee-inventory-modal-actions">
          <button
            type="button"
            className="employee-inventory-cancel-button"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="employee-inventory-save-button"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar movimiento'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InventoryMovementModal;