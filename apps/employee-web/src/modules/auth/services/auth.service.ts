// Importamos la instancia axios configurada
import { api } from '../../../services/api';

// Importamos tipos
import type { LoginPayload, LoginResponse } from '../../../types/auth.types';

// Función que pide login al backend
export async function loginRequest(payload: LoginPayload) {
  // Enviamos POST al endpoint de login
  const { data } = await api.post<LoginResponse>('/auth/login', payload);

  // Devolvemos la respuesta del backend
  return data;
}