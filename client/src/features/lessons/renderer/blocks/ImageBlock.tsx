import React from 'react';
import type { ContentBlock } from '@/types';

export const ImageBlock: React.FC<{ block: ContentBlock }> = ({ block }) => {
  return (
    <figure className="my-6">
      <img
        src={block.url || block.content}
        alt={block.alt || block.title || 'Lesson image'}
        className="w-full rounded-xl border border-surface-200 shadow-sm"
        loading="lazy"
      />
      {block.title && (
        <figcaption className="mt-2 text-sm text-center text-surface-500">
          {block.title}
        </figcaption>
      )}
    </figure>
  );
};
