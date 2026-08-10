import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  count = 1,
}) => {
  const baseClasses = 'skeleton-shimmer animate-pulse bg-surface-800/60';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${baseClasses} ${variantClasses[variant]} ${className}`}
          style={style}
        />
      ))}
    </>
  );
};

// Preset skeleton components for common patterns
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-xl border border-surface-200 p-6 ${className}`}>
    <Skeleton variant="rectangular" className="w-full h-40 mb-4 bg-surface-200" />
    <Skeleton variant="text" className="w-3/4 mb-2 bg-surface-200" />
    <Skeleton variant="text" className="w-1/2 mb-4 bg-surface-200" />
    <div className="flex gap-2">
      <Skeleton variant="text" className="w-16 h-6 bg-surface-200" />
      <Skeleton variant="text" className="w-20 h-6 bg-surface-200" />
    </div>
  </div>
);

export const SkeletonList: React.FC<{ count?: number; className?: string }> = ({
  count = 3,
  className = '',
}) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-surface-200">
        <Skeleton variant="circular" width={48} height={48} className="bg-surface-200" />
        <div className="flex-1">
          <Skeleton variant="text" className="w-1/3 mb-2 bg-surface-200" />
          <Skeleton variant="text" className="w-2/3 bg-surface-200" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonLessonContent: React.FC = () => (
  <div className="space-y-6 max-w-4xl">
    <Skeleton variant="text" className="w-2/3 h-8 mb-2 bg-surface-200" />
    <Skeleton variant="text" className="w-1/3 h-4 mb-6 bg-surface-200" />
    <div className="space-y-3">
      <Skeleton variant="text" className="w-full bg-surface-200" />
      <Skeleton variant="text" className="w-full bg-surface-200" />
      <Skeleton variant="text" className="w-5/6 bg-surface-200" />
      <Skeleton variant="text" className="w-4/5 bg-surface-200" />
    </div>
    <Skeleton variant="rectangular" className="w-full h-48 mt-4 bg-surface-200" />
    <div className="space-y-3">
      <Skeleton variant="text" className="w-full bg-surface-200" />
      <Skeleton variant="text" className="w-3/4 bg-surface-200" />
      <Skeleton variant="text" className="w-5/6 bg-surface-200" />
    </div>
  </div>
);

export const SkeletonGrid: React.FC<{ count?: number; cols?: number }> = ({
  count = 6,
  cols = 3,
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-6`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

/**
 * Admin Panel Dynamic Skeletons
 */
export const SkeletonAdminTable: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 5,
}) => (
  <div className="w-full overflow-hidden">
    <div className="p-4 bg-surface-950/60 border-b border-surface-800 flex gap-6">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-4 bg-surface-800/80 rounded animate-pulse" style={{ width: `${60 + (i * 20) % 60}px` }} />
      ))}
    </div>
    <div className="divide-y divide-surface-800/40">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="p-4 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 rounded-xl bg-surface-800/80 flex-shrink-0" />
            <div className="space-y-2 flex-1 max-w-sm">
              <div className="h-4 bg-surface-800/80 rounded w-2/3" />
              <div className="h-3 bg-surface-800/40 rounded w-1/2" />
            </div>
          </div>
          <div className="h-5 bg-surface-800/60 rounded-full w-20" />
          <div className="flex gap-2">
            <div className="w-7 h-7 bg-surface-800/60 rounded-lg" />
            <div className="w-7 h-7 bg-surface-800/60 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonAdminStats: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-surface-900 border border-surface-800 rounded-2xl p-4 animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 bg-surface-800 rounded w-16" />
          <div className="w-5 h-5 bg-surface-800 rounded" />
        </div>
        <div className="h-7 bg-surface-700/80 rounded w-12 mb-2" />
        <div className="h-2.5 bg-surface-800 rounded w-20" />
      </div>
    ))}
  </div>
);

export const SkeletonAdminCards: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-surface-900 border border-surface-800 rounded-2xl p-5 animate-pulse">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-800 flex-shrink-0" />
            <div className="space-y-1.5">
              <div className="h-4 bg-surface-700 rounded w-28" />
              <div className="h-3 bg-surface-800 rounded w-20" />
            </div>
          </div>
          <div className="h-5 bg-surface-800 rounded-full w-16" />
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-surface-800/70 rounded w-full" />
          <div className="h-3 bg-surface-800/50 rounded w-4/5" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-surface-800/60">
          <div className="h-3 bg-surface-800 rounded w-20" />
          <div className="flex gap-2">
            <div className="w-6 h-6 bg-surface-800 rounded" />
            <div className="w-6 h-6 bg-surface-800 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);
