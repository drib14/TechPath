import { z } from 'zod';

const optionSchema = z.object({
  text: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
});

const questionSchema = z.object({
  question: z.string().min(1, 'Question text is required'),
  type: z.enum(['multiple-choice', 'true-false']),
  options: z.array(optionSchema).min(2, 'At least 2 options are required'),
  explanation: z.string().default(''),
});

export const createAssessmentSchema = z.object({
  lessonId: z.string().min(1, 'Lesson ID is required'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().default(''),
  questions: z.array(questionSchema).default([]),
  passingScore: z.number().min(0).max(100).default(70),
});

export const updateAssessmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200).optional(),
  description: z.string().optional(),
  questions: z.array(questionSchema).optional(),
  passingScore: z.number().min(0).max(100).optional(),
});

export const submitAssessmentSchema = z.object({
  answers: z.array(
    z.object({
      questionIndex: z.number(),
      selectedOptionIndex: z.number(),
    })
  ),
});

export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
export type UpdateAssessmentInput = z.infer<typeof updateAssessmentSchema>;
export type SubmitAssessmentInput = z.infer<typeof submitAssessmentSchema>;
