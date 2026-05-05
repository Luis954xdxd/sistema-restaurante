// Importamos React Query para consultar datos del pedido.
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Importamos hooks de React.
import { useEffect, useMemo, useState } from 'react';

// Importamos herramientas de rutas.
import { Link, useParams } from 'react-router-dom';

// Importamos socket.
import { socket } from '../../../services/socket';

// Importamos servicio.
import { getPublicOrderStatus } from '../services/orderStatus.service';

// Importamos estilos.
import '../styles/orderStatus.css';

// Importamos tipos.
import type {
  ClientOrderStatus,
  ClientOrderStatusData,
} from '../types/orderStatus.types';

// Pasos visuales del pedido.
const ORDER_STEPS: {
  status: ClientOrderStatus;
  title: string;
  description: string;
}[] = [
  {
    status: 'PENDING',
    title: 'Pedido recibido',
    description: 'Tu pedido ya fue enviado a cocina.',
  },
  {
    status: 'IN_PREPARATION',
    title: 'En preparación',
    description: 'El cocinero ya está preparando tu comida.',
  },
  {
    status: 'READY',
    title: 'Comida lista',
    description: 'Tu pedido está listo para ser entregado por el mesero.',
  },
  {
    status: 'DELIVERED',
    title: 'Entregado',
    description: 'Tu pedido fue entregado en la mesa.',
  },
];

// Función para convertir estado técnico a texto bonito.
function getStatusLabel(status: ClientOrderStatus) {
  if (status === 'PENDING') return 'Pendiente';
  if (status === 'IN_PREPARATION') return 'En preparación';
  if (status === 'READY') return 'Comida lista';
  if (status === 'DELIVERED') return 'Entregado';
  if (status === 'CANCELLED') return 'Cancelado';

  return status;
}

// Función para saber el índice actual del progreso.
function getStepIndex(status: ClientOrderStatus) {
  if (status === 'PENDING') return 0;
  if (status === 'IN_PREPARATION') return 1;
  if (status === 'READY') return 2;
  if (status === 'DELIVERED') return 3;

  return 0;
}

// Página del estado del pedido.
function OrderStatusPage() {
  // Obtenemos el ID del pedido desde la URL.
  const { orderId } = useParams();

  // React Query client para actualizar datos manualmente.
  const queryClient = useQueryClient();

  // Estado local para mostrar toast visual.
  const [toast, setToast] = useState<string | null>(null);

  // Convertimos orderId a número.
  const parsedOrderId = Number(orderId);

  // Query para obtener estado inicial del pedido.
  const orderQuery = useQuery({
    queryKey: ['client-order-status', parsedOrderId],

    queryFn: () => getPublicOrderStatus(parsedOrderId),

    enabled: Number.isInteger(parsedOrderId) && parsedOrderId > 0,

    // Respaldo por si socket falla.
    refetchInterval: 5000,

    refetchOnWindowFocus: true,
  });

  // Pedido actual.
  const order: ClientOrderStatusData | null = orderQuery.data?.order ?? null;

  // Índice actual del paso.
  const currentStepIndex = useMemo(() => {
    if (!order) return 0;

    return getStepIndex(order.status);
  }, [order]);

  // Conectar Socket.IO para escuchar cambios del pedido.
  useEffect(() => {
    // Si el ID no es válido, no escuchamos nada.
    if (!Number.isInteger(parsedOrderId) || parsedOrderId <= 0) return;

    // Conectamos socket si no está conectado.
    if (!socket.connected) {
      socket.connect();
    }

    // Evento cuando un pedido cambia de estado.
    const handleOrderUpdated = (payload?: {
      order?: {
        id: number;
        status: ClientOrderStatus;
        tableNumber?: number | null;
      };
    }) => {
      // Si el evento no trae pedido, salimos.
      if (!payload?.order) return;

      // Si el pedido actualizado no es el del cliente actual, salimos.
      if (payload.order.id !== parsedOrderId) return;

      // Refrescamos la query del pedido actual.
      queryClient.invalidateQueries({
        queryKey: ['client-order-status', parsedOrderId],
      });

      // Mostramos mensaje visual.
      setToast(`Estado actualizado: ${getStatusLabel(payload.order.status)}`);
    };

    // Registramos listener.
    socket.on('order:updated', handleOrderUpdated);

    // Limpiamos listener al salir de la página.
    return () => {
      socket.off('order:updated', handleOrderUpdated);
    };
  }, [parsedOrderId, queryClient]);

  // Ocultar toast automáticamente.
  useEffect(() => {
    if (!toast) return;

    const timeout = setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => clearTimeout(timeout);
  }, [toast]);

  // Si el ID no es válido.
  if (!Number.isInteger(parsedOrderId) || parsedOrderId <= 0) {
    return (
      <div className="client-order-status-page">
        <div className="client-order-status-card">
          <h1>Pedido no válido</h1>
          <p>No encontramos el número de pedido.</p>

          <Link to="/menu" className="client-order-status-link">
            Volver al menú
          </Link>
        </div>
      </div>
    );
  }

  // Estado de carga.
  if (orderQuery.isLoading) {
    return (
      <div className="client-order-status-page">
        <div className="client-order-status-card">
          <h1>Cargando pedido...</h1>
          <p>Estamos consultando el estado de tu pedido.</p>
        </div>
      </div>
    );
  }

  // Estado de error.
  if (orderQuery.isError || !order) {
    return (
      <div className="client-order-status-page">
        <div className="client-order-status-card">
          <h1>No se pudo cargar el pedido</h1>
          <p>Intenta nuevamente en unos segundos.</p>

          <Link to="/menu" className="client-order-status-link">
            Volver al menú
          </Link>
        </div>
      </div>
    );
  }

  // Si el pedido fue cancelado.
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="client-order-status-page">
      {toast && (
        <div className="client-order-status-toast">
          <strong>{toast}</strong>
          <span>La pantalla se actualizó automáticamente.</span>
        </div>
      )}

      <section className="client-order-status-card">
        <div className="client-order-status-header">
          <div>
            <span className="client-order-status-eyebrow">
              {order.tableNumber ? `Mesa #${order.tableNumber}` : 'Sin mesa'}
            </span>

            <h1>Pedido #{order.id}</h1>

            <p>
              Estado actual:{' '}
              <strong className={`client-order-status-label ${order.status.toLowerCase()}`}>
                {getStatusLabel(order.status)}
              </strong>
            </p>
          </div>

          <div className="client-order-status-total">
            <span>Total</span>
            <strong>${Number(order.total).toFixed(2)}</strong>
          </div>
        </div>

        {isCancelled ? (
          <div className="client-order-cancelled-box">
            Tu pedido fue cancelado. Consulta con el personal del restaurante.
          </div>
        ) : (
          <div className="client-order-timeline">
            {ORDER_STEPS.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div
                  key={step.status}
                  className={`client-order-step ${
                    isCompleted ? 'completed' : ''
                  } ${isCurrent ? 'current' : ''}`}
                >
                  <div className="client-order-step-marker">
                    {isCompleted ? '✓' : index + 1}
                  </div>

                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="client-order-status-items">
          <h2>Detalle del pedido</h2>

          {order.items.map((item) => (
            <div key={item.id} className="client-order-status-item">
              <span>
                {item.quantity}x {item.product.name}
              </span>
            </div>
          ))}
        </div>
            



            <div className="client-order-status-actions">
    <button
         type="button"
                className="client-order-pay-button"
                disabled={order.status !== 'DELIVERED'}
            onClick={() => {
             window.alert('Aquí se abrirá la pantalla de pago.');
            }}
        >
            Pagar
        </button>

  <Link to="/menu" className="client-order-status-link secondary">
    Volver al menú
  </Link>
</div>
        
      </section>
    </div>
  );
}

export default OrderStatusPage;