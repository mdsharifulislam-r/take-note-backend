import { z } from 'zod';
import { objectIdSchema, paginationSchema } from '../../validations/common.validation';

export const createNoteSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'Title is required.').max(200),
    content: z.string().trim().min(1, 'Content is required.'),
  }),
});

export const updateNoteSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    title: z.string().trim().min(1, 'Title cannot be empty.').max(200).optional(),
    content: z.string().trim().min(1, 'Content cannot be empty.').optional(),
  }),
});

export const noteParamsSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const notePaginationSchema = z.object({
  query: paginationSchema,
});
