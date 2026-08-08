import bcrypt from 'bcryptjs';
import { env } from '../../config/env';
import { User } from './user.model';
import { Post } from './post.model';
import { ApiError } from '../../utils/apiResponse';
import { buildPaginatedResult, getPaginationParams } from '../../utils/pagination';
import { CreatePostInput, CreateUserInput, UpdateUserInput, UserPublic } from './user.interface';

export class UserService {
  async createUser(data: CreateUserInput): Promise<UserPublic> {
    const { name, email, password, role, interests } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'Email is already registered.');
    }

    const hashedPassword = await bcrypt.hash(password, env.saltRounds);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      interests,
    });

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      interests: user.interests,
    };
  }

  async getAllUsers(query: Record<string, any>) {
    const { page, limit, skip } = getPaginationParams(query);

    const [users, total] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    return buildPaginatedResult(users, total, page, limit);
  }

  async getUserById(userId: string) {
    const user = await User.findById(userId).select('-password');

    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    return user;
  }

  async updateUser(userId: string, data: UpdateUserInput): Promise<UserPublic> {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    const { name, email, role, interests, password } = data;

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (interests) user.interests = interests;
    if (password) user.password = await bcrypt.hash(password, env.saltRounds);

    await user.save();

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      interests: user.interests,
    };
  }

  async deleteUser(userId: string, currentUserId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    if (user._id.toString() === currentUserId) {
      throw new ApiError(400, 'You cannot delete your own account.');
    }

    await user.deleteOne();
  }

  async createPost(userId: string, data: CreatePostInput) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    return Post.create({
      title: data.title,
      content: data.content,
      author: userId,
    });
  }
}

export const userService = new UserService();
