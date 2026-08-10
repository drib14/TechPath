import React from 'react';
import { BookOpen } from 'lucide-react';
import type { ContentBlock } from '@/types';

export const ExampleBlock: React.FC<{ block: ContentBlock }> = ({ block }) => {
  return (
    <div className="my-6 rounded-xl border border-primary-200 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-primary-50 border-b border-primary-200">
        <BookOpen className="w-4 h-4 text-primary-600" />
        <span className="text-sm font-semibold text-primary-800">
          {block.title || 'Example'}
        </span>
      </div>
      <div className="p-4 bg-white">
        <div className="text-sm text-surface-700 leading-relaxed">{block.content}</div>
      </div>
    </div>
  );
};
