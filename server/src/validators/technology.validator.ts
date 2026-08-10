import { z } from 'zod';

export const createTechnologySchema = z.object({
  domainId: z.string().min(1, 'Domain ID is required'),
  name: z.string().min(1, 'Name is required').max(100),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  description: z.string().min(1, 'Description is required').max(2000),
  icon: z.string().optional().default(''),
  status: z.enum(['draft', 'published']).optional().default('draft'),
  order: z.number().int().min(0).optional().default(0),
});

export const updateTechnologySchema = createTechnologySchema.partial();

export type CreateTechnologyInput = z.infer<typeof createTechnologySchema>;
export type UpdateTechnologyInput = z.infer<typeof updateTechnologySchema>;
