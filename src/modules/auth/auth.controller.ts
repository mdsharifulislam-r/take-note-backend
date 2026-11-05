import { Response } from 'express';
import { UPLOAD_DIRS } from '../../config/upload';
import { AuthService } from './auth.service';
import { sendResponse } from '../../utils/apiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { deleteUploadedFile, getPublicUploadUrl } from '../../utils/file';
import { AuthRequest } from '../../types';
import { LoginInput, SignupInput, UpdateProfileInput } from './auth.interface';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  signup = catchAsync(async (req: AuthRequest, res: Response) => {
    const result = await this.authService.signup(req.body as SignupInput);
    sendResponse({
      res,
      data: result,
      message: 'Account created successfully.',
      statusCode: 201,
    });
  });

  login = catchAsync(async (req: AuthRequest, res: Response) => {
    const result = await this.authService.login(req.body as LoginInput);
    sendResponse({ res, data: result, message: 'Login successful.' });
  });

  getProfile = catchAsync(async (req: AuthRequest, res: Response) => {
    const profile = await this.authService.getProfile(req.user!.userId);
    sendResponse({ res, data: profile });
  });

  updateProfile = catchAsync(async (req: AuthRequest, res: Response) => {
    const profileImage = req.file
      ? getPublicUploadUrl(UPLOAD_DIRS.profiles, req.file.filename)
      : undefined;

    const { profile, previousProfileImage } = await this.authService.updateProfile(
      req.user!.userId,
      req.body as UpdateProfileInput,
      profileImage
    );

    if (previousProfileImage) {
      deleteUploadedFile(previousProfileImage);
    }

    sendResponse({ res, data: profile, message: 'Profile updated successfully.' });
  });
}

export const authController = new AuthController(new AuthService());
