export type Role = 'ADMIN' | 'USER';

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface UserFormData {
  username?: string;
  email?: string;
  role?: Role;
}
