// Importamos axios configurado
import { api } from '../../../services/api';

// Importamos tipo de respuesta
import type { DashboardSummaryResponse } from '../../../types/dashboard.types';

// Función que obtiene resumen del dashboard
export async function getDashboardSummary() {
  const { data } = await api.get<DashboardSummaryResponse>('/dashboard/summary');
  return data;
}