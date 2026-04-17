import prisma from '../../config/prisma';
import { AppError } from '../../shared/errors/AppError';
import { buildPaginationMeta, getPaginationParams, getSkip } from '../../utils/pagination';
import type {
  CreateProductInput,
  GetProductsQuery,
  UpdateProductInput,
} from './product.types';

export async function createProductService(payload: CreateProductInput) {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) {
    throw new AppError('La categoría seleccionada no existe', 404);
  }

  const product = await prisma.product.create({
    data: {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      imageUrl: payload.imageUrl,
      categoryId: payload.categoryId,
    },
    include: {
      category: true,
    },
  });

  return {
    message: 'Producto creado correctamente',
    product,
  };
}

export async function getAllProductsService(query: GetProductsQuery) {
  const { page, limit } = getPaginationParams(query.page, query.limit);

  const where = {
    ...(query.search
      ? {
          name: {
            contains: query.search,
            mode: 'insensitive' as const,
          },
        }
      : {}),
    ...(typeof query.categoryId === 'number'
      ? {
          categoryId: query.categoryId,
        }
      : {}),
    ...(typeof query.isAvailable === 'boolean'
      ? {
          isAvailable: query.isAvailable,
        }
      : {}),
  };

  const [products, totalItems] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: getSkip(page, limit),
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    message: 'Productos obtenidos correctamente',
    data: products,
    pagination: buildPaginationMeta(totalItems, page, limit),
  };
}

/**
 * Obtiene productos públicos del menú:
 * - solo productos disponibles
 * - solo categorías activas
 * - sin autenticación
 */
export async function getPublicProductsService() {
  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
      category: {
        isActive: true,
      },
    },
    include: {
      category: true,
    },
    orderBy: [
      {
        category: {
          name: 'asc',
        },
      },
      {
        name: 'asc',
      },
    ],
  });

  return {
    message: 'Menú público obtenido correctamente',
    data: products,
    pagination: {
      page: 1,
      limit: products.length,
      totalItems: products.length,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
}

export async function getProductByIdService(id: number) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!product) {
    throw new AppError('Producto no encontrado', 404);
  }

  return {
    message: 'Producto obtenido correctamente',
    product,
  };
}

export async function updateProductService(id: number, payload: UpdateProductInput) {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new AppError('Producto no encontrado', 404);
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });

    if (!category) {
      throw new AppError('La categoría seleccionada no existe', 404);
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      imageUrl: payload.imageUrl,
      categoryId: payload.categoryId,
    },
    include: {
      category: true,
    },
  });

  return {
    message: 'Producto actualizado correctamente',
    product: updatedProduct,
  };
}

export async function toggleProductAvailabilityService(id: number) {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new AppError('Producto no encontrado', 404);
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      isAvailable: !existingProduct.isAvailable,
    },
    include: {
      category: true,
    },
  });

  return {
    message: updatedProduct.isAvailable
      ? 'Producto visible correctamente'
      : 'Producto oculto correctamente',
    product: updatedProduct,
  };
}

export async function deleteProductService(id: number) {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
    include: {
      inventory: true,
      inventoryMovements: {
        select: { id: true },
      },
      orderItems: {
        select: { id: true },
      },
    },
  });

  if (!existingProduct) {
    throw new AppError('Producto no encontrado', 404);
  }

  const hasRelations =
    existingProduct.inventory !== null ||
    existingProduct.inventoryMovements.length > 0 ||
    existingProduct.orderItems.length > 0;

  if (hasRelations) {
    throw new AppError(
      'No se puede eliminar el producto porque tiene inventario, movimientos o pedidos relacionados. Puedes ocultarlo.',
      409
    );
  }

  const deletedProduct = await prisma.product.delete({
    where: { id },
    include: {
      category: true,
    },
  });

  return {
    message: 'Producto eliminado correctamente',
    product: deletedProduct,
  };
}