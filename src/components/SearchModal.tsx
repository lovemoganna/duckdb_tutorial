import { useEffect, useRef, useState } from 'react';
import { cn } from '../utils/cn';
import { Badge } from './DesignSystem';

export interface SearchResult {
  sectionId: string;
  title: string;
  moduleTitle: string;
  icon: string;
  matchType: 'title' | 'content' | 'tags';
  relevance: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  excerpt: string;
}

export interface SearchFilters {
  level?: 'beginner' | 'intermediate' | 'advanced';
  module?: string;
  type?: 'tutorial' | 'reference' | 'example';
}

interface SearchModalProps {
  isOpen: boolean;
  query: string;
  results: SearchResult[];
  suggestions: string[];
  history: { query: string; timestamp: number; resultCount: number }[];
  filters: SearchFilters;
  selectedIndex: number;
  onQueryChange: (query: string) => void;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  onSuggestionSelect: (suggestion: string) => void;
  onHistorySelect: (historyQuery: string) => void;
  onFilterChange: (filters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
  onClearHistory: () => void;
}

export function SearchModal({
  isOpen,
  query,
  results,
  suggestions,
  history,
  filters,
  selectedIndex,
  onQueryChange,
  onClose,
  onNavigate,
  onSuggestionSelect,
  onHistorySelect,
  onFilterChange,
  onClearFilters,
  onClearHistory,
}: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showFilters, setShowFilters] = useState(false);

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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'title': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'tags': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'content': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
        onClick={onClose}
      />
      <div className="fixed top-[8%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[201] px-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-slideDown">
          {/* 搜索输入区域 */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => onQueryChange(e.target.value)}
                placeholder="搜索教程内容、概念、函数..."
                className="flex-1 bg-transparent outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 text-lg"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  showFilters
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400'
                )}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 rounded">
                ESC
              </kbd>
            </div>

            {/* 过滤器 */}
            {showFilters && (
              <div className="flex flex-wrap gap-2 mb-3 animate-fadeIn">
                <select
                  value={filters.level || ''}
                  onChange={e => onFilterChange({ level: e.target.value as any || undefined })}
                  className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 rounded-lg border-0"
                >
                  <option value="">所有难度</option>
                  <option value="beginner">初级</option>
                  <option value="intermediate">中级</option>
                  <option value="advanced">高级</option>
                </select>
                <button
                  onClick={onClearFilters}
                  className="px-3 py-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  清除筛选
                </button>
              </div>
            )}
          </div>

          {/* 内容区域 */}
          <div className="max-h-96 overflow-y-auto">
            {query.trim() === '' ? (
              /* 空状态 - 显示建议和历史 */
              <div className="p-6">
                {suggestions.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">热门搜索</h4>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => onSuggestionSelect(suggestion)}
                          className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {history.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">搜索历史</h4>
                      <button
                        onClick={onClearHistory}
                        className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        清除历史
                      </button>
                    </div>
                    <div className="space-y-1">
                      {history.slice(0, 5).map((item, index) => (
                        <button
                          key={index}
                          onClick={() => onHistorySelect(item.query)}
                          className="w-full flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
                        >
                          <span className="text-sm text-slate-600 dark:text-slate-400">{item.query}</span>
                          <span className="text-xs text-slate-400">{item.resultCount} 结果</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {suggestions.length === 0 && history.length === 0 && (
                  <div className="text-center text-slate-400 py-8">
                    <p className="text-sm">输入关键词开始搜索</p>
                    <p className="text-xs mt-2">支持搜索：章节名称、SQL概念、函数名等</p>
                  </div>
                )}
              </div>
            ) : results.length === 0 ? (
              /* 无结果 */
              <div className="p-8 text-center text-slate-400">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-sm font-medium">未找到相关内容</p>
                <p className="text-xs mt-2">尝试调整关键词或清除筛选条件</p>
                {Object.keys(filters).length > 0 && (
                  <button
                    onClick={onClearFilters}
                    className="mt-3 px-3 py-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors"
                  >
                    清除筛选
                  </button>
                )}
              </div>
            ) : (
              /* 搜索结果 */
              <ul className="py-2">
                {results.map((result, index) => (
                  <li key={result.sectionId}>
                    <button
                      onClick={() => {
                        onNavigate(result.sectionId);
                        onClose();
                      }}
                      className={cn(
                        'w-full flex items-start gap-3 px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition-colors',
                        index === selectedIndex && 'bg-blue-50 dark:bg-blue-900/30'
                      )}
                    >
                      <span className="text-2xl flex-shrink-0 mt-1">{result.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                            {result.title}
                          </div>
                          <Badge variant="default" size="sm" className={getLevelColor(result.level)}>
                            {result.level === 'beginner' ? '初级' :
                             result.level === 'intermediate' ? '中级' : '高级'}
                          </Badge>
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded',
                            getMatchTypeColor(result.matchType)
                          )}>
                            {result.matchType === 'title' ? '标题' :
                             result.matchType === 'tags' ? '标签' : '内容'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mb-2 truncate">
                          {result.moduleTitle}
                        </div>
                        {result.excerpt && (
                          <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {result.excerpt}
                          </div>
                        )}
                        {result.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {result.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {result.tags.length > 3 && (
                              <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded">
                                +{result.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-slate-400">
                          {Math.round(result.relevance)} 分
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 底部提示 */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-400 flex justify-between">
            <span>↑↓ 选择 • ↵ 打开</span>
            <span>ESC 关闭 • {results.length > 0 && `${results.length} 结果`}</span>
          </div>
        </div>
      </div>
    </>
  );
}
