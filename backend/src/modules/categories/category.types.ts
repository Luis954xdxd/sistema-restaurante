export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
}

export interface GetCategoriesQuery {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}