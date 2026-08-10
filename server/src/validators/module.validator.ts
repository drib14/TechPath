import { z } from 'zod';

export const createModuleSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional().default(''),
  order: z.number().int().min(0).optional().default(0),
});

export const updateModuleSchema = createModuleSchema.partial();

export type CreateModuleInput = z.infer<typeof createModuleSchema>;
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;
