// Importamos ReactNode para tipar children
import type { ReactNode } from 'react';

// Importamos QueryClient y provider de React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Importamos provider del carrito
import { CartProvider } from '../contexts/CartContext';

// Props del componente
interface Props {
  children: ReactNode;
}

// Instancia global de React Query
const queryClient = new QueryClient();

// Provider principal de la app
export function AppProviders({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>{children}</CartProvider>
    </QueryClientProvider>
  );
}