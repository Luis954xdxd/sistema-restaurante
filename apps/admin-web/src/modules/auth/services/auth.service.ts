import { api } from '../../../services/api';
import type { LoginPayload, LoginResponse } from '../../../types/auth.types';

export async function loginRequest(payload: LoginPayload) {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);
  return data;
}