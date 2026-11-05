export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type PaginatedResult<T> = {
  data: T[];
  pagination: PaginationMeta;
};
