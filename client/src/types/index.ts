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

export interface User {
  _id: string;
  email: string;
  name: string;
  avatar: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Domain {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  status: ContentStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Technology {
  _id: string;
  domainId: string | Domain;
  name: string;
  slug: string;
  description: string;
  icon: string;
  status: ContentStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  _id: string;
  technologyId: string | Technology;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  difficulty: Difficulty;
  status: ContentStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContentBlock {
  _id?: string;
  type: ContentBlockType;
  content: string;
  title?: string;
  language?: string;
  level?: number;
  url?: string;
  alt?: string;
  order: number;
}

export interface Lesson {
  _id: string;
  moduleId: string;
  title: string;
  slug: string;
  description: string;
  content: ContentBlock[];
  order: number;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LessonSummary {
  _id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  status: ContentStatus;
}

export interface LessonWithNav {
  lesson: Lesson;
  previous: LessonSummary | null;
  next: LessonSummary | null;
}

export interface Exercise {
  _id: string;
  lessonId: string;
  type: ExerciseType;
  question: string;
  options: { text: string; isCorrect: boolean }[];
  correctAnswer: string;
  explanation: string;
  order: number;
}

export interface Assessment {
  _id: string;
  lessonId: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  passingScore: number;
}

export interface AssessmentQuestion {
  _id?: string;
  question: string;
  type: 'multiple-choice' | 'true-false';
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

export interface Progress {
  _id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  completedAt: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchResults {
  domains: Domain[];
  technologies: Technology[];
  courses: Course[];
  lessons: LessonSummary[];
}

export interface PlatformStats {
  domains: number;
  technologies: number;
  courses: number;
  lessons: number;
}

