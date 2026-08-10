import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { Button } from './ui/Button';
import { TechPathLogo } from './TechPathLogo';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <TechPathLogo size="md" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/domains" className="text-sm font-medium text-surface-600 hover:text-primary-600 transition-colors">
              Domains
            </Link>
            <Link to="/courses" className="text-sm font-medium text-surface-600 hover:text-primary-600 transition-colors">
              Courses
            </Link>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, lessons..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </form>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-100 transition-colors"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary-600">
                        {user?.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 text-surface-500" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-surface-200 py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-surface-100">
                      <p className="text-sm font-semibold text-surface-900">{user?.name}</p>
                      <p className="text-xs text-surface-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm">
                  Sign in
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-surface-200 animate-fade-in">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </form>
            <div className="space-y-1">
              <Link
                to="/domains"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-surface-600 hover:bg-surface-50 rounded-lg"
              >
                Domains
              </Link>
              <Link
                to="/courses"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-surface-600 hover:bg-surface-50 rounded-lg"
              >
                Courses
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-surface-600 hover:bg-surface-50 rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
