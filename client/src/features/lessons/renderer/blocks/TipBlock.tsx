import React from 'react';
import { Lightbulb } from 'lucide-react';
import type { ContentBlock } from '@/types';

export const TipBlock: React.FC<{ block: ContentBlock }> = ({ block }) => {
  return (
    <div className="flex gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 my-4">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-emerald-600" />
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-emerald-800 mb-1">
          {block.title || 'Tip'}
        </p>
        <div className="text-sm text-emerald-700 leading-relaxed">{block.content}</div>
      </div>
    </div>
  );
};
