// Importamos axios configurado
import { api } from '../../../services/api';

// Importamos tipos
import type {
  GetOrdersParams,
  OrderMutationResponse,
  OrdersResponse,
  UpdateOrderStatusPayload,
} from '../types/orders.types';

// Construimos query string dinámicamente
function buildOrdersQuery(params: GetOrdersParams) {
  const queryParams = new URLSearchParams();

  // Si mandan status, lo agregamos
  if (params.status) {
    queryParams.set('status', params.status);
  }

  // Si mandan userId, lo agregamos
  if (typeof params.userId === 'number') {
    queryParams.set('userId', String(params.userId));
  }

  // Si mandan fecha, la agregamos
  if (params.date) {
    queryParams.set('date', params.date);
  }

  // Si mandan page, la agregamos
  if (params.page) {
    queryParams.set('page', String(params.page));
  }

  // Si mandan limit, lo agregamos
  if (params.limit) {
    queryParams.set('limit', String(params.limit));
  }

  // Generamos query final
  const queryString = queryParams.toString();

  return queryString ? `/orders?${queryString}` : '/orders';
}

// Obtener lista de pedidos
export async function getOrders(params: GetOrdersParams) {
  const { data } = await api.get<OrdersResponse>(buildOrdersQuery(params));
  return data;
}

// Cambiar estado del pedido
export async function updateOrderStatus(
  id: number,
  payload: UpdateOrderStatusPayload
) {
  const { data } = await api.patch<OrderMutationResponse>(
    `/orders/${id}/status`,
    payload
  );

  return data;
}