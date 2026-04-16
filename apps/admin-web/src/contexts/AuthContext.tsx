import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, LoginResponse } from '../types/auth.types';
import { AuthContext } from './auth-context';

interface Props {
  children: ReactNode;
}

const TOKEN_KEY = 'restaurant_admin_token';
const USER_KEY = 'restaurant_admin_user';

function getInitialToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getInitialUser(): AuthUser | null {
  const savedUser = localStorage.getItem(USER_KEY);
  return savedUser ? JSON.parse(savedUser) : null;
}

export function AuthProvider({ children }: Props) {
  const [token, setToken] = useState<string | null>(() => getInitialToken());
  const [user, setUser] = useState<AuthUser | null>(() => getInitialUser());

  const login = (data: LoginResponse) => {
    setToken(data.accessToken);
    setUser(data.user);

    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}