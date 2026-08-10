import React from 'react';
import type { ContentBlock } from '@/types';

export const TextBlock: React.FC<{ block: ContentBlock }> = ({ block }) => {
  return (
    <div
      className="text-surface-700 leading-relaxed prose prose-surface max-w-none"
      dangerouslySetInnerHTML={{ __html: block.content }}
    />
  );
};
