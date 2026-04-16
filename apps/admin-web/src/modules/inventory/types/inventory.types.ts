export interface InventoryCategory {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryProduct {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  category: InventoryCategory;
}

export interface InventoryItem {
  id: number;
  productId: number;
  stockCurrent: number;
  stockMinimum: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
  product: InventoryProduct;
}

export interface InventoryResponse {
  message: string;
  data: InventoryItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface GetInventoryParams {
  search?: string;
  lowStockOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateInventoryPayload {
  productId: number;
  stockCurrent: number;
  stockMinimum: number;
  unit: string;
}

export interface UpdateInventoryPayload {
  stockMinimum?: number;
  unit?: string;
}

export interface InventoryMutationResponse {
  message: string;
  inventory: InventoryItem;
}

export type InventoryMovementType = 'ENTRY' | 'EXIT' | 'ADJUSTMENT';

export interface CreateInventoryMovementPayload {
  productId: number;
  movementType: InventoryMovementType;
  quantity: number;
  reason?: string;
}

export interface InventoryMovementResponse {
  message: string;
  stockCurrent: number;
  lowStockAlert: boolean;
  movement: {
    id: number;
    productId: number;
    movementType: InventoryMovementType;
    quantity: number;
    reason: string | null;
    createdAt: string;
  };
}