import { modules } from '../data/sections';

interface LearningPathProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  completedSections: string[];
  bookmarkedSections: string[];
}

export function LearningPath({ 
  isOpen, 
  onClose, 
  onNavigate,
  completedSections,
  bookmarkedSections
}: LearningPathProps) {
  if (!isOpen) return null;

  const allSections = modules.flatMap(m => m.sections);
  const completedCount = completedSections.length;
  const progress = Math.round((completedCount / allSections.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 弹窗内容 */}
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
        {/* 标题栏 */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🗺️</span>
              <div>
                <h2 className="text-xl font-bold">学习路径</h2>
                <p className="text-sm text-amber-100">按顺序完成以下模块</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 总进度条 */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>总进度</span>
              <span>{completedCount}/{allSections.length} 章节 ({progress}%)</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 路径内容 */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-160px)]">
          <div className="space-y-6">
            {modules.map((module, moduleIndex) => {
              const moduleCompleted = module.sections.every(s => 
                completedSections.includes(s.id)
              );
              const moduleProgress = module.sections.filter(s => 
                completedSections.includes(s.id)
              ).length;

              return (
                <div 
                  key={module.id}
                  className="relative"
                >
                  {/* 连接线 */}
                  {moduleIndex < modules.length - 1 && (
                    <div className="absolute left-5 top-16 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
                  )}

                  {/* 模块卡片 */}
                  <div className={`relative rounded-xl border-2 transition-all ${
                    moduleCompleted
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                      : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                  }`}>
                    {/* 模块头部 */}
                    <div className="p-4 flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        moduleCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                      }`}>
                        {moduleCompleted ? '✓' : moduleIndex + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold ${
                          moduleCompleted 
                            ? 'text-green-700 dark:text-green-400' 
                            : 'text-slate-800 dark:text-slate-200'
                        }`}>
                          {module.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {moduleProgress}/{module.sections.length} 章节已完成
                        </p>
                      </div>
                      {/* 模块进度圆环 */}
                      <div className="relative w-12 h-12">
                        <svg className="w-12 h-12 -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            fill="none"
                            stroke={moduleCompleted ? '#22c55e' : '#e2e8f0'}
                            strokeWidth="4"
                          />
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            fill="none"
                            stroke={moduleCompleted ? '#22c55e' : '#f59e0b'}
                            strokeWidth="4"
                            strokeDasharray={`${(moduleProgress / module.sections.length) * 125.6} 125.6`}
                            className="transition-all duration-500"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                          {Math.round((moduleProgress / module.sections.length) * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* 章节列表 */}
                    <div className="px-4 pb-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {module.sections.map((section) => {
                          const isCompleted = completedSections.includes(section.id);
                          const isBookmarked = bookmarkedSections.includes(section.id);

                          return (
                            <button
                              key={section.id}
                              onClick={() => {
                                onNavigate(section.id);
                                onClose();
                              }}
                              className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all hover:scale-[1.02] ${
                                isCompleted
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              <span className="text-lg">{section.icon}</span>
                              <span className="flex-1 text-sm truncate">{section.title}</span>
                              <div className="flex items-center gap-1">
                                {isBookmarked && <span className="text-yellow-500 text-xs">★</span>}
                                {isCompleted && (
                                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 完成提示 */}
          {progress === 100 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl border border-amber-300 dark:border-amber-700 text-center">
              <span className="text-3xl">🎉</span>
              <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300 mt-2">
                恭喜！你已完成所有章节！
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                继续探索 DuckDB 的更多高级功能吧
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
