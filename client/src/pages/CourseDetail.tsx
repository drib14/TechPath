import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, BookOpen, Clock, BarChart3 } from 'lucide-react';
import { courseService } from '../services/course.service';
import { lessonService } from '../services/lesson.service';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SkeletonLessonContent, SkeletonList } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import type { Technology } from '../types';

const difficultyColors = {
  beginner: 'success' as const,
  intermediate: 'warning' as const,
  advanced: 'danger' as const,
};

export const CourseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: course, isLoading: courseLoading, error } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => courseService.getBySlug(slug!),
    enabled: !!slug,
  });

  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ['modules', course?._id],
    queryFn: () => courseService.getModules(course!._id),
    enabled: !!course?._id,
  });

  if (courseLoading) return <div className="max-w-7xl mx-auto px-4 py-12"><SkeletonLessonContent /></div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-12"><ErrorState /></div>;
  if (!course) return <div className="max-w-7xl mx-auto px-4 py-12"><ErrorState title="Course not found" /></div>;

  const parentTech = course.technologyId as Technology;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-surface-500 mb-6 flex-wrap">
        <Link to="/courses" className="hover:text-primary-600 transition-colors">Courses</Link>
        <ChevronRight className="w-4 h-4" />
        {parentTech && (
          <>
            <Link to={`/technologies/${parentTech.slug}`} className="hover:text-primary-600 transition-colors">
              {parentTech.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
          </>
        )}
        <span className="text-surface-900 font-medium">{course.title}</span>
      </nav>

      {/* Course Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Badge variant={difficultyColors[course.difficulty]} size="md">
            {course.difficulty}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-surface-900 mb-3">{course.title}</h1>
        <p className="text-lg text-surface-500 mb-4">{course.description}</p>
        <div className="flex items-center gap-6 text-sm text-surface-500">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            {modules?.length || 0} modules
          </span>
          <span className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4" />
            {course.difficulty}
          </span>
        </div>
      </div>

      {/* Modules */}
      <h2 className="text-xl font-semibold text-surface-900 mb-6">Course Content</h2>

      {modulesLoading ? (
        <SkeletonList count={4} />
      ) : modules && modules.length > 0 ? (
        <div className="space-y-4">
          {modules.map((mod, idx) => (
            <ModuleCard key={mod._id} module={mod} index={idx + 1} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-surface-500">
          <p>No modules added to this course yet.</p>
        </div>
      )}
    </div>
  );
};

const ModuleCard: React.FC<{ module: any; index: number }> = ({ module, index }) => {
  const { data: lessons } = useQuery({
    queryKey: ['lessons', module._id],
    queryFn: () => lessonService.getByModule(module._id),
  });

  return (
    <Card>
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary-600">{index}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-surface-900 mb-1">{module.title}</h3>
            {module.description && (
              <p className="text-sm text-surface-500 mb-3">{module.description}</p>
            )}
            {lessons && lessons.length > 0 && (
              <div className="space-y-1.5 mt-3">
                {lessons.map((lesson) => (
                  <Link
                    key={lesson._id}
                    to={`/learn/${lesson.slug}`}
                    className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm text-surface-600 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 flex-shrink-0" />
                    {lesson.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
