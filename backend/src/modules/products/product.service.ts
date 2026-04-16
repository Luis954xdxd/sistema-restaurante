import prisma from '../../config/prisma';
import { CreateProductInput, UpdateProductInput } from './product.types';
import { buildPaginatedResponse, getPaginationParams } from '../../utils/pagination';
import { GetProductsQuery } from './product.types';
import { AppError } from '../../shared/errors/AppError';

export const createProductService = async (input: CreateProductInput) => {
  const { name, description, price, imageUrl, categoryId } = input;

  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new AppError('El nombre del producto es obligatorio', 400);
  }

  if (typeof price !== 'number' || Number.isNaN(price) || price <= 0) {
    throw new AppError('El precio debe ser un número mayor a 0', 400);
  }

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw new AppError('El categoryId debe ser un número entero válido', 400);
  }

  const existingCategory = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!existingCategory) {
    throw new AppError('La categoría seleccionada no existe', 404);
  }

  if (!existingCategory.isActive) {
    throw new AppError(
      'No se puede crear un producto en una categoría inactiva',
      400
    );
  }

  const product = await prisma.product.create({
    data: {
      name: normalizedName,
      description: description?.trim() || null,
      price,
      imageUrl: imageUrl?.trim() || null,
      categoryId,
    },
    include: {
      category: true,
    },
  });

  return {
    message: 'Producto creado correctamente',
    product,
  };
};

export const getAllProductsService = async (query: GetProductsQuery) => {
  const { search, categoryId, isAvailable, page, limit } = query;

  const { page: currentPage, limit: currentLimit, skip } = getPaginationParams(
    page,
    limit
  );

  const where: {
    name?: {
      contains: string;
      mode: 'insensitive';
    };
    categoryId?: number;
    isAvailable?: boolean;
  } = {};

  if (search) {
    where.name = {
      contains: search.trim(),
      mode: 'insensitive',
    };
  }

  if (typeof categoryId === 'number' && !Number.isNaN(categoryId)) {
    where.categoryId = categoryId;
  }

  if (typeof isAvailable === 'boolean') {
    where.isAvailable = isAvailable;
  }

  const [products, totalItems] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        id: 'asc',
      },
      skip,
      take: currentLimit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    message: 'Productos obtenidos correctamente',
    ...buildPaginatedResponse(products, currentPage, currentLimit, totalItems),
  };
};

export const getProductByIdService = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    throw new Error('Producto no encontrado');
  }

  return {
    message: 'Producto obtenido correctamente',
    product,
  };
};

export const updateProductService = async (
  id: number,
  input: UpdateProductInput
) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!existingProduct) {
    throw new AppError('Producto no encontrado', 404);
  }

  const dataToUpdate: {
    name?: string;
    description?: string | null;
    price?: number;
    imageUrl?: string | null;
    categoryId?: number;
  } = {};

  if (input.name !== undefined) {
    const normalizedName = input.name.trim();

    if (!normalizedName) {
      throw new AppError('El nombre del producto no puede estar vacío', 400);
    }

    dataToUpdate.name = normalizedName;
  }

  if (input.description !== undefined) {
    dataToUpdate.description = input.description.trim() || null;
  }

  if (input.price !== undefined) {
    if (
      typeof input.price !== 'number' ||
      Number.isNaN(input.price) ||
      input.price <= 0
    ) {
      throw new AppError('El precio debe ser un número mayor a 0', 400);
    }

    dataToUpdate.price = input.price;
  }

  if (input.imageUrl !== undefined) {
    dataToUpdate.imageUrl = input.imageUrl.trim() || null;
  }

  if (input.categoryId !== undefined) {
    if (!Number.isInteger(input.categoryId) || input.categoryId <= 0) {
      throw new AppError('El categoryId debe ser un número entero válido', 400);
    }

    const existingCategory = await prisma.category.findUnique({
      where: {
        id: input.categoryId,
      },
    });

    if (!existingCategory) {
      throw new AppError('La categoría seleccionada no existe', 404);
    }

    if (!existingCategory.isActive) {
      throw new AppError(
        'No se puede mover un producto a una categoría inactiva',
        400
      );
    }

    dataToUpdate.categoryId = input.categoryId;
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id,
    },
    data: dataToUpdate,
    include: {
      category: true,
    },
  });

  return {
    message: 'Producto actualizado correctamente',
    product: updatedProduct,
  };
};
export const toggleProductAvailabilityService = async (id: number) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!existingProduct) {
    throw new Error('Producto no encontrado');
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id,
    },
    data: {
      isAvailable: !existingProduct.isAvailable,
    },
    include: {
      category: true,
    },
  });

  return {
    message: updatedProduct.isAvailable
      ? 'Producto activado correctamente'
      : 'Producto desactivado correctamente',
    product: updatedProduct,
  };
};