import { api } from '../../../services/api';
import type {
  CategoriesResponse,
  CategoryMutationResponse,
  CreateCategoryPayload,
  GetCategoriesParams,
  UpdateCategoryPayload,
} from '../types/categories.types';

export async function getCategories(params: GetCategoriesParams) {
  const queryParams = new URLSearchParams();

  if (params.search) {
    queryParams.set('search', params.search);
  }

  if (typeof params.isActive === 'boolean') {
    queryParams.set('isActive', String(params.isActive));
  }

  if (params.page) {
    queryParams.set('page', String(params.page));
  }

  if (params.limit) {
    queryParams.set('limit', String(params.limit));
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/categories?${queryString}` : '/categories';

  const { data } = await api.get<CategoriesResponse>(url);
  return data;
}

export async function createCategory(payload: CreateCategoryPayload) {
  const { data } = await api.post<CategoryMutationResponse>('/categories', payload);
  return data;
}

export async function updateCategory(id: number, payload: UpdateCategoryPayload) {
  const { data } = await api.put<CategoryMutationResponse>(`/categories/${id}`, payload);
  return data;
}

export async function toggleCategoryStatus(id: number) {
  const { data } = await api.patch<CategoryMutationResponse>(
    `/categories/${id}/toggle-status`
  );
  return data;
}

export async function deleteCategory(id: number) {
  const { data } = await api.delete<CategoryMutationResponse>(`/categories/${id}`);
  return data;
}