// Importamos React Query
import { useQuery } from '@tanstack/react-query';

// Importamos servicio
import { getDashboardSummary } from '../modules/dashboard/services/dashboard.service';

// Hook para consultar dashboard del empleado
export function useEmployeeDashboard() {
  return useQuery({
    queryKey: ['employee-dashboard-summary'],
    queryFn: getDashboardSummary,
  });
}