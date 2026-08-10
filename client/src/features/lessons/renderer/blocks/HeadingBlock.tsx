import React from 'react';
import type { ContentBlock } from '@/types';

export const HeadingBlock: React.FC<{ block: ContentBlock }> = ({ block }) => {
  const level = block.level || 2;
  const classes: Record<number, string> = {
    1: 'text-3xl font-bold text-surface-900 mt-8 mb-4',
    2: 'text-2xl font-bold text-surface-900 mt-8 mb-3',
    3: 'text-xl font-semibold text-surface-800 mt-6 mb-3',
    4: 'text-lg font-semibold text-surface-800 mt-4 mb-2',
    5: 'text-base font-semibold text-surface-700 mt-4 mb-2',
    6: 'text-sm font-semibold text-surface-700 mt-3 mb-2',
  };

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className={classes[level] || classes[2]}>{block.content}</Tag>;
};
