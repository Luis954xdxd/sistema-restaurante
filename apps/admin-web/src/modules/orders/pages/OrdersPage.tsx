import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';

import PageHeader from '../../../components/ui/PageHeader';
import '../../../components/ui/ui.css';

import OrderFilters from '../components/OrderFilters';
import OrderPaginationControls from '../components/OrderPaginationControls';
import OrdersTable from '../components/OrdersTable';
import OrderStatusUpdateForm from '../components/OrderStatusUpdateForm';

import { getOrders, updateOrderStatus } from '../services/orders.service';
import { socket } from '../../../services/socket';

import '../styles/orders.css';

import type { Order, OrderStatus } from '../types/orders.types';

function OrdersPage() {
  const queryClient = useQueryClient();

  const [status, setStatus] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [date, setDate] = useState('');
  const [page, setPage] = useState(1);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const ordersQuery = useQuery({
    queryKey: ['orders', status, tableNumber, date, page],
    queryFn: () =>
      getOrders({
        status: status ? (status as OrderStatus) : undefined,
        tableNumber: tableNumber ? Number(tableNumber) : undefined,
        date: date || undefined,
        page,
        limit: 5,
      }),
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleOrderCreated = () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });

      const audio = new Audio('/notification.mp3');

      audio.play().catch(() => {
        console.log('El navegador bloqueó el sonido hasta que haya interacción.');
      });
    };

    const handleOrderUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    };

    socket.on('order:created', handleOrderCreated);
    socket.on('order:updated', handleOrderUpdated);

    return () => {
      socket.off('order:created', handleOrderCreated);
      socket.off('order:updated', handleOrderUpdated);
    };
  }, [queryClient]);

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
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });

      setSelectedOrder(null);
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
    setTableNumber('');
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