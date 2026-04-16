// Estados permitidos del pedido
export type OrderStatus =
  | 'PENDING'
  | 'IN_PREPARATION'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

// Información del producto dentro de un pedido
export interface OrderProduct {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

// Información del usuario dueño del pedido
export interface OrderUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  status: string;
}

// Item individual dentro del pedido
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  createdAt: string;
  product: OrderProduct;
}

// Pedido completo
export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  subtotal: string;
  tipAmount: string;
  total: string;
  createdAt: string;
  updatedAt: string;
  user: OrderUser;
  items: OrderItem[];
}

// Respuesta paginada del backend
export interface OrdersResponse {
  message: string;
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Parámetros para consultar pedidos
export interface GetOrdersParams {
  status?: OrderStatus;
  userId?: number;
  date?: string;
  page?: number;
  limit?: number;
}

// Payload para cambiar el estado
export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

// Respuesta del backend al mutar pedido
export interface OrderMutationResponse {
  message: string;
  order: Order;
}