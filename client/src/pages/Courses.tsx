import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { courseService } from '../services/course.service';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SafeImage } from '../components/ui/SafeImage';
import { SkeletonGrid } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';

const difficultyColors = {
  beginner: 'success' as const,
  intermediate: 'warning' as const,
  advanced: 'danger' as const,
};

export const Courses: React.FC = () => {
  const { data: courses, isLoading, error, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: courseService.getAll,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">All Courses</h1>
        <p className="text-surface-500">
          Explore all available courses across every technology domain.
        </p>
      </div>

      {isLoading ? (
        <SkeletonGrid count={9} cols={3} />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link key={course._id} to={`/courses/${course.slug}`}>
              <Card hoverable className="h-full flex flex-col">
                <SafeImage
                  src={course.thumbnail}
                  alt={course.title}
                  aspectRatio="video"
                  className="w-full h-44"
                />
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={difficultyColors[course.difficulty]}>{course.difficulty}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-surface-900 mb-1">{course.title}</h3>
                  <p className="text-sm text-surface-500 line-clamp-2 mb-3">{course.description}</p>
                  <span className="text-sm font-medium text-primary-600 flex items-center gap-1">
                    Start Course <ArrowRight className="w-4 h-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="No courses available" message="Courses will appear here as they are published." />
      )}
    </div>
  );
};
