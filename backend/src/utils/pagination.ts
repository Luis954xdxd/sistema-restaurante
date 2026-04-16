import { PaginatedResponse } from '../shared/types/pagination.types';

// 🔹 Obtiene page, limit y skip
export const getPaginationParams = (
  page?: number,
  limit?: number
) => {
  const currentPage =
    typeof page === 'number' && !Number.isNaN(page) && page > 0 ? page : 1;

  const currentLimit =
    typeof limit === 'number' && !Number.isNaN(limit) && limit > 0
      ? limit
      : 10;

  const skip = (currentPage - 1) * currentLimit;

  return {
    page: currentPage,
    limit: currentLimit,
    skip,
  };
};

// 🔹 Solo devuelve skip (para compatibilidad)
export const getSkip = (page: number, limit: number) => {
  return (page - 1) * limit;
};

// 🔹 Meta de paginación (lo que usan tus services)
export const buildPaginationMeta = (
  totalItems: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(totalItems / limit) || 1;

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

// 🔹 (OPCIONAL) Si aún usas esto en otros lados
export const buildPaginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  totalItems: number
): PaginatedResponse<T> => {
  return {
    data,
    pagination: buildPaginationMeta(totalItems, page, limit),
  };
};