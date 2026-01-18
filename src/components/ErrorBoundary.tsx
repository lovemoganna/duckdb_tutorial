import React from 'react';
import { cn } from '../utils/cn';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    // 这里可以添加错误上报逻辑
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.handleRetry} />;
      }

      return <ErrorFallback error={this.state.error} retry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  retry: () => void;
}

export function ErrorFallback({ error, retry }: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">💥</div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            出了点小问题
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            教程内容加载失败，但这不是你的错
          </p>
        </div>

        {error && (
          <details className="mb-6 text-left bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
            <summary className="cursor-pointer font-medium text-slate-700 dark:text-slate-300 mb-2">
              错误详情
            </summary>
            <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap">
              {error.message}
            </pre>
          </details>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={retry}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
          >
            🔄 重试
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
          >
            🔄 刷新页面
          </button>
        </div>
      </div>
    </div>
  );
}

// 简化的错误边界 Hook
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Error handled:', error, errorInfo);
    // 可以在这里添加错误上报
  };
}
