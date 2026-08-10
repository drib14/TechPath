import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProgress extends Document {
  userId: Types.ObjectId;
  lessonId: Types.ObjectId;
  completed: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const progressSchema = new Schema<IProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
      index: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export const Progress = mongoose.model<IProgress>('Progress', progressSchema);
