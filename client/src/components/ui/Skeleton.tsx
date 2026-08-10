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
  const baseClasses = 'skeleton-shimmer animate-pulse';

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
    <Skeleton variant="rectangular" className="w-full h-40 mb-4" />
    <Skeleton variant="text" className="w-3/4 mb-2" />
    <Skeleton variant="text" className="w-1/2 mb-4" />
    <div className="flex gap-2">
      <Skeleton variant="text" className="w-16 h-6" />
      <Skeleton variant="text" className="w-20 h-6" />
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
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton variant="text" className="w-1/3 mb-2" />
          <Skeleton variant="text" className="w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonLessonContent: React.FC = () => (
  <div className="space-y-6 max-w-4xl">
    <Skeleton variant="text" className="w-2/3 h-8 mb-2" />
    <Skeleton variant="text" className="w-1/3 h-4 mb-6" />
    <div className="space-y-3">
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-5/6" />
      <Skeleton variant="text" className="w-4/5" />
    </div>
    <Skeleton variant="rectangular" className="w-full h-48 mt-4" />
    <div className="space-y-3">
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-5/6" />
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
