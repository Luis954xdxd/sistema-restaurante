// Importamos iconos.
import { CheckCircle2, Clock, HandPlatter, MapPin, Timer } from 'lucide-react';

// Importamos tipos.
import type { Order, OrderStatus } from '../../orders/types/orders.types';

// Props que recibe la tarjeta del mesero.
interface Props {
  order: Order;
  isUpdating: boolean;
  onChangeStatus: (orderId: number, status: OrderStatus) => void;
}

// Formatear hora.
function formatTime(date: string) {
  return new Date(date).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Tarjeta del mesero.
function WaiterOrderCard({ order, isUpdating, onChangeStatus }: Props) {
  // Si el pedido tiene mesa, mostramos Mesa #.
  // Si no, mostramos Sin mesa.
  const tableLabel = order.tableNumber ? `Mesa #${order.tableNumber}` : 'Sin mesa';

  // Este pedido todavía lo está preparando cocina.
  const isInPreparation = order.status === 'IN_PREPARATION';

  // Este pedido ya está listo para entregar.
  const isReady = order.status === 'READY';

  return (
    <article className="waiter-order-card">
      <div className="waiter-order-card-header">
        <div>
          <span className="waiter-order-eyebrow">
            <MapPin size={15} />
            {tableLabel}
          </span>

          <h3>Pedido #{order.id}</h3>
        </div>

        {isInPreparation ? (
          <div className="waiter-status-badge pending">
            Pendiente en cocina
          </div>
        ) : (
          <div className="waiter-status-badge ready">
            Listo para entregar
          </div>
        )}
      </div>

      <div className="waiter-order-meta">
        <span>
          <Clock size={16} />
          {formatTime(order.createdAt)}
        </span>

        {isInPreparation ? (
          <span>
            <Timer size={16} />
            Esperando comida
          </span>
        ) : (
          <span>
            <HandPlatter size={16} />
            Llevar a mesa
          </span>
        )}
      </div>

      <div className="waiter-order-items">
        {order.items.map((item) => (
          <div key={item.id} className="waiter-order-item">
            <strong>{item.quantity}x</strong>
            <span>{item.product.name}</span>
          </div>
        ))}
      </div>

      <div className="waiter-order-total">
        <span>Total</span>
        <strong>${Number(order.total).toFixed(2)}</strong>
      </div>

      {isInPreparation && (
        <div className="waiter-waiting-box">
          Este pedido todavía está en cocina. Cuando el cocinero marque
          “Comida lista”, aquí aparecerá el botón para entregarlo.
        </div>
      )}

      {isReady && (
        <button
          type="button"
          className="waiter-deliver-button"
          disabled={isUpdating}
          onClick={() => onChangeStatus(order.id, 'DELIVERED')}
        >
          <CheckCircle2 size={18} />
          Marcar como entregado
        </button>
      )}
    </article>
  );
}

export default WaiterOrderCard;