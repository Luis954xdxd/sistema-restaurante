// Importamos la instancia de axios configurada.
// Esta instancia ya tiene la URL base del backend y el token.
import { api } from '../../../services/api';

// Importamos solamente el tipo del estado del pedido.
import type { OrderStatus } from '../../orders/types/orders.types';

// Respuesta genérica para listas de pedidos.
interface OrdersResponse {
  message: string;
  data: any[];
  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Respuesta genérica para cambios de estado.
interface OrderMutationResponse {
  message: string;
  order: any;
}

// Obtener pedidos que el mesero debe vigilar.
// Primero traemos pedidos EN PREPARACIÓN.
// Luego traemos pedidos LISTOS.
// Después los juntamos en una sola lista.
export async function getWaiterOrders() {
  const [inPreparationResponse, readyResponse] = await Promise.all([
    api.get<OrdersResponse>(
      '/orders?status=IN_PREPARATION&page=1&limit=100'
    ),
    api.get<OrdersResponse>(
      '/orders?status=READY&page=1&limit=100'
    ),
  ]);

  const inPreparationOrders = inPreparationResponse.data.data ?? [];
  const readyOrders = readyResponse.data.data ?? [];

  return {
    message: 'Pedidos del mesero obtenidos correctamente',
    data: [...readyOrders, ...inPreparationOrders].sort((a, b) => b.id - a.id),
  };
}

// Actualizar estado desde mesero.
// El mesero solamente debe pasar de READY a DELIVERED.
export async function updateWaiterOrderStatus(
  id: number,
  status: OrderStatus
) {
  const payload = {
    status,
  };

  const { data } = await api.patch<OrderMutationResponse>(
    `/orders/${id}/status`,
    payload
  );

  return data;
}