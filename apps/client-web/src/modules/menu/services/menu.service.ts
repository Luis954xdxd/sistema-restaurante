// Importamos la instancia de axios configurada
import { api } from '../../../services/api';

// Importamos el tipo de respuesta esperado del menú
import type { MenuProductsResponse } from '../types/menu.types';

// Función para obtener productos visibles del menú público
export async function getPublicMenuProducts() {
  // Consumimos la nueva ruta pública del backend
  const { data } = await api.get<MenuProductsResponse>('/products/public');

  // Retornamos la respuesta ya tipada
  return data;
}