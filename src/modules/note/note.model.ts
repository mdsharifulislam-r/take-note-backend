import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  image?: string;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
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
    image: {
      type: String,
      default: null,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
  },
  { timestamps: true }
);

noteSchema.index({ author: 1, createdAt: -1 });
noteSchema.index({ createdAt: -1 });

export const Note = mongoose.model<INote>('Note', noteSchema);
