import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpen } from 'lucide-react';
import { domainService } from '../services/domain.service';
import { Card, CardContent } from '../components/ui/Card';
import { SkeletonGrid } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';

export const Domains: React.FC = () => {
  const { data: domains, isLoading, error, refetch } = useQuery({
    queryKey: ['domains'],
    queryFn: domainService.getAll,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Technology Domains</h1>
        <p className="text-surface-500">
          Browse all available technology domains and find your learning path.
        </p>
      </div>

      {isLoading ? (
        <SkeletonGrid count={9} cols={3} />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : domains && domains.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => (
            <Link key={domain._id} to={`/domains/${domain.slug}`}>
              <Card hoverable className="h-full">
                <CardContent>
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 mb-4">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-semibold text-surface-900 mb-2">{domain.name}</h2>
                  <p className="text-sm text-surface-500 line-clamp-3 mb-4">{domain.description}</p>
                  <span className="text-sm font-medium text-primary-600 flex items-center gap-1">
                    Explore <ArrowRight className="w-4 h-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No domains yet"
          message="Technology domains will appear here once they are published."
        />
      )}
    </div>
  );
};
