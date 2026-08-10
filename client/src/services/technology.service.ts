import api from '../lib/axios';
import type { Technology, Course, ApiResponse } from '../types';

export const technologyService = {
  async getAll(): Promise<Technology[]> {
    const { data } = await api.get<ApiResponse<Technology[]>>('/technologies');
    return data.data!;
  },

  async getBySlug(slug: string): Promise<Technology> {
    const { data } = await api.get<ApiResponse<Technology>>(`/technologies/${slug}`);
    return data.data!;
  },

  async getCourses(technologyId: string): Promise<Course[]> {
    const { data } = await api.get<ApiResponse<Course[]>>(`/courses/technology/${technologyId}`);
    return data.data!;
  },
};
