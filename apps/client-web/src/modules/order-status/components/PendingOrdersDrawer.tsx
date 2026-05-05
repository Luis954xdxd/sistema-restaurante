// Importamos hooks de React.
import { useCallback, useEffect, useState } from 'react';

// Importamos Link para navegar.
import { Link } from 'react-router-dom';

// Importamos socket para actualizar en tiempo real.
import { socket } from '../../../services/socket';

// Importamos servicio para obtener estado de pedidos.
import { getPublicOrderStatus } from '../services/orderStatus.service';

// Importamos función para quitar pedidos pagados.
import { removePendingOrderId } from '../storage/pendingOrders.storage';

// Importamos tipos.
import type {
  ClientOrderStatus,
  ClientOrderStatusData,
} from '../types/orderStatus.types';

// Props del componente.
interface Props {
  isOpen: boolean;
  orderIds: number[];
  onClose: () => void;
  onPendingOrdersChanged: () => void;
}

// Convertir estado técnico a texto.
function getStatusLabel(status: string) {
  if (status === 'PENDING') return 'Pendiente';
  if (status === 'IN_PREPARATION') return 'En preparación';
  if (status === 'READY') return 'Comida lista';
  if (status === 'DELIVERED') return 'Entregado';
  if (status === 'CANCELLED') return 'Cancelado';

  return status;
}

// Drawer de pedidos pendientes.
function PendingOrdersDrawer({
  isOpen,
  orderIds,
  onClose,
  onPendingOrdersChanged,
}: Props) {
  // Estado de carga.
  const [loading, setLoading] = useState(false);

  // Pedidos cargados.
  const [orders, setOrders] = useState<ClientOrderStatusData[]>([]);

  // Mensaje de error.
  const [error, setError] = useState<string | null>(null);

  // Mensaje visual cuando cambia un estado.
  const [realtimeMessage, setRealtimeMessage] = useState<string | null>(null);

  // Función para cargar pedidos pendientes.
  const loadOrders = useCallback(async () => {
    // Si no hay IDs, limpiamos.
    if (orderIds.length === 0) {
      setOrders([]);
      return;
    }

    try {
      // Activamos carga solo si todavía no hay pedidos mostrados.
      if (orders.length === 0) {
        setLoading(true);
      }

      // Limpiamos error anterior.
      setError(null);

      // Pedimos todos los pedidos por ID.
      const responses = await Promise.all(
        orderIds.map((orderId) => getPublicOrderStatus(orderId))
      );

      // Extraemos el order de cada respuesta.
      const loadedOrders = responses.map((response) => response.order);

      // Quitamos pedidos cancelados si no quieres mostrarlos.
      const visibleOrders = loadedOrders.filter(
        (order) => order.status !== 'CANCELLED'
      );

      // Guardamos pedidos.
      setOrders(visibleOrders);
    } catch {
      // Mostramos error.
      setError('No se pudieron cargar tus pedidos pendientes.');
    } finally {
      // Apagamos carga.
      setLoading(false);
    }
  }, [orderIds, orders.length]);

  // Cargar pedidos cuando se abre el drawer.
  useEffect(() => {
    if (!isOpen) return;

    loadOrders();
  }, [isOpen, loadOrders]);

  // Escuchar cambios en tiempo real con Socket.IO.
  useEffect(() => {
    // Si el drawer está cerrado, no escuchamos.
    if (!isOpen) return;

    // Si no hay pedidos pendientes, no escuchamos.
    if (orderIds.length === 0) return;

    // Conectamos socket si todavía no está conectado.
    if (!socket.connected) {
      socket.connect();
    }

    // Cuando cocina o mesero cambia un pedido.
    const handleOrderUpdated = (payload?: {
      order?: {
        id: number;
        status: ClientOrderStatus;
        tableNumber?: number | null;
      };
    }) => {
      // Si no viene pedido, salimos.
      if (!payload?.order) return;

      // Si el pedido actualizado no está en esta lista pendiente, salimos.
      if (!orderIds.includes(payload.order.id)) return;

      // Mostramos mensaje visual.
      setRealtimeMessage(
        `Pedido #${payload.order.id}: ${getStatusLabel(payload.order.status)}`
      );

      // Recargamos los pedidos del drawer.
      loadOrders();
    };

    // Registramos el evento.
    socket.on('order:updated', handleOrderUpdated);

    // Limpiamos evento al cerrar o desmontar.
    return () => {
      socket.off('order:updated', handleOrderUpdated);
    };
  }, [isOpen, orderIds, loadOrders]);

  // Respaldo: si por alguna razón Socket.IO falla, refrescamos cada 5 segundos.
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      loadOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen, loadOrders]);

  // Ocultar mensaje de tiempo real.
  useEffect(() => {
    if (!realtimeMessage) return;

    const timeout = setTimeout(() => {
      setRealtimeMessage(null);
    }, 3500);

    return () => clearTimeout(timeout);
  }, [realtimeMessage]);

  // Si está cerrado, no renderizamos.
  if (!isOpen) return null;

  // Función para pagar un pedido.
  const handlePayOrder = (orderId: number) => {
    // Quitamos el pedido de pendientes localmente.
    removePendingOrderId(orderId);

    // Avisamos al usuario.
    window.alert('Pago registrado correctamente.');

    // Avisamos al menú para actualizar contador.
    onPendingOrdersChanged();
  };

  return (
    <div className="client-pending-overlay">
      <aside className="client-pending-drawer">
        <div className="client-pending-header">
          <div>
            <h2>Pedidos pendientes</h2>
            <p>
              Pedidos realizados en este dispositivo que todavía no se han
              pagado.
            </p>
          </div>

          <button type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        {realtimeMessage && (
          <div className="client-pending-realtime-message">
            {realtimeMessage}
          </div>
        )}

        {loading ? (
          <div className="client-pending-empty">
            Cargando pedidos pendientes...
          </div>
        ) : error ? (
          <div className="client-pending-empty">{error}</div>
        ) : orders.length === 0 ? (
          <div className="client-pending-empty">
            No tienes pedidos pendientes de pago.
          </div>
        ) : (
          <div className="client-pending-list">
            {orders.map((order) => {
              const canPay = order.status === 'DELIVERED';

              return (
                <article key={order.id} className="client-pending-card">
                  <div className="client-pending-card-top">
                    <div>
                      <span>
                        {order.tableNumber
                          ? `Mesa #${order.tableNumber}`
                          : 'Sin mesa'}
                      </span>

                      <h3>Pedido #{order.id}</h3>
                    </div>

                    <strong>${Number(order.total).toFixed(2)}</strong>
                  </div>

                  <div
                    className={`client-pending-status ${order.status.toLowerCase()}`}
                  >
                    {getStatusLabel(order.status)}
                  </div>

                  <div className="client-pending-items">
                    {order.items.map((item) => (
                      <p key={item.id}>
                        {item.quantity}x {item.product.name}
                      </p>
                    ))}
                  </div>

                  <div className="client-pending-actions">
                    <Link
                      to={`/order-status/${order.id}`}
                      className="client-pending-link"
                      onClick={onClose}
                    >
                      Ver estado
                    </Link>

                    <button
                      type="button"
                      className="client-pending-pay-button"
                      disabled={!canPay}
                      onClick={() => handlePayOrder(order.id)}
                    >
                      {canPay ? 'Pagar' : 'Espera entrega'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </aside>
    </div>
  );
}

export default PendingOrdersDrawer;