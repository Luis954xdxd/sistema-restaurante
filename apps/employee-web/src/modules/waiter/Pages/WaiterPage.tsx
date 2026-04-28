// Importamos React Query.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Importamos Axios helper.
import { isAxiosError } from 'axios';

// Importamos hooks.
import { useEffect, useState } from 'react';

// Importamos UI.
import PageHeader from '../../../components/ui/PageHeader';
import '../../../components/ui/ui.css';

// Importamos socket.
import { socket } from '../../../services/socket';

// Importamos tarjeta.
import WaiterOrderCard from '../components/WaiterOrderCard';

// Importamos servicios.
import {
  getWaiterOrders,
  updateWaiterOrderStatus,
} from '../services/waiter.service';

// Importamos estilos.
import '../styles/waiter.css';

// Importamos tipos.
import type { OrderStatus } from '../../orders/types/orders.types';

// Página del mesero.
function WaiterPage() {
  const queryClient = useQueryClient();

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [realtimeToast, setRealtimeToast] = useState<string | null>(null);

  // Ahora el mesero ve pedidos IN_PREPARATION y READY.
  const waiterOrdersQuery = useQuery({
    queryKey: ['waiter-orders'],
    queryFn: getWaiterOrders,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: number;
      status: OrderStatus;
    }) => updateWaiterOrderStatus(orderId, status),

    onSuccess: (response) => {
      setFeedback({
        type: 'success',
        text: response.message,
      });

      queryClient.invalidateQueries({ queryKey: ['waiter-orders'] });
      queryClient.invalidateQueries({ queryKey: ['employee-orders'] });
      queryClient.invalidateQueries({
        queryKey: ['employee-dashboard-summary'],
      });
    },

    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        setFeedback({
          type: 'error',
          text:
            error.response?.data?.message ||
            'No se pudo actualizar el pedido',
        });
      } else {
        setFeedback({
          type: 'error',
          text: 'Error inesperado al actualizar el pedido',
        });
      }
    },
  });

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleOrderUpdated = (payload?: {
      order?: {
        id: number;
        status?: string;
        tableNumber?: number | null;
      };
    }) => {
      queryClient.invalidateQueries({ queryKey: ['waiter-orders'] });

      const tableText = payload?.order?.tableNumber
        ? `Mesa #${payload.order.tableNumber}`
        : 'Sin mesa';

      if (payload?.order?.status === 'IN_PREPARATION') {
        setRealtimeToast(`Pedido pendiente para mesero - ${tableText}`);
      }

      if (payload?.order?.status === 'READY') {
        setRealtimeToast(`Pedido listo para entregar - ${tableText}`);

        const audio = new Audio('/notification.mp3');

        audio.play().catch(() => {
          console.log(
            'El navegador bloqueó el sonido hasta que haya interacción.'
          );
        });
      }
    };

    socket.on('order:updated', handleOrderUpdated);

    return () => {
      socket.off('order:updated', handleOrderUpdated);
    };
  }, [queryClient]);

  useEffect(() => {
    if (!realtimeToast) return;

    const timeout = setTimeout(() => {
      setRealtimeToast(null);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [realtimeToast]);

  const handleChangeStatus = (orderId: number, status: OrderStatus) => {
    setFeedback(null);

    updateStatusMutation.mutate({
      orderId,
      status,
    });
  };

  const orders = waiterOrdersQuery.data?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Mesero"
        subtitle="Vigila pedidos en cocina y entrega los pedidos listos"
      />

      {realtimeToast && (
        <div className="waiter-realtime-toast">
          <div className="waiter-realtime-toast-icon">🔔</div>

          <div>
            <strong>{realtimeToast}</strong>
            <span>La lista del mesero se actualizó automáticamente.</span>
          </div>
        </div>
      )}

      {feedback && (
        <div
          className={`feedback-message ${
            feedback.type === 'success' ? 'feedback-success' : 'feedback-error'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {waiterOrdersQuery.isLoading ? (
        <div className="waiter-empty-state">
          Cargando pedidos del mesero...
        </div>
      ) : waiterOrdersQuery.isError ? (
        <div className="waiter-empty-state">
          No se pudieron cargar los pedidos.
        </div>
      ) : orders.length === 0 ? (
        <div className="waiter-empty-state">
          No hay pedidos pendientes ni listos para entregar.
        </div>
      ) : (
        <div className="waiter-orders-grid">
          {orders.map((order) => (
            <WaiterOrderCard
              key={order.id}
              order={order}
              isUpdating={updateStatusMutation.isPending}
              onChangeStatus={handleChangeStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default WaiterPage;