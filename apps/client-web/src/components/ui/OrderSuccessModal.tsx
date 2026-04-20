// Importamos iconos
import { CheckCircle2, X } from 'lucide-react';

// Props del modal
interface Props {
  isOpen: boolean;
  order: {
    id: number;
    status: string;
    subtotal: string;
    tipAmount: string;
    total: string;
    tableNumber?: number | null;
    createdAt: string;
  } | null;
  onClose: () => void;
}

// Modal de éxito al realizar pedido
function OrderSuccessModal({ isOpen, order, onClose }: Props) {
  // Si no está abierto o no hay pedido, no renderiza nada
  if (!isOpen || !order) return null;

  return (
    <div className="client-modal-overlay" onClick={onClose}>
      <div
        className="client-modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="client-modal-close"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <div className="client-modal-icon success">
          <CheckCircle2 size={28} />
        </div>

        <h3>¡Pedido realizado!</h3>
        <p>
          Tu pedido fue enviado correctamente a cocina. En unos momentos será
          atendido por el personal.
        </p>

        <div className="client-order-success-summary">
          <div>
            <span>Pedido</span>
            <strong>#{order.id}</strong>
          </div>

          <div>
            <span>Estado</span>
            <strong>{order.status}</strong>
          </div>

          {order.tableNumber ? (
            <div>
              <span>Mesa</span>
              <strong>#{order.tableNumber}</strong>
            </div>
          ) : null}

          <div>
            <span>Subtotal</span>
            <strong>${order.subtotal}</strong>
          </div>

          <div>
            <span>Propina</span>
            <strong>${order.tipAmount}</strong>
          </div>

          <div>
            <span>Total</span>
            <strong>${order.total}</strong>
          </div>

          <div>
            <span>Fecha</span>
            <strong>{new Date(order.createdAt).toLocaleString()}</strong>
          </div>
        </div>

        <button
          type="button"
          className="client-modal-primary-button"
          onClick={onClose}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}

export default OrderSuccessModal;