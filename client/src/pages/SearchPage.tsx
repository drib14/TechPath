import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, BookOpen, Layers, ArrowRight, FileText } from 'lucide-react';
import { searchService } from '../services/search.service';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SkeletonList } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchService.search(query),
    enabled: query.trim().length >= 2,
  });

  const totalResults =
    (data?.domains?.length || 0) +
    (data?.technologies?.length || 0) +
    (data?.courses?.length || 0) +
    (data?.lessons?.length || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Search Results</h1>
        <p className="text-surface-500">
          {query ? (
            <>
              Showing results for <span className="font-semibold text-surface-900">"{query}"</span>
              {!isLoading && data && ` (${totalResults} found)`}
            </>
          ) : (
            'Enter a search term to find domains, courses, and lessons.'
          )}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <SkeletonList count={4} />
        </div>
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !query || query.trim().length < 2 ? (
        <EmptyState
          icon={<Search className="w-8 h-8 text-surface-400" />}
          title="Search TechPath"
          message="Type at least 2 characters in the search bar above to look up content."
        />
      ) : totalResults === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8 text-surface-400" />}
          title="No results found"
          message={`We couldn't find any content matching "${query}". Try searching for another topic like Python, Web Development, or Docker.`}
        />
      ) : (
        <div className="space-y-10">
          {/* Domains */}
          {data.domains && data.domains.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-surface-900 mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary-600" />
                Domains ({data.domains.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.domains.map((domain) => (
                  <Link key={domain._id} to={`/domains/${domain.slug}`}>
                    <Card hoverable className="h-full">
                      <CardContent>
                        <h3 className="font-semibold text-surface-900 mb-1">{domain.name}</h3>
                        <p className="text-sm text-surface-500 line-clamp-2">{domain.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Technologies */}
          {data.technologies && data.technologies.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-surface-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent-600" />
                Technologies & Subjects ({data.technologies.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.technologies.map((tech) => (
                  <Link key={tech._id} to={`/technologies/${tech.slug}`}>
                    <Card hoverable className="h-full">
                      <CardContent>
                        <h3 className="font-semibold text-surface-900 mb-1">{tech.name}</h3>
                        <p className="text-sm text-surface-500 line-clamp-2">{tech.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Courses */}
          {data.courses && data.courses.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-surface-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-600" />
                Courses ({data.courses.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.courses.map((course) => (
                  <Link key={course._id} to={`/courses/${course.slug}`}>
                    <Card hoverable className="h-full">
                      <CardContent>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="primary" size="sm">
                            {course.difficulty}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-surface-900 mb-1">{course.title}</h3>
                        <p className="text-sm text-surface-500 line-clamp-2">{course.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Lessons */}
          {data.lessons && data.lessons.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-surface-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-600" />
                Lessons ({data.lessons.length})
              </h2>
              <div className="space-y-3">
                {data.lessons.map((lesson) => (
                  <Link key={lesson._id} to={`/learn/${lesson.slug}`} className="block">
                    <Card hoverable>
                      <CardContent className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-surface-900 mb-1">{lesson.title}</h3>
                          {lesson.description && (
                            <p className="text-sm text-surface-500 line-clamp-1">
                              {lesson.description}
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-medium text-primary-600 flex items-center gap-1 flex-shrink-0 ml-4">
                          Open Lesson <ArrowRight className="w-4 h-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
