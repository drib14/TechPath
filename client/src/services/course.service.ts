import api from '../lib/axios';
import type { Course, Module, ApiResponse } from '../types';

export const courseService = {
  async getAll(): Promise<Course[]> {
    const { data } = await api.get<ApiResponse<Course[]>>('/courses');
    return data.data!;
  },

  async getBySlug(slug: string): Promise<Course> {
    const { data } = await api.get<ApiResponse<Course>>(`/courses/${slug}`);
    return data.data!;
  },

  async getModules(courseId: string): Promise<Module[]> {
    const { data } = await api.get<ApiResponse<Module[]>>(`/modules/course/${courseId}`);
    return data.data!;
  },
};
