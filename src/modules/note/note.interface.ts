import { z } from 'zod';
import { createNoteSchema, updateNoteSchema } from './note.validation';

export type CreateNoteInput = z.infer<typeof createNoteSchema>['body'];
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>['body'];
