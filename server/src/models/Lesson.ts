import mongoose, { Schema, Document, Types } from 'mongoose';
import { ContentBlockType, ContentStatus } from '../types';

export interface IContentBlock {
  type: ContentBlockType;
  content: string;
  title?: string;
  language?: string;
  level?: number;
  url?: string;
  alt?: string;
  order: number;
}

export interface ILesson extends Document {
  moduleId: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  content: IContentBlock[];
  order: number;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const contentBlockSchema = new Schema<IContentBlock>(
  {
    type: {
      type: String,
      enum: [
        'heading',
        'text',
        'code',
        'image',
        'video',
        'tip',
        'warning',
        'note',
        'example',
        'exercise',
        'assessment',
      ],
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    title: {
      type: String,
    },
    language: {
      type: String,
    },
    level: {
      type: Number,
      min: 1,
      max: 6,
    },
    url: {
      type: String,
    },
    alt: {
      type: String,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: true }
);

const lessonSchema = new Schema<ILesson>(
  {
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
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
      default: '',
    },
    content: {
      type: [contentBlockSchema],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

lessonSchema.index({ title: 'text', description: 'text' });

export const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);
