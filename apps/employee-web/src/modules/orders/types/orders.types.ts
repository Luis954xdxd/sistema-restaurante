export type OrderStatus =
  | 'PENDING'
  | 'IN_PREPARATION'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderProduct {
  id: number;
  name: string;
  description?: string | null;
  price: string;
  imageUrl?: string | null;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  product: OrderProduct;
}

export interface OrderUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  subtotal: string;
  tipAmount: string;
  total: string;
  tableNumber?: number | null;
  createdAt: string;
  updatedAt: string;
  user: OrderUser;
  items: OrderItem[];
}