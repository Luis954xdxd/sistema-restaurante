import { useQuery } from '@tanstack/react-query';
import { getPublicMenuProducts } from '../modules/menu/services/menu.service';

export function useMenu() {
  return useQuery({
    queryKey: ['client-menu-products'],
    queryFn: getPublicMenuProducts,
  });
}