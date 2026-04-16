import prisma from '../../config/prisma';
import { getDayRange } from '../../utils/date';
import { buildDailySummaryPdf } from '../../utils/pdf';

export const getDailySummaryService = async (date?: string) => {
  const { baseDate, startOfDay, endOfDay } = getDayRange(date);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((order) => order.status === 'DELIVERED').length;
  const cancelledOrders = orders.filter((order) => order.status === 'CANCELLED').length;

  const subtotalAmount = orders.reduce(
    (acc, order) => acc + Number(order.subtotal),
    0
  );

  const tipAmount = orders.reduce(
    (acc, order) => acc + Number(order.tipAmount),
    0
  );

  const totalAmount = orders.reduce(
    (acc, order) => acc + Number(order.total),
    0
  );

  return {
    message: 'Resumen diario obtenido correctamente',
    summary: {
      reportDate: baseDate,
      totalOrders,
      deliveredOrders,
      cancelledOrders,
      subtotalAmount,
      tipAmount,
      totalAmount,
    },
  };
};

export const getDailyOrdersService = async (date?: string) => {
  const { baseDate, startOfDay, endOfDay } = getDayRange(date);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return {
    message: 'Pedidos del día obtenidos correctamente',
    reportDate: baseDate,
    orders,
  };
};

export const getDailySummaryPdfService = async (date?: string) => {
  const { baseDate, startOfDay, endOfDay } = getDayRange(date);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((order) => order.status === 'DELIVERED').length;
  const cancelledOrders = orders.filter((order) => order.status === 'CANCELLED').length;

  const subtotalAmount = orders.reduce(
    (acc, order) => acc + Number(order.subtotal),
    0
  );

  const tipAmount = orders.reduce(
    (acc, order) => acc + Number(order.tipAmount),
    0
  );

  const totalAmount = orders.reduce(
    (acc, order) => acc + Number(order.total),
    0
  );

  const pdfBuffer = buildDailySummaryPdf({
    reportDate: baseDate,
    totalOrders,
    deliveredOrders,
    cancelledOrders,
    subtotalAmount: subtotalAmount.toFixed(2),
    tipAmount: tipAmount.toFixed(2),
    totalAmount: totalAmount.toFixed(2),
    orders: orders.map((order) => ({
      id: order.id,
      customerName: `${order.user.firstName} ${order.user.lastName}`,
      status: order.status,
      subtotal: Number(order.subtotal).toFixed(2),
      tipAmount: Number(order.tipAmount).toFixed(2),
      total: Number(order.total).toFixed(2),
      createdAt: order.createdAt,
    })),
  });

  return {
    fileName: `reporte-diario-${baseDate.toISOString().slice(0, 10)}.pdf`,
    pdfBuffer,
  };
};