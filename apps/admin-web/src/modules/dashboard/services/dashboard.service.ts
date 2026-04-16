import { api } from '../../../services/api';
import type { DashboardSummaryResponse } from '../../../types/dashboard.types';

export async function getDashboardSummary() {
  const { data } = await api.get<DashboardSummaryResponse>('/dashboard/summary');
  return data;
}