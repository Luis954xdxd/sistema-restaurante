// Importamos Prisma para trabajar con la base de datos.
import prisma from '../../config/prisma';

// Importamos AppError para errores controlados.
import { AppError } from '../../shared/errors/AppError';

// Importamos Socket.IO para actualizar pantallas en tiempo real.
import { getSocket } from '../../socket';

// Importamos tipos.
import type { CreateInventoryMovementInput } from './inventory.types';

// ==============================
// OBTENER INVENTARIO
// ==============================
export async function getInventoryService() {
  const inventory = await prisma.inventory.findMany({
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  });

  return {
    message: 'Inventario obtenido correctamente',
    data: inventory,
  };
}

// ==============================
// CREAR MOVIMIENTO DE INVENTARIO
// ==============================
export async function createInventoryMovementService(
  input: CreateInventoryMovementInput
) {
  const { productId, movementType, quantity, reason } = input;

  // Validamos producto.
  if (!Number.isInteger(productId) || productId <= 0) {
    throw new AppError('El productId debe ser un número válido', 400);
  }

  // Validamos tipo de movimiento.
  if (!['ENTRY', 'EXIT', 'ADJUSTMENT'].includes(movementType)) {
    throw new AppError('Tipo de movimiento inválido', 400);
  }

  // Validamos cantidad.
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new AppError('La cantidad debe ser un número entero mayor a 0', 400);
  }

  // Buscamos el inventario del producto.
  const inventory = await prisma.inventory.findUnique({
    where: {
      productId,
    },
    include: {
      product: true,
    },
  });

  if (!inventory) {
    throw new AppError('No existe inventario para este producto', 404);
  }

  // Calculamos el nuevo stock.
  let newStock = inventory.stockCurrent;

  if (movementType === 'ENTRY') {
    // Entrada: suma stock.
    newStock = inventory.stockCurrent + quantity;
  }

  if (movementType === 'EXIT') {
    // Salida: resta stock.
    if (inventory.stockCurrent < quantity) {
      throw new AppError(
        `No hay suficiente stock. Stock actual: ${inventory.stockCurrent}`,
        400
      );
    }

    newStock = inventory.stockCurrent - quantity;
  }

  if (movementType === 'ADJUSTMENT') {
    // Ajuste: deja el stock exactamente en la cantidad indicada.
    newStock = quantity;
  }

  // Guardamos movimiento y actualizamos inventario en una transacción.
  const result = await prisma.$transaction(async (tx) => {
    // Actualizamos stock.
    const updatedInventory = await tx.inventory.update({
      where: {
        productId,
      },
      data: {
        stockCurrent: newStock,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    // Guardamos historial de movimiento.
    const movement = await tx.inventoryMovement.create({
      data: {
        productId,
        movementType,
        quantity,
        reason:
          reason && reason.trim().length > 0
            ? reason.trim()
            : getDefaultReason(movementType),
      },
    });

    return {
      updatedInventory,
      movement,
    };
  });

  // Emitimos evento de inventario actualizado.
  try {
    const io = getSocket();

    console.log(
      'Emitiendo evento inventory:updated para producto:',
      productId
    );

    io.emit('inventory:updated', {
      message: 'Inventario actualizado',
      inventory: result.updatedInventory,
      movement: result.movement,
    });
  } catch (error) {
    console.error('No se pudo emitir evento inventory:updated:', error);
  }

  return {
    message: 'Movimiento de inventario registrado correctamente',
    inventory: result.updatedInventory,
    movement: result.movement,
  };
}

// ==============================
// MOTIVO POR DEFECTO
// ==============================
function getDefaultReason(movementType: string) {
  if (movementType === 'ENTRY') {
    return 'Entrada manual de inventario';
  }

  if (movementType === 'EXIT') {
    return 'Salida manual de inventario';
  }

  if (movementType === 'ADJUSTMENT') {
    return 'Ajuste manual de inventario';
  }

  return 'Movimiento manual de inventario';
}

// ==============================
// OBTENER HISTORIAL DE MOVIMIENTOS
// ==============================
export async function getInventoryMovementsService() {
  const movements = await prisma.inventoryMovement.findMany({
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      id: 'desc',
    },
    take: 50,
  });

  return {
    message: 'Historial de inventario obtenido correctamente',
    data: movements,
  };
}