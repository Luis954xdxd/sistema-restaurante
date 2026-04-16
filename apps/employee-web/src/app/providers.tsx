// Importamos ReactNode para tipar children
import type { ReactNode } from 'react';

// Importamos React Query para manejar peticiones y caché
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Importamos el provider de autenticación
import { AuthProvider } from '../contexts/AuthContext';

// Definimos las props del componente
interface Props {
  children: ReactNode;
}

// Creamos una instancia global de React Query
const queryClient = new QueryClient();

// Componente que agrupa todos los providers globales
export function AppProviders({ children }: Props) {
  return (
    // Provider de React Query
    <QueryClientProvider client={queryClient}>
      {/* Provider de autenticación */}
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}