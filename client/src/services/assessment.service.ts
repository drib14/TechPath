import api from '../lib/axios';
import type { Assessment, AssessmentSubmissionResult, ApiResponse } from '../types';

interface SanitizedAssessment {
  _id: string;
  lessonId: string;
  title: string;
  description: string;
  questions: {
    _id: string;
    question: string;
    type: 'multiple-choice' | 'true-false';
    options: { text: string }[];
  }[];
  passingScore: number;
}

export const assessmentService = {
  async getByLesson(lessonId: string): Promise<SanitizedAssessment | null> {
    const { data } = await api.get<ApiResponse<SanitizedAssessment | null>>(
      `/assessments/lesson/${lessonId}`
    );
    return data.data || null;
  },

  async submit(
    assessmentId: string,
    answers: { questionIndex: number; selectedOptionIndex: number }[]
  ): Promise<AssessmentSubmissionResult> {
    const { data } = await api.post<ApiResponse<AssessmentSubmissionResult>>(
      `/assessments/${assessmentId}/submit`,
      { answers }
    );
    return data.data!;
  },
};
