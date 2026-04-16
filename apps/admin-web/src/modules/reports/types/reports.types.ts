export interface DailySummaryResponse {
  message: string;
  summary: {
    reportDate: string;
    totalOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    subtotalAmount: number;
    tipAmount: number;
    totalAmount: number;
  };
}

export interface ReportUser {
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

export interface ReportProduct {
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

export interface ReportOrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  createdAt: string;
  product: ReportProduct;
}

export interface ReportOrder {
  id: number;
  userId: number;
  status: string;
  subtotal: string;
  tipAmount: string;
  total: string;
  createdAt: string;
  updatedAt: string;
  user: ReportUser;
  items: ReportOrderItem[];
}

export interface DailyOrdersResponse {
  message: string;
  reportDate: string;
  orders: ReportOrder[];
}