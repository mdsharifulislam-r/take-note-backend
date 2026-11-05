import mongoose, { Document, Schema } from 'mongoose';
import { USER_ROLE_VALUES, USERS_RULES, UserRole } from '../../constants/users.rules';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  interests: string[];
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: USER_ROLE_VALUES,
      default: USERS_RULES.USER,
    },
    interests: {
      type: [String],
      default: [],
    },
    profileImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ interests: 1 });
userSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser>('User', userSchema);
