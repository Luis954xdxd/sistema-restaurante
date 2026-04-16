import prisma from '../../config/prisma';
import { getDayRange } from '../../utils/date';

export const getDashboardSummaryService = async (date?: string) => {
  const { baseDate, startOfDay, endOfDay } = getDayRange(date);

  const [
    dailyOrders,
    totalProducts,
    totalCategories,
    totalUsers,
    inventoryList,
  ] = await Promise.all([
    prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),
    prisma.product.count(),
    prisma.category.count(),
    prisma.user.count(),
    prisma.inventory.findMany(),
  ]);

  const totalOrdersToday = dailyOrders.length;

  const pendingOrders = dailyOrders.filter(
    (order) => order.status === 'PENDING'
  ).length;

  const inPreparationOrders = dailyOrders.filter(
    (order) => order.status === 'IN_PREPARATION'
  ).length;

  const readyOrders = dailyOrders.filter(
    (order) => order.status === 'READY'
  ).length;

  const deliveredOrders = dailyOrders.filter(
    (order) => order.status === 'DELIVERED'
  ).length;

  const cancelledOrders = dailyOrders.filter(
    (order) => order.status === 'CANCELLED'
  ).length;

  const subtotalAmount = dailyOrders.reduce(
    (acc, order) => acc + Number(order.subtotal),
    0
  );

  const tipAmount = dailyOrders.reduce(
    (acc, order) => acc + Number(order.tipAmount),
    0
  );

  const totalAmount = dailyOrders.reduce(
    (acc, order) => acc + Number(order.total),
    0
  );

  const lowStockCount = inventoryList.filter(
    (item) => item.stockCurrent <= item.stockMinimum
  ).length;

  return {
    message: 'Resumen del dashboard obtenido correctamente',
    summary: {
      reportDate: baseDate,
      totalOrdersToday,
      pendingOrders,
      inPreparationOrders,
      readyOrders,
      deliveredOrders,
      cancelledOrders,
      subtotalAmount,
      tipAmount,
      totalAmount,
      totalProducts,
      totalCategories,
      totalUsers,
      lowStockCount,
    },
  };
};

export const getDashboardLowStockService = async () => {
  const inventory = await prisma.inventory.findMany({
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      stockCurrent: 'asc',
    },
  });

  const lowStockItems = inventory.filter(
    (item) => item.stockCurrent <= item.stockMinimum
  );

  return {
    message: 'Productos con stock bajo obtenidos correctamente',
    inventory: lowStockItems,
  };
};

export const getDashboardTopProductsService = async () => {
  const orderItems = await prisma.orderItem.findMany({
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });

  const grouped = new Map<
    number,
    {
      productId: number;
      productName: string;
      categoryName: string;
      totalQuantitySold: number;
      totalRevenue: number;
    }
  >();

  for (const item of orderItems) {
    const productId = item.productId;
    const current = grouped.get(productId);

    const itemQuantity = item.quantity;
    const itemSubtotal = Number(item.subtotal);

    if (current) {
      current.totalQuantitySold += itemQuantity;
      current.totalRevenue += itemSubtotal;
    } else {
      grouped.set(productId, {
        productId,
        productName: item.product.name,
        categoryName: item.product.category.name,
        totalQuantitySold: itemQuantity,
        totalRevenue: itemSubtotal,
      });
    }
  }

  const topProducts = Array.from(grouped.values())
    .sort((a, b) => b.totalQuantitySold - a.totalQuantitySold)
    .slice(0, 10);

  return {
    message: 'Productos más vendidos obtenidos correctamente',
    products: topProducts,
  };
};

export const getDashboardRecentOrdersService = async () => {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  });

  return {
    message: 'Pedidos recientes obtenidos correctamente',
    orders,
  };
};