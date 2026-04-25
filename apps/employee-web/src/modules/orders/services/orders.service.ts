import { api } from '../../../services/api';

import type {
  GetOrdersParams,
  OrderMutationResponse,
  OrdersResponse,
  UpdateOrderStatusPayload,
} from '../types/orders.types';

function buildOrdersQuery(params: GetOrdersParams) {
  const queryParams = new URLSearchParams();

  if (params.status) {
    queryParams.set('status', params.status);
  }

  if (typeof params.tableNumber === 'number') {
    queryParams.set('tableNumber', String(params.tableNumber));
  }

  if (params.date) {
    queryParams.set('date', params.date);
  }

  if (params.page) {
    queryParams.set('page', String(params.page));
  }

  if (params.limit) {
    queryParams.set('limit', String(params.limit));
  }

  const queryString = queryParams.toString();

  return queryString ? `/orders?${queryString}` : '/orders';
}

export async function getOrders(params: GetOrdersParams) {
  const { data } = await api.get<OrdersResponse>(buildOrdersQuery(params));
  return data;
}

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