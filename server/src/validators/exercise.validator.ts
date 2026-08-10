import { z } from 'zod';

const exerciseOptionSchema = z.object({
  text: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
});

export const createExerciseSchema = z.object({
  lessonId: z.string().min(1, 'Lesson ID is required'),
  type: z.enum([
    'multiple-choice',
    'true-false',
    'text-answer',
    'code',
    'configuration',
    'scenario',
  ]),
  question: z.string().min(1, 'Question is required').max(2000),
  options: z.array(exerciseOptionSchema).default([]),
  correctAnswer: z.string().default(''),
  explanation: z.string().default(''),
  order: z.number().int().min(0).default(0),
});

export const updateExerciseSchema = createExerciseSchema.partial().omit({ lessonId: true });

export const submitExerciseSchema = z.object({
  selectedOptionIndex: z.number().int().min(0).optional(),
  textAnswer: z.string().max(5000).optional(),
});

export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;
export type SubmitExerciseInput = z.infer<typeof submitExerciseSchema>;
