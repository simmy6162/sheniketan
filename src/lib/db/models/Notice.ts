import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export type NoticeCategory = 'Maintenance' | 'Emergency' | 'Event';

export interface INotice extends Document {
  _id: mongoose.Types.ObjectId;
  category: NoticeCategory;
  title: string;
  content: string;
  postedBy: mongoose.Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema = new Schema<INotice>(
  {
    category: {
      type: String,
      enum: ['Maintenance', 'Emergency', 'Event'],
      required: [true, 'Category is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Posted by (user ID) is required'],
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  { timestamps: true }
);

NoticeSchema.index({ category: 1 });
NoticeSchema.index({ postedBy: 1 });
NoticeSchema.index({ createdAt: -1 });

export const Notice = mongoose.models.Notice || mongoose.model<INotice>('Notice', NoticeSchema);
