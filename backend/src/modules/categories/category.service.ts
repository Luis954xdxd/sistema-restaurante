import prisma from '../../config/prisma';
import { AppError } from '../../shared/errors/AppError';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from './category.types';
import { getPaginationParams, buildPaginatedResponse } from '../../utils/pagination';
import { GetCategoriesQuery } from './category.types';

export const createCategoryService = async (input: CreateCategoryInput) => {
  const { name, description } = input;

  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new AppError('El nombre de la categoría es obligatorio', 400);
  }

  const existingCategory = await prisma.category.findUnique({
    where: {
      name: normalizedName,
    },
  });

  if (existingCategory) {
    throw new AppError('Ya existe una categoría con ese nombre', 400);
  }

  const category = await prisma.category.create({
    data: {
      name: normalizedName,
      description: description?.trim() || null,
    },
  });

  return {
    message: 'Categoría creada correctamente',
    category,
  };
};

export const getAllCategoriesService = async (query: GetCategoriesQuery) => {
  const { search, isActive, page, limit } = query;

  const { page: currentPage, limit: currentLimit, skip } = getPaginationParams(
    page,
    limit
  );

  const where: {
    name?: {
      contains: string;
      mode: 'insensitive';
    };
    isActive?: boolean;
  } = {};

  if (search) {
    where.name = {
      contains: search.trim(),
      mode: 'insensitive',
    };
  }

  if (typeof isActive === 'boolean') {
    where.isActive = isActive;
  }

  const [categories, totalItems] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy: {
        id: 'asc',
      },
      skip,
      take: currentLimit,
    }),
    prisma.category.count({ where }),
  ]);

  return {
    message: 'Categorías obtenidas correctamente',
    ...buildPaginatedResponse(categories, currentPage, currentLimit, totalItems),
  };
};

export const getCategoryByIdService = async (id: number) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new AppError('Categoría no encontrada', 404);
  }

  return {
    message: 'Categoría obtenida correctamente',
    category,
  };
};

export const updateCategoryService = async (
  id: number,
  input: UpdateCategoryInput
) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!existingCategory) {
    throw new AppError('Categoría no encontrada', 404);
  }

  const dataToUpdate: {
    name?: string;
    description?: string | null;
  } = {};

  if (input.name !== undefined) {
    const normalizedName = input.name.trim();

    if (!normalizedName) {
      throw new AppError('El nombre de la categoría no puede estar vacío', 400);
    }

    const categoryWithSameName = await prisma.category.findFirst({
      where: {
        name: normalizedName,
        NOT: {
          id,
        },
      },
    });

    if (categoryWithSameName) {
      throw new AppError('Ya existe otra categoría con ese nombre', 400);
    }

    dataToUpdate.name = normalizedName;
  }

  if (input.description !== undefined) {
    dataToUpdate.description = input.description.trim() || null;
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id,
    },
    data: dataToUpdate,
  });

  return {
    message: 'Categoría actualizada correctamente',
    category: updatedCategory,
  };
};

export const toggleCategoryStatusService = async (id: number) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!existingCategory) {
    throw new AppError('Categoría no encontrada', 404);
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id,
    },
    data: {
      isActive: !existingCategory.isActive,
    },
  });

  return {
    message: updatedCategory.isActive
      ? 'Categoría activada correctamente'
      : 'Categoría desactivada correctamente',
    category: updatedCategory,
  };
};