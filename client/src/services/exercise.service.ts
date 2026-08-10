import api from '../lib/axios';
import type { Exercise, ApiResponse } from '../types';

interface SanitizedExercise {
  _id: string;
  lessonId: string;
  type: Exercise['type'];
  question: string;
  options: { text: string }[];
  explanation: string;
  order: number;
}

interface ExerciseResult {
  isCorrect: boolean;
  correctOptionIndex?: number;
  correctAnswer?: string;
  explanation: string;
}

export const exerciseService = {
  async getByLesson(lessonId: string): Promise<SanitizedExercise[]> {
    const { data } = await api.get<ApiResponse<SanitizedExercise[]>>(
      `/exercises/lesson/${lessonId}`
    );
    return data.data || [];
  },

  async submitAnswer(
    exerciseId: string,
    payload: { selectedOptionIndex?: number; textAnswer?: string }
  ): Promise<ExerciseResult> {
    const { data } = await api.post<ApiResponse<ExerciseResult>>(
      `/exercises/${exerciseId}/submit`,
      payload
    );
    return data.data!;
  },
};
