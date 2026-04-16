export type OrderStatus =
  | 'PENDING'
  | 'IN_PREPARATION'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

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

export interface OrderUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  status: string;
  roleId?: number;
  createdAt?: string;
  updatedAt?: string;
}

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

export interface GetOrdersParams {
  status?: OrderStatus;
  userId?: number;
  date?: string;
  page?: number;
  limit?: number;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

export interface OrderMutationResponse {
  message: string;
  order: Order;
}