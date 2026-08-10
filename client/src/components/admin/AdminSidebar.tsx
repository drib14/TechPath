import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Cpu,
  BookOpen,
  HelpCircle,
  Users,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { TechPathLogo } from '../TechPathLogo';

interface NavItem {
  name: string;
  to: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { name: 'Domains', to: '/admin/domains', icon: Layers },
  { name: 'Technologies', to: '/admin/technologies', icon: Cpu },
  { name: 'Courses', to: '/admin/courses', icon: BookOpen },
  { name: 'Assessments', to: '/admin/assessments', icon: HelpCircle },
  { name: 'Users & Roles', to: '/admin/users', icon: Users },
  { name: 'Audit Logs', to: '/admin/audit-logs', icon: ShieldAlert },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-surface-950/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-surface-900 border-r border-surface-800 text-surface-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo & Workspace Title */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-surface-800 bg-surface-950/40">
          <Link to="/admin" className="flex items-center gap-2.5">
            <TechPathLogo size="sm" />
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30">
              CMS Admin
            </span>
          </Link>
        </div>

        {/* Navigation Modules */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-surface-400">
            Educational CMS
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 font-semibold'
                      : 'text-surface-400 hover:text-surface-100 hover:bg-surface-800/80'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            );
          })}
        </div>
      </aside>
    </>
  );
};
