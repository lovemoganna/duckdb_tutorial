import { cn } from '../utils/cn';

interface LearningDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    completedCount: number;
    totalSections: number;
    totalTime: number;
    notesCount: number;
    bookmarksCount: number;
    streakDays: number;
    lastVisit: number;
  };
}

export function LearningDashboard({ isOpen, onClose, stats }: LearningDashboardProps) {
  if (!isOpen) return null;

  const progress = Math.round((stats.completedCount / stats.totalSections) * 100);
  const averageTimePerSection = stats.completedCount > 0 
    ? Math.round(stats.totalTime / stats.completedCount) 
    : 0;

  const achievements = [
    { 
      id: 'first', 
      title: '迈出第一步', 
      desc: '完成第一个章节', 
      unlocked: stats.completedCount >= 1,
      icon: '🌱'
    },
    { 
      id: 'half', 
      title: '半程勇士', 
      desc: '完成一半的章节', 
      unlocked: stats.completedCount >= stats.totalSections / 2,
      icon: '🏃'
    },
    { 
      id: 'complete', 
      title: 'SQL 大师', 
      desc: '完成所有章节', 
      unlocked: stats.completedCount >= stats.totalSections,
      icon: '🎓'
    },
    { 
      id: 'notes', 
      title: '笔记达人', 
      desc: '记录 10 条笔记', 
      unlocked: stats.notesCount >= 10,
      icon: '📝'
    },
    { 
      id: 'time', 
      title: '专注学习', 
      desc: '累计学习 1 小时', 
      unlocked: stats.totalTime >= 60,
      icon: '⏰'
    },
    { 
      id: 'collector', 
      title: '知识收藏家', 
      desc: '收藏 5 个章节', 
      unlocked: stats.bookmarksCount >= 5,
      icon: '⭐'
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // 建议下一步
  const getNextSuggestion = () => {
    if (stats.completedCount === 0) {
      return { text: '开始你的第一课！从"为什么学 DuckDB"开始吧', icon: '🚀' };
    }
    if (stats.notesCount === 0) {
      return { text: '尝试在学习中添加笔记，帮助记忆', icon: '📝' };
    }
    if (stats.completedCount < stats.totalSections / 2) {
      return { text: '继续学习，向半程勇士迈进！', icon: '💪' };
    }
    if (stats.completedCount < stats.totalSections) {
      return { text: '加油！距离完成所有课程只差几步了', icon: '🎯' };
    }
    return { text: '恭喜完成全部课程！可以复习或尝试实战项目', icon: '🏆' };
  };

  const suggestion = getNextSuggestion();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-slideUp max-h-[90vh] flex flex-col">
        {/* 头部 */}
        <div className="flex-shrink-0 px-6 py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📊</span>
              <div>
                <h2 className="text-xl font-bold text-white">学习仪表盘</h2>
                <p className="text-sm text-white/80">追踪你的学习进度</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 主要进度 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">学习进度</h3>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                {progress}%
              </span>
            </div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              已完成 {stats.completedCount} / {stats.totalSections} 章节
            </p>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.completedCount}
              </div>
              <div className="text-xs text-blue-500 dark:text-blue-500">章节已完成</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border border-purple-200 dark:border-purple-700">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.totalTime}m
              </div>
              <div className="text-xs text-purple-500">累计学习</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 border border-amber-200 dark:border-amber-700">
              <div className="text-3xl mb-2">📝</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {stats.notesCount}
              </div>
              <div className="text-xs text-amber-500">笔记数量</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-800/30 border border-rose-200 dark:border-rose-700">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                {stats.bookmarksCount}
              </div>
              <div className="text-xs text-rose-500">收藏章节</div>
            </div>
          </div>

          {/* 建议 */}
          <div className="mb-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{suggestion.icon}</span>
              <div>
                <h4 className="font-semibold text-amber-800 dark:text-amber-300">下一步建议</h4>
                <p className="text-sm text-amber-700 dark:text-amber-400">{suggestion.text}</p>
              </div>
            </div>
          </div>

          {/* 成就 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">成就徽章</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {unlockedCount} / {achievements.length} 已解锁
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {achievements.map(a => (
                <div 
                  key={a.id}
                  className={cn(
                    'p-4 rounded-xl border transition-all',
                    a.unlocked
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-300 dark:border-green-700'
                      : 'bg-slate-100 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 opacity-60'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'text-2xl',
                      !a.unlocked && 'grayscale'
                    )}>
                      {a.unlocked ? a.icon : '🔒'}
                    </span>
                    <div>
                      <h4 className={cn(
                        'font-medium text-sm',
                        a.unlocked 
                          ? 'text-green-700 dark:text-green-300' 
                          : 'text-slate-500 dark:text-slate-400'
                      )}>
                        {a.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{a.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 学习效率 */}
          {stats.completedCount > 0 && (
            <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">📈 学习效率</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    ~{averageTimePerSection} 分钟
                  </div>
                  <div className="text-xs text-slate-500">平均每章用时</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    {Math.round(stats.notesCount / Math.max(stats.completedCount, 1) * 10) / 10}
                  </div>
                  <div className="text-xs text-slate-500">每章平均笔记</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            继续学习
          </button>
        </div>
      </div>
    </div>
  );
}
