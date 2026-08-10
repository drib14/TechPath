import mongoose, { Schema, Document, Types } from 'mongoose';
import { ExerciseType } from '../types';

export interface IExerciseOption {
  text: string;
  isCorrect: boolean;
}

export interface IExercise extends Document {
  lessonId: Types.ObjectId;
  type: ExerciseType;
  question: string;
  options: IExerciseOption[];
  correctAnswer: string;
  explanation: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const exerciseOptionSchema = new Schema<IExerciseOption>(
  {
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true, default: false },
  },
  { _id: false }
);

const exerciseSchema = new Schema<IExercise>(
  {
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'multiple-choice',
        'true-false',
        'text-answer',
        'code',
        'configuration',
        'scenario',
      ],
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [exerciseOptionSchema],
      default: [],
    },
    correctAnswer: {
      type: String,
      default: '',
    },
    explanation: {
      type: String,
      default: '',
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

export const Exercise = mongoose.model<IExercise>('Exercise', exerciseSchema);
