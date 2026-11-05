import { z } from 'zod';
import { USER_ROLE_VALUES } from '../../constants/users.rules';
import { objectIdSchema, paginationSchema } from '../../validations/common.validation';

export class UserValidation {
  private readonly userRoleEnum = z.enum(USER_ROLE_VALUES);

  readonly createUser = z.object({
    body: z.object({
      name: z.string().trim().min(1, 'Name is required.').max(100),
      email: z.string().trim().email('A valid email is required.'),
      password: z.string().min(6, 'Password must be at least 6 characters.'),
      role: this.userRoleEnum.optional().default('user'),
      interests: z.array(z.string().trim().min(1)).optional().default([]),
    }),
  });

  readonly updateUser = z.object({
    params: z.object({
      id: objectIdSchema,
    }),
    body: z
      .object({
        name: z.string().trim().min(1, 'Name cannot be empty.').max(100).optional(),
        email: z.string().trim().email('A valid email is required.').optional(),
        password: z.string().min(6, 'Password must be at least 6 characters.').optional(),
        role: this.userRoleEnum.optional(),
        interests: z.array(z.string().trim().min(1)).optional(),
      })
      .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field is required to update.',
      }),
  });

  readonly userParams = z.object({
    params: z.object({
      id: objectIdSchema,
    }),
  });

  readonly userPagination = z.object({
    query: paginationSchema,
  });

  readonly createPost = z.object({
    body: z.object({
      title: z.string().trim().min(1, 'Title is required.').max(200),
      content: z.string().trim().min(1, 'Content is required.'),
    }),
  });
}

export const userValidation = new UserValidation();
