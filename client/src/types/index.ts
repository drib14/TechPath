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

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'REORDER'
  | 'PUBLISH'
  | 'UNPUBLISH'
  | 'ROLE_CHANGE'
  | 'LOGIN';

export type AuditResourceType =
  | 'Domain'
  | 'Technology'
  | 'Course'
  | 'Module'
  | 'Lesson'
  | 'Exercise'
  | 'Assessment'
  | 'User'
  | 'System';

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
  moduleId: string | { _id: string; title: string; courseId: string };
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

export interface ExerciseOption {
  text: string;
  isCorrect: boolean;
}

export interface Exercise {
  _id: string;
  lessonId: string;
  type: ExerciseType;
  question: string;
  options: ExerciseOption[];
  correctAnswer: string;
  explanation: string;
  order: number;
}

export interface AssessmentOption {
  text: string;
  isCorrect?: boolean;
}

export interface AssessmentQuestion {
  _id?: string;
  question: string;
  type: 'multiple-choice' | 'true-false';
  options: AssessmentOption[];
  explanation?: string;
}

export interface Assessment {
  _id: string;
  lessonId: string | { _id: string; title: string; slug: string };
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  passingScore: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentSubmissionResult {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  passingScore: number;
  details: {
    questionIndex: number;
    question: string;
    selectedIndex: number;
    correctIndex: number;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface Progress {
  _id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  completedAt: string | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  meta?: PaginationMeta;
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

export interface AdminMetrics {
  domains: { total: number; published: number; draft: number };
  technologies: { total: number; published: number; draft: number };
  courses: { total: number; published: number; draft: number };
  modules: { total: number };
  lessons: { total: number; published: number; draft: number };
  assessments: { total: number };
  exercises: { total: number };
  users: { total: number; admins: number; learners: number };
}

export interface AdminDashboardData {
  metrics: AdminMetrics;
  drafts: {
    lessons: Lesson[];
    courses: Course[];
  };
  recentActivity: AuditLog[];
}

export interface AuditLog {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId?: string;
  details: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}
