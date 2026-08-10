import React, { useEffect, useState } from 'react';
import { Users, Search, Shield, ShieldCheck, UserCheck, Clock, Filter } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { useAuth } from '../../features/auth/AuthContext';
import type { User, UserRole } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { SkeletonAdminTable } from '../../components/ui/Skeleton';

export const AdminUsers: React.FC = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('USER');
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getUsers({
        search: search.trim() || undefined,
        role: roleFilter === 'all' ? undefined : roleFilter,
      });
      setUsers(res.users);
    } catch (err: any) {
      toast.error('Failed to load users', err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, roleFilter]);

  const openRoleModal = (u: User) => {
    setTargetUser(u);
    setSelectedRole(u.role);
    setIsRoleModalOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!targetUser) return;

    if (currentAdmin?._id === targetUser._id && selectedRole !== 'ADMIN') {
      toast.error('Forbidden', 'You cannot remove your own administrator privileges');
      return;
    }

    try {
      setIsUpdating(true);
      await adminService.updateUserRole(targetUser._id, selectedRole);
      toast.success(
        'Role Updated',
        `User ${targetUser.name} is now ${selectedRole === 'ADMIN' ? 'an Administrator' : 'a Learner'}`
      );
      setIsRoleModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      toast.error('Failed to update role', err.response?.data?.message || 'Server error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-amber-400" />
            User & Role Management
          </h1>
          <p className="mt-1 text-sm text-surface-400">
            View registered learners and manage platform administrator permissions (RBAC).
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-surface-900 border border-surface-800 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-surface-950 border border-surface-800 rounded-lg text-white placeholder-surface-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-surface-400" />
          <span className="text-xs font-semibold uppercase text-surface-400">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-surface-950 border border-surface-800 text-surface-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="all">All Roles</option>
            <option value="ADMIN">Administrators</option>
            <option value="USER">Learners</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <SkeletonAdminTable rows={6} cols={4} />
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-surface-400">No users match your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-surface-300">
              <thead className="bg-surface-950/60 text-xs font-semibold uppercase tracking-wider text-surface-400 border-b border-surface-800">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/60">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-surface-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-9 h-9 rounded-full object-cover border border-surface-700"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center font-bold text-surface-300 text-xs">
                            {u.name?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{u.name}</span>
                            {currentAdmin?._id === u._id && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary-500/20 text-primary-300 border border-primary-500/30">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-surface-400">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'ADMIN'
                            ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                            : 'bg-surface-800 text-surface-300 border border-surface-700'
                        }`}
                      >
                        {u.role === 'ADMIN' ? (
                          <>
                            <ShieldCheck className="w-3 h-3 text-primary-400" />
                            Administrator
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3 h-3 text-surface-400" />
                            Learner
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-surface-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-surface-500" />
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRoleModal(u)}
                        className="!border-surface-700 !text-surface-300 hover:!bg-surface-800"
                      >
                        <Shield className="w-3.5 h-3.5 mr-1" />
                        Change Role
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Management Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Manage User Permissions"
        description={`Update system role and access level for ${targetUser?.name} (${targetUser?.email}).`}
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <label
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                selectedRole === 'USER'
                  ? 'bg-surface-800/80 border-primary-500 text-white'
                  : 'bg-surface-950/40 border-surface-800 text-surface-400 hover:border-surface-700'
              }`}
            >
              <input
                type="radio"
                name="role"
                value="USER"
                checked={selectedRole === 'USER'}
                onChange={() => setSelectedRole('USER')}
                className="mt-0.5 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <div className="text-sm font-bold text-white">Learner (Standard Role)</div>
                <div className="text-xs text-surface-400 mt-0.5">
                  Can browse courses, complete interactive lessons, take quizzes, and track learning progress.
                </div>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                selectedRole === 'ADMIN'
                  ? 'bg-surface-800/80 border-primary-500 text-white'
                  : 'bg-surface-950/40 border-surface-800 text-surface-400 hover:border-surface-700'
              }`}
            >
              <input
                type="radio"
                name="role"
                value="ADMIN"
                checked={selectedRole === 'ADMIN'}
                onChange={() => setSelectedRole('ADMIN')}
                className="mt-0.5 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <div className="text-sm font-bold text-white">Administrator (Full Access)</div>
                <div className="text-xs text-surface-400 mt-0.5">
                  Can access the Admin Console, create/publish curriculum content, manage user roles, and view security audit trails.
                </div>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsRoleModalOpen(false)}
              className="!text-surface-400 hover:!text-white"
            >
              Cancel
            </Button>
            <Button type="button" variant="primary" onClick={handleUpdateRole} isLoading={isUpdating}>
              Confirm Role Change
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
