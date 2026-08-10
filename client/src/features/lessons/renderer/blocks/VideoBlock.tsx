import React from 'react';
import type { ContentBlock } from '@/types';

export const VideoBlock: React.FC<{ block: ContentBlock }> = ({ block }) => {
  const url = block.url || block.content;

  // YouTube embed support
  const getYouTubeId = (videoUrl: string) => {
    const match = videoUrl.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match?.[1];
  };

  const youtubeId = getYouTubeId(url);

  return (
    <figure className="my-6">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-surface-200 shadow-sm">
        {youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={block.title || 'Video'}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={url}
            controls
            className="absolute inset-0 w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      {block.title && (
        <figcaption className="mt-2 text-sm text-center text-surface-500">
          {block.title}
        </figcaption>
      )}
    </figure>
  );
};
