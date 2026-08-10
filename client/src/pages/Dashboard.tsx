import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  ArrowRight,
  CheckCircle,
  Clock,
  GraduationCap,
  TrendingUp,
  PlayCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { progressService } from '../services/progress.service';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ErrorState } from '../components/ui/ErrorState';
import { Badge } from '../components/ui/Badge';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const {
    data: dashboard,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => progressService.getDashboard(),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState
          title="Failed to load dashboard"
          message="We couldn't load your learning data. Please try again."
        />
      </div>
    );
  }

  const stats = dashboard?.stats;
  const continueLearning = dashboard?.continueLearning;
  const enrolledCourses = dashboard?.enrolledCourses || [];
  const recentlyCompleted = dashboard?.recentlyCompleted || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 👋
        </h1>
        <p className="text-surface-500">
          Continue your learning journey where you left off.
        </p>
      </div>

      {/* Continue Learning */}
      {continueLearning && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg shadow-primary-600/20">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <PlayCircle className="w-5 h-5 text-primary-200" />
                  <span className="text-sm font-medium text-primary-200">Continue Learning</span>
                </div>
                <h2 className="text-xl font-bold mb-1 truncate">{continueLearning.course.title}</h2>
                <p className="text-sm text-primary-200 mb-3">
                  {continueLearning.module.title} · {continueLearning.lesson.title}
                </p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 max-w-xs bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${continueLearning.courseProgress}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-primary-100">
                    {continueLearning.courseProgress}%
                  </span>
                </div>
                <Link to={`/learn/${continueLearning.lesson.slug}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="!border-white/40 !text-white hover:!bg-white/10"
                  >
                    Resume Lesson <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900">
                  {stats?.totalCompletedLessons ?? 0}
                </p>
                <p className="text-sm text-surface-500">Lessons Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center text-accent-600 flex-shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900">
                  {stats?.coursesInProgress ?? 0}
                </p>
                <p className="text-sm text-surface-500">Courses In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900">
                  {stats?.coursesCompleted ?? 0}
                </p>
                <p className="text-sm text-surface-500">Courses Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enrolled Courses */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-surface-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-600" />
            Your Courses
          </h2>
          {enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-xl border border-surface-200 p-8 text-center">
              <p className="text-surface-500 mb-4">
                You haven't started any courses yet. Browse our catalog to begin learning!
              </p>
              <Link to="/courses">
                <Button variant="primary">
                  Browse Courses <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {enrolledCourses.map((item) => (
                <Link
                  key={item.course._id}
                  to={`/courses/${item.course.slug}`}
                  className="block bg-white rounded-xl border border-surface-200 p-4 hover:border-primary-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-surface-900 truncate">{item.course.title}</h3>
                      <p className="text-xs text-surface-400 mt-0.5">
                        {item.completedLessons}/{item.totalLessons} lessons
                        {item.course.technologyId && typeof item.course.technologyId === 'object'
                          ? ` · ${(item.course.technologyId as { name: string }).name}`
                          : ''}
                      </p>
                    </div>
                    <Badge
                      variant={item.percentage === 100 ? 'success' : 'info'}
                    >
                      {item.percentage}%
                    </Badge>
                  </div>
                  <ProgressBar value={item.percentage} max={100} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recently Completed */}
        <div>
          <h2 className="text-xl font-semibold text-surface-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent-600" />
            Recently Completed
          </h2>
          {recentlyCompleted.length === 0 ? (
            <div className="bg-white rounded-xl border border-surface-200 p-6 text-center">
              <p className="text-sm text-surface-500">
                No lessons completed yet. Start a course to begin tracking your progress!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentlyCompleted.slice(0, 8).map((item, idx) => {
                const lesson = item.lesson as any;
                return (
                  <Link
                    key={idx}
                    to={`/learn/${lesson?.slug || ''}`}
                    className="block bg-white rounded-lg border border-surface-200 px-4 py-3 hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-surface-800 truncate">
                          {lesson?.title || 'Lesson'}
                        </p>
                        <p className="text-xs text-surface-400">
                          {item.completedAt
                            ? new Date(item.completedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })
                            : ''}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

