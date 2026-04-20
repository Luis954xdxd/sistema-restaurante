import { api } from '../../../services/api';
import type {
  CreateOrderPayload,
  CreateOrderResponse,
  MenuProductsResponse,
} from '../types/menu.types';

export async function getPublicMenuProducts() {
  try {
    const { data } = await api.get<MenuProductsResponse>('/products/public');
    return data;
  } catch (error) {
    console.error('Error al obtener el menú público:', error);
    throw error;
  }
}

export async function createPublicOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  try {
    const { data } = await api.post<CreateOrderResponse>(
      '/orders/public',
      payload
    );

    return data;
  } catch (error) {
    console.error('Error al crear pedido:', error);
    throw error;
  }
}