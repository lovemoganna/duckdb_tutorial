import { useEffect, useRef } from 'react';
import { cn } from '../utils/cn';

interface SearchResult {
  sectionId: string;
  title: string;
  moduleTitle: string;
  icon: string;
  matchType: 'title' | 'content';
}

interface SearchModalProps {
  isOpen: boolean;
  query: string;
  results: SearchResult[];
  onQueryChange: (query: string) => void;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

export function SearchModal({
  isOpen,
  query,
  results,
  onQueryChange,
  onClose,
  onNavigate,
}: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
        onClick={onClose}
      />
      <div className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[201] px-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
          {/* 搜索输入 */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => onQueryChange(e.target.value)}
              placeholder="搜索教程内容..."
              className="flex-1 bg-transparent outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 rounded">
              ESC
            </kbd>
          </div>

          {/* 搜索结果 */}
          <div className="max-h-80 overflow-y-auto">
            {query.trim() === '' ? (
              <div className="p-8 text-center text-slate-400">
                <p className="text-sm">输入关键词搜索章节</p>
                <p className="text-xs mt-2">支持搜索：章节名称、SQL关键词等</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <p className="text-sm">未找到相关内容</p>
                <p className="text-xs mt-2">尝试其他关键词</p>
              </div>
            ) : (
              <ul className="py-2">
                {results.map(result => (
                  <li key={result.sectionId}>
                    <button
                      onClick={() => {
                        onNavigate(result.sectionId);
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition-colors"
                    >
                      <span className="text-xl flex-shrink-0">{result.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                          {result.title}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {result.moduleTitle}
                        </div>
                      </div>
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded',
                        result.matchType === 'title'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      )}>
                        {result.matchType === 'title' ? '标题' : '内容'}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 快捷键提示 */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-400 flex justify-between">
            <span>↑↓ 选择</span>
            <span>↵ 打开</span>
            <span>ESC 关闭</span>
          </div>
        </div>
      </div>
    </>
  );
}
