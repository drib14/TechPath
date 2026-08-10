import { z } from 'zod';

export const createDomainSchema = z.object({
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

export const updateDomainSchema = createDomainSchema.partial();

export type CreateDomainInput = z.infer<typeof createDomainSchema>;
export type UpdateDomainInput = z.infer<typeof updateDomainSchema>;
