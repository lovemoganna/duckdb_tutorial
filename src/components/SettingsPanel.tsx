import { cn } from '../utils/cn';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onToggleDarkMode: () => void;
  onFontSizeChange: (size: 'small' | 'medium' | 'large') => void;
  completedCount: number;
  totalSections: number;
  totalTime: number;
  onResetProgress: () => void;
  // Toolbar actions
  onOpenPlayground: () => void;
  onOpenOntologyGraph: () => void;
  onOpenSQLCompare: () => void;
  onOpenQuiz: () => void;
  onOpenQuickRef: () => void;
  onOpenFlashcards: () => void;
  onOpenLearningPath: () => void;
  onOpenAchievements: () => void;
  onOpenGlossary: () => void;
  onOpenDashboard: () => void;
  onOpenProjectWorkspace: () => void;
  onOpenLearningAssistant: () => void;
  onOpenCodeReview: () => void;
}

export function SettingsPanel({
  isOpen,
  onClose,
  darkMode,
  fontSize,
  onToggleDarkMode,
  onFontSizeChange,
  completedCount,
  totalSections,
  totalTime,
  onResetProgress,
  onOpenPlayground,
  onOpenOntologyGraph,
  onOpenSQLCompare,
  onOpenQuiz,
  onOpenQuickRef,
  onOpenFlashcards,
  onOpenLearningPath,
  onOpenAchievements,
  onOpenGlossary,
  onOpenDashboard,
  onOpenProjectWorkspace,
  onOpenLearningAssistant,
  onOpenCodeReview,
}: SettingsPanelProps) {
  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    }
    return `${minutes}分钟`;
  };

  const progressPercent = totalSections > 0 
    ? Math.round((completedCount / totalSections) * 100) 
    : 0;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[150]"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-800 shadow-2xl z-[151] flex flex-col">
        {/* 头部 */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span>⚙️</span>
            设置与统计
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* 学习统计 */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">📊 学习统计</h3>
            
            {/* 进度条 */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-300">学习进度</span>
                <span className="text-amber-600 font-medium">{progressPercent}%</span>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-xs text-slate-400 mt-1">
                已完成 {completedCount} / {totalSections} 章节
              </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-3 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {completedCount}
                </div>
                <div className="text-xs text-blue-500">已完成章节</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-3 rounded-xl">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {formatTime(totalTime)}
                </div>
                <div className="text-xs text-purple-500">累计学习</div>
              </div>
            </div>
          </div>

          {/* 外观设置 */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">🎨 外观设置</h3>
            
            {/* 暗色模式 */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span>{darkMode ? '🌙' : '☀️'}</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">暗色模式</span>
              </div>
              <button
                onClick={onToggleDarkMode}
                className={cn(
                  'w-12 h-6 rounded-full transition-colors relative',
                  darkMode ? 'bg-amber-500' : 'bg-slate-300'
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow',
                    darkMode ? 'translate-x-6' : 'translate-x-0.5'
                  )}
                />
              </button>
            </div>

            {/* 字体大小 */}
            <div className="py-2">
              <div className="flex items-center gap-2 mb-2">
                <span>🔤</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">字体大小</span>
              </div>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => onFontSizeChange(size)}
                    className={cn(
                      'flex-1 py-2 text-sm rounded-lg transition-colors',
                      fontSize === size
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    )}
                  >
                    {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 工具栏 */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">🛠️ 学习工具</h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOpenPlayground}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors text-left"
              >
                <span className="text-lg">🎮</span>
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">SQL 练习场</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">交互式 SQL 练习</div>
                </div>
              </button>

              <button
                onClick={onOpenOntologyGraph}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors text-left"
              >
                <span className="text-lg">🕸️</span>
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">本体论概念图</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">概念关系可视化</div>
                </div>
              </button>

              <button
                onClick={onOpenSQLCompare}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors text-left"
              >
                <span className="text-lg">⚖️</span>
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">SQL 语法对比</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">不同数据库对比</div>
                </div>
              </button>

              <button
                onClick={onOpenQuiz}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-left"
              >
                <span className="text-lg">🎯</span>
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">知识测验</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">测试学习成果</div>
                </div>
              </button>

              <button
                onClick={onOpenQuickRef}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors text-left"
              >
                <span className="text-lg">📋</span>
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">SQL 快速参考</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">常用语法参考</div>
                </div>
              </button>

              <button
                onClick={onOpenFlashcards}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors text-left"
              >
                <span className="text-lg">🃏</span>
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">闪卡复习</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">记忆强化工具</div>
                </div>
              </button>

              <button
                onClick={onOpenLearningPath}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors text-left"
              >
                <span className="text-lg">🗺️</span>
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">学习路径</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">个性化学习路线</div>
                </div>
              </button>

              <button
                onClick={onOpenAchievements}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors text-left"
              >
                <span className="text-lg">🏆</span>
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">成就系统</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">学习成就展示</div>
                </div>
              </button>

              <button
                onClick={onOpenGlossary}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors text-left"
              >
                <span className="text-lg">📖</span>
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">术语表</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">专业术语解释</div>
                </div>
              </button>

              <button
                onClick={onOpenDashboard}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left"
              >
                <span className="text-lg">📊</span>
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">学习仪表盘</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">学习数据分析</div>
                </div>
              </button>

              <button
                onClick={onOpenProjectWorkspace}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left"
              >
                <span className="text-lg">💻</span>
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">项目工作区</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">综合项目环境</div>
                </div>
              </button>

              <button
                onClick={onOpenLearningAssistant}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-left"
              >
                <span className="text-lg">🤖</span>
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">学习助手</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">AI 智能辅导</div>
                </div>
              </button>

              <button
                onClick={onOpenCodeReview}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-left"
              >
                <span className="text-lg">🔍</span>
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">代码审查</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">代码质量检查</div>
                </div>
              </button>
            </div>
          </div>

          {/* 数据管理 */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">🗂️ 数据管理</h3>
            
            <button
              onClick={() => {
                if (confirm('确定要重置学习进度吗？此操作不可撤销。')) {
                  onResetProgress();
                }
              }}
              className="w-full py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              重置学习进度
            </button>
          </div>
        </div>

        {/* 底部 */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400">
          <p>🦆 DuckDB 本体论教程 v1.0</p>
          <p className="mt-1">使用 ❤️ 构建</p>
        </div>
      </div>
    </>
  );
}
