import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { ContentBlock } from '@/types';

export const WarningBlock: React.FC<{ block: ContentBlock }> = ({ block }) => {
  return (
    <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 my-4">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-amber-800 mb-1">
          {block.title || 'Warning'}
        </p>
        <div className="text-sm text-amber-700 leading-relaxed">{block.content}</div>
      </div>
    </div>
  );
};
