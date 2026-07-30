export type UserRole = "user" | "admin";
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  itemPerPage: number;
  currentPage: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
export interface SelectOption {
  value: string | number;
  label: string;
}

export interface BaseFilterParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  search?: string;
}
