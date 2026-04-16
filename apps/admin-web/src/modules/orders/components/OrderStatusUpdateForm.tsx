import { useEffect, useState } from 'react';
import type { Order, OrderStatus } from '../types/orders.types';

interface Props {
  selectedOrder: Order | null;
  isLoading?: boolean;
  onSubmit: (values: { status: OrderStatus }) => void;
  onCancel?: () => void;
}

function OrderStatusUpdateForm({
  selectedOrder,
  isLoading,
  onSubmit,
  onCancel,
}: Props) {
  const [status, setStatus] = useState<OrderStatus>('PENDING');

  useEffect(() => {
    if (selectedOrder) {
      setStatus(selectedOrder.status);
    }
  }, [selectedOrder]);

  if (!selectedOrder) {
    return (
      <div className="order-form-card">
        <div className="order-form-header">
          <h3>Actualizar pedido</h3>
          <p>Selecciona un pedido de la tabla para actualizar su estado.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ status });
  };

  return (
    <form className="order-form-card" onSubmit={handleSubmit}>
      <div className="order-form-header">
        <h3>Actualizar pedido #{selectedOrder.id}</h3>
        <p>
          Cliente: {selectedOrder.user.firstName} {selectedOrder.user.lastName}
        </p>
      </div>

      <div className="order-summary-box">
        <div><strong>Estado actual:</strong> {selectedOrder.status}</div>
        <div><strong>Total:</strong> ${selectedOrder.total}</div>
        <div><strong>Items:</strong> {selectedOrder.items.length}</div>
      </div>

      <div className="order-form-group">
        <label htmlFor="order-status-select">Nuevo estado</label>
        <select
          id="order-status-select"
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
        >
          <option value="PENDING">Pendiente</option>
          <option value="IN_PREPARATION">En preparación</option>
          <option value="READY">Listo</option>
          <option value="DELIVERED">Entregado</option>
          <option value="CANCELLED">Cancelado</option>
        </select>
      </div>

      <div className="order-form-actions">
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
          {isLoading ? 'Actualizando...' : 'Guardar estado'}
        </button>
      </div>
    </form>
  );
}

export default OrderStatusUpdateForm;