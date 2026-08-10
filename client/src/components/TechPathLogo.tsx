import React from 'react';

interface TechPathLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const TechPathIcon: React.FC<{ size?: number | string; className?: string }> = ({
  size = 32,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="tpl_bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="tpl_accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
      </defs>

      {/* Rounded Container */}
      <rect width="512" height="512" rx="128" fill="url(#tpl_bg)" />

      {/* Circuit Nodes */}
      <path
        d="M120 180 L200 180 L256 236"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M392 332 L312 332 L256 276"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle cx="120" cy="180" r="10" fill="rgba(255,255,255,0.3)" />
      <circle cx="392" cy="332" r="10" fill="rgba(255,255,255,0.3)" />

      {/* Main TechPath Monogram T + P Branch */}
      <path
        d="M168 136 L344 136 C366 136 380 152 380 174 C380 196 366 212 344 212 L288 212 L288 376 C288 398 270 416 248 416 C226 416 208 398 208 376 L208 212 L168 212 C146 212 128 194 128 172 C128 150 146 136 168 136 Z"
        fill="#ffffff"
      />

      {/* Accent Learning Loop */}
      <path
        d="M208 288 L320 288 C342 288 360 306 360 328 C360 350 342 368 320 368 L288 368"
        fill="none"
        stroke="url(#tpl_accent)"
        strokeWidth="26"
        strokeLinecap="round"
      />

      {/* Waypoints */}
      <circle cx="208" cy="174" r="16" fill="#4f46e5" />
      <circle cx="288" cy="288" r="15" fill="#06b6d4" />
      <circle cx="360" cy="328" r="14" fill="#4ade80" />
      <circle cx="248" cy="376" r="15" fill="#6366f1" />
    </svg>
  );
};

export const TechPathLogo: React.FC<TechPathLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 24, text: 'text-lg', gap: 'gap-1.5' },
    md: { icon: 32, text: 'text-xl', gap: 'gap-2' },
    lg: { icon: 44, text: 'text-2xl', gap: 'gap-2.5' },
    xl: { icon: 60, text: 'text-4xl', gap: 'gap-3' },
  };

  const { icon, text, gap } = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${gap} ${className}`}>
      <TechPathIcon size={icon} className="shadow-md rounded-lg" />
      {showText && (
        <span className={`font-extrabold tracking-tight gradient-text ${text}`}>
          TechPath
        </span>
      )}
    </div>
  );
};
