import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, LogOut, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Generate breadcrumbs from path
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const formatSegment = (seg: string) => {
    if (seg === 'admin') return 'Admin';
    if (seg === 'curriculum') return 'Curriculum';
    if (seg === 'editor') return 'Content Editor';
    return seg.charAt(0).toUpperCase() + seg.slice(1);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface-900/90 backdrop-blur-md border-b border-surface-800 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb path */}
        <nav className="flex items-center gap-1.5 text-xs text-surface-400">
          <Link
            to="/admin"
            className="hover:text-primary-400 transition-colors font-medium flex items-center gap-1 text-surface-300"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-primary-400" />
            Console
          </Link>
          {pathSegments.slice(1).map((seg, idx) => {
            const isLast = idx === pathSegments.length - 2;
            const fullPath = `/${pathSegments.slice(0, idx + 2).join('/')}`;

            return (
              <React.Fragment key={fullPath}>
                <ChevronRight className="w-3 h-3 text-surface-600" />
                {isLast ? (
                  <span className="font-semibold text-white truncate max-w-[150px]">
                    {formatSegment(seg)}
                  </span>
                ) : (
                  <Link
                    to={fullPath}
                    className="hover:text-surface-200 transition-colors truncate max-w-[120px]"
                  >
                    {formatSegment(seg)}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right: Quick actions & Admin Profile */}
      <div className="flex items-center gap-3">
        {/* Admin Profile */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-primary-500/40"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-600/30 border border-primary-500/40 flex items-center justify-center text-primary-300 text-xs font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
            )}
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-white leading-none">{user?.name}</div>
              <div className="text-[10px] text-primary-400 mt-0.5 font-medium">Administrator</div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-2 rounded-lg text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
