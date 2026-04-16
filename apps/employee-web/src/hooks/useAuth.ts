// Importamos useContext para leer el contexto
import { useContext } from 'react';

// Importamos el contexto de autenticación
import { AuthContext } from '../contexts/auth-context';

// Hook personalizado para usar auth fácilmente
export function useAuth() {
  const context = useContext(AuthContext);

  // Si el hook se usa fuera del provider, lanzamos error
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}