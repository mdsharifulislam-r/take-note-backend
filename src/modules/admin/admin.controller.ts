import { Response } from 'express';
import { AdminService } from './admin.service';
import { sendResponse } from '../../utils/apiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { AuthRequest } from '../../types';

export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  getUsersByInterests = catchAsync(async (_req: AuthRequest, res: Response) => {
    const results = await this.adminService.getUsersByInterests();
    sendResponse({ res, data: results, message: 'Users grouped by interests.' });
  });

  getUserPosts = catchAsync(async (req: AuthRequest, res: Response) => {
    const result = await this.adminService.getUserPosts(req.params.userId);
    sendResponse({ res, data: result, message: 'User posts retrieved successfully.' });
  });
}

export const adminController = new AdminController(new AdminService());
