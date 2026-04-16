import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import PageHeader from '../../../components/ui/PageHeader';
import '../../../components/ui/ui.css';
import OrderFilters from '../components/OrderFilters';
import OrderPaginationControls from '../components/OrderPaginationControls';
import OrdersTable from '../components/OrdersTable';
import OrderStatusUpdateForm from '../components/OrderStatusUpdateForm';
import { getOrders, updateOrderStatus } from '../services/orders.service';
import '../styles/orders.css';
import type { Order, OrderStatus } from '../types/orders.types';

function OrdersPage() {
  const queryClient = useQueryClient();

  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState('');
  const [date, setDate] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const ordersQuery = useQuery({
    queryKey: ['orders', status, userId, date, page],
    queryFn: () =>
      getOrders({
        status: status ? (status as OrderStatus) : undefined,
        userId: userId ? Number(userId) : undefined,
        date: date || undefined,
        page,
        limit: 5,
      }),
  });

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
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setSelectedOrder(null);
    },
    onError: (error: any) => {
      setFeedback({
        type: 'error',
        text: error?.response?.data?.message || 'No se pudo actualizar el pedido',
      });
    },
  });

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setFeedback(null);
  };

  const handleSubmitStatus = (values: { status: OrderStatus }) => {
    if (!selectedOrder) return;

    setFeedback(null);
    updateStatusMutation.mutate({
      id: selectedOrder.id,
      payload: values,
    });
  };

  const handleResetFilters = () => {
    setStatus('');
    setUserId('');
    setDate('');
    setPage(1);
  };

  const orders = ordersQuery.data?.data ?? [];
  const pagination = ordersQuery.data?.pagination;

  return (
    <div>
      <PageHeader
        title="Pedidos"
        subtitle="Consulta, filtra y actualiza el estado de los pedidos"
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