import React from 'react';
import {
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
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
import type { ContentBlock } from '../../types';

interface BlockEditorProps {
  block: ContentBlock;
  index: number;
  totalBlocks: number;
  onChange: (updated: ContentBlock) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const languageOptions = [
  'typescript',
  'javascript',
  'python',
  'go',
  'rust',
  'sql',
  'bash',
  'html',
  'css',
  'json',
  'yaml',
  'dockerfile',
  'java',
  'csharp',
  'cpp',
];

export const BlockEditor: React.FC<BlockEditorProps> = ({
  block,
  index,
  totalBlocks,
  onChange,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}) => {
  const getBlockIcon = () => {
    switch (block.type) {
      case 'heading':
        return <Heading className="w-4 h-4 text-sky-400" />;
      case 'text':
        return <AlignLeft className="w-4 h-4 text-indigo-400" />;
      case 'code':
        return <Code className="w-4 h-4 text-emerald-400" />;
      case 'example':
        return <Bookmark className="w-4 h-4 text-teal-400" />;
      case 'tip':
        return <Lightbulb className="w-4 h-4 text-amber-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'note':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'image':
        return <Image className="w-4 h-4 text-purple-400" />;
      case 'video':
        return <Video className="w-4 h-4 text-red-400" />;
      case 'exercise':
        return <HelpCircle className="w-4 h-4 text-orange-400" />;
      case 'assessment':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      default:
        return <FileText className="w-4 h-4 text-surface-400" />;
    }
  };

  return (
    <div className="bg-surface-900 border border-surface-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4 transition-all hover:border-surface-700">
      {/* Block Header & Action Toolbar */}
      <div className="flex items-center justify-between border-b border-surface-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-surface-950 border border-surface-800 flex items-center justify-center">
            {getBlockIcon()}
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-surface-300">
            Block {index + 1}: <span className="text-white">{block.type}</span>
          </span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            className="p-1.5 rounded-lg text-surface-400 hover:text-white disabled:opacity-20 hover:bg-surface-800 transition-colors"
            title="Move Block Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={index === totalBlocks - 1}
            onClick={onMoveDown}
            className="p-1.5 rounded-lg text-surface-400 hover:text-white disabled:opacity-20 hover:bg-surface-800 transition-colors"
            title="Move Block Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            className="p-1.5 rounded-lg text-surface-400 hover:text-primary-400 hover:bg-surface-800 transition-colors"
            title="Duplicate Block"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-lg text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete Block"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Block Specific Form Fields */}
      <div className="space-y-3">
        {/* HEADING BLOCK */}
        {block.type === 'heading' && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-surface-400 mb-1">
                Heading Level
              </label>
              <select
                value={block.level || 2}
                onChange={(e) => onChange({ ...block, level: parseInt(e.target.value, 10) })}
                className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value={1}>H1 (Main Title)</option>
                <option value={2}>H2 (Major Section)</option>
                <option value={3}>H3 (Subsection)</option>
                <option value={4}>H4 (Minor Header)</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-semibold uppercase text-surface-400 mb-1">
                Heading Text
              </label>
              <input
                type="text"
                value={block.content}
                onChange={(e) => onChange({ ...block, content: e.target.value })}
                placeholder="Enter section heading..."
                className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        {/* TEXT / MARKDOWN BLOCK */}
        {block.type === 'text' && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold uppercase text-surface-400">
                Text / Markdown Body
              </label>
              <span className="text-[10px] text-surface-500 font-mono">Supports GitHub Markdown</span>
            </div>
            <textarea
              rows={5}
              value={block.content}
              onChange={(e) => onChange({ ...block, content: e.target.value })}
              placeholder="Write explanatory paragraph, bullet points (**bold**, `inline code`, lists)..."
              className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-mono leading-relaxed"
            />
          </div>
        )}

        {/* CODE BLOCK */}
        {block.type === 'code' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-surface-400 mb-1">
                  Language
                </label>
                <select
                  value={block.language || 'typescript'}
                  onChange={(e) => onChange({ ...block, language: e.target.value })}
                  className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-mono"
                >
                  {languageOptions.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase text-surface-400 mb-1">
                  Code Block Title / File Name (Optional)
                </label>
                <input
                  type="text"
                  value={block.title || ''}
                  onChange={(e) => onChange({ ...block, title: e.target.value })}
                  placeholder="e.g. server.ts or Dockerfile"
                  className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-surface-400 mb-1">
                Code Snippet
              </label>
              <textarea
                rows={6}
                value={block.content}
                onChange={(e) => onChange({ ...block, content: e.target.value })}
                placeholder="// Enter executable code snippet..."
                className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3.5 py-2.5 text-xs text-emerald-300 font-mono focus:outline-none focus:ring-1 focus:ring-primary-500 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* CALLOUT BLOCKS (TIP, WARNING, NOTE, EXAMPLE) */}
        {['tip', 'warning', 'note', 'example'].includes(block.type) && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-surface-400 mb-1">
                Callout Title (Optional)
              </label>
              <input
                type="text"
                value={block.title || ''}
                onChange={(e) => onChange({ ...block, title: e.target.value })}
                placeholder={`e.g. Pro ${block.type.toUpperCase()}: Best Practice`}
                className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-surface-400 mb-1">
                Callout Content
              </label>
              <textarea
                rows={3}
                value={block.content}
                onChange={(e) => onChange({ ...block, content: e.target.value })}
                placeholder="Write message content here..."
                className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        {/* IMAGE BLOCK */}
        {block.type === 'image' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-surface-400 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={block.url || ''}
                  onChange={(e) => onChange({ ...block, url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase text-surface-400 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={block.alt || ''}
                  onChange={(e) => onChange({ ...block, alt: e.target.value })}
                  placeholder="Descriptive alt text for accessibility"
                  className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-surface-400 mb-1">
                Caption / Subtitle (Optional)
              </label>
              <input
                type="text"
                value={block.content}
                onChange={(e) => onChange({ ...block, content: e.target.value })}
                placeholder="Figure 1: Architectural diagram of the container pipeline..."
                className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        {/* VIDEO BLOCK */}
        {block.type === 'video' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-surface-400 mb-1">
                Video Embed URL (YouTube, Vimeo, or Direct MP4) *
              </label>
              <input
                type="url"
                value={block.url || ''}
                onChange={(e) => onChange({ ...block, url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-surface-400 mb-1">
                Video Title / Summary (Optional)
              </label>
              <input
                type="text"
                value={block.title || ''}
                onChange={(e) => onChange({ ...block, title: e.target.value })}
                placeholder="Demo: Live cluster provisioning..."
                className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        {/* EXERCISE / ASSESSMENT EMBED BLOCKS */}
        {(block.type === 'exercise' || block.type === 'assessment') && (
          <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-primary-300">
                Interactive {block.type === 'assessment' ? 'Quiz / Assessment' : 'Exercise'} Block
              </span>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-surface-400 mb-1">
                Prompt / Instructions
              </label>
              <textarea
                rows={2}
                value={block.content}
                onChange={(e) => onChange({ ...block, content: e.target.value })}
                placeholder="Complete the hands-on check below..."
                className="w-full bg-surface-900 border border-surface-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
