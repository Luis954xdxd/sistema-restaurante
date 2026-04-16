import prisma from '../../config/prisma';
import { AppError } from '../../shared/errors/AppError';
import { buildPaginationMeta, getPaginationParams, getSkip } from '../../utils/pagination';
import type { CreateCategoryInput, GetCategoriesQuery, UpdateCategoryInput } from './category.types';

export async function createCategoryService(payload: CreateCategoryInput) {
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (existingCategory) {
    throw new AppError('Ya existe una categoría con ese nombre', 409);
  }

  const category = await prisma.category.create({
    data: {
      name: payload.name,
      description: payload.description,
    },
  });

  return {
    message: 'Categoría creada correctamente',
    category,
  };
}

export async function getAllCategoriesService(query: GetCategoriesQuery) {
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
    ...(typeof query.isActive === 'boolean'
      ? {
          isActive: query.isActive,
        }
      : {}),
  };

  const [categories, totalItems] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip: getSkip(page, limit),
      take: limit,
    }),
    prisma.category.count({ where }),
  ]);

  return {
    message: 'Categorías obtenidas correctamente',
    data: categories,
    pagination: buildPaginationMeta(totalItems, page, limit),
  };
}

export async function getCategoryByIdService(id: number) {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new AppError('Categoría no encontrada', 404);
  }

  return {
    message: 'Categoría obtenida correctamente',
    category,
  };
}

export async function updateCategoryService(id: number, payload: UpdateCategoryInput) {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new AppError('Categoría no encontrada', 404);
  }

  if (payload.name && payload.name !== existingCategory.name) {
    const duplicatedCategory = await prisma.category.findUnique({
      where: { name: payload.name },
    });

    if (duplicatedCategory) {
      throw new AppError('Ya existe una categoría con ese nombre', 409);
    }
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      name: payload.name,
      description: payload.description,
    },
  });

  return {
    message: 'Categoría actualizada correctamente',
    category: updatedCategory,
  };
}

export async function toggleCategoryStatusService(id: number) {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new AppError('Categoría no encontrada', 404);
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      isActive: !existingCategory.isActive,
    },
  });

  return {
    message: updatedCategory.isActive
      ? 'Categoría visible correctamente'
      : 'Categoría oculta correctamente',
    category: updatedCategory,
  };
}

export async function deleteCategoryService(id: number) {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        select: { id: true },
      },
    },
  });

  if (!existingCategory) {
    throw new AppError('Categoría no encontrada', 404);
  }

  if (existingCategory.products.length > 0) {
    throw new AppError(
      'No se puede eliminar la categoría porque tiene productos asociados. Puedes ocultarla.',
      409
    );
  }

  const deletedCategory = await prisma.category.delete({
    where: { id },
  });

  return {
    message: 'Categoría eliminada correctamente',
    category: deletedCategory,
  };
}