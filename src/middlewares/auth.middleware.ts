import { NextFunction, Response } from 'express';
import { USERS_RULES, UserRole } from '../constants/users.rules';
import { verifyToken } from '../utils/jwt';
import { ApiError } from '../utils/apiResponse';
import { AuthRequest } from '../types';

export class AuthMiddleware {
  auth = (...roles: UserRole[]) => {
    return (req: AuthRequest, _res: Response, next: NextFunction): void => {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith('Bearer ')) {
        return next(new ApiError(401, 'Access denied. No token provided.'));
      }

      const token = authHeader.split(' ')[1];

      try {
        const decoded = verifyToken(token);
        req.user = { userId: decoded.userId, role: decoded.role };

        if (roles.length > 0 && !roles.includes(req.user.role)) {
          return next(new ApiError(403, 'You do not have permission to perform this action.'));
        }

        next();
      } catch {
        next(new ApiError(401, 'Invalid or expired token.'));
      }
    };
  };
}

export const authMiddleware = new AuthMiddleware();
export { USERS_RULES };
