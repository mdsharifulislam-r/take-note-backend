import { Request } from 'express';
import { UserRole } from '../constants/users.rules';

export type { UserRole };
export * from './utility.types';

export type AuthUser = {
  userId: string;
  role: UserRole;
};

export type JwtPayload = AuthUser;

export interface AuthRequest extends Request {
  user?: AuthUser;
}
