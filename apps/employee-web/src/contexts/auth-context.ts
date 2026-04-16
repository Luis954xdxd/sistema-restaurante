// Importamos createContext para crear el contexto global
import { createContext } from 'react';

// Importamos tipos relacionados con autenticación
import type { AuthUser, LoginResponse } from '../types/auth.types';

// Definimos la estructura del contexto
export interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (data: LoginResponse) => void;
  logout: () => void;
}

// Creamos el contexto con valor inicial null
export const AuthContext = createContext<AuthContextValue | null>(null);