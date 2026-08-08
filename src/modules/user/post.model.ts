import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
  },
  { timestamps: true }
);

postSchema.index({ author: 1 });

export const Post = mongoose.model<IPost>('Post', postSchema);
