import React from 'react';
import {
  Heading,
  AlignLeft,
  Code,
  Image,
  Video,
  Lightbulb,
  AlertTriangle,
  FileText,
  Bookmark,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import type { ContentBlockType } from '../../types';

interface BlockTypeOption {
  type: ContentBlockType;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const blockOptions: BlockTypeOption[] = [
  {
    type: 'heading',
    label: 'Heading',
    description: 'Section header (H1 - H6)',
    icon: Heading,
    color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  },
  {
    type: 'text',
    label: 'Text / Markdown',
    description: 'Rich explanatory paragraphs & lists',
    icon: AlignLeft,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    type: 'code',
    label: 'Code Snippet',
    description: 'Multi-language formatted code block',
    icon: Code,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    type: 'example',
    label: 'Practical Example',
    description: 'Real-world technical scenario & walkthrough',
    icon: Bookmark,
    color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  },
  {
    type: 'tip',
    label: 'Pro Tip',
    description: 'Helpful guidance or best practices',
    icon: Lightbulb,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    type: 'warning',
    label: 'Warning Callout',
    description: 'Critical gotchas or security notes',
    icon: AlertTriangle,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
  {
    type: 'note',
    label: 'Info Note',
    description: 'Contextual reference or remark',
    icon: FileText,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    type: 'image',
    label: 'Image / Diagram',
    description: 'Visual architecture or screenshot',
    icon: Image,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  {
    type: 'video',
    label: 'Video Demonstration',
    description: 'YouTube, Vimeo, or MP4 embed',
    icon: Video,
    color: 'text-red-400 bg-red-500/10 border-red-500/20',
  },
  {
    type: 'exercise',
    label: 'Interactive Exercise',
    description: 'Hands-on check (multiple-choice, scenario, code)',
    icon: HelpCircle,
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  },
  {
    type: 'assessment',
    label: 'Quiz / Assessment',
    description: 'Graded questions with passing score',
    icon: CheckCircle2,
    color: 'text-green-400 bg-green-500/10 border-green-500/20',
  },
];

interface BlockTypePickerProps {
  onSelect: (type: ContentBlockType) => void;
  onClose?: () => void;
}

export const BlockTypePicker: React.FC<BlockTypePickerProps> = ({ onSelect, onClose }) => {
  return (
    <div className="p-4 rounded-2xl bg-surface-900 border border-surface-800 shadow-2xl space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-surface-800 text-xs font-semibold uppercase tracking-wider text-surface-400">
        <span>Select Content Block Type</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {blockOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.type}
              type="button"
              onClick={() => {
                onSelect(opt.type);
                if (onClose) onClose();
              }}
              className="flex items-start gap-3 p-3 rounded-xl bg-surface-950/60 hover:bg-surface-800/80 border border-surface-800 hover:border-surface-700 text-left transition-all group"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 ${opt.color} group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-primary-400 transition-colors">
                  {opt.label}
                </div>
                <div className="text-[11px] text-surface-400 mt-0.5 line-clamp-2">
                  {opt.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
