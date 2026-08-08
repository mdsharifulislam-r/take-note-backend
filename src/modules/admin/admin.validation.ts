import { z } from 'zod';
import { objectIdSchema } from '../../validations/common.validation';

export class AdminValidation {
  readonly userPosts = z.object({
    params: z.object({
      userId: objectIdSchema,
    }),
  });
}

export const adminValidation = new AdminValidation();
