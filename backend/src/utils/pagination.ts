import { PaginatedResponse } from '../shared/types/pagination.types';

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

export const buildPaginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  totalItems: number
): PaginatedResponse<T> => {
  const totalPages = Math.ceil(totalItems / limit) || 1;

  return {
    data,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};