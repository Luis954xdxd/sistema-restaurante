// Importamos React Query para consultas, mutaciones y refrescar datos
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Importamos helper para validar errores de Axios
import { isAxiosError } from 'axios';

// Importamos hooks de React
import { useEffect, useState } from 'react';

// Importamos UI base
import PageHeader from '../../../components/ui/PageHeader';
import '../../../components/ui/ui.css';

// Importamos componentes del módulo de pedidos
import OrderFilters from '../components/OrderFilters';
import OrderPaginationControls from '../components/OrderPaginationControls';
import OrdersTable from '../components/OrdersTable';
import OrderStatusUpdateForm from '../components/OrderStatusUpdateForm';

// Importamos servicios de pedidos
import { getOrders, updateOrderStatus } from '../services/orders.service';

// Importamos socket configurado
import { socket } from '../../../services/socket';

// Importamos estilos del módulo
import '../styles/orders.css';

// Importamos tipos
import type { Order, OrderStatus } from '../types/orders.types';

// Página principal de pedidos del administrador
function OrdersPage() {
  // Cliente de React Query para refrescar consultas
  const queryClient = useQueryClient();

  // Estado del filtro por estado
  const [status, setStatus] = useState('');

  // Estado del filtro por mesa
  const [tableNumber, setTableNumber] = useState('');

  // Estado del filtro por fecha
  const [date, setDate] = useState('');

  // Estado de página actual
  const [page, setPage] = useState(1);

  // Pedido seleccionado para gestionar estado
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mensaje normal de éxito o error
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Toast visual para pedidos recibidos en tiempo real
  const [realtimeToast, setRealtimeToast] = useState<string | null>(null);

  // Consulta para obtener pedidos
  const ordersQuery = useQuery({
    // La query cambia si cambian filtros o paginación
    queryKey: ['orders', status, tableNumber, date, page],

    // Función que pide los pedidos al backend
    queryFn: () =>
      getOrders({
        status: status ? (status as OrderStatus) : undefined,
        tableNumber: tableNumber ? Number(tableNumber) : undefined,
        date: date || undefined,
        page,
        limit: 5,
      }),

    // Respaldo por si socket falla: refresca cada 5 segundos
    refetchInterval: 5000,

    // Refresca cuando vuelves a la pestaña
    refetchOnWindowFocus: true,
  });

  // ==============================
  // SOCKET.IO: ESCUCHAR PEDIDOS NUEVOS
  // ==============================
  useEffect(() => {
    // Si el socket todavía no está conectado, lo conectamos
    if (!socket.connected) {
      socket.connect();
    }

    // Función que se ejecuta cuando llega un pedido nuevo
    const handleOrderCreated = (payload?: {
      order?: {
        id: number;
        tableNumber?: number | null;
      };
    }) => {
      // Armamos el texto de la mesa
      const tableText = payload?.order?.tableNumber
        ? `Mesa #${payload.order.tableNumber}`
        : 'Sin mesa';

      // Mostramos toast visual
      setRealtimeToast(`Nuevo pedido recibido - ${tableText}`);

      // Refrescamos lista de pedidos del admin
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      // Refrescamos dashboard del admin si lo tienes con esa key
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });

      // Intentamos reproducir sonido
      const audio = new Audio('/notification.mp3');

      audio.play().catch(() => {
        console.log(
          'El navegador bloqueó el sonido hasta que haya interacción.'
        );
      });
    };

    // Función que se ejecuta cuando un pedido cambia de estado
    const handleOrderUpdated = () => {
      // Refrescamos pedidos
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      // Refrescamos dashboard
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    };

    // Registramos eventos
    socket.on('order:created', handleOrderCreated);
    socket.on('order:updated', handleOrderUpdated);

    // Limpiamos eventos cuando sales de esta página
    return () => {
      socket.off('order:created', handleOrderCreated);
      socket.off('order:updated', handleOrderUpdated);
    };
  }, [queryClient]);

  // ==============================
  // PASO 3: OCULTAR TOAST AUTOMÁTICAMENTE
  // ==============================
  useEffect(() => {
    // Si no hay toast activo, no hacemos nada
    if (!realtimeToast) return;

    // Esperamos 4 segundos y ocultamos el toast
    const timeout = setTimeout(() => {
      setRealtimeToast(null);
    }, 4000);

    // Limpiamos el temporizador si cambia el toast o se desmonta el componente
    return () => clearTimeout(timeout);
  }, [realtimeToast]);

  // Mutación para cambiar estado del pedido
  const updateStatusMutation = useMutation({
    // Función que manda la actualización al backend
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: { status: OrderStatus };
    }) => updateOrderStatus(id, payload),

    // Cuando se actualiza correctamente
    onSuccess: (response) => {
      // Mostramos mensaje de éxito
      setFeedback({ type: 'success', text: response.message });

      // Refrescamos pedidos
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      // Refrescamos dashboard
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });

      // Quitamos pedido seleccionado
      setSelectedOrder(null);
    },

    // Cuando ocurre un error
    onError: (error: unknown) => {
      // Si es error de Axios, usamos mensaje del backend
      if (isAxiosError(error)) {
        setFeedback({
          type: 'error',
          text:
            error.response?.data?.message ||
            'No se pudo actualizar el pedido',
        });
      } else {
        // Error genérico
        setFeedback({
          type: 'error',
          text: 'Error inesperado al actualizar el pedido',
        });
      }
    },
  });

  // Selecciona pedido para gestionarlo
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setFeedback(null);
  };

  // Envía nuevo estado del pedido
  const handleSubmitStatus = (values: { status: OrderStatus }) => {
    if (!selectedOrder) return;

    setFeedback(null);

    updateStatusMutation.mutate({
      id: selectedOrder.id,
      payload: values,
    });
  };

  // Limpia filtros
  const handleResetFilters = () => {
    setStatus('');
    setTableNumber('');
    setDate('');
    setPage(1);
  };

  // Pedidos obtenidos
  const orders = ordersQuery.data?.data ?? [];

  // Datos de paginación
  const pagination = ordersQuery.data?.pagination;

  return (
    <div>
      <PageHeader
        title="Pedidos"
        subtitle="Consulta, filtra y actualiza el estado de los pedidos"
      />

      {/* ==============================
          PASO 4: MOSTRAR TOAST VISUAL
      ============================== */}
      {realtimeToast && (
        <div className="realtime-order-toast">
          <div className="realtime-order-toast-icon">🔔</div>

          <div>
            <strong>{realtimeToast}</strong>
            <span>La lista se actualizó automáticamente.</span>
          </div>
        </div>
      )}

      {/* Mensaje normal de éxito o error */}
      {feedback && (
        <div
          className={`feedback-message ${
            feedback.type === 'success' ? 'feedback-success' : 'feedback-error'
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="orders-page-grid">
        <OrderStatusUpdateForm
          selectedOrder={selectedOrder}
          isLoading={updateStatusMutation.isPending}
          onSubmit={handleSubmitStatus}
          onCancel={() => setSelectedOrder(null)}
        />

        <div className="order-panel-card">
          <h3>Listado de pedidos</h3>
          <p>Consulta pedidos y administra sus estados.</p>

          <OrderFilters
            status={status}
            tableNumber={tableNumber}
            date={date}
            onStatusChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            onTableNumberChange={(value) => {
              setTableNumber(value);
              setPage(1);
            }}
            onDateChange={(value) => {
              setDate(value);
              setPage(1);
            }}
            onReset={handleResetFilters}
          />

          {ordersQuery.isLoading ? (
            <div className="order-empty-state">Cargando pedidos...</div>
          ) : ordersQuery.isError ? (
            <div className="order-empty-state">
              No se pudieron cargar los pedidos.
            </div>
          ) : (
            <>
              <OrdersTable orders={orders} onSelect={handleSelectOrder} />

              {pagination && (
                <OrderPaginationControls
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  hasNextPage={pagination.hasNextPage}
                  hasPreviousPage={pagination.hasPreviousPage}
                  onChangePage={setPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;