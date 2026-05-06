// Importamos axios configurado.
import { api } from '../../../services/api';

// Importamos tipos del inventario.
import type {
  CreateInventoryMovementPayload,
  InventoryListResponse,
  InventoryMovementResponse,
  InventoryMovementsResponse,
} from '../types/inventory.types';

// Obtener inventario general.
export async function getInventory() {
  const { data } = await api.get<InventoryListResponse>('/inventory');

  return data;
}

// Registrar movimiento de inventario.
export async function createInventoryMovement(
  payload: CreateInventoryMovementPayload
) {
  const { data } = await api.post<InventoryMovementResponse>(
    '/inventory/movements',
    payload
  );

  return data;
}

// Obtener historial reciente de movimientos.
export async function getInventoryMovements() {
  const { data } = await api.get<InventoryMovementsResponse>(
    '/inventory/movements'
  );

  return data;
}