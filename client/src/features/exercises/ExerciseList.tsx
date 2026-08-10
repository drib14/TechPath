import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dumbbell } from 'lucide-react';
import { exerciseService } from '../../services/exercise.service';
import { ExerciseCard } from './ExerciseCard';

interface ExerciseListProps {
  lessonId: string;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({ lessonId }) => {
  const { data: exercises, isLoading } = useQuery({
    queryKey: ['exercises', lessonId],
    queryFn: () => exerciseService.getByLesson(lessonId),
    enabled: !!lessonId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse border border-surface-200 rounded-xl p-5">
            <div className="h-4 bg-surface-200 rounded w-1/4 mb-4" />
            <div className="h-4 bg-surface-200 rounded w-3/4 mb-3" />
            <div className="space-y-2">
              <div className="h-10 bg-surface-100 rounded" />
              <div className="h-10 bg-surface-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!exercises || exercises.length === 0) {
    return null; // No exercises for this lesson — don't render anything
  }

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
          <Dumbbell className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-surface-900">Practice Exercises</h2>
          <p className="text-sm text-surface-500">
            Test your understanding with {exercises.length}{' '}
            {exercises.length === 1 ? 'exercise' : 'exercises'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <ExerciseCard key={exercise._id} exercise={exercise} index={index} />
        ))}
      </div>
    </div>
  );
};
