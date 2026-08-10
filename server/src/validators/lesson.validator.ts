import { z } from 'zod';

const contentBlockSchema = z.object({
  type: z.enum([
    'heading',
    'text',
    'code',
    'image',
    'video',
    'tip',
    'warning',
    'note',
    'example',
    'exercise',
    'assessment',
  ]),
  content: z.string().default(''),
  title: z.string().optional(),
  language: z.string().optional(),
  level: z.number().int().min(1).max(6).optional(),
  url: z.string().optional(),
  alt: z.string().optional(),
  order: z.number().int().min(0).default(0),
});

export const createLessonSchema = z.object({
  moduleId: z.string().min(1, 'Module ID is required'),
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  description: z.string().optional().default(''),
  content: z.array(contentBlockSchema).optional().default([]),
  order: z.number().int().min(0).optional().default(0),
  status: z.enum(['draft', 'published']).optional().default('draft'),
});

export const updateLessonSchema = createLessonSchema.partial();

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
