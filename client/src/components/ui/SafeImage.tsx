import React, { useState } from 'react';
import { BookOpen, Code2, Cloud, Shield, Database, Brain, Globe, ImageOff } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  className?: string;
  fallbackIcon?: 'code' | 'cloud' | 'security' | 'database' | 'ai' | 'web' | 'default';
  categoryTitle?: string;
  aspectRatio?: 'video' | 'square' | 'banner' | 'auto';
}

const iconMap = {
  code: <Code2 className="w-8 h-8 text-primary-400" />,
  cloud: <Cloud className="w-8 h-8 text-cyan-400" />,
  security: <Shield className="w-8 h-8 text-emerald-400" />,
  database: <Database className="w-8 h-8 text-amber-400" />,
  ai: <Brain className="w-8 h-8 text-purple-400" />,
  web: <Globe className="w-8 h-8 text-sky-400" />,
  default: <BookOpen className="w-8 h-8 text-primary-400" />,
};

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackIcon = 'default',
  categoryTitle,
  aspectRatio = 'auto',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    banner: 'aspect-[21/9]',
    auto: '',
  };

  // If no source provided or failed to load, show the cool fallback
  if (!src || hasError) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-surface-800 via-surface-900 to-primary-950 flex flex-col items-center justify-center p-6 text-center select-none ${aspectClasses[aspectRatio]} ${className}`}
      >
        {/* Subtle geometric background grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />

        {/* Ambient glow */}
        <div className="absolute w-32 h-32 bg-primary-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Icon & Title */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
            {iconMap[fallbackIcon] || iconMap.default}
          </div>
          {categoryTitle && (
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-300 mt-1 max-w-[200px] truncate">
              {categoryTitle}
            </span>
          )}
          <span className="text-xs text-surface-500 font-medium line-clamp-1 max-w-[220px]">
            {alt || 'TechPath Concept'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-surface-100 ${aspectClasses[aspectRatio]} ${className}`}>
      {/* Shimmer loader while image is loading */}
      {isLoading && (
        <div className="absolute inset-0 skeleton-shimmer z-10" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        {...props}
      />
    </div>
  );
};
