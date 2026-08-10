import api from '../lib/axios';
import type { Domain, Technology, ApiResponse } from '../types';

export const domainService = {
  async getAll(): Promise<Domain[]> {
    const { data } = await api.get<ApiResponse<Domain[]>>('/domains');
    return data.data!;
  },

  async getBySlug(slug: string): Promise<Domain> {
    const { data } = await api.get<ApiResponse<Domain>>(`/domains/${slug}`);
    return data.data!;
  },

  async getTechnologies(domainId: string): Promise<Technology[]> {
    const { data } = await api.get<ApiResponse<Technology[]>>(`/technologies/domain/${domainId}`);
    return data.data!;
  },
};
