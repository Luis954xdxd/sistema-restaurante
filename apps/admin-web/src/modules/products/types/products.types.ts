export interface ProductCategory {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  category: ProductCategory;
}

export interface ProductsResponse {
  message: string;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface GetProductsParams {
  search?: string;
  categoryId?: number;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  image?: File | null;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  image?: File | null;
}

export interface ProductMutationResponse {
  message: string;
  product: Product;
}