import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { technologyService } from '../services/technology.service';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SafeImage } from '../components/ui/SafeImage';
import { SkeletonGrid, SkeletonLessonContent } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { DynamicIcon } from '../components/ui/DynamicIcon';
import type { Domain } from '../types';

const difficultyColors = {
  beginner: 'success' as const,
  intermediate: 'warning' as const,
  advanced: 'danger' as const,
};

export const TechnologyDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: tech, isLoading: techLoading, error } = useQuery({
    queryKey: ['technology', slug],
    queryFn: () => technologyService.getBySlug(slug!),
    enabled: !!slug,
  });

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', tech?._id],
    queryFn: () => technologyService.getCourses(tech!._id),
    enabled: !!tech?._id,
  });

  if (techLoading) return <div className="max-w-7xl mx-auto px-4 py-12"><SkeletonLessonContent /></div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-12"><ErrorState /></div>;
  if (!tech) return <div className="max-w-7xl mx-auto px-4 py-12"><ErrorState title="Technology not found" /></div>;

  const parentDomain = tech.domainId as Domain;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-surface-500 mb-6 flex-wrap">
        <Link to="/domains" className="hover:text-primary-600 transition-colors">Domains</Link>
        <ChevronRight className="w-4 h-4" />
        {parentDomain && (
          <>
            <Link to={`/domains/${parentDomain.slug}`} className="hover:text-primary-600 transition-colors">
              {parentDomain.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
          </>
        )}
        <span className="text-surface-900 font-medium">{tech.name}</span>
      </nav>

      <div className="mb-10 flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 flex-shrink-0 shadow-sm mt-1">
          <DynamicIcon name={tech.icon} className="w-7 h-7" fallback="Cpu" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-surface-900 mb-2">{tech.name}</h1>
          <p className="text-lg text-surface-500">{tech.description}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-surface-900 mb-6">Available Courses</h2>

      {coursesLoading ? (
        <SkeletonGrid count={6} cols={3} />
      ) : courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link key={course._id} to={`/courses/${course.slug}`}>
              <Card hoverable className="h-full flex flex-col">
                <SafeImage
                  src={course.thumbnail}
                  alt={course.title}
                  categoryTitle={tech.name}
                  aspectRatio="video"
                  className="w-full h-44"
                />
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={difficultyColors[course.difficulty]}>
                      {course.difficulty}
                    </Badge>
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
        <EmptyState
          title="No courses yet"
          message="Courses for this technology will be added soon."
        />
      )}
    </div>
  );
};
