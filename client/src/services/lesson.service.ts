import api from '../lib/axios';
import type { LessonWithNav, LessonSummary, ApiResponse } from '../types';

export const lessonService = {
  async getBySlug(slug: string): Promise<LessonWithNav> {
    const { data } = await api.get<ApiResponse<LessonWithNav>>(`/lessons/${slug}`);
    return data.data!;
  },

  async getByModule(moduleId: string): Promise<LessonSummary[]> {
    const { data } = await api.get<ApiResponse<LessonSummary[]>>(`/lessons/module/${moduleId}`);
    return data.data!;
  },
};
