import React from 'react';
import { ClipboardCheck } from 'lucide-react';
import type { ContentBlock } from '@/types';

interface AssessmentBlockProps {
  block: ContentBlock;
}

/**
 * Renders an inline assessment reference within lesson content.
 * The actual interactive assessment UI is rendered by AssessmentPanel
 * after the lesson content. This block acts as a visual marker.
 */
export const AssessmentBlock: React.FC<AssessmentBlockProps> = ({ block }) => {
  return (
    <div className="my-4 p-4 border border-accent-200 bg-accent-50/50 rounded-xl flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <ClipboardCheck className="w-4 h-4 text-accent-600" />
      </div>
      <div>
        {block.title && (
          <p className="font-semibold text-surface-900 text-sm mb-1">{block.title}</p>
        )}
        <p className="text-sm text-surface-600 leading-relaxed">
          {block.content || 'Complete the assessment at the end of this lesson to test your knowledge.'}
        </p>
      </div>
    </div>
  );
};
