import mongoose from 'mongoose';
import { USERS_RULES } from '../../constants/users.rules';
import { User } from '../user/user.model';
import { ApiError } from '../../utils/apiResponse';

export class AdminService {
  async getUsersByInterests() {
    return User.aggregate([
      { $match: { role: USERS_RULES.USER } },
      { $unwind: '$interests' },
      {
        $group: {
          _id: '$interests',
          count: { $sum: 1 },
          users: {
            $push: {
              _id: '$_id',
              name: '$name',
              email: '$email',
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async getUserPosts(userId: string) {
    const results = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'author',
          as: 'posts',
        },
      },
      {
        $project: {
          password: 0,
          __v: 0,
        },
      },
    ]);

    if (results.length === 0) {
      throw new ApiError(404, 'User not found.');
    }

    return results[0];
  }
}

export const adminService = new AdminService();
