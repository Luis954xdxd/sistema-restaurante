// Importamos axios configurado.
import { api } from '../../../services/api';

// Importamos el tipo de respuesta.
import type { ClientOrderStatusResponse } from '../types/orderStatus.types';

// Servicio para obtener el estado actual de un pedido público.
// Se usa cuando el cliente entra a /order-status/:orderId.
export async function getPublicOrderStatus(orderId: number) {
  const { data } = await api.get<ClientOrderStatusResponse>(
    `/orders/public/${orderId}/status`
  );

  return data;
}