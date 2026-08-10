import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Cpu,
  BookOpen,
  FileText,
  Users,
  ShieldAlert,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  FileEdit,
  ExternalLink,
} from 'lucide-react';
import { adminService } from '../../services/admin.service';
import type { AdminDashboardData } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SkeletonAdminStats } from '../../components/ui/Skeleton';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getDashboardStats();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="h-28 rounded-2xl bg-surface-900 border border-surface-800 animate-pulse" />
        <SkeletonAdminStats />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 rounded-2xl bg-surface-900 border border-surface-800 animate-pulse" />
          <div className="h-64 rounded-2xl bg-surface-900 border border-surface-800 animate-pulse" />
        </div>
      </div>
    );
  }

  const metrics = data?.metrics;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-surface-900 via-surface-850 to-primary-950/40 border border-surface-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">TechPath CMS & Console</h1>
          <p className="mt-1 text-sm text-surface-400">
            Manage technical curriculum, structured content blocks, quizzes, and security access.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link to="/admin/domains">
            <Button variant="outline" size="sm" className="!border-surface-700 !text-surface-200 hover:!bg-surface-800">
              <Plus className="w-4 h-4 mr-1" /> New Domain
            </Button>
          </Link>
          <Link to="/admin/courses">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-1" /> New Course
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Domains */}
        <Card className="!bg-surface-900 !border-surface-800 p-4 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Domains</span>
            <Layers className="w-4 h-4 text-primary-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{metrics?.domains.total || 0}</span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-surface-400">
              <span className="text-emerald-400 font-medium">{metrics?.domains.published || 0} pub</span>
              <span>•</span>
              <span className="text-amber-400 font-medium">{metrics?.domains.draft || 0} draft</span>
            </div>
          </div>
        </Card>

        {/* Technologies */}
        <Card className="!bg-surface-900 !border-surface-800 p-4 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Technologies</span>
            <Cpu className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{metrics?.technologies.total || 0}</span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-surface-400">
              <span className="text-emerald-400 font-medium">{metrics?.technologies.published || 0} pub</span>
              <span>•</span>
              <span className="text-amber-400 font-medium">{metrics?.technologies.draft || 0} draft</span>
            </div>
          </div>
        </Card>

        {/* Courses */}
        <Card className="!bg-surface-900 !border-surface-800 p-4 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Courses</span>
            <BookOpen className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{metrics?.courses.total || 0}</span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-surface-400">
              <span className="text-emerald-400 font-medium">{metrics?.courses.published || 0} pub</span>
              <span>•</span>
              <span className="text-amber-400 font-medium">{metrics?.courses.draft || 0} draft</span>
            </div>
          </div>
        </Card>

        {/* Lessons */}
        <Card className="!bg-surface-900 !border-surface-800 p-4 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Lessons</span>
            <FileText className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{metrics?.lessons.total || 0}</span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-surface-400">
              <span className="text-emerald-400 font-medium">{metrics?.lessons.published || 0} pub</span>
              <span>•</span>
              <span className="text-amber-400 font-medium">{metrics?.lessons.draft || 0} draft</span>
            </div>
          </div>
        </Card>

        {/* Assessments */}
        <Card className="!bg-surface-900 !border-surface-800 p-4 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Quizzes</span>
            <CheckCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{metrics?.assessments.total || 0}</span>
            <div className="mt-1 text-[11px] text-surface-400">
              <span>{metrics?.exercises.total || 0} interactive exercises</span>
            </div>
          </div>
        </Card>

        {/* Users */}
        <Card className="!bg-surface-900 !border-surface-800 p-4 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Users</span>
            <Users className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{metrics?.users.total || 0}</span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-surface-400">
              <span className="text-primary-400 font-medium">{metrics?.users.admins || 0} admins</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Two Column Layout: Drafts Queue & Recent Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Draft Content Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-amber-400" />
              Draft Content Queue
            </h2>
            <Badge variant="warning">{data?.drafts.lessons.length || 0} pending</Badge>
          </div>

          <div className="space-y-2.5">
            {data?.drafts.lessons && data.drafts.lessons.length > 0 ? (
              data.drafts.lessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-surface-900 border border-surface-800 hover:border-surface-700 transition-all group"
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <h3 className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-surface-400 mt-0.5 truncate">
                      Slug: /{lesson.slug}
                    </p>
                  </div>
                  <Link to={`/admin/lessons/${lesson._id}/editor`}>
                    <Button variant="outline" size="sm" className="!border-surface-700 !text-surface-300 hover:!bg-surface-800">
                      <span>Edit Blocks</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center rounded-xl bg-surface-900 border border-surface-800 text-surface-400 text-sm">
                No draft lessons in queue. All curriculum content is published!
              </div>
            )}
          </div>
        </div>

        {/* Right: Security & Audit Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary-400" />
              Recent Audit Activity
            </h2>
            <Link to="/admin/audit-logs" className="text-xs text-primary-400 hover:underline flex items-center gap-1">
              View all <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {data?.recentActivity && data.recentActivity.length > 0 ? (
              data.recentActivity.map((log) => (
                <div
                  key={log._id}
                  className="flex items-start justify-between p-3.5 rounded-xl bg-surface-900 border border-surface-800 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-surface-200">{log.userName}</span>
                      <Badge
                        variant={
                          log.action === 'CREATE'
                            ? 'success'
                            : log.action === 'DELETE'
                            ? 'danger'
                            : log.action === 'ROLE_CHANGE'
                            ? 'warning'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {log.action}
                      </Badge>
                      <span className="text-surface-400">{log.resourceType}</span>
                    </div>
                    <p className="text-surface-400">{log.details}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-surface-500 whitespace-nowrap pl-2">
                    <Clock className="w-3 h-3" />
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center rounded-xl bg-surface-900 border border-surface-800 text-surface-400 text-sm">
                No recent audit activity.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
