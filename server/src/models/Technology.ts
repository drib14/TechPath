import mongoose, { Schema, Document, Types } from 'mongoose';
import { ContentStatus } from '../types';

export interface ITechnology extends Document {
  domainId: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  icon: string;
  status: ContentStatus;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const technologySchema = new Schema<ITechnology>(
  {
    domainId: {
      type: Schema.Types.ObjectId,
      ref: 'Domain',
      required: true,
      index: true,
    },
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

technologySchema.index({ name: 'text', description: 'text' });

export const Technology = mongoose.model<ITechnology>('Technology', technologySchema);
