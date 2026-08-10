import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-surface-600">Progress</span>
          <span className="text-sm font-semibold text-primary-600">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-surface-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${sizes[size]} rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
