// ==============================
// CATEGORÍA DEL MENÚ
// ==============================

export interface MenuCategory {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==============================
// INVENTARIO DEL PRODUCTO
// ==============================

export interface MenuProductInventory {
  id: number;
  productId: number;
  stockCurrent: number;
  stockMinimum: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

// ==============================
// PRODUCTO DEL MENÚ
// ==============================

export interface MenuProduct {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  category: MenuCategory;
  inventory: MenuProductInventory | null;
}

// ==============================
// RESPUESTA DEL MENÚ PÚBLICO
// ==============================

export interface MenuProductsResponse {
  message: string;
  data: MenuProduct[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// ==============================
// ITEM DEL CARRITO
// ==============================

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

// ==============================
// PAYLOAD PARA CREAR PEDIDO
// ==============================

export interface CreateOrderItemPayload {
  productId: number;
  quantity: number;
}

export interface CreateOrderPayload {
  items: CreateOrderItemPayload[];
  tipAmount?: number;
  tableNumber?: number | null;
}

// ==============================
// RESPUESTA AL CREAR PEDIDO
// ==============================

export interface CreateOrderResponse {
  message: string;
  order: {
    id: number;
    status: string;
    subtotal: string;
    tipAmount: string;
    total: string;
    tableNumber?: number | null;
    createdAt: string;
  };
}

