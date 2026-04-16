export interface CreateInventoryInput {
  productId: number;
  stockCurrent: number;
  stockMinimum: number;
  unit: string;
}

export interface UpdateInventoryInput {
  stockMinimum?: number;
  unit?: string;
}

export interface CreateInventoryMovementInput {
  productId: number;
  movementType: 'ENTRY' | 'EXIT' | 'ADJUSTMENT';
  quantity: number;
  reason?: string;
}

export interface GetInventoryQuery {
  search?: string;
  lowStockOnly?: boolean;
  page?: number;
  limit?: number;
}