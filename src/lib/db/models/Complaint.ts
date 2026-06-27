import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export type ComplaintCategory = 'Water' | 'Electricity' | 'WiFi' | 'Maintenance' | 'Other';
export type ComplaintStatus = 'Pending' | 'In Progress' | 'Done';

export interface IComplaint extends Document {
  _id: mongoose.Types.ObjectId;
  residentId: mongoose.Types.ObjectId | IUser;
  title: string;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  adminReply?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    residentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Resident ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    category: {
      type: String,
      enum: ['Water', 'Electricity', 'WiFi', 'Maintenance', 'Other'],
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Done'],
      default: 'Pending',
    },
    adminReply: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  { timestamps: true }
);

ComplaintSchema.index({ residentId: 1 });
ComplaintSchema.index({ status: 1 });
ComplaintSchema.index({ createdAt: -1 });

export const Complaint =
  mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);
