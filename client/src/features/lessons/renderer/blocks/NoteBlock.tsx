import React from 'react';
import { Info } from 'lucide-react';
import type { ContentBlock } from '@/types';

export const NoteBlock: React.FC<{ block: ContentBlock }> = ({ block }) => {
  return (
    <div className="flex gap-3 p-4 rounded-xl bg-sky-50 border border-sky-200 my-4">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
          <Info className="w-4 h-4 text-sky-600" />
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-sky-800 mb-1">
          {block.title || 'Note'}
        </p>
        <div className="text-sm text-sky-700 leading-relaxed">{block.content}</div>
      </div>
    </div>
  );
};
