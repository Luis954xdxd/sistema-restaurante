// Tipos permitidos para movimientos de inventario.
export type InventoryMovementType = 'ENTRY' | 'EXIT' | 'ADJUSTMENT';

// Payload para crear un movimiento de inventario.
export interface CreateInventoryMovementInput {
  productId: number;
  movementType: InventoryMovementType;
  quantity: number;
  reason?: string;
}