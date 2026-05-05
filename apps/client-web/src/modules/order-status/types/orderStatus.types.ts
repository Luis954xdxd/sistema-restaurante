// Estados reales del pedido según tu backend.
export type ClientOrderStatus =
  | 'PENDING'
  | 'IN_PREPARATION'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

// Producto dentro del pedido.
export interface ClientOrderItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
  };
}

// Pedido que se mostrará al cliente.
export interface ClientOrderStatusData {
  id: number;
  status: ClientOrderStatus;
  tableNumber: number | null;
  subtotal: string;
  tipAmount: string;
  total: string;
  createdAt: string;
  items: ClientOrderItem[];
}

// Respuesta del backend.
export interface ClientOrderStatusResponse {
  message: string;
  order: ClientOrderStatusData;
}