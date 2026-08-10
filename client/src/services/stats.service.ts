import api from '../lib/axios';
import type { PlatformStats, ApiResponse } from '../types';

export const statsService = {
  async getStats(): Promise<PlatformStats> {
    const { data } = await api.get<ApiResponse<PlatformStats>>('/stats');
    return data.data || { domains: 0, technologies: 0, courses: 0, lessons: 0 };
  },
};
