export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  categoryId?: number;
}

export interface GetProductsQuery {
  search?: string;
  categoryId?: number;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
}