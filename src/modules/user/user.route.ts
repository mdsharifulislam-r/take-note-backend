import { Router } from 'express';
import { authMiddleware, USERS_RULES } from '../../middlewares/auth.middleware';
import { validateMiddleware } from '../../middlewares/validate.middleware';
import { userController } from './user.controller';
import { userValidation } from './user.validation';

export class UserRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/posts',
      authMiddleware.auth(),
      validateMiddleware.validate(userValidation.createPost),
      userController.createPost
    );

    this.router.use(authMiddleware.auth(USERS_RULES.ADMIN, USERS_RULES.SUPER_ADMIN));

    this.router.post('/', validateMiddleware.validate(userValidation.createUser), userController.createUser);
    this.router.get('/', validateMiddleware.validate(userValidation.userPagination), userController.getAllUsers);
    this.router.get('/:id', validateMiddleware.validate(userValidation.userParams), userController.getUserById);
    this.router.put('/:id', validateMiddleware.validate(userValidation.updateUser), userController.updateUser);
    this.router.delete('/:id', validateMiddleware.validate(userValidation.userParams), userController.deleteUser);
  }
}

const userRoute = new UserRoute();
export const UserRoutes = userRoute.router;
