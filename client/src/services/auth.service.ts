import api from '../lib/axios';
import type { User, ApiResponse } from '../types';

export const authService = {
  async googleLogin(credential: string): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>('/auth/google', { credential });
    return data.data!;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    return data.data!;
  },
};
