import { useState } from 'react';
import { cn } from '../utils/cn';

interface CodeCopyProps {
  code: string;
  className?: string;
  showCopyButton?: boolean;
  maxHeight?: string;
}

export function CodeCopy({
  code,
  className,
  showCopyButton = true,
  maxHeight = '400px'
}: CodeCopyProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // 降级方案：使用 document.execCommand
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Failed to copy code:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className={cn('relative group', className)}>
      <pre
        className={cn(
          'bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto font-mono text-sm',
          'border border-slate-700',
          maxHeight && `max-h-[${maxHeight}] overflow-y-auto`
        )}
        style={{ maxHeight }}
      >
        <code>{code}</code>
      </pre>

      {showCopyButton && (
        <button
          onClick={copyToClipboard}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-md transition-all duration-200',
            'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white',
            'opacity-0 group-hover:opacity-100 focus:opacity-100',
            'shadow-lg hover:shadow-xl'
          )}
          title={copied ? '已复制！' : '复制代码'}
        >
          {copied ? (
            <span className="text-green-400">✓</span>
          ) : (
            <span>📋</span>
          )}
        </button>
      )}
    </div>
  );
}

// 增强版的代码块组件，集成复制功能
interface EnhancedCodeBlockProps {
  title?: string;
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
  className?: string;
}

export function EnhancedCodeBlock({
  title,
  code,
  language = 'sql',
  showLineNumbers = false,
  maxHeight,
  className
}: EnhancedCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const lines = code.split('\n');

  return (
    <div className={cn('bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden', className)}>
      {/* 标题栏 */}
      {title && (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</span>
            <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs">
              {language.toUpperCase()}
            </span>
          </div>
          <button
            onClick={copyToClipboard}
            className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            title={copied ? '已复制！' : '复制代码'}
          >
            {copied ? (
              <span className="text-green-500">✓</span>
            ) : (
              <span className="text-lg">📋</span>
            )}
          </button>
        </div>
      )}

      {/* 代码内容 */}
      <div className="relative">
        <pre
          className={cn(
            'text-sm font-mono leading-relaxed overflow-x-auto p-4',
            'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200',
            maxHeight && `max-h-[${maxHeight}] overflow-y-auto`
          )}
          style={{ maxHeight }}
        >
          <code>
            {showLineNumbers ? (
              lines.map((line, index) => (
                <div key={index} className="flex">
                  <span className="inline-block w-8 text-right text-slate-400 select-none mr-4">
                    {index + 1}
                  </span>
                  <span>{line}</span>
                </div>
              ))
            ) : (
              code
            )}
          </code>
        </pre>

        {/* 复制按钮（如果没有标题栏） */}
        {!title && (
          <button
            onClick={copyToClipboard}
            className="absolute top-3 right-3 p-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors opacity-0 hover:opacity-100 focus:opacity-100 shadow-lg"
            title={copied ? '已复制！' : '复制代码'}
          >
            {copied ? '✓' : '📋'}
          </button>
        )}
      </div>
    </div>
  );
}
