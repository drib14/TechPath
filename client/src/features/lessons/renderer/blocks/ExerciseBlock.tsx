import React from 'react';
import { Dumbbell } from 'lucide-react';
import type { ContentBlock } from '@/types';

interface ExerciseBlockProps {
  block: ContentBlock;
}

/**
 * Renders an inline exercise reference within lesson content.
 * The actual interactive exercise UI is rendered by ExerciseList
 * after the lesson content. This block acts as a visual marker.
 */
export const ExerciseBlock: React.FC<ExerciseBlockProps> = ({ block }) => {
  return (
    <div className="my-4 p-4 border border-primary-200 bg-primary-50/50 rounded-xl flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Dumbbell className="w-4 h-4 text-primary-600" />
      </div>
      <div>
        {block.title && (
          <p className="font-semibold text-surface-900 text-sm mb-1">{block.title}</p>
        )}
        <p className="text-sm text-surface-600 leading-relaxed">
          {block.content || 'Complete the practice exercises at the end of this lesson.'}
        </p>
      </div>
    </div>
  );
};
