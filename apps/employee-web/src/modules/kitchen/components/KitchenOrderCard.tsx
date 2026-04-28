// Importamos iconos.
import { ChefHat, Clock, Flame, CheckCircle2 } from 'lucide-react';

// Importamos tipo de pedido.
import type { Order, OrderStatus } from '../../orders/types/orders.types';

// Props que recibe la tarjeta.
interface Props {
  // Pedido que se mostrará.
  order: Order;

  // Indica si una actualización está cargando.
  isUpdating: boolean;

  // Función para cambiar el estado.
  onChangeStatus: (orderId: number, status: OrderStatus) => void;
}

// Función para mostrar fecha/hora legible.
function formatTime(date: string) {
  return new Date(date).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Tarjeta visual para el cocinero.
function KitchenOrderCard({ order, isUpdating, onChangeStatus }: Props) {
  // Validamos mesa.
  const tableLabel = order.tableNumber ? `Mesa #${order.tableNumber}` : 'Sin mesa';

  // Saber si el pedido está pendiente.
  const isPending = order.status === 'PENDING';

  // Saber si el pedido está en preparación.
  const isInPreparation = order.status === 'IN_PREPARATION';

  return (
    <article className="kitchen-order-card">
      <div className="kitchen-order-card-header">
        <div>
          <span className="kitchen-order-eyebrow">{tableLabel}</span>
          <h3>Pedido #{order.id}</h3>
        </div>

        <div className={`kitchen-status-badge kitchen-status-${order.status.toLowerCase()}`}>
          {order.status === 'PENDING' ? 'Pendiente' : 'En preparación'}
        </div>
      </div>

      <div className="kitchen-order-meta">
        <span>
          <Clock size={16} />
          {formatTime(order.createdAt)}
        </span>

        <span>
          <ChefHat size={16} />
          {order.items.length} producto(s)
        </span>
      </div>

      <div className="kitchen-order-items">
        {order.items.map((item) => (
          <div key={item.id} className="kitchen-order-item">
            <strong>{item.quantity}x</strong>
            <span>{item.product.name}</span>
          </div>
        ))}
      </div>

      <div className="kitchen-order-total">
        <span>Total</span>
        <strong>${Number(order.total).toFixed(2)}</strong>
      </div>

      <div className="kitchen-order-actions">
        {isPending && (
          <button
            type="button"
            className="kitchen-action-button start"
            disabled={isUpdating}
            onClick={() => onChangeStatus(order.id, 'IN_PREPARATION')}
          >
            <Flame size={18} />
            En preparación
          </button>
        )}

        {isInPreparation && (
          <button
            type="button"
            className="kitchen-action-button ready"
            disabled={isUpdating}
            onClick={() => onChangeStatus(order.id, 'READY')}
          >
            <CheckCircle2 size={18} />
            Comida lista
          </button>
        )}
      </div>
    </article>
  );
}

export default KitchenOrderCard;