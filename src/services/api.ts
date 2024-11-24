import axios from 'axios';
import { User, UserFormData, LoginData, RegisterData } from '../types/user';
import { handleAuthError } from '../utils/auth';

const API_BASE_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for handling cookies
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 不处理登录接口的401错误
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      // Handle unauthorized access with loading state
      handleAuthError();
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: LoginData) => {
    const response = await api.post<{ user: User }>('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterData) => {
    const response = await api.post<{ user: User }>('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async () => {
    const response = await api.get<{ user: User }>('/user/me');
    return response.data;
  },
};

export const adminApi = {
  getAllUsers: async () => {
    const response = await api.get<{ users: User[] }>('/admin/users');
    return response.data;
  },

  updateUserRole: async (userId: number, role: string) => {
    const response = await api.put<{ user: User }>(`/admin/users?id=${userId}`, { role });
    return response.data;
  },

  deleteUser: async (userId: number) => {
    await api.delete(`/admin/users?id=${userId}`);
  },
};
