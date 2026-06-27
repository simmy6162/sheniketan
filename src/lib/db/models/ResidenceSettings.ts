import mongoose, { Schema, Document } from 'mongoose';

export interface IResidenceSettings extends Document {
  _id: mongoose.Types.ObjectId;
  residenceName: string;
  contactNumber: string;
  address: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResidenceSettingsSchema = new Schema<IResidenceSettings>(
  {
    residenceName: {
      type: String,
      required: [true, 'Residence name is required'],
      trim: true,
      unique: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
      match: [/^[+]?[\d\s\-()]{7,}$/, 'Please provide a valid contact number'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const ResidenceSettings =
  mongoose.models.ResidenceSettings ||
  mongoose.model<IResidenceSettings>('ResidenceSettings', ResidenceSettingsSchema);
