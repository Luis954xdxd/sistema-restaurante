import { api } from '../../../services/api';
import type {
  CreateProductPayload,
  GetProductsParams,
  ProductMutationResponse,
  ProductsResponse,
  UpdateProductPayload,
} from '../types/products.types';

function buildProductsQuery(params: GetProductsParams) {
  const queryParams = new URLSearchParams();

  if (params.search) {
    queryParams.set('search', params.search);
  }

  if (typeof params.categoryId === 'number') {
    queryParams.set('categoryId', String(params.categoryId));
  }

  if (typeof params.isAvailable === 'boolean') {
    queryParams.set('isAvailable', String(params.isAvailable));
  }

  if (params.page) {
    queryParams.set('page', String(params.page));
  }

  if (params.limit) {
    queryParams.set('limit', String(params.limit));
  }

  const queryString = queryParams.toString();
  return queryString ? `/products?${queryString}` : '/products';
}

export async function getProducts(params: GetProductsParams) {
  const { data } = await api.get<ProductsResponse>(buildProductsQuery(params));
  return data;
}

export async function createProduct(payload: CreateProductPayload) {
  const formData = new FormData();

  formData.append('name', payload.name);
  formData.append('description', payload.description || '');
  formData.append('price', String(payload.price));
  formData.append('categoryId', String(payload.categoryId));

  if (payload.image) {
    formData.append('image', payload.image);
  }

  const { data } = await api.post<ProductMutationResponse>('/products', formData);
  return data;
}

export async function updateProduct(id: number, payload: UpdateProductPayload) {
  const formData = new FormData();

  if (payload.name !== undefined) {
    formData.append('name', payload.name);
  }

  if (payload.description !== undefined) {
    formData.append('description', payload.description);
  }

  if (payload.price !== undefined) {
    formData.append('price', String(payload.price));
  }

  if (payload.categoryId !== undefined) {
    formData.append('categoryId', String(payload.categoryId));
  }

  if (payload.image) {
    formData.append('image', payload.image);
  }

  const { data } = await api.put<ProductMutationResponse>(
    `/products/${id}`,
    formData
  );

  return data;
}

export async function toggleProductAvailability(id: number) {
  const { data } = await api.patch<ProductMutationResponse>(
    `/products/${id}/toggle-availability`
  );

  return data;
}

export async function deleteProduct(id: number) {
  const { data } = await api.delete<ProductMutationResponse>(`/products/${id}`);
  return data;
}