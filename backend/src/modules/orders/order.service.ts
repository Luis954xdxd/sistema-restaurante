// Importamos Prisma para trabajar con la base de datos
import prisma from '../../config/prisma';

// Importamos AppError para lanzar errores controlados
import { AppError } from '../../shared/errors/AppError';

// Importamos helpers de paginación
import {
  buildPaginatedResponse,
  getPaginationParams,
} from '../../utils/pagination';

// Importamos helper para calcular rango de fechas
import { getDayRange } from '../../utils/date';

// Importamos tipos del módulo de pedidos
import type {
  CreateOrderInput,
  CreatePublicOrderInput,
  GetOrdersQuery,
  UpdateOrderStatusInput,
} from './order.types';

// Importamos Socket.IO del backend
import { getSocket } from '../../socket';

// ==============================
// EMITIR EVENTO DE INVENTARIO
// ==============================
// Esta función nos ayuda a avisar en tiempo real cuando cambia el stock.
// Sirve para que el panel de inventario se actualice sin refrescar.
function emitInventoryUpdated(payload: {
  message: string;
  inventory: unknown;
  movement?: unknown;
}) {
  try {
    const io = getSocket();

    console.log('Emitiendo evento inventory:updated');

    io.emit('inventory:updated', payload);
  } catch (error) {
    console.error('No se pudo emitir evento inventory:updated:', error);
  }
}

// ==============================
// EMITIR EVENTO DE PEDIDO ACTUALIZADO
// ==============================
// Esta función avisa a cocina, mesero, cliente y admin cuando cambia un pedido.
function emitOrderUpdated(order: unknown) {
  try {
    const io = getSocket();

    console.log('Emitiendo evento order:updated');

    io.emit('order:updated', {
      message: 'Pedido actualizado',
      order,
    });
  } catch (error) {
    console.error('No se pudo emitir evento order:updated:', error);
  }
}

// ==============================
// CREAR PEDIDO INTERNO
// ==============================
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
    throw new AppError(
      'No se puede crear un pedido con un usuario inactivo',
      400
    );
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
      throw new AppError(
        'Cada quantity debe ser un número entero mayor a 0',
        400
      );
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
      throw new AppError(
        `El producto "${product.name}" no está disponible`,
        400
      );
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

      const updatedInventory = await tx.inventory.update({
        where: {
          productId: item.productId,
        },
        data: {
          stockCurrent: currentInventory.stockCurrent - item.quantity,
        },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });

      const movement = await tx.inventoryMovement.create({
        data: {
          productId: item.productId,
          movementType: 'EXIT',
          quantity: item.quantity,
          reason: `Descuento automático por pedido #${createdOrder.id}`,
        },
      });

      emitInventoryUpdated({
        message: 'Inventario actualizado por pedido interno',
        inventory: updatedInventory,
        movement,
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

// ==============================
// OBTENER TODOS LOS PEDIDOS
// ==============================
export const getAllOrdersService = async (query: GetOrdersQuery) => {
  const { status, userId, tableNumber, date, page, limit } = query;

  const { page: currentPage, limit: currentLimit, skip } = getPaginationParams(
    page,
    limit
  );

  const where: {
    status?: 'PENDING' | 'IN_PREPARATION' | 'READY' | 'DELIVERED' | 'CANCELLED';
    userId?: number;
    tableNumber?: number;
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

  if (typeof tableNumber === 'number' && !Number.isNaN(tableNumber)) {
    where.tableNumber = tableNumber;
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

// ==============================
// OBTENER PEDIDO POR ID
// ==============================
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
    throw new AppError('Pedido no encontrado', 404);
  }

  return {
    message: 'Pedido obtenido correctamente',
    order,
  };
};

// ==============================
// OBTENER PEDIDOS POR USUARIO
// ==============================
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

// ==============================
// ACTUALIZAR ESTADO DEL PEDIDO
// ==============================
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

        const updatedInventory = await tx.inventory.update({
          where: {
            productId: item.productId,
          },
          data: {
            stockCurrent: inventory.stockCurrent + item.quantity,
          },
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        });

        const movement = await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            movementType: 'ENTRY',
            quantity: item.quantity,
            reason: `Devolución automática por cancelación del pedido #${existingOrder.id}`,
          },
        });

        emitInventoryUpdated({
          message: 'Inventario restaurado por cancelación de pedido',
          inventory: updatedInventory,
          movement,
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

    emitOrderUpdated(updatedOrder);

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

  emitOrderUpdated(updatedOrder);

  return {
    message: 'Estado del pedido actualizado correctamente',
    order: updatedOrder,
  };
};

// ==============================
// CREAR PEDIDO PÚBLICO DESDE CLIENTE
// ==============================
export async function createPublicOrderService(payload: CreatePublicOrderInput) {
  if (!payload.items || payload.items.length === 0) {
    throw new AppError('Debes enviar al menos un producto en el pedido', 400);
  }

  const { items, tipAmount, tableNumber } = payload;

  const customerUser = await prisma.user.findUnique({
    where: {
      email: 'cliente@restaurante.com',
    },
  });

  if (!customerUser) {
    throw new AppError(
      'No existe el usuario cliente demo. Ejecuta el seed o crea ese usuario.',
      404
    );
  }

  const productIds = [...new Set(items.map((item) => item.productId))];

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
      isAvailable: true,
      category: {
        isActive: true,
      },
    },
    include: {
      inventory: true,
      category: true,
    },
  });

  if (products.length !== productIds.length) {
    throw new AppError(
      'Uno o más productos no existen o no están disponibles',
      400
    );
  }

  let subtotal = 0;

  const orderItemsData = items.map((item) => {
    const product = products.find((prod) => prod.id === item.productId);

    if (!product) {
      throw new AppError('Producto inválido en el pedido', 400);
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new AppError('La cantidad de cada producto debe ser mayor a 0', 400);
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

    return {
      productId: product.id,
      quantity: item.quantity,
      unitPrice,
      subtotal: itemSubtotal,
    };
  });

  const safeTipAmount = tipAmount && tipAmount > 0 ? tipAmount : 0;
  const total = subtotal + safeTipAmount;

  const createdOrder = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId: customerUser.id,
        status: 'PENDING',
        subtotal,
        tipAmount: safeTipAmount,
        total,
        tableNumber,
      },
    });

    for (const item of orderItemsData) {
      await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
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

      const updatedInventory = await tx.inventory.update({
        where: {
          productId: item.productId,
        },
        data: {
          stockCurrent: currentInventory.stockCurrent - item.quantity,
        },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });

      const movement = await tx.inventoryMovement.create({
        data: {
          productId: item.productId,
          movementType: 'EXIT',
          quantity: item.quantity,
          reason: `Descuento automático por pedido público #${newOrder.id}`,
        },
      });

      emitInventoryUpdated({
        message: 'Inventario actualizado por pedido público',
        inventory: updatedInventory,
        movement,
      });
    }

    return tx.order.findUnique({
      where: {
        id: newOrder.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
  });

  if (!createdOrder) {
    throw new AppError('No se pudo crear el pedido público', 500);
  }

  try {
    const io = getSocket();

    console.log(
      'Emitiendo evento order:created para pedido:',
      createdOrder.id,
      'mesa:',
      createdOrder.tableNumber
    );

    io.emit('order:created', {
      message: 'Nuevo pedido recibido',
      order: {
        id: createdOrder.id,
        tableNumber: createdOrder.tableNumber,
        status: createdOrder.status,
        total: createdOrder.total.toString(),
        createdAt: createdOrder.createdAt,
      },
    });
  } catch (error) {
    console.error('No se pudo emitir evento order:created:', error);
  }

  return {
    message: 'Pedido realizado correctamente',
    order: {
      id: createdOrder.id,
      status: createdOrder.status,
      subtotal: createdOrder.subtotal.toString(),
      tipAmount: createdOrder.tipAmount.toString(),
      total: createdOrder.total.toString(),
      tableNumber: createdOrder.tableNumber,
      createdAt: createdOrder.createdAt,
    },
  };
}

// ==============================
// OBTENER ESTADO PÚBLICO DEL PEDIDO
// ==============================
export async function getPublicOrderStatusService(id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('El id del pedido debe ser válido', 400);
  }

  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    throw new AppError('Pedido no encontrado', 404);
  }

  return {
    message: 'Estado del pedido obtenido correctamente',
    order: {
      id: order.id,
      status: order.status,
      tableNumber: order.tableNumber,
      subtotal: order.subtotal.toString(),
      tipAmount: order.tipAmount.toString(),
      total: order.total.toString(),
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
        },
      })),
    },
  };
}