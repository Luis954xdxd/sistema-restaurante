import prisma from '../../config/prisma';
import { CreateOrderInput, UpdateOrderStatusInput } from './order.types';
import { AppError } from '../../shared/errors/AppError';
import { buildPaginatedResponse, getPaginationParams } from '../../utils/pagination';
import { GetOrdersQuery } from './order.types';
import { getDayRange } from '../../utils/date';


export const createOrderService = async (input: CreateOrderInput) => {
  const { userId, tipAmount = 0, items } = input;

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new AppError('El userId debe ser un número entero válido', 400);
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError('El pedido debe incluir al menos un producto', 400);
  }

  if (
    typeof tipAmount !== 'number' ||
    Number.isNaN(tipAmount) ||
    tipAmount < 0
  ) {
    throw new AppError('La propina debe ser un número mayor o igual a 0', 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      role: true,
    },
  });

  if (!existingUser) {
    throw new AppError('El usuario no existe', 404);
  }

  if (existingUser.status !== 'ACTIVE') {
    throw new AppError('No se puede crear un pedido con un usuario inactivo', 400);
  }

  let subtotal = 0;

  const orderItemsData: {
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[] = [];

  for (const item of items) {
    if (!Number.isInteger(item.productId) || item.productId <= 0) {
      throw new AppError('Cada productId debe ser un número entero válido', 400);
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new AppError('Cada quantity debe ser un número entero mayor a 0', 400);
    }

    const product = await prisma.product.findUnique({
      where: {
        id: item.productId,
      },
      include: {
        inventory: true,
        category: true,
      },
    });

    if (!product) {
      throw new AppError(`El producto con id ${item.productId} no existe`, 404);
    }

    if (!product.isAvailable) {
      throw new AppError(`El producto "${product.name}" no está disponible`, 400);
    }

    if (!product.category.isActive) {
      throw new AppError(
        `El producto "${product.name}" pertenece a una categoría inactiva`,
        400
      );
    }

    if (!product.inventory) {
      throw new AppError(
        `El producto "${product.name}" no tiene inventario registrado`,
        400
      );
    }

    if (product.inventory.stockCurrent < item.quantity) {
      throw new AppError(
        `No hay suficiente stock para el producto "${product.name}"`,
        400
      );
    }

    const unitPrice = Number(product.price);
    const itemSubtotal = unitPrice * item.quantity;

    subtotal += itemSubtotal;

    orderItemsData.push({
      productId: product.id,
      quantity: item.quantity,
      unitPrice,
      subtotal: itemSubtotal,
    });
  }

  const total = subtotal + tipAmount;

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,
        subtotal,
        tipAmount,
        total,
      },
    });

    for (const item of orderItemsData) {
      await tx.orderItem.create({
        data: {
          orderId: createdOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        },
      });

      const currentInventory = await tx.inventory.findUnique({
        where: {
          productId: item.productId,
        },
      });

      if (!currentInventory) {
        throw new AppError(
          'Inventario no encontrado durante la transacción',
          404
        );
      }

      await tx.inventory.update({
        where: {
          productId: item.productId,
        },
        data: {
          stockCurrent: currentInventory.stockCurrent - item.quantity,
        },
      });

      await tx.inventoryMovement.create({
        data: {
          productId: item.productId,
          movementType: 'EXIT',
          quantity: item.quantity,
          reason: `Descuento automático por pedido #${createdOrder.id}`,
        },
      });
    }

    return tx.order.findUnique({
      where: {
        id: createdOrder.id,
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  });

  return {
    message: 'Pedido creado correctamente',
    order,
  };
};

export const getAllOrdersService = async (query: GetOrdersQuery) => {
  const { status, userId, date, page, limit } = query;

  const { page: currentPage, limit: currentLimit, skip } = getPaginationParams(
    page,
    limit
  );

  const where: {
    status?: 'PENDING' | 'IN_PREPARATION' | 'READY' | 'DELIVERED' | 'CANCELLED';
    userId?: number;
    createdAt?: {
      gte: Date;
      lte: Date;
    };
  } = {};

  if (status) {
    where.status = status;
  }

  if (typeof userId === 'number' && !Number.isNaN(userId)) {
    where.userId = userId;
  }

  if (date) {
    const { startOfDay, endOfDay } = getDayRange(date);

    where.createdAt = {
      gte: startOfDay,
      lte: endOfDay,
    };
  }

  const [orders, totalItems] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
      skip,
      take: currentLimit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    message: 'Pedidos obtenidos correctamente',
    ...buildPaginatedResponse(orders, currentPage, currentLimit, totalItems),
  };
};

export const getOrderByIdService = async (id: number) => {
  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error('Pedido no encontrado');
  }

  return {
    message: 'Pedido obtenido correctamente',
    order,
  };
};

export const getOrdersByUserIdService = async (userId: number) => {
  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      id: 'desc',
    },
  });

  return {
    message: 'Pedidos del usuario obtenidos correctamente',
    orders,
  };
};

export const updateOrderStatusService = async (
  id: number,
  input: UpdateOrderStatusInput
) => {
  const existingOrder = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
    },
  });

  if (!existingOrder) {
    throw new AppError('Pedido no encontrado', 404);
  }

  if (existingOrder.status === input.status) {
    throw new AppError('El pedido ya tiene ese estado', 400);
  }

  if (existingOrder.status === 'CANCELLED') {
    throw new AppError('No se puede modificar un pedido ya cancelado', 400);
  }

  if (existingOrder.status === 'DELIVERED' && input.status === 'CANCELLED') {
    throw new AppError('No se puede cancelar un pedido ya entregado', 400);
  }

  if (input.status === 'CANCELLED') {
    const updatedOrder = await prisma.$transaction(async (tx) => {
      for (const item of existingOrder.items) {
        const inventory = await tx.inventory.findUnique({
          where: {
            productId: item.productId,
          },
        });

        if (!inventory) {
          throw new AppError(
            `No se encontró inventario para el producto con id ${item.productId}`,
            404
          );
        }

        await tx.inventory.update({
          where: {
            productId: item.productId,
          },
          data: {
            stockCurrent: inventory.stockCurrent + item.quantity,
          },
        });

        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            movementType: 'ENTRY',
            quantity: item.quantity,
            reason: `Devolución automática por cancelación del pedido #${existingOrder.id}`,
          },
        });
      }

      await tx.order.update({
        where: {
          id,
        },
        data: {
          status: 'CANCELLED',
        },
      });

      return tx.order.findUnique({
        where: {
          id,
        },
        include: {
          user: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    return {
      message: 'Pedido cancelado correctamente y stock restaurado',
      order: updatedOrder,
    };
  }

  const updatedOrder = await prisma.order.update({
    where: {
      id,
    },
    data: {
      status: input.status,
    },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return {
    message: 'Estado del pedido actualizado correctamente',
    order: updatedOrder,
  };
};