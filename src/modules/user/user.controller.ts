import { Response } from 'express';
import { UserService } from './user.service';
import { sendResponse } from '../../utils/apiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { AuthRequest } from '../../types';
import { CreatePostInput, CreateUserInput, UpdateUserInput } from './user.interface';

export class UserController {
  constructor(private readonly userService: UserService) {}

  createUser = catchAsync(async (req: AuthRequest, res: Response) => {
    const user = await this.userService.createUser(req.body as CreateUserInput);
    sendResponse({
      res,
      data: user,
      message: 'User created successfully.',
      statusCode: 201,
    });
  });

  getAllUsers = catchAsync(async (req: AuthRequest, res: Response) => {
    const result = await this.userService.getAllUsers(req.query);
    sendResponse({ res, data: result.data, pagination: result.pagination });
  });

  getUserById = catchAsync(async (req: AuthRequest, res: Response) => {
    const user = await this.userService.getUserById(req.params.id);
    sendResponse({ res, data: user });
  });

  updateUser = catchAsync(async (req: AuthRequest, res: Response) => {
    const user = await this.userService.updateUser(
      req.params.id,
      req.body as UpdateUserInput
    );
    sendResponse({ res, data: user, message: 'User updated successfully.' });
  });

  deleteUser = catchAsync(async (req: AuthRequest, res: Response) => {
    await this.userService.deleteUser(req.params.id, req.user!.userId);
    sendResponse({ res, data: null, message: 'User deleted successfully.' });
  });

  createPost = catchAsync(async (req: AuthRequest, res: Response) => {
    const post = await this.userService.createPost(
      req.user!.userId,
      req.body as CreatePostInput
    );
    sendResponse({
      res,
      data: post,
      message: 'Post created successfully.',
      statusCode: 201,
    });
  });
}

export const userController = new UserController(new UserService());
