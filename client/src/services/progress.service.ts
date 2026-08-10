import api from '../lib/axios';
import type { Progress, ApiResponse } from '../types';

interface DashboardCourseProgress {
  course: {
    _id: string;
    title: string;
    slug: string;
    description: string;
    difficulty: string;
    thumbnail: string;
    technologyId: { name: string; slug: string } | null;
  };
  totalLessons: number;
  completedLessons: number;
  percentage: number;
}

interface ContinueLearning {
  course: {
    _id: string;
    title: string;
    slug: string;
  };
  lesson: {
    _id: string;
    title: string;
    slug: string;
  };
  module: {
    title: string;
  };
  courseProgress: number;
}

interface RecentlyCompletedItem {
  lesson: {
    _id: string;
    title: string;
    slug: string;
    moduleId?: {
      title: string;
      courseId: string;
    };
  };
  completedAt: string;
}

export interface DashboardData {
  recentlyCompleted: RecentlyCompletedItem[];
  enrolledCourses: DashboardCourseProgress[];
  continueLearning: ContinueLearning | null;
  stats: {
    totalCompletedLessons: number;
    coursesInProgress: number;
    coursesCompleted: number;
  };
}

export const progressService = {
  async getProgress(): Promise<Progress[]> {
    const { data } = await api.get<ApiResponse<Progress[]>>('/progress');
    return data.data || [];
  },

  async completeLesson(lessonId: string): Promise<Progress> {
    const { data } = await api.post<ApiResponse<Progress>>(
      `/progress/${lessonId}/complete`
    );
    return data.data!;
  },

  async checkLessonStatus(lessonId: string): Promise<boolean> {
    const { data } = await api.get<ApiResponse<{ completed: boolean }>>(
      `/progress/${lessonId}/status`
    );
    return data.data?.completed ?? false;
  },

  async getDashboard(): Promise<DashboardData> {
    const { data } = await api.get<ApiResponse<DashboardData>>(
      '/progress/dashboard'
    );
    return data.data!;
  },
};
