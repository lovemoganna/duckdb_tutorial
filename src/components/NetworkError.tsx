import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

interface NetworkErrorProps {
  error?: Error;
  onRetry?: () => void;
  className?: string;
}

export function NetworkError({ error, onRetry, className }: NetworkErrorProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    onRetry?.();
  };

  if (!isOnline) {
    return (
      <div className={cn(
        'flex items-center justify-center p-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg',
        className
      )}>
        <div className="text-center space-y-4">
          <div className="text-4xl">📶</div>
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-200">网络连接已断开</h3>
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
              请检查网络连接后重试
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm"
          >
            刷新页面
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg',
      className
    )}>
      <div className="text-center space-y-4">
        <div className="text-4xl">🔌</div>
        <div>
          <h3 className="font-semibold text-red-800 dark:text-red-200">加载失败</h3>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {error?.message || '网络请求失败，请稍后重试'}
          </p>
          {retryCount > 0 && (
            <p className="text-xs text-red-500 dark:text-red-300 mt-1">
              已重试 {retryCount} 次
            </p>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
          >
            🔄 重试
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-sm"
          >
            刷新页面
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for handling network requests with error handling
export function useNetworkRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async <T,>(
    requestFn: () => Promise<T>,
    options: {
      retries?: number;
      retryDelay?: number;
      onSuccess?: (data: T) => void;
      onError?: (error: Error) => void;
    } = {}
  ): Promise<T | null> => {
    const { retries = 3, retryDelay = 1000, onSuccess, onError } = options;

    setLoading(true);
    setError(null);

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await requestFn();
        setLoading(false);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');

        if (attempt === retries) {
          setLoading(false);
          setError(error);
          onError?.(error);
          return null;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }

    return null;
  };

  const reset = () => {
    setLoading(false);
    setError(null);
  };

  return { loading, error, execute, reset };
}

// Service unavailable component
export function ServiceUnavailable({ serviceName, estimatedTime }: {
  serviceName: string;
  estimatedTime?: string;
}) {
  return (
    <div className="flex items-center justify-center p-8 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
      <div className="text-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <div>
          <h3 className="font-semibold text-orange-800 dark:text-orange-200">服务暂时不可用</h3>
          <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
            {serviceName} 当前无法访问
          </p>
          {estimatedTime && (
            <p className="text-xs text-orange-500 dark:text-orange-300 mt-2">
              预计恢复时间: {estimatedTime}
            </p>
          )}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
        >
          刷新页面
        </button>
      </div>
    </div>
  );
}
