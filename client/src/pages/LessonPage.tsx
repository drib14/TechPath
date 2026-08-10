import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import { lessonService } from '../services/lesson.service';
import { progressService } from '../services/progress.service';
import { LessonRenderer } from '../features/lessons/renderer/LessonRenderer';
import { ExerciseList } from '../features/exercises/ExerciseList';
import { AssessmentPanel } from '../features/assessments/AssessmentPanel';
import { Button } from '../components/ui/Button';
import { SkeletonLessonContent } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { useAuth } from '../features/auth/AuthContext';

export const LessonPage: React.FC = () => {
  const { lessonSlug } = useParams<{ lessonSlug: string }>();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['lesson', lessonSlug],
    queryFn: () => lessonService.getBySlug(lessonSlug!),
    enabled: !!lessonSlug,
  });

  const lessonId = data?.lesson?._id;

  // Check if lesson is already completed (only for authenticated users)
  const { data: completionStatus } = useQuery({
    queryKey: ['lessonStatus', lessonId],
    queryFn: () => progressService.checkLessonStatus(lessonId!),
    enabled: !!lessonId && isAuthenticated,
  });

  const completeMutation = useMutation({
    mutationFn: () => progressService.completeLesson(lessonId!),
    onSuccess: () => {
      queryClient.setQueryData(['lessonStatus', lessonId], true);
      // Invalidate dashboard data so it refreshes when user navigates there
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const isCompleted = completionStatus === true;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SkeletonLessonContent />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState title="Lesson not found" message="This lesson doesn't exist or hasn't been published yet." />
      </div>
    );
  }

  const { lesson, previous, next } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Lesson Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 mb-3">{lesson.title}</h1>
        {lesson.description && (
          <p className="text-lg text-surface-500">{lesson.description}</p>
        )}
        {isCompleted && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-sm text-emerald-700 font-medium">
            <CheckCircle className="w-4 h-4" />
            Completed
          </div>
        )}
      </header>

      {/* Lesson Content */}
      <article className="mb-12">
        <LessonRenderer content={lesson.content} />
      </article>

      {/* Exercises */}
      {lessonId && <ExerciseList lessonId={lessonId} />}

      {/* Assessment */}
      {lessonId && <AssessmentPanel lessonId={lessonId} />}

      {/* Complete Lesson */}
      {isAuthenticated && !isCompleted && (
        <div className="mt-10 p-6 bg-accent-50 border border-accent-200 rounded-xl text-center">
          <CheckCircle className="w-8 h-8 text-accent-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-surface-900 mb-1">Finished this lesson?</h3>
          <p className="text-sm text-surface-500 mb-4">
            Mark it as complete to track your progress.
          </p>
          <Button
            variant="secondary"
            disabled={completeMutation.isPending}
            onClick={() => completeMutation.mutate()}
          >
            {completeMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Mark as Complete'
            )}
          </Button>
          {completeMutation.isError && (
            <p className="text-sm text-red-600 mt-2">Failed to mark as complete. Please try again.</p>
          )}
        </div>
      )}

      {isAuthenticated && isCompleted && (
        <div className="mt-10 p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
          <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-surface-900 mb-1">Lesson Completed!</h3>
          <p className="text-sm text-surface-500">
            Great work! Continue to the next lesson or review your dashboard.
          </p>
        </div>
      )}

      {!isAuthenticated && (
        <div className="mt-10 p-6 bg-primary-50 border border-primary-200 rounded-xl text-center">
          <h3 className="text-lg font-semibold text-surface-900 mb-1">Want to track your progress?</h3>
          <p className="text-sm text-surface-500 mb-4">
            Sign in with Google to save your learning progress and pick up where you left off.
          </p>
          <Link to="/login">
            <Button variant="primary">Sign In</Button>
          </Link>
        </div>
      )}

      {/* Previous / Next Navigation */}
      <nav className="flex items-center justify-between gap-4 pt-8 mt-8 border-t border-surface-200">
        {previous ? (
          <Link
            to={`/learn/${previous.slug}`}
            className="flex items-center gap-2 text-sm font-medium text-surface-600 hover:text-primary-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <div className="text-left">
              <span className="text-xs text-surface-400 block">Previous</span>
              {previous.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            to={`/learn/${next.slug}`}
            className="flex items-center gap-2 text-sm font-medium text-surface-600 hover:text-primary-600 transition-colors text-right"
          >
            <div>
              <span className="text-xs text-surface-400 block">Next</span>
              {next.title}
            </div>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
};

