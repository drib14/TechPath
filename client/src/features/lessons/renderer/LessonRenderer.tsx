import React from 'react';
import type { ContentBlock } from '@/types';
import { HeadingBlock } from './blocks/HeadingBlock';
import { TextBlock } from './blocks/TextBlock';
import { CodeBlockRenderer } from './blocks/CodeBlockRenderer';
import { ImageBlock } from './blocks/ImageBlock';
import { VideoBlock } from './blocks/VideoBlock';
import { TipBlock } from './blocks/TipBlock';
import { WarningBlock } from './blocks/WarningBlock';
import { NoteBlock } from './blocks/NoteBlock';
import { ExampleBlock } from './blocks/ExampleBlock';

interface LessonRendererProps {
  content: ContentBlock[];
}

const blockComponents: Record<string, React.FC<{ block: ContentBlock }>> = {
  heading: HeadingBlock,
  text: TextBlock,
  code: CodeBlockRenderer,
  image: ImageBlock,
  video: VideoBlock,
  tip: TipBlock,
  warning: WarningBlock,
  note: NoteBlock,
  example: ExampleBlock,
};

export const LessonRenderer: React.FC<LessonRendererProps> = ({ content }) => {
  if (!content || content.length === 0) {
    return (
      <div className="text-center py-12 text-surface-500">
        <p>This lesson has no content yet.</p>
      </div>
    );
  }

  const sortedContent = [...content].sort((a, b) => a.order - b.order);

  return (
    <div className="lesson-content space-y-6">
      {sortedContent.map((block, index) => {
        const Component = blockComponents[block.type];

        if (!Component) {
          return (
            <div key={block._id || index} className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
              Unknown block type: <code>{block.type}</code>
            </div>
          );
        }

        return <Component key={block._id || index} block={block} />;
      })}
    </div>
  );
};
