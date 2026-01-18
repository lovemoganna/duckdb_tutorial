import { cn } from '../utils/cn';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon = '📭',
  title,
  description,
  action,
  className,
  compact = false
}: EmptyStateProps) {
  const containerClasses = compact
    ? 'py-8 px-4 text-center'
    : 'min-h-[300px] flex items-center justify-center p-8';

  return (
    <div className={cn(containerClasses, className)}>
      <div className="max-w-sm w-full text-center">
        <div className={cn(
          'mb-4',
          compact ? 'text-3xl' : 'text-5xl'
        )}>
          {icon}
        </div>

        <h3 className={cn(
          'font-bold text-slate-800 dark:text-slate-200 mb-2',
          compact ? 'text-lg' : 'text-xl'
        )}>
          {title}
        </h3>

        {description && (
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            {description}
          </p>
        )}

        {action && (
          <button
            onClick={action.onClick}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              action.variant === 'primary'
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
            )}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

// 预定义的空状态组件
export function NoSearchResults({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <EmptyState
      icon="🔍"
      title="未找到相关内容"
      description={`没有找到包含"${query}"的结果。尝试调整关键词或浏览其他章节。`}
      action={{
        label: '清除搜索',
        onClick: onClear,
        variant: 'secondary'
      }}
    />
  );
}

export function NoNotes({ sectionId }: { sectionId: string }) {
  return (
    <EmptyState
      icon="📝"
      title="暂无笔记"
      description="你可以在学习过程中添加笔记，帮助记忆重要概念。"
      compact={true}
    />
  );
}

export function NoBookmarks() {
  return (
    <EmptyState
      icon="🔖"
      title="暂无收藏"
      description="点击章节标题旁的书签图标来收藏重要的内容。"
      compact={true}
    />
  );
}

export function NoProgress() {
  return (
    <EmptyState
      icon="🎯"
      title="开始你的学习之旅"
      description="选择左侧的章节开始学习，完成章节后会自动记录你的学习进度。"
    />
  );
}

export function SectionNotFound({ sectionId }: { sectionId: string }) {
  return (
    <EmptyState
      icon="❓"
      title="章节未找到"
      description={`章节 "${sectionId}" 不存在或已被移除。`}
      action={{
        label: '返回首页',
        onClick: () => window.location.hash = '',
        variant: 'primary'
      }}
    />
  );
}
