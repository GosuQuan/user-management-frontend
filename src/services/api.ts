import axios from 'axios';
import { User, UserFormData } from '../types/user';

const API_BASE_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userApi = {
  getUsers: async () => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getUser: async (id: number) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: UserFormData) => {
    const response = await api.post<User>('/users', userData);
    return response.data;
  },

  updateUser: async (id: number, userData: UserFormData) => {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number) => {
    await api.delete(`/users/${id}`);
  },
};
