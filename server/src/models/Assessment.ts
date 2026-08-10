import mongoose, { Schema, Document, Types } from 'mongoose';
import { AssessmentQuestionType } from '../types';

export interface IAssessmentOption {
  text: string;
  isCorrect: boolean;
}

export interface IAssessmentQuestion {
  question: string;
  type: AssessmentQuestionType;
  options: IAssessmentOption[];
  explanation: string;
}

export interface IAssessment extends Document {
  lessonId: Types.ObjectId;
  title: string;
  description: string;
  questions: IAssessmentQuestion[];
  passingScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const assessmentOptionSchema = new Schema<IAssessmentOption>(
  {
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true, default: false },
  },
  { _id: false }
);

const assessmentQuestionSchema = new Schema<IAssessmentQuestion>(
  {
    question: { type: String, required: true },
    type: {
      type: String,
      enum: ['multiple-choice', 'true-false'],
      required: true,
    },
    options: {
      type: [assessmentOptionSchema],
      required: true,
    },
    explanation: {
      type: String,
      default: '',
    },
  },
  { _id: true }
);

const assessmentSchema = new Schema<IAssessment>(
  {
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    questions: {
      type: [assessmentQuestionSchema],
      default: [],
    },
    passingScore: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

export const Assessment = mongoose.model<IAssessment>('Assessment', assessmentSchema);
