// Payload que se enviará al backend al iniciar sesión
export interface LoginPayload {
  email: string;
  password: string;
}

// Datos del usuario autenticado
export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  status: string;
  role: string;
  createdAt: string;
}

// Respuesta que devuelve el backend al iniciar sesión
export interface LoginResponse {
  message: string;
  accessToken: string;
  user: AuthUser;
}