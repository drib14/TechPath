import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../types';

export interface IUser extends Document {
  email: string;
  name: string;
  avatar: string;
  googleId: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', userSchema);
