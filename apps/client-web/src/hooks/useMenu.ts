// Importamos useQuery de React Query
import { useQuery } from '@tanstack/react-query';

// Importamos servicio del menú
import { getPublicMenuProducts } from '../modules/menu/services/menu.service';

// Hook para obtener el menú público
export function useMenu() {
  return useQuery({
    queryKey: ['client-menu-products'],
    queryFn: getPublicMenuProducts,
  });
}