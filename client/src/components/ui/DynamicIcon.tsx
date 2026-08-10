import React from 'react';
import {
  Globe,
  Shield,
  Cloud,
  Database,
  Brain,
  Code,
  Code2,
  Cpu,
  Layers,
  Terminal,
  Server,
  Lock,
  Flame,
  Sparkles,
  Boxes,
  BookOpen,
  HelpCircle,
  Workflow,
  Network,
  Monitor,
  Smartphone,
  Key,
  GitBranch,
  FolderGit2,
  Package,
  Wrench,
  Activity,
  HardDrive,
  Radio,
  Wifi,
  FileCode,
  FileText,
  Binary,
  Bot,
  Zap,
  Gauge,
  Box,
  Folder,
  Compass,
  Laptop,
  CheckCircle,
  Layout,
  TerminalSquare,
} from 'lucide-react';

export interface DynamicIconProps {
  name?: string | null;
  className?: string;
  size?: number | string;
  fallback?: string;
}

// Normalized map of popular lucide icon names
const lucideIconMap: Record<string, React.ElementType> = {
  globe: Globe,
  web: Globe,
  website: Globe,
  shield: Shield,
  security: Shield,
  cybersecurity: Shield,
  cloud: Cloud,
  aws: Cloud,
  azure: Cloud,
  gcp: Cloud,
  database: Database,
  databases: Database,
  db: Database,
  sql: Database,
  brain: Brain,
  ai: Brain,
  ml: Brain,
  'machine-learning': Brain,
  'artificial-intelligence': Brain,
  code: Code,
  code2: Code2,
  coding: Code2,
  programming: Code2,
  cpu: Cpu,
  hardware: Cpu,
  layers: Layers,
  domain: Layers,
  architecture: Layers,
  terminal: Terminal,
  cli: Terminal,
  bash: Terminal,
  shell: Terminal,
  server: Server,
  backend: Server,
  devops: Server,
  infrastructure: Server,
  lock: Lock,
  auth: Lock,
  flame: Flame,
  sparkles: Sparkles,
  boxes: Boxes,
  containers: Boxes,
  docker: Boxes,
  kubernetes: Boxes,
  k8s: Boxes,
  bookopen: BookOpen,
  book: BookOpen,
  course: BookOpen,
  helpcircle: HelpCircle,
  quiz: HelpCircle,
  assessment: HelpCircle,
  workflow: Workflow,
  pipeline: Workflow,
  ci: Workflow,
  cd: Workflow,
  network: Network,
  networking: Network,
  monitor: Monitor,
  frontend: Monitor,
  smartphone: Smartphone,
  mobile: Smartphone,
  android: Smartphone,
  ios: Smartphone,
  key: Key,
  gitbranch: GitBranch,
  git: GitBranch,
  foldergit2: FolderGit2,
  package: Package,
  npm: Package,
  wrench: Wrench,
  tools: Wrench,
  activity: Activity,
  monitoring: Activity,
  harddrive: HardDrive,
  storage: HardDrive,
  radio: Radio,
  wifi: Wifi,
  filecode: FileCode,
  filetext: FileText,
  binary: Binary,
  bot: Bot,
  zap: Zap,
  gauge: Gauge,
  box: Box,
  folder: Folder,
  compass: Compass,
  laptop: Laptop,
  checkcircle: CheckCircle,
  layout: Layout,
  terminalsquare: TerminalSquare,
};

// Popular tech brand SVGs as custom inline vector icons
const techSvgMap: Record<string, (props: { size?: number | string; className?: string }) => React.ReactElement> = {
  react: ({ size = 20, className = '' }) => (
    <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" fill="none" className={className}>
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  ),
  typescript: ({ size = 20, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
      <rect width="128" height="128" rx="24" fill="#3178C6" />
      <path d="M72.2 46.2H20v14.4h20.8v47.2H55V60.6h20.8V46.2zm14.6 44.5c4 2.8 9.3 4.6 14.8 4.6 6 0 9-2.5 9-6.3 0-4-3.5-5.9-10.7-9-10.3-4.4-16.8-10.1-16.8-19.7 0-10.8 8.6-18.4 22.3-18.4 6.7 0 12.8 1.9 17.1 4.8l-4.1 11.8c-3.6-2.3-8.2-3.8-13-3.8-5.3 0-8.2 2.3-8.2 5.6 0 3.7 3.3 5.4 10.5 8.5 11 4.7 17.2 10.3 17.2 20.3 0 11.7-9.1 19.3-23.7 19.3-7.5 0-14.7-2.3-19.4-5.6l5-12.1z" fill="#ffffff" />
    </svg>
  ),
  python: ({ size = 20, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
      <path d="M63.6 8.5c-27.4 0-25.7 11.9-25.7 11.9l.03 12.3h26.2v3.7H27.5c-19 0-22.3 12.8-22.3 25.8 0 15 13.1 24.8 24.8 24.8h6.4v-9.1c0-13.4 11.3-24.8 24.8-24.8h25.8V39.2c0-14.6-12.7-30.7-23.4-30.7zm-14 7.9a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4z" fill="#3776AB" />
      <path d="M64.4 119.5c27.4 0 25.7-11.9 25.7-11.9l-.03-12.3H63.9v-3.7h36.6c19 0 22.3-12.8 22.3-25.8 0-15-13.1-24.8-24.8-24.8h-6.4v9.1c0 13.4-11.3 24.8-24.8 24.8H41v13.7c0 14.6 12.7 30.7 23.4 30.7zm14-7.9a4.2 4.2 0 1 1 0-8.4 4.2 4.2 0 0 1 0 8.4z" fill="#FFD438" />
    </svg>
  ),
  docker: ({ size = 20, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
      <path d="M124.6 57.3c-2.4-1.8-7.7-1.4-11.8.3-1.6-9.6-8.7-14.9-8.7-14.9s-4.6 4.7-2.3 14.6c-4.4 2.5-9.3 2.6-13.8 2.3-1.8-6.1-6.1-9.9-12.2-11.5L74 47.9h-8.7V39h-9V29.8h-9V39h-9v8.9h-9.2v9h-9.2v8.9h45.6c1.1 0 2.2.1 3.2.3 3.3.6 6.3 1.9 8.8 3.9 6.8 5.4 9.1 14.2 6.5 22.5-3.3 10.7-13.9 17.5-24.7 17.5-25.3 0-48.4-13.7-60.3-35.7C17.5 106.8 45.4 120 74.9 120c38.7 0 62.4-23.7 62.4-53.7 0-3.3-.6-6.4-1.7-9.3-3.2 1.3-7.5 2.1-11 0.3z" fill="#2496ED" />
      <rect x="47.3" y="39" width="8" height="7.9" fill="#2496ED" />
      <rect x="38.1" y="39" width="8.2" height="7.9" fill="#2496ED" />
      <rect x="28.9" y="39" width="8.2" height="7.9" fill="#2496ED" />
      <rect x="47.3" y="47.9" width="8" height="7.9" fill="#2496ED" />
      <rect x="38.1" y="47.9" width="8.2" height="7.9" fill="#2496ED" />
      <rect x="28.9" y="47.9" width="8.2" height="7.9" fill="#2496ED" />
      <rect x="56.5" y="47.9" width="8" height="7.9" fill="#2496ED" />
    </svg>
  ),
  kubernetes: ({ size = 20, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
      <path d="M64 4L11.5 34.3v60.7L64 125.3l52.5-30.3V34.3L64 4z" fill="#326CE5" />
      <path d="M64 19.3L24.8 42v45.3L64 109.9l39.2-22.6V42L64 19.3z" fill="#ffffff" />
      <path d="M64 28.5l-26 15v30l26 15 26-15v-30l-26-15z" fill="#326CE5" />
    </svg>
  ),
};

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  className = 'w-5 h-5',
  size,
  fallback = 'Layers',
}) => {
  if (!name && !fallback) return null;

  const raw = (name || fallback || '').trim();

  // 1. If it is an image URL (http, https, data:, /)
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:') || raw.startsWith('/')) {
    return (
      <img
        src={raw}
        alt="icon"
        className={`object-contain flex-shrink-0 ${className}`}
        style={size ? { width: size, height: size } : undefined}
        onError={(e) => {
          // Fallback to layers icon if image fails
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  const normalized = raw.toLowerCase().replace(/[\s\-_]/g, '');

  // 2. Custom Brand SVG Icon match
  if (techSvgMap[normalized]) {
    const BrandSvg = techSvgMap[normalized];
    return <BrandSvg size={size} className={className} />;
  }

  // 3. Lucide Icon match
  const IconComponent = lucideIconMap[normalized] || lucideIconMap[fallback.toLowerCase().replace(/[\s\-_]/g, '')] || Layers;

  return <IconComponent className={className} style={size ? { width: size, height: size } : undefined} />;
};
