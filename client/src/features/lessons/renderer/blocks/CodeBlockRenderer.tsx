import React from 'react';
import type { ContentBlock } from '@/types';
import { CodeBlock } from '@/components/ui/CodeBlock';

export const CodeBlockRenderer: React.FC<{ block: ContentBlock }> = ({ block }) => {
  return (
    <CodeBlock
      code={block.content}
      language={block.language}
      title={block.title}
    />
  );
};
