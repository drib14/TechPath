import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpen, ChevronRight } from 'lucide-react';
import { domainService } from '../services/domain.service';
import { Card, CardContent } from '../components/ui/Card';
import { SkeletonGrid, SkeletonLessonContent } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { DynamicIcon } from '../components/ui/DynamicIcon';

export const DomainDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: domain, isLoading: domainLoading, error } = useQuery({
    queryKey: ['domain', slug],
    queryFn: () => domainService.getBySlug(slug!),
    enabled: !!slug,
  });

  const { data: technologies, isLoading: techLoading } = useQuery({
    queryKey: ['technologies', domain?._id],
    queryFn: () => domainService.getTechnologies(domain!._id),
    enabled: !!domain?._id,
  });

  if (domainLoading) return <div className="max-w-7xl mx-auto px-4 py-12"><SkeletonLessonContent /></div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-12"><ErrorState /></div>;
  if (!domain) return <div className="max-w-7xl mx-auto px-4 py-12"><ErrorState title="Domain not found" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-surface-500 mb-6">
        <Link to="/domains" className="hover:text-primary-600 transition-colors">Domains</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-surface-900 font-medium">{domain.name}</span>
      </nav>

      <div className="mb-10 flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0 shadow-sm mt-1">
          <DynamicIcon name={domain.icon} className="w-7 h-7" fallback="Layers" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-surface-900 mb-2">{domain.name}</h1>
          <p className="text-lg text-surface-500">{domain.description}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-surface-900 mb-6">Technologies & Subjects</h2>

      {techLoading ? (
        <SkeletonGrid count={6} cols={3} />
      ) : technologies && technologies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech) => (
            <Link key={tech._id} to={`/technologies/${tech.slug}`}>
              <Card hoverable className="h-full">
                <CardContent>
                  <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 mb-3 shadow-sm">
                    <DynamicIcon name={tech.icon} className="w-6 h-6" fallback="Cpu" />
                  </div>
                  <h3 className="text-lg font-semibold text-surface-900 mb-1">{tech.name}</h3>
                  <p className="text-sm text-surface-500 line-clamp-2 mb-3">{tech.description}</p>
                  <span className="text-sm font-medium text-primary-600 flex items-center gap-1">
                    View Courses <ArrowRight className="w-4 h-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No technologies yet"
          message="Technologies for this domain will be added soon."
        />
      )}
    </div>
  );
};
