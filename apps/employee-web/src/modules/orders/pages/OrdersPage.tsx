// Importamos React Query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
// Importamos useState para filtros y selección
import { useState } from 'react';

// Importamos UI base
import PageHeader from '../../../components/ui/PageHeader';
import '../../../components/ui/ui.css';

// Importamos componentes del módulo
import OrderFilters from '../components/OrderFilters';
import OrderPaginationControls from '../components/OrderPaginationControls';
import OrdersTable from '../components/OrdersTable';
import OrderStatusUpdateForm from '../components/OrderStatusUpdateForm';

// Importamos servicios
import { getOrders, updateOrderStatus } from '../services/orders.service';

// Importamos estilos del módulo
import '../styles/orders.css';

// Importamos tipos
import type { Order, OrderStatus } from '../types/orders.types';

// Página real de pedidos del empleado
function OrdersPage() {
  const queryClient = useQueryClient();

  // Estado del filtro status
  const [status, setStatus] = useState('');

  // Estado del filtro userId
  const [userId, setUserId] = useState('');

  // Estado del filtro fecha
  const [date, setDate] = useState('');

  // Estado de página actual
  const [page, setPage] = useState(1);

  // Pedido seleccionado para gestionar
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mensaje visual
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Query para obtener pedidos
  const ordersQuery = useQuery({
    queryKey: ['employee-orders', status, userId, date, page],
    queryFn: () =>
      getOrders({
        status: status ? (status as OrderStatus) : undefined,
        userId: userId ? Number(userId) : undefined,
        date: date || undefined,
        page,
        limit: 5,
      }),
  });

  // Mutación para cambiar el estado del pedido
  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: { status: OrderStatus };
    }) => updateOrderStatus(id, payload),

    onSuccess: (response) => {
      setFeedback({ type: 'success', text: response.message });

      // Refrescamos pedidos
      queryClient.invalidateQueries({ queryKey: ['employee-orders'] });

      // Refrescamos dashboard del empleado
      queryClient.invalidateQueries({ queryKey: ['employee-dashboard-summary'] });

      setSelectedOrder(null);
    },

    onError: (error: unknown) => {
  // Validamos si es error de axios
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
}
  });

  // Función para seleccionar un pedido
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setFeedback(null);
  };

  // Función para enviar actualización de estado
  const handleSubmitStatus = (values: { status: OrderStatus }) => {
    if (!selectedOrder) return;

    setFeedback(null);

    updateStatusMutation.mutate({
      id: selectedOrder.id,
      payload: values,
    });
  };

  // Función para limpiar filtros
  const handleResetFilters = () => {
    setStatus('');
    setUserId('');
    setDate('');
    setPage(1);
  };

  // Datos finales
  const orders = ordersQuery.data?.data ?? [];
  const pagination = ordersQuery.data?.pagination;

  return (
    <div>
      <PageHeader
        title="Pedidos"
        subtitle="Consulta y actualiza el estado operativo de los pedidos"
      />

      {feedback && (
        <div
          className={`feedback-message ${
            feedback.type === 'success' ? 'feedback-success' : 'feedback-error'
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="employee-orders-page-grid">
        <OrderStatusUpdateForm
          selectedOrder={selectedOrder}
          isLoading={updateStatusMutation.isPending}
          onSubmit={handleSubmitStatus}
          onCancel={() => setSelectedOrder(null)}
        />

        <div className="employee-order-panel-card">
          <h3>Listado de pedidos</h3>
          <p>Consulta pedidos y administra sus estados.</p>

          <OrderFilters
            status={status}
            userId={userId}
            date={date}
            onStatusChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            onUserIdChange={(value) => {
              setUserId(value);
              setPage(1);
            }}
            onDateChange={(value) => {
              setDate(value);
              setPage(1);
            }}
            onReset={handleResetFilters}
          />

          {ordersQuery.isLoading ? (
            <div className="employee-order-empty-state">
              Cargando pedidos...
            </div>
          ) : ordersQuery.isError ? (
            <div className="employee-order-empty-state">
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