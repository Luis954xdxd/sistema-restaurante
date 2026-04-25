// ==============================
// PEDIDO INTERNO
// ==============================

// Item individual de un pedido interno
export interface CreateOrderItemInput {
  productId: number; // ID del producto
  quantity: number; // Cantidad pedida
}

// Payload para crear pedido interno
export interface CreateOrderInput {
  userId: number; // Usuario que hace el pedido
  tipAmount?: number; // Propina opcional
  items: CreateOrderItemInput[]; // Productos del pedido
}

// ==============================
// ACTUALIZAR ESTADO DEL PEDIDO
// ==============================

export interface UpdateOrderStatusInput {
  status:
    | 'PENDING'
    | 'IN_PREPARATION'
    | 'READY'
    | 'DELIVERED'
    | 'CANCELLED';
}

// ==============================
// FILTROS DE CONSULTA
// ==============================

export interface GetOrdersQuery {
  status?: 'PENDING' | 'IN_PREPARATION' | 'READY' | 'DELIVERED' | 'CANCELLED';
  userId?: number;
  date?: string;
  page?: number;
  limit?: number;
  tableNumber?: number;
}

// ==============================
// PEDIDO PÚBLICO DEL CLIENTE
// ==============================

// Item que llega desde el carrito del cliente
export interface CreatePublicOrderItemInput {
  productId: number; // ID del producto
  quantity: number; // Cantidad solicitada
}

// Payload del pedido público
export interface CreatePublicOrderInput {
  items: CreatePublicOrderItemInput[]; // Productos enviados
  tipAmount?: number; // Propina opcional
  tableNumber?: number | null; // Número de mesa opcional
}

// ==============================
// RESPUESTA DEL PEDIDO PÚBLICO
// ==============================

export interface PublicOrderResponse {
  message: string;
  order: {
    id: number;
    status:
      | 'PENDING'
      | 'IN_PREPARATION'
      | 'READY'
      | 'DELIVERED'
      | 'CANCELLED';
    subtotal: string;
    tipAmount: string;
    total: string;
    tableNumber?: number | null;
    createdAt: string;
  };
}