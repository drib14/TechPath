import mongoose, { Schema, Document, Types } from 'mongoose';
import { ContentStatus, Difficulty } from '../types';

export interface ICourse extends Document {
  technologyId: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  difficulty: Difficulty;
  status: ContentStatus;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    technologyId: {
      type: Schema.Types.ObjectId,
      ref: 'Technology',
      required: true,
      index: true,
    },
    title: {
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
    thumbnail: {
      type: String,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
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

courseSchema.index({ title: 'text', description: 'text' });

export const Course = mongoose.model<ICourse>('Course', courseSchema);
