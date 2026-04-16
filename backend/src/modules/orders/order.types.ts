export interface CreateOrderItemInput {
  productId: number;
  quantity: number;
}

export interface CreateOrderInput {
  userId: number;
  tipAmount?: number;
  items: CreateOrderItemInput[];
}

export interface UpdateOrderStatusInput {
  status: 'PENDING' | 'IN_PREPARATION' | 'READY' | 'DELIVERED' | 'CANCELLED';
}

export interface GetOrdersQuery {
  status?: 'PENDING' | 'IN_PREPARATION' | 'READY' | 'DELIVERED' | 'CANCELLED';
  userId?: number;
  date?: string;
  page?: number;
  limit?: number;
}