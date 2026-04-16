import { api } from '../../../services/api';
import type {
  CreateInventoryMovementPayload,
  CreateInventoryPayload,
  GetInventoryParams,
  InventoryMovementResponse,
  InventoryMutationResponse,
  InventoryResponse,
  UpdateInventoryPayload,
} from '../types/inventory.types';

function buildInventoryQuery(params: GetInventoryParams) {
  const queryParams = new URLSearchParams();

  if (params.search) {
    queryParams.set('search', params.search);
  }

  if (typeof params.lowStockOnly === 'boolean') {
    queryParams.set('lowStockOnly', String(params.lowStockOnly));
  }

  if (params.page) {
    queryParams.set('page', String(params.page));
  }

  if (params.limit) {
    queryParams.set('limit', String(params.limit));
  }

  const queryString = queryParams.toString();
  return queryString ? `/inventory?${queryString}` : '/inventory';
}

export async function getInventory(params: GetInventoryParams) {
  const { data } = await api.get<InventoryResponse>(buildInventoryQuery(params));
  return data;
}

export async function createInventory(payload: CreateInventoryPayload) {
  const { data } = await api.post<InventoryMutationResponse>('/inventory', payload);
  return data;
}

export async function updateInventory(productId: number, payload: UpdateInventoryPayload) {
  const { data } = await api.put<InventoryMutationResponse>(
    `/inventory/${productId}`,
    payload
  );
  return data;
}

export async function createInventoryMovement(payload: CreateInventoryMovementPayload) {
  const { data } = await api.post<InventoryMovementResponse>(
    '/inventory/movement',
    payload
  );
  return data;
}