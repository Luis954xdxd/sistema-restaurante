import prisma from '../../config/prisma';
import {
  CreateInventoryInput,
  CreateInventoryMovementInput,
  UpdateInventoryInput,
} from './inventory.types';
import { buildPaginatedResponse, getPaginationParams } from '../../utils/pagination';
import { GetInventoryQuery } from './inventory.types';
import { AppError } from '../../shared/errors/AppError';

export const createInventoryService = async (input: CreateInventoryInput) => {
  const { productId, stockCurrent, stockMinimum, unit } = input;

  if (!Number.isInteger(productId) || productId <= 0) {
    throw new AppError('El productId debe ser un número entero válido', 400);
  }

  if (!Number.isInteger(stockCurrent) || stockCurrent < 0) {
    throw new AppError(
      'El stock actual debe ser un número entero mayor o igual a 0',
      400
    );
  }

  if (!Number.isInteger(stockMinimum) || stockMinimum < 0) {
    throw new AppError(
      'El stock mínimo debe ser un número entero mayor o igual a 0',
      400
    );
  }

  const normalizedUnit = unit.trim();

  if (!normalizedUnit) {
    throw new AppError('La unidad es obligatoria', 400);
  }

  const existingProduct = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      category: true,
    },
  });

  if (!existingProduct) {
    throw new AppError('El producto no existe', 404);
  }

  if (!existingProduct.isAvailable) {
    throw new AppError(
      'No se puede crear inventario para un producto inactivo o no disponible',
      400
    );
  }

  if (!existingProduct.category.isActive) {
    throw new AppError(
      'No se puede crear inventario para un producto cuya categoría está inactiva',
      400
    );
  }

  const existingInventory = await prisma.inventory.findUnique({
    where: {
      productId,
    },
  });

  if (existingInventory) {
    throw new AppError(
      'Ese producto ya tiene un registro de inventario',
      400
    );
  }

  const inventory = await prisma.inventory.create({
    data: {
      productId,
      stockCurrent,
      stockMinimum,
      unit: normalizedUnit,
    },
    include: {
      product: true,
    },
  });

  return {
    message: 'Inventario creado correctamente',
    inventory,
  };
};

export const getAllInventoryService = async (query: GetInventoryQuery) => {
  const { search, lowStockOnly, page, limit } = query;

  const { page: currentPage, limit: currentLimit, skip } = getPaginationParams(
    page,
    limit
  );

  const inventoryList = await prisma.inventory.findMany({
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

  let filteredInventory = inventoryList;

  if (search) {
    const normalizedSearch = search.trim().toLowerCase();

    filteredInventory = filteredInventory.filter((item) =>
      item.product.name.toLowerCase().includes(normalizedSearch)
    );
  }

  if (lowStockOnly) {
    filteredInventory = filteredInventory.filter(
      (item) => item.stockCurrent <= item.stockMinimum
    );
  }

  const totalItems = filteredInventory.length;
  const paginatedData = filteredInventory.slice(skip, skip + currentLimit);

  return {
    message: 'Inventarios obtenidos correctamente',
    ...buildPaginatedResponse(
      paginatedData,
      currentPage,
      currentLimit,
      totalItems
    ),
  };
};

export const getInventoryByProductIdService = async (productId: number) => {
  const inventory = await prisma.inventory.findUnique({
    where: {
      productId,
    },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!inventory) {
    throw new Error('Inventario no encontrado para ese producto');
  }

  return {
    message: 'Inventario obtenido correctamente',
    inventory,
  };
};

export const updateInventoryService = async (
  productId: number,
  input: UpdateInventoryInput
) => {
  const existingInventory = await prisma.inventory.findUnique({
    where: {
      productId,
    },
  });

  if (!existingInventory) {
    throw new Error('Inventario no encontrado para ese producto');
  }

  const dataToUpdate: {
    stockMinimum?: number;
    unit?: string;
  } = {};

  if (input.stockMinimum !== undefined) {
    if (!Number.isInteger(input.stockMinimum) || input.stockMinimum < 0) {
      throw new Error('El stock mínimo debe ser un número entero mayor o igual a 0');
    }

    dataToUpdate.stockMinimum = input.stockMinimum;
  }

  if (input.unit !== undefined) {
    const normalizedUnit = input.unit.trim();

    if (!normalizedUnit) {
      throw new Error('La unidad no puede estar vacía');
    }

    dataToUpdate.unit = normalizedUnit;
  }

  const updatedInventory = await prisma.inventory.update({
    where: {
      productId,
    },
    data: dataToUpdate,
    include: {
      product: true,
    },
  });

  return {
    message: 'Inventario actualizado correctamente',
    inventory: updatedInventory,
  };
};

export const createInventoryMovementService = async (
  input: CreateInventoryMovementInput
) => {
  const { productId, movementType, quantity, reason } = input;

  if (!Number.isInteger(productId) || productId <= 0) {
    throw new AppError('El productId debe ser un número entero válido', 400);
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new AppError('La cantidad debe ser un número entero mayor a 0', 400);
  }

  const inventory = await prisma.inventory.findUnique({
    where: {
      productId,
    },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!inventory) {
    throw new AppError('El producto no tiene inventario registrado', 404);
  }

  if (!inventory.product.isAvailable) {
    throw new AppError(
      'No se pueden registrar movimientos sobre un producto no disponible',
      400
    );
  }

  if (!inventory.product.category.isActive) {
    throw new AppError(
      'No se pueden registrar movimientos sobre un producto cuya categoría está inactiva',
      400
    );
  }

  let newStock = inventory.stockCurrent;

  if (movementType === 'ENTRY') {
    newStock += quantity;
  } else if (movementType === 'EXIT') {
    if (inventory.stockCurrent < quantity) {
      throw new AppError(
        'No hay suficiente stock para realizar la salida',
        400
      );
    }

    newStock -= quantity;
  } else if (movementType === 'ADJUSTMENT') {
    newStock = quantity;
  }

  const movement = await prisma.inventoryMovement.create({
    data: {
      productId,
      movementType,
      quantity,
      reason: reason?.trim() || null,
    },
    include: {
      product: true,
    },
  });

  await prisma.inventory.update({
    where: {
      productId,
    },
    data: {
      stockCurrent: newStock,
    },
  });

  return {
    message: 'Movimiento de inventario registrado correctamente',
    movement,
    stockCurrent: newStock,
    lowStockAlert: newStock <= inventory.stockMinimum,
  };
};

export const getInventoryMovementsByProductIdService = async (
  productId: number
) => {
  const movements = await prisma.inventoryMovement.findMany({
    where: {
      productId,
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    message: 'Movimientos obtenidos correctamente',
    movements,
  };
};

export const getLowStockProductsService = async () => {
  const inventoryList = await prisma.inventory.findMany({
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

  const lowStockItems = inventoryList.filter(
    (item) => item.stockCurrent <= item.stockMinimum
  );

  return {
    message: 'Productos con stock bajo obtenidos correctamente',
    inventory: lowStockItems,
  };
};