export interface LoginPayload {
  email: string;
  password: string;
}

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

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: AuthUser;
}