import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { MIME_TYPES, uploadMiddleware } from '../../middlewares/upload.middleware';
import { validateMiddleware } from '../../middlewares/validate.middleware';
import { authController } from './auth.controller';
import { loginSchema, signupSchema, updateProfileSchema } from './auth.validation';
import { UPLOAD_DIRS } from '../../config/upload';

export class AuthRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/signup', validateMiddleware.validate(signupSchema), authController.signup);
    this.router.post('/login', validateMiddleware.validate(loginSchema), authController.login);
    this.router.get('/profile', authMiddleware.auth(), authController.getProfile);
    this.router.put(
      '/profile',
      authMiddleware.auth(),
      uploadMiddleware.upload({
        folder: UPLOAD_DIRS.profiles,
        fieldName: 'profileImage',
        allowedMimeTypes: MIME_TYPES.IMAGE,
      }),
      validateMiddleware.validate(updateProfileSchema),
      authController.updateProfile
    );
  }
}

const authRoute = new AuthRoute();
export const AuthRoutes = authRoute.router;
