import React, { useEffect, useState } from 'react';
import { ShieldAlert, Filter, Clock, Globe, Shield, RefreshCw } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import type { AuditLog, PaginationMeta } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { SkeletonAdminTable } from '../../components/ui/Skeleton';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const fetchLogs = async (currentPage = 1) => {
    try {
      setIsLoading(true);
      const res = await adminService.getAuditLogs({
        page: currentPage,
        limit: 20,
        action: actionFilter || undefined,
        resourceType: resourceFilter || undefined,
      });
      setLogs(res.logs);
      setPagination(res.meta);
      setPage(currentPage);
    } catch (err: any) {
      toast.error('Failed to load audit logs', err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, [actionFilter, resourceFilter]);

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'CREATE':
      case 'PUBLISH':
        return 'success';
      case 'DELETE':
      case 'UNPUBLISH':
        return 'danger';
      case 'ROLE_CHANGE':
        return 'warning';
      case 'LOGIN':
        return 'primary';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-primary-400" />
            Security & Audit Logs
          </h1>
          <p className="mt-1 text-sm text-surface-400">
            Immutable audit record of all administrative operations, content updates, role changes, and security events.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchLogs(page)}
          className="!border-surface-700 !text-surface-300 hover:!bg-surface-800"
        >
          <RefreshCw className="w-4 h-4 mr-1.5" />
          Refresh
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-surface-900 border border-surface-800 rounded-xl">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-surface-400" />
          <span className="text-xs font-semibold uppercase text-surface-400">Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-surface-950 border border-surface-800 text-surface-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="PUBLISH">PUBLISH</option>
            <option value="UNPUBLISH">UNPUBLISH</option>
            <option value="ROLE_CHANGE">ROLE_CHANGE</option>
            <option value="LOGIN">LOGIN</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase text-surface-400">Resource:</span>
          <select
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value)}
            className="bg-surface-950 border border-surface-800 text-surface-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">All Resources</option>
            <option value="Domain">Domain</option>
            <option value="Technology">Technology</option>
            <option value="Course">Course</option>
            <option value="Module">Module</option>
            <option value="Lesson">Lesson</option>
            <option value="Assessment">Assessment</option>
            <option value="User">User</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <SkeletonAdminTable rows={7} cols={6} />
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-surface-400">No audit log records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-surface-300">
              <thead className="bg-surface-950/60 text-xs font-semibold uppercase tracking-wider text-surface-400 border-b border-surface-800">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Actor</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Resource</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4 text-right">Origin IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/60 font-mono text-xs">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-surface-800/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-surface-400 font-sans">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-surface-500" />
                        {new Date(log.createdAt).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-sans">
                      <div>
                        <div className="font-semibold text-white">{log.userName}</div>
                        <div className="text-[11px] text-surface-400">{log.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-sans">
                      <Badge variant={getActionBadgeVariant(log.action) as any} size="sm">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-surface-300">{log.resourceType}</span>
                    </td>
                    <td className="px-6 py-4 font-sans text-xs text-surface-300 max-w-md">
                      {log.details}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-surface-500 text-[11px]">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3.5 bg-surface-950/60 border-t border-surface-800 text-xs">
            <span className="text-surface-400">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total logs)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => fetchLogs(page - 1)}
                className="!border-surface-700 !text-surface-300 hover:!bg-surface-800 disabled:opacity-30"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => fetchLogs(page + 1)}
                className="!border-surface-700 !text-surface-300 hover:!bg-surface-800 disabled:opacity-30"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
