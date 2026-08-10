import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  className = '',
}) => {
  const config = {
    info: {
      bg: 'bg-sky-50 border-sky-200',
      text: 'text-sky-800',
      icon: <Info className="w-5 h-5 text-sky-500" />,
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-800',
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-800',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
    },
  };

  const { bg, text, icon } = config[variant];

  return (
    <div className={`flex gap-3 p-4 rounded-lg border ${bg} ${className}`}>
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className={text}>
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
};
