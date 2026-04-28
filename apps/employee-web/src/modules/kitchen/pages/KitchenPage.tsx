// Importamos React Query.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Importamos Axios helper.
import { isAxiosError } from 'axios';

// Importamos hooks de React.
import { useEffect, useMemo, useState } from 'react';

// Importamos UI.
import PageHeader from '../../../components/ui/PageHeader';
import '../../../components/ui/ui.css';

// Importamos socket.
import { socket } from '../../../services/socket';

// Importamos componente de tarjeta.
import KitchenOrderCard from '../components/KitchenOrderCard';

// Importamos servicios.
import {
  getInPreparationKitchenOrders,
  getPendingKitchenOrders,
  updateKitchenOrderStatus,
} from '../services/kitchen.service';

// Importamos estilos.
import '../styles/kitchen.css';

// Importamos tipos.
import type { Order, OrderStatus } from '../../orders/types/orders.types';

// Página principal para cocinero.
function KitchenPage() {
  // Cliente de React Query.
  const queryClient = useQueryClient();

  // Mensaje visual.
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Toast de pedido nuevo.
  const [realtimeToast, setRealtimeToast] = useState<string | null>(null);

  // Query de pedidos pendientes.
  const pendingQuery = useQuery({
    queryKey: ['kitchen-orders-pending'],
    queryFn: getPendingKitchenOrders,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  // Query de pedidos en preparación.
  const inPreparationQuery = useQuery({
    queryKey: ['kitchen-orders-in-preparation'],
    queryFn: getInPreparationKitchenOrders,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  // Juntamos ambos grupos en una lista.
  const orders: Order[] = useMemo(() => {
    const pending = pendingQuery.data?.data ?? [];
    const inPreparation = inPreparationQuery.data?.data ?? [];

    return [...pending, ...inPreparation].sort((a, b) => b.id - a.id);
  }, [pendingQuery.data, inPreparationQuery.data]);

  // Mutación para cambiar estado.
  const updateStatusMutation = useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: number;
      status: OrderStatus;
    }) => updateKitchenOrderStatus(orderId, status),

    onSuccess: (response) => {
      setFeedback({
        type: 'success',
        text: response.message,
      });

      queryClient.invalidateQueries({ queryKey: ['kitchen-orders-pending'] });
      queryClient.invalidateQueries({
        queryKey: ['kitchen-orders-in-preparation'],
      });
      queryClient.invalidateQueries({ queryKey: ['employee-orders'] });
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

  // Conexión Socket.IO.
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleOrderCreated = (payload?: {
      order?: {
        id: number;
        tableNumber?: number | null;
      };
    }) => {
      const tableText = payload?.order?.tableNumber
        ? `Mesa #${payload.order.tableNumber}`
        : 'Sin mesa';

      setRealtimeToast(`Nuevo pedido para cocina - ${tableText}`);

      queryClient.invalidateQueries({ queryKey: ['kitchen-orders-pending'] });
      queryClient.invalidateQueries({
        queryKey: ['kitchen-orders-in-preparation'],
      });

      const audio = new Audio('/notification.mp3');

      audio.play().catch(() => {
        console.log('El navegador bloqueó el sonido hasta que haya interacción.');
      });
    };

    const handleOrderUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders-pending'] });
      queryClient.invalidateQueries({
        queryKey: ['kitchen-orders-in-preparation'],
      });
    };

    socket.on('order:created', handleOrderCreated);
    socket.on('order:updated', handleOrderUpdated);

    return () => {
      socket.off('order:created', handleOrderCreated);
      socket.off('order:updated', handleOrderUpdated);
    };
  }, [queryClient]);

  // Ocultar toast automáticamente.
  useEffect(() => {
    if (!realtimeToast) return;

    const timeout = setTimeout(() => {
      setRealtimeToast(null);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [realtimeToast]);

  // Función para actualizar estado desde tarjeta.
  const handleChangeStatus = (orderId: number, status: OrderStatus) => {
    setFeedback(null);

    updateStatusMutation.mutate({
      orderId,
      status,
    });
  };

  // Estado de carga.
  const isLoading = pendingQuery.isLoading || inPreparationQuery.isLoading;

  // Estado de error.
  const isError = pendingQuery.isError || inPreparationQuery.isError;

  return (
    <div>
      <PageHeader
        title="Cocina"
        subtitle="Gestiona pedidos pendientes y en preparación"
      />

      {realtimeToast && (
        <div className="kitchen-realtime-toast">
          <div className="kitchen-realtime-toast-icon">🔔</div>

          <div>
            <strong>{realtimeToast}</strong>
            <span>La lista de cocina se actualizó automáticamente.</span>
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

      {isLoading ? (
        <div className="kitchen-empty-state">Cargando pedidos de cocina...</div>
      ) : isError ? (
        <div className="kitchen-empty-state">
          No se pudieron cargar los pedidos.
        </div>
      ) : orders.length === 0 ? (
        <div className="kitchen-empty-state">
          No hay pedidos pendientes para cocina.
        </div>
      ) : (
        <div className="kitchen-orders-grid">
          {orders.map((order) => (
            <KitchenOrderCard
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

export default KitchenPage;