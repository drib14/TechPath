import React from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nothing here yet',
  message = 'No content is available at the moment.',
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
        {icon || <FolderOpen className="w-8 h-8 text-surface-400" />}
      </div>
      <h3 className="text-lg font-semibold text-surface-900 mb-2">{title}</h3>
      <p className="text-surface-500 max-w-md mb-6">{message}</p>
      {action}
    </div>
  );
};
