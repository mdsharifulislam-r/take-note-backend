import { Router } from 'express';
import { authMiddleware, USERS_RULES } from '../../middlewares/auth.middleware';
import { validateMiddleware } from '../../middlewares/validate.middleware';
import { adminController } from './admin.controller';
import { adminValidation } from './admin.validation';

export class AdminRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(authMiddleware.auth(USERS_RULES.ADMIN, USERS_RULES.SUPER_ADMIN));

    this.router.get('/users-by-interests', adminController.getUsersByInterests);
    this.router.get(
      '/users/:userId/posts',
      validateMiddleware.validate(adminValidation.userPosts),
      adminController.getUserPosts
    );
  }
}

const adminRoute = new AdminRoute();
export const AdminRoutes = adminRoute.router;
