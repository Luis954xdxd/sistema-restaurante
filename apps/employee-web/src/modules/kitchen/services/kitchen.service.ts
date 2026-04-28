// Importamos la instancia de axios configurada.
// Esta instancia ya tiene la URL base del backend y el token.
import { api } from '../../../services/api';

// Importamos solamente el tipo del estado del pedido.
// Este tipo debe existir porque lo usan las páginas y componentes de pedidos.
import type { OrderStatus } from '../../orders/types/orders.types';

// Definimos una respuesta genérica para listas de pedidos.
// Usamos any[] para no depender de nombres exactos del archivo orders.types.ts.
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

// Definimos una respuesta genérica para cambios de estado.
interface OrderMutationResponse {
  message: string;
  order: any;
}

// Función para obtener pedidos pendientes.
// Estos son pedidos nuevos que todavía no se preparan.
export async function getPendingKitchenOrders() {
  const { data } = await api.get<OrdersResponse>(
    '/orders?status=PENDING&page=1&limit=100'
  );

  return data;
}

// Función para obtener pedidos en preparación.
// Estos son pedidos que el cocinero ya está preparando.
export async function getInPreparationKitchenOrders() {
  const { data } = await api.get<OrdersResponse>(
    '/orders?status=IN_PREPARATION&page=1&limit=100'
  );

  return data;
}

// Función para actualizar estado de pedido.
// La usaremos para pasar de PENDING a IN_PREPARATION
// y de IN_PREPARATION a READY.
export async function updateKitchenOrderStatus(
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