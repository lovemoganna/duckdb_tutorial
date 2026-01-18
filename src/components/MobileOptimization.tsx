import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';
import { OntologicalButton } from './DesignSystem';

interface MobileNavigationProps {
  currentSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenSearch: () => void;
  onOpenLearningPath: () => void;
  onOpenSettings: () => void;
  className?: string;
}

export function MobileNavigation({
  currentSection,
  onNavigate,
  onOpenSearch,
  onOpenLearningPath,
  onOpenSettings,
  className
}: MobileNavigationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 自动隐藏/显示导航栏
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 向下滚动时隐藏
        setIsVisible(false);
      } else {
        // 向上滚动时显示
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    {
      id: 'home',
      label: '首页',
      icon: '🏠',
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    {
      id: 'search',
      label: '搜索',
      icon: '🔍',
      action: onOpenSearch
    },
    {
      id: 'learning',
      label: '学习',
      icon: '🎓',
      action: onOpenLearningPath
    },
    {
      id: 'settings',
      label: '设置',
      icon: '⚙️',
      action: onOpenSettings
    }
  ];

  return (
    <nav
      className={cn(
        'nav-mobile grid grid-cols-4 gap-1 px-4 safe-area-bottom transition-transform duration-300',
        isVisible ? 'translate-y-0' : 'translate-y-full',
        className
      )}
    >
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={item.action}
          className="btn-mobile flex flex-col items-center justify-center py-2 px-1 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors rounded-lg active:bg-slate-100 dark:active:bg-slate-800"
        >
          <span className="text-lg mb-1">{item.icon}</span>
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileSidebar({ isOpen, onClose, children }: MobileSidebarProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* 背景遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* 侧边栏 */}
      <div
        className={cn(
          'sidebar-mobile transition-transform duration-300',
          isOpen && 'open'
        )}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              菜单
            </h2>
            <OntologicalButton
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              ✕
            </OntologicalButton>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}

interface MobileSearchProps {
  isOpen: boolean;
  query: string;
  results: any[];
  suggestions: string[];
  onQueryChange: (query: string) => void;
  onSuggestionSelect: (suggestion: string) => void;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

export function MobileSearch({
  isOpen,
  query,
  results,
  suggestions,
  onQueryChange,
  onSuggestionSelect,
  onClose,
  onNavigate
}: MobileSearchProps) {
  if (!isOpen) return null;

  return (
    <div className="search-mobile">
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="搜索教程内容..."
          className="input-mobile flex-1 bg-transparent outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400"
          autoFocus
        />

        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 搜索结果 */}
      {(query.trim() || suggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 max-h-80 overflow-y-auto">
          {query.trim() === '' ? (
            /* 建议 */
            <div className="p-4">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                热门搜索
              </h4>
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
          ) : results.length > 0 ? (
            /* 搜索结果 */
            <div className="py-2">
              {results.slice(0, 5).map(result => (
                <button
                  key={result.sectionId}
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
                </button>
              ))}
            </div>
          ) : (
            /* 无结果 */
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm">未找到相关内容</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface MobileLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  navigation: React.ReactNode;
  search: React.ReactNode;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function MobileLayout({
  sidebar,
  main,
  navigation,
  search,
  isSidebarOpen,
  onToggleSidebar
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* 移动端搜索 */}
      {search}

      {/* 主内容区域 */}
      <div className="pb-20">
        {/* 移动端顶部栏 */}
        <div className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              🦆 DuckDB 教程
            </h1>

            <div className="w-10" /> {/* 占位符保持居中 */}
          </div>
        </div>

        {/* 主内容 */}
        <main className="container-mobile">
          {main}
        </main>
      </div>

      {/* 移动端侧边栏 */}
      <MobileSidebar isOpen={isSidebarOpen} onClose={onToggleSidebar}>
        {sidebar}
      </MobileSidebar>

      {/* 移动端导航 */}
      {navigation}
    </div>
  );
}

// 响应式工具组件
export function ResponsiveContainer({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('container-mobile', className)}>
      {children}
    </div>
  );
}

export function ResponsiveGrid({
  children,
  columns = { default: 1, tablet: 2, desktop: 3 },
  className
}: {
  children: React.ReactNode;
  columns?: { default?: number; tablet?: number; desktop?: number };
  className?: string;
}) {
  const gridClasses = cn(
    'grid gap-4',
    columns.default && `grid-cols-${columns.default}`,
    columns.tablet && `md:grid-cols-${columns.tablet}`,
    columns.desktop && `lg:grid-cols-${columns.desktop}`,
    className
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}

export function ResponsiveText({
  children,
  size = { default: 'base', tablet: 'base', desktop: 'lg' },
  className
}: {
  children: React.ReactNode;
  size?: { default?: string; tablet?: string; desktop?: string };
  className?: string;
}) {
  const sizeClasses = cn(
    size.default && `text-${size.default}`,
    size.tablet && `md:text-${size.tablet}`,
    size.desktop && `lg:text-${size.desktop}`,
    className
  );

  return (
    <div className={sizeClasses}>
      {children}
    </div>
  );
}

// 触摸友好的交互组件
export function TouchButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'btn-mobile touch-manipulation select-none transition-colors',
        {
          'bg-amber-500 hover:bg-amber-600 text-white': variant === 'primary',
          'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300': variant === 'secondary',
          'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400': variant === 'ghost',
          'opacity-50 cursor-not-allowed': disabled
        },
        className
      )}
    >
      {children}
    </button>
  );
}

// 移动端优化的模态框
export function MobileModal({
  isOpen,
  onClose,
  children,
  title,
  fullScreen = false
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  fullScreen?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 rounded-t-2xl z-50 transition-transform duration-300',
          fullScreen ? 'top-0 rounded-none' : 'max-h-[90vh]',
          'modal-mobile-full animate-slideUp'
        )}
      >
        {/* 拖拽手柄 */}
        {!fullScreen && (
          <div className="flex justify-center py-3">
            <div className="w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
          </div>
        )}

        {/* 标题栏 */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {title}
            </h2>
            <OntologicalButton
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              ✕
            </OntologicalButton>
          </div>
        )}

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}
