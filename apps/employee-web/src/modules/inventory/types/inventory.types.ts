// Tipos de movimientos permitidos por el inventario.
export type InventoryMovementType = 'ENTRY' | 'EXIT' | 'ADJUSTMENT';

// Categoría del producto.
export interface InventoryCategory {
  id: number;
  name: string;
}

// Producto dentro del inventario.
export interface InventoryProduct {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
  category: InventoryCategory;
}

// Inventario de un producto.
export interface InventoryItem {
  id: number;
  productId: number;
  stockCurrent: number;
  stockMinimum: number;
  unit: string;
  product: InventoryProduct;
  createdAt: string;
  updatedAt: string;
}

// Respuesta de listado de inventario.
export interface InventoryListResponse {
  message: string;
  data: InventoryItem[];
}

// Payload para registrar movimiento.
export interface CreateInventoryMovementPayload {
  productId: number;
  movementType: InventoryMovementType;
  quantity: number;
  reason?: string;
}

// Respuesta al crear movimiento.
export interface InventoryMovementResponse {
  message: string;
}

// Movimiento de inventario mostrado en historial.
export interface InventoryMovement {
  id: number;
  productId: number;
  movementType: InventoryMovementType;
  quantity: number;
  reason: string | null;
  createdAt: string;
  product: InventoryProduct;
}

// Respuesta del historial de movimientos.
export interface InventoryMovementsResponse {
  message: string;
  data: InventoryMovement[];
}