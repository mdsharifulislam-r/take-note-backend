import bcrypt from 'bcryptjs';
import { USERS_RULES } from '../../constants/users.rules';
import { env } from '../../config/env';
import { User } from '../user/user.model';
import { signToken } from '../../utils/jwt';
import { ApiError } from '../../utils/apiResponse';
import {
  AuthResponse,
  LoginInput,
  Profile,
  SignupInput,
  UpdateProfileInput,
} from './auth.interface';

export class AuthService {
  private formatUserSession(user: InstanceType<typeof User>): AuthResponse['user'] {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      interests: user.interests,
      profileImage: user.profileImage ?? undefined,
    };
  }

  private formatProfile(user: InstanceType<typeof User>): Profile {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      interests: user.interests,
      profileImage: user.profileImage ?? undefined,
      createdAt: user.createdAt,
    };
  }

  async signup(data: SignupInput): Promise<AuthResponse> {
    const { name, email, password, interests } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'Email is already registered.');
    }

    const hashedPassword = await bcrypt.hash(password, env.saltRounds);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      interests,
      role: USERS_RULES.USER,
    });

    const token = signToken({ userId: user._id.toString(), role: user.role });

    return { token, user: this.formatUserSession(user) };
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const { email, password } = data;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const token = signToken({ userId: user._id.toString(), role: user.role });

    return { token, user: this.formatUserSession(user) };
  }

  async getProfile(userId: string): Promise<Profile> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    return this.formatProfile(user);
  }

  async updateProfile(
    userId: string,
    data: UpdateProfileInput,
    profileImage?: string
  ): Promise<{ profile: Profile; previousProfileImage?: string }> {
    if (!profileImage && Object.keys(data).length === 0) {
      throw new ApiError(400, 'At least one field or profile image is required.');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.interests) user.interests = data.interests;
    if (data.password) user.password = await bcrypt.hash(data.password, env.saltRounds);

    let previousProfileImage: string | undefined;

    if (profileImage) {
      previousProfileImage = user.profileImage;
      user.profileImage = profileImage;
    }

    await user.save();

    return { profile: this.formatProfile(user), previousProfileImage };
  }
}

export const authService = new AuthService();
