export interface DashboardSummaryResponse {
  message: string;
  summary: {
    reportDate: string;
    totalOrdersToday: number;
    pendingOrders: number;
    inPreparationOrders: number;
    readyOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    subtotalAmount: number;
    tipAmount: number;
    totalAmount: number;
    totalProducts: number;
    totalCategories: number;
    totalUsers: number;
    lowStockCount: number;
  };
}