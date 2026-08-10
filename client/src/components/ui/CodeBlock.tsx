import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'text',
  title,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-xl overflow-hidden border border-surface-200 ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-surface-800 border-b border-surface-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          {(title || language) && (
            <span className="text-xs text-surface-400 ml-2 font-mono">
              {title || language}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-surface-400 hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 bg-surface-900 overflow-x-auto">
        <code className="text-sm font-mono text-surface-100 leading-relaxed">{code}</code>
      </pre>
    </div>
  );
};
