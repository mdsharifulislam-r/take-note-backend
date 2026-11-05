import { z } from 'zod';
import { UserRole } from '../../constants/users.rules';
import { userValidation } from './user.validation';

export type CreateUserInput = z.infer<typeof userValidation.createUser>['body'];
export type UpdateUserInput = z.infer<typeof userValidation.updateUser>['body'];
export type CreatePostInput = z.infer<typeof userValidation.createPost>['body'];

export type UserPublic = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  interests: string[];
};
