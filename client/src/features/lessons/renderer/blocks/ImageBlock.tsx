import React from 'react';
import type { ContentBlock } from '@/types';
import { SafeImage } from '@/components/ui/SafeImage';

export const ImageBlock: React.FC<{ block: ContentBlock }> = ({ block }) => {
  return (
    <figure className="my-6">
      <SafeImage
        src={block.url || block.content}
        alt={block.alt || block.title || 'Technical Diagram'}
        categoryTitle={block.title}
        aspectRatio="video"
        className="w-full rounded-xl border border-surface-200 shadow-sm"
      />
      {block.title && (
        <figcaption className="mt-2 text-sm text-center text-surface-500">
          {block.title}
        </figcaption>
      )}
    </figure>
  );
};
