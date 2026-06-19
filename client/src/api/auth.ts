import api from './axios';
import type { User } from '../types';

export const register = (name: string, email: string, password: string) =>
  api.post<User>('/auth/register', { name, email, password }).then((r) => r.data);

export const login = (email: string, password: string) =>
  api.post<User>('/auth/login', { email, password }).then((r) => r.data);

export const getProfile = () => api.get<User>('/auth/profile').then((r) => r.data);

export const updateProfile = (data: Partial<User> & { password?: string }) =>
  api.put<User>('/auth/profile', data).then((r) => r.data);
