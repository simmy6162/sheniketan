import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export type LeaveType = 'Temporary' | 'Weekend' | 'Permanent';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface ILeaveRequest extends Document {
  _id: mongoose.Types.ObjectId;
  residentId: mongoose.Types.ObjectId | IUser;
  leaveType: LeaveType;
  fromDate: Date;
  toDate: Date;
  reason: string;
  status: LeaveStatus;
  createdAt: Date;
  updatedAt: Date;
}

const LeaveRequestSchema = new Schema<ILeaveRequest>(
  {
    residentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Resident ID is required'],
    },
    leaveType: {
      type: String,
      enum: ['Temporary', 'Weekend', 'Permanent'],
      required: [true, 'Leave type is required'],
    },
    fromDate: {
      type: Date,
      required: [true, 'From date is required'],
    },
    toDate: {
      type: Date,
      required: [true, 'To date is required'],
      validate: {
        validator: function (value: Date) {
          return value > (this as ILeaveRequest).fromDate;
        },
        message: 'To date must be after from date',
      },
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
      minlength: [10, 'Reason must be at least 10 characters'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  { timestamps: true }
);

LeaveRequestSchema.index({ residentId: 1 });
LeaveRequestSchema.index({ status: 1 });
LeaveRequestSchema.index({ fromDate: 1, toDate: 1 });

export const LeaveRequest =
  mongoose.models.LeaveRequest ||
  mongoose.model<ILeaveRequest>('LeaveRequest', LeaveRequestSchema);
