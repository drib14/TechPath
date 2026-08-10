import mongoose, { Schema, Document } from 'mongoose';
import { ContentStatus } from '../types';

export interface IDomain extends Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
  status: ContentStatus;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const domainSchema = new Schema<IDomain>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

domainSchema.index({ name: 'text', description: 'text' });

export const Domain = mongoose.model<IDomain>('Domain', domainSchema);
