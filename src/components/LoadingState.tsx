import { cn } from '../utils/cn';

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingState({
  size = 'md',
  text = '加载中...',
  fullScreen = false,
  className
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center'
    : 'flex flex-col items-center justify-center p-8';

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center gap-4">
        {/* 旋转的鸭子图标 */}
        <div className="relative">
          <div className={cn(
            'animate-spin text-blue-500',
            sizeClasses[size]
          )}>
            🦆
          </div>
          <div className={cn(
            'absolute inset-0 animate-ping text-blue-300 opacity-20',
            sizeClasses[size]
          )}>
            🦆
          </div>
        </div>

        {text && (
          <p className={cn(
            'text-slate-600 dark:text-slate-400 font-medium',
            textSizeClasses[size]
          )}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

// 骨架屏加载状态
export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="space-y-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
        <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
      </div>
    </div>
  );
}

// 内联加载状态（用于按钮等）
export function InlineLoader({ size = 'sm', className }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={cn(
      'animate-spin text-slate-500',
      sizeClasses[size],
      className
    )}>
      ⟳
    </div>
  );
}

// 进度条加载状态
interface ProgressLoaderProps {
  progress: number; // 0-100
  text?: string;
  className?: string;
}

export function ProgressLoader({ progress, text, className }: ProgressLoaderProps) {
  return (
    <div className={cn('w-full max-w-md', className)}>
      {text && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">{text}</span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{progress}%</span>
        </div>
      )}
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
