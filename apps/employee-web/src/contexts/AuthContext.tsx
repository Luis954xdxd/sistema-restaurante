// Importamos hooks de React
import { useMemo, useState } from 'react';

// Importamos ReactNode para tipar children
import type { ReactNode } from 'react';

// Importamos tipos
import type { AuthUser, LoginResponse } from '../types/auth.types';

// Importamos el contexto ya creado
import { AuthContext } from './auth-context';

// Props del provider
interface Props {
  children: ReactNode;
}

// Claves de localStorage para no mezclar con admin
const TOKEN_KEY = 'restaurant_employee_token';
const USER_KEY = 'restaurant_employee_user';

// Función para leer token inicial desde localStorage
function getInitialToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Función para leer usuario inicial desde localStorage
function getInitialUser(): AuthUser | null {
  const savedUser = localStorage.getItem(USER_KEY);

  // Si existe usuario guardado, lo convertimos a objeto
  return savedUser ? JSON.parse(savedUser) : null;
}

// Provider de autenticación
export function AuthProvider({ children }: Props) {
  // Estado del token
  const [token, setToken] = useState<string | null>(() => getInitialToken());

  // Estado del usuario autenticado
  const [user, setUser] = useState<AuthUser | null>(() => getInitialUser());

  // Función para iniciar sesión y guardar datos
  const login = (data: LoginResponse) => {
    setToken(data.accessToken);
    setUser(data.user);

    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  };

  // Función para cerrar sesión
  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  // Memoizamos el valor del contexto para evitar renders innecesarios
  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user]
  );

  // Retornamos el provider con el valor del contexto
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}