import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format.');

export type IPaginationQuery = z.infer<typeof paginationSchema>;
