import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

interface QuickAction {
  id: string;
  icon: string;
  label: string;
  shortcut?: string;
  action: () => void;
  category: 'navigation' | 'content' | 'tools';
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

export function QuickActions({ actions, className }: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 监听键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredActions = actions.filter(action =>
    action.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedActions = filteredActions.reduce((groups, action) => {
    if (!groups[action.category]) {
      groups[action.category] = [];
    }
    groups[action.category].push(action);
    return groups;
  }, {} as Record<string, QuickAction[]>);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-4 right-4 z-30 p-3 rounded-full',
          'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800',
          'hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors',
          'shadow-lg hover:shadow-xl',
          className
        )}
        title="快速操作 (⌘K)"
      >
        <span className="text-lg">⚡</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* 搜索框 */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索功能..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </div>
          </div>
          <div className="flex gap-2 mt-2 text-xs text-slate-500">
            <span>↑↓ 选择</span>
            <span>↵ 执行</span>
            <span>Esc 关闭</span>
          </div>
        </div>

        {/* 操作列表 */}
        <div className="max-h-96 overflow-y-auto">
          {Object.entries(groupedActions).map(([category, categoryActions]) => (
            <div key={category} className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
                {category === 'navigation' ? '导航' :
                 category === 'content' ? '内容' : '工具'}
              </div>
              {categoryActions.map((action, index) => (
                <button
                  key={action.id}
                  onClick={() => {
                    action.action();
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
                >
                  <span className="text-lg">{action.icon}</span>
                  <span className="flex-1">{action.label}</span>
                  {action.shortcut && (
                    <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded text-xs">
                      {action.shortcut}
                    </kbd>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="p-3 bg-slate-50 dark:bg-slate-700 text-center text-xs text-slate-500">
          按 <kbd className="px-1 py-0.5 bg-white dark:bg-slate-600 rounded text-xs">⌘K</kbd> 快速打开
        </div>
      </div>
    </div>
  );
}
