import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  BookOpen,
  Layers,
  Globe,
  Shield,
  Cloud,
  Database,
  Brain,
  Code2,
  Cpu,
  Network,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { domainService } from '../services/domain.service';
import { courseService } from '../services/course.service';
import { technologyService } from '../services/technology.service';
import { statsService } from '../services/stats.service';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SafeImage } from '../components/ui/SafeImage';
import { SkeletonGrid, Skeleton } from '../components/ui/Skeleton';
import type { Domain, Course, Technology } from '../types';

const domainIcons: Record<string, React.ReactNode> = {
  'web-development': <Globe className="w-6 h-6" />,
  'cybersecurity': <Shield className="w-6 h-6" />,
  'cloud-computing': <Cloud className="w-6 h-6" />,
  'databases': <Database className="w-6 h-6" />,
  'artificial-intelligence': <Brain className="w-6 h-6" />,
  'machine-learning': <Brain className="w-6 h-6" />,
  'programming': <Code2 className="w-6 h-6" />,
  'devops': <Layers className="w-6 h-6" />,
  'networking': <Network className="w-6 h-6" />,
  'data-science': <Cpu className="w-6 h-6" />,
};

const getDomainIcon = (slug: string) =>
  domainIcons[slug] || <BookOpen className="w-6 h-6" />;

const difficultyColors = {
  beginner: 'success' as const,
  intermediate: 'warning' as const,
  advanced: 'danger' as const,
};

export const Landing: React.FC = () => {
  // 1. Live platform statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: statsService.getStats,
  });

  // 2. Live published domains
  const { data: domains, isLoading: domainsLoading } = useQuery({
    queryKey: ['domains'],
    queryFn: domainService.getAll,
  });

  // 3. Live published courses
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: courseService.getAll,
  });

  // 4. Live published technologies
  const { data: technologies, isLoading: techLoading } = useQuery({
    queryKey: ['technologies'],
    queryFn: technologyService.getAll,
  });

  const featuredCourses = courses?.slice(0, 6) || [];
  const popularTechs = technologies?.slice(0, 6) || [];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.2),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(6,182,212,0.15),_transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-primary-200 mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              100% Free Technology Learning Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Master modern tech,{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                one structured step at a time
              </span>
            </h1>
            <p className="text-lg md:text-xl text-surface-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Explore interactive lessons, command examples, and real-world scenarios across web development, cloud computing, cybersecurity, AI, and more.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/courses">
                <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5">
                  Start Learning
                  <ArrowRight className="w-5 h-5 text-indigo-700" />
                </button>
              </Link>
              <Link to="/domains">
                <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/30 backdrop-blur-md transition-all duration-200 transform hover:-translate-y-0.5">
                  Browse Domains
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Bar */}
      <section className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 text-primary-600 mx-auto mb-2">
                <Layers className="w-5 h-5" />
              </div>
              {statsLoading ? (
                <Skeleton className="w-16 h-8 mx-auto my-1" />
              ) : (
                <p className="text-3xl font-extrabold text-surface-900">
                  {stats?.domains || domains?.length || 0}
                </p>
              )}
              <p className="text-sm font-medium text-surface-500">Tech Domains</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 mx-auto mb-2">
                <Cpu className="w-5 h-5" />
              </div>
              {statsLoading ? (
                <Skeleton className="w-16 h-8 mx-auto my-1" />
              ) : (
                <p className="text-3xl font-extrabold text-surface-900">
                  {stats?.technologies || technologies?.length || 0}
                </p>
              )}
              <p className="text-sm font-medium text-surface-500">Technologies</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent-50 text-accent-600 mx-auto mb-2">
                <BookOpen className="w-5 h-5" />
              </div>
              {statsLoading ? (
                <Skeleton className="w-16 h-8 mx-auto my-1" />
              ) : (
                <p className="text-3xl font-extrabold text-surface-900">
                  {stats?.courses || courses?.length || 0}
                </p>
              )}
              <p className="text-sm font-medium text-surface-500">Available Courses</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600 mx-auto mb-2">
                <FileCode className="w-5 h-5" />
              </div>
              {statsLoading ? (
                <Skeleton className="w-16 h-8 mx-auto my-1" />
              ) : (
                <p className="text-3xl font-extrabold text-surface-900">
                  {stats?.lessons || 0}
                </p>
              )}
              <p className="text-sm font-medium text-surface-500">Interactive Lessons</p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Domains Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-surface-900 mb-2">
              Explore Learning Domains
            </h2>
            <p className="text-surface-500 max-w-xl">
              Choose an area of technology to discover curated learning paths and structured subjects.
            </p>
          </div>
          <Link
            to="/domains"
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            View all domains <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {domainsLoading ? (
          <SkeletonGrid count={6} cols={3} />
        ) : domains && domains.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain: Domain) => (
              <Link key={domain._id} to={`/domains/${domain.slug}`}>
                <Card hoverable className="h-full">
                  <CardContent className="flex flex-col items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                      {getDomainIcon(domain.slug)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-surface-900 mb-1">{domain.name}</h3>
                      <p className="text-sm text-surface-500 line-clamp-2">{domain.description}</p>
                    </div>
                    <span className="text-sm font-medium text-primary-600 flex items-center gap-1 mt-auto pt-2">
                      Explore domain <ArrowRight className="w-4 h-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-surface-500 bg-white rounded-2xl border border-surface-200">
            <Layers className="w-10 h-10 text-surface-400 mx-auto mb-2" />
            <p className="font-semibold text-surface-800">No domains published yet</p>
            <p className="text-sm mt-1">Run database seed or create domains from the admin CMS.</p>
          </div>
        )}
      </section>

      {/* Featured Courses (Real Data) */}
      <section className="bg-surface-50 border-y border-surface-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-surface-900 mb-2">
                Featured Courses
              </h2>
              <p className="text-surface-500 max-w-xl">
                Start learning with our most popular step-by-step practical courses.
              </p>
            </div>
            <Link
              to="/courses"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              Browse all courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {coursesLoading ? (
            <SkeletonGrid count={3} cols={3} />
          ) : featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course: Course) => {
                const parentTech = course.technologyId as Technology;
                return (
                  <Link key={course._id} to={`/courses/${course.slug}`}>
                    <Card hoverable className="h-full flex flex-col bg-white">
                      <SafeImage
                        src={course.thumbnail}
                        alt={course.title}
                        categoryTitle={parentTech?.name || 'TechPath Course'}
                        aspectRatio="video"
                        className="w-full h-44"
                      />
                      <CardContent className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <Badge variant={difficultyColors[course.difficulty]}>
                            {course.difficulty}
                          </Badge>
                          {parentTech?.name && (
                            <span className="text-xs text-surface-400 font-medium truncate max-w-[150px]">
                              {parentTech.name}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-surface-900 mb-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-surface-500 line-clamp-2 mb-4 flex-1">
                          {course.description}
                        </p>
                        <span className="text-sm font-medium text-primary-600 flex items-center gap-1 mt-auto">
                          Start Course <ArrowRight className="w-4 h-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-surface-500 bg-white rounded-2xl border border-surface-200">
              <BookOpen className="w-10 h-10 text-surface-400 mx-auto mb-2" />
              <p className="font-semibold text-surface-800">No courses published yet</p>
              <p className="text-sm mt-1">Courses will appear here as they are added to the platform.</p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Technologies & Subjects (Real Data) */}
      {popularTechs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-surface-900 mb-2">
              Popular Technologies & Subjects
            </h2>
            <p className="text-surface-500 max-w-2xl mx-auto">
              Dive directly into specific technologies, tools, and technical languages.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularTechs.map((tech: Technology) => (
              <Link key={tech._id} to={`/technologies/${tech.slug}`}>
                <div className="p-5 rounded-2xl bg-white border border-surface-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 text-center flex flex-col items-center gap-2 group h-full">
                  <div className="w-10 h-10 rounded-xl bg-surface-100 group-hover:bg-primary-50 text-surface-700 group-hover:text-primary-600 flex items-center justify-center transition-colors">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-surface-900 group-hover:text-primary-600 transition-colors">
                    {tech.name}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
};
