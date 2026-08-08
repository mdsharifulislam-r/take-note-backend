import { z } from 'zod';
import { UserRole } from '../../constants/users.rules';
import { loginSchema, signupSchema, updateProfileSchema } from './auth.validation';

export type SignupInput = z.infer<typeof signupSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  interests: string[];
  profileImage?: string;
};

export type Profile = SessionUser & {
  createdAt: Date;
};

export type AuthResponse = {
  token: string;
  user: SessionUser;
};
