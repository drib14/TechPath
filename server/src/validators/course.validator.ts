import { z } from 'zod';

export const createCourseSchema = z.object({
  technologyId: z.string().min(1, 'Technology ID is required'),
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  description: z.string().min(1, 'Description is required').max(5000),
  thumbnail: z.string().optional().default(''),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional().default('beginner'),
  status: z.enum(['draft', 'published']).optional().default('draft'),
  order: z.number().int().min(0).optional().default(0),
});

export const updateCourseSchema = createCourseSchema.partial();

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
