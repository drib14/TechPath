import { Request } from 'express';

export type UserRole = 'USER' | 'ADMIN';

export type ContentStatus = 'draft' | 'published';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type ContentBlockType =
  | 'heading'
  | 'text'
  | 'code'
  | 'image'
  | 'video'
  | 'tip'
  | 'warning'
  | 'note'
  | 'example'
  | 'exercise'
  | 'assessment';

export type ExerciseType =
  | 'multiple-choice'
  | 'true-false'
  | 'text-answer'
  | 'code'
  | 'configuration'
  | 'scenario';

export type AssessmentQuestionType = 'multiple-choice' | 'true-false';

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
  };
}
