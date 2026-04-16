// Importamos useMemo y useState para manejar el valor seleccionado
import { useMemo, useState } from 'react';

// Importamos tipos del módulo de pedidos
import type { Order, OrderStatus } from '../types/orders.types';

// Definimos las props del componente
interface Props {
  // Pedido seleccionado desde la tabla
  selectedOrder: Order | null;

  // Estado de carga opcional para deshabilitar acciones
  isLoading?: boolean;

  // Función que se ejecuta al guardar
  onSubmit: (values: { status: OrderStatus }) => void;

  // Función opcional para cancelar
  onCancel?: () => void;
}

// Componente para actualizar el estado de un pedido
function OrderStatusUpdateForm({
  selectedOrder,
  isLoading,
  onSubmit,
  onCancel,
}: Props) {
  // Guardamos el id del pedido que ya fue inicializado localmente
  const [initializedOrderId, setInitializedOrderId] = useState<number | null>(null);

  // Guardamos el estado local editable
  const [status, setStatus] = useState<OrderStatus>('PENDING');

  // Calculamos si el pedido actual cambió con respecto al último inicializado
  const selectedOrderChanged = useMemo(() => {
    return selectedOrder?.id !== initializedOrderId;
  }, [selectedOrder?.id, initializedOrderId]);

  // Si no hay pedido seleccionado, mostramos mensaje base
  if (!selectedOrder) {
    return (
      <div className="employee-order-form-card">
        <div className="employee-order-form-header">
          <h3>Actualizar pedido</h3>
          <p>Selecciona un pedido de la tabla para actualizar su estado.</p>
        </div>
      </div>
    );
  }

  // Si cambió el pedido seleccionado y todavía no lo inicializamos,
  // actualizamos los estados locales una sola vez durante render controlado
  if (selectedOrderChanged) {
    setInitializedOrderId(selectedOrder.id);
    setStatus(selectedOrder.status);
  }

  // Al enviar el formulario usamos el estado local actual
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ status });
  };

  return (
    <form className="employee-order-form-card" onSubmit={handleSubmit}>
      <div className="employee-order-form-header">
        <h3>Actualizar pedido #{selectedOrder.id}</h3>
        <p>
          Cliente: {selectedOrder.user.firstName} {selectedOrder.user.lastName}
        </p>
      </div>

      <div className="employee-order-summary-box">
        <div>
          <strong>Estado actual:</strong> {selectedOrder.status}
        </div>

        <div>
          <strong>Total:</strong> ${selectedOrder.total}
        </div>

        <div>
          <strong>Items:</strong> {selectedOrder.items.length}
        </div>
      </div>

      <div className="employee-order-form-group">
        <label htmlFor="employee-order-status-select">Nuevo estado</label>

        <select
          id="employee-order-status-select"
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

      <div className="employee-order-form-actions">
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

        <button
          type="submit"
          className="button-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Actualizando...' : 'Guardar estado'}
        </button>
      </div>
    </form>
  );
}

// Exportamos el componente
export default OrderStatusUpdateForm;