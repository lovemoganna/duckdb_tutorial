import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

interface WelcomeBannerProps {
  completedCount: number;
  totalSections: number;
  onDismiss: () => void;
}

export function WelcomeBanner({ completedCount, totalSections, onDismiss }: WelcomeBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const hasDismissed = localStorage.getItem('welcome-banner-dismissed');
    if (hasDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('welcome-banner-dismissed', 'true');
    setTimeout(() => {
      setDismissed(true);
      onDismiss();
    }, 300);
  };

  if (dismissed) return null;

  const progress = Math.round((completedCount / totalSections) * 100);
  const isReturningUser = completedCount > 0;

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-2xl mb-6 transition-all duration-300',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      )}
    >
      {/* 背景动画 */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 dark:from-amber-600 dark:via-orange-600 dark:to-rose-600" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="relative p-6 md:p-8">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
          title="关闭"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* 左侧图标和文案 */}
          <div className="flex-shrink-0 text-center md:text-left">
            <div className="text-6xl mb-3">🦆</div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {isReturningUser ? '欢迎回来！' : '欢迎来到 DuckDB 教程！'}
            </h2>
            <p className="text-white/90 text-sm md:text-base max-w-xl">
              {isReturningUser 
                ? `你已完成 ${completedCount}/${totalSections} 章节 (${progress}%)，继续加油！`
                : '采用 Fast.ai 风格教学法，先动手实践，再深入理解。每个章节都支持添加笔记，帮助你更好地学习！'
              }
            </p>

            {/* 快速操作 */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <a
                href="https://shell.duckdb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-amber-600 rounded-full text-sm font-medium hover:bg-amber-50 transition-colors shadow-lg"
              >
                <span>🖥️</span>
                在线试用 DuckDB
              </a>
              <button
                onClick={handleDismiss}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
              >
                <span>📖</span>
                开始学习
              </button>
            </div>
          </div>

          {/* 右侧进度环（返回用户） */}
          {isReturningUser && (
            <div className="flex-shrink-0">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${progress * 2.51} 251`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{progress}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 学习建议标签 */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
          <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
            📝 边学边记笔记
          </span>
          <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
            ⌨️ 快捷键：← → 翻页
          </span>
          <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
            🔍 ⌘K 快速搜索
          </span>
          <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
            🌙 支持暗色模式
          </span>
        </div>
      </div>
    </div>
  );
}
