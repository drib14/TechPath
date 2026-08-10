import React from 'react';

interface TechPathLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'full' | 'mascot-only';
}

/**
 * TechPath Mascot: "Byte" - The friendly, futuristic Tech Explorer Bot!
 * Features glowing holographic visor, antenna node, cyber path accents, and expressive robotic charm.
 */
export const TechPathMascot: React.FC<{ size?: number | string; className?: string }> = ({
  size = 36,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 drop-shadow-md transition-transform duration-300 hover:scale-105 ${className}`}
    >
      <defs>
        {/* Background Gradient */}
        <linearGradient id="tp_mascot_bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="60%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>

        {/* Visor Screen Gradient */}
        <linearGradient id="tp_visor_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        {/* Eye Glow Gradient */}
        <linearGradient id="tp_eye_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>

        {/* Ear Light Gradient */}
        <linearGradient id="tp_accent_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>

        {/* Outer Shadow Filter */}
        <filter id="tp_glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Rounded Outer Chassis Frame */}
      <rect x="8" y="14" width="104" height="96" rx="30" fill="url(#tp_mascot_bg)" />

      {/* Antenna / Satellite Node */}
      <path d="M60 14 V4" stroke="#818cf8" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="4" r="4.5" fill="#38bdf8" filter="url(#tp_glow)" />

      {/* Left Cyber Ear / Headphone */}
      <rect x="2" y="44" width="8" height="34" rx="4" fill="#312e81" />
      <rect x="4" y="50" width="4" height="22" rx="2" fill="url(#tp_accent_grad)" />

      {/* Right Cyber Ear / Headphone */}
      <rect x="110" y="44" width="8" height="34" rx="4" fill="#312e81" />
      <rect x="112" y="50" width="4" height="22" rx="2" fill="url(#tp_accent_grad)" />

      {/* Cyber Visor Screen */}
      <rect x="18" y="26" width="84" height="66" rx="20" fill="url(#tp_visor_grad)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

      {/* Visor Tech Path Circuit Lines (Background subtle) */}
      <path
        d="M26 36 H40 L48 44"
        stroke="rgba(56, 189, 248, 0.25)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="26" cy="36" r="1.5" fill="#38bdf8" opacity="0.5" />

      <path
        d="M94 82 H80 L72 74"
        stroke="rgba(52, 211, 153, 0.25)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="94" cy="82" r="1.5" fill="#34d399" opacity="0.5" />

      {/* Left Expressive Robotic Eye */}
      <rect x="32" y="46" width="18" height="22" rx="9" fill="url(#tp_eye_grad)" filter="url(#tp_glow)" />
      {/* Eye Highlight Glint */}
      <circle cx="37" cy="51" r="3" fill="#ffffff" />
      <circle cx="43" cy="59" r="1.5" fill="#ffffff" opacity="0.8" />

      {/* Right Expressive Robotic Eye */}
      <rect x="70" y="46" width="18" height="22" rx="9" fill="url(#tp_eye_grad)" filter="url(#tp_glow)" />
      {/* Eye Highlight Glint */}
      <circle cx="75" cy="51" r="3" fill="#ffffff" />
      <circle cx="81" cy="59" r="1.5" fill="#ffffff" opacity="0.8" />

      {/* Cute Digital Smile / Path Trace */}
      <path
        d="M52 74 Q60 80 68 74"
        stroke="#38bdf8"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Cute Rosy Cyber Cheek Dots */}
      <circle cx="26" cy="62" r="2.5" fill="#f43f5e" opacity="0.75" />
      <circle cx="94" cy="62" r="2.5" fill="#f43f5e" opacity="0.75" />
    </svg>
  );
};

export const TechPathIcon = TechPathMascot;

export const TechPathLogo: React.FC<TechPathLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 26, text: 'text-lg', gap: 'gap-2' },
    md: { icon: 34, text: 'text-xl', gap: 'gap-2.5' },
    lg: { icon: 44, text: 'text-2xl', gap: 'gap-3' },
    xl: { icon: 56, text: 'text-4xl', gap: 'gap-3.5' },
  };

  const { icon, text, gap } = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${gap} ${className} select-none group`}>
      <TechPathMascot size={icon} />
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-black tracking-tight gradient-text ${text} transition-all duration-300 group-hover:brightness-110`}>
            TechPath
          </span>
        </div>
      )}
    </div>
  );
};
