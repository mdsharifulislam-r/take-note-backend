import { PaginatedResult } from '../types';
import { IPaginationQuery } from '../validations/common.validation';

export const getPaginationParams = (query: unknown): IPaginationQuery & { skip: number } => {
  const { page, limit } = query as IPaginationQuery;
  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

export const buildPaginatedResult = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> => {
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
