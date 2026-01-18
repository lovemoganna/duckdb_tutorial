import { cn } from '../utils/cn';

interface AchievementsProps {
  isOpen: boolean;
  onClose: () => void;
  completedCount: number;
  totalSections: number;
  totalTime: number;
  notesCount: number;
  bookmarksCount: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: Stats) => boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Stats {
  completedCount: number;
  totalSections: number;
  totalTime: number;
  notesCount: number;
  bookmarksCount: number;
}

const achievements: Achievement[] = [
  {
    id: 'first-step',
    title: '第一步',
    description: '完成第一个章节',
    icon: '👶',
    condition: (s) => s.completedCount >= 1,
    rarity: 'common',
  },
  {
    id: 'getting-started',
    title: '入门学徒',
    description: '完成 3 个章节',
    icon: '🌱',
    condition: (s) => s.completedCount >= 3,
    rarity: 'common',
  },
  {
    id: 'half-way',
    title: '半程勇士',
    description: '完成一半的章节',
    icon: '🏃',
    condition: (s) => s.completedCount >= s.totalSections / 2,
    rarity: 'rare',
  },
  {
    id: 'sql-master',
    title: 'SQL 大师',
    description: '完成所有章节',
    icon: '🎓',
    condition: (s) => s.completedCount >= s.totalSections,
    rarity: 'legendary',
  },
  {
    id: 'note-taker',
    title: '笔记达人',
    description: '记录 5 条笔记',
    icon: '📝',
    condition: (s) => s.notesCount >= 5,
    rarity: 'common',
  },
  {
    id: 'diligent-noter',
    title: '勤勉学者',
    description: '记录 15 条笔记',
    icon: '📚',
    condition: (s) => s.notesCount >= 15,
    rarity: 'rare',
  },
  {
    id: 'collector',
    title: '收藏家',
    description: '收藏 3 个章节',
    icon: '⭐',
    condition: (s) => s.bookmarksCount >= 3,
    rarity: 'common',
  },
  {
    id: 'time-investor',
    title: '时间投资者',
    description: '累计学习 30 分钟',
    icon: '⏰',
    condition: (s) => s.totalTime >= 30,
    rarity: 'rare',
  },
  {
    id: 'dedicated',
    title: '专注学习者',
    description: '累计学习 60 分钟',
    icon: '🔥',
    condition: (s) => s.totalTime >= 60,
    rarity: 'epic',
  },
  {
    id: 'duck-lover',
    title: 'DuckDB 爱好者',
    description: '完成快速入门模块',
    icon: '🦆',
    condition: (s) => s.completedCount >= 2,
    rarity: 'common',
  },
  {
    id: 'query-ninja',
    title: '查询忍者',
    description: '完成进阶查询模块（需7+章节）',
    icon: '🥷',
    condition: (s) => s.completedCount >= 7,
    rarity: 'epic',
  },
  {
    id: 'perfectionist',
    title: '完美主义者',
    description: '完成所有章节并记录10+笔记',
    icon: '💎',
    condition: (s) => s.completedCount >= s.totalSections && s.notesCount >= 10,
    rarity: 'legendary',
  },
];

const rarityColors = {
  common: 'from-slate-400 to-slate-500 border-slate-300',
  rare: 'from-blue-400 to-blue-600 border-blue-300',
  epic: 'from-purple-400 to-purple-600 border-purple-300',
  legendary: 'from-amber-400 to-orange-500 border-amber-300',
};

const rarityBg = {
  common: 'bg-slate-50 dark:bg-slate-800/50',
  rare: 'bg-blue-50 dark:bg-blue-900/30',
  epic: 'bg-purple-50 dark:bg-purple-900/30',
  legendary: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30',
};

const rarityLabels = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

export function Achievements({ 
  isOpen, 
  onClose,
  completedCount,
  totalSections,
  totalTime,
  notesCount,
  bookmarksCount,
}: AchievementsProps) {
  if (!isOpen) return null;

  const stats: Stats = { completedCount, totalSections, totalTime, notesCount, bookmarksCount };
  const unlockedAchievements = achievements.filter(a => a.condition(stats));
  const lockedAchievements = achievements.filter(a => !a.condition(stats));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-slate-800 dark:to-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">成就系统</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  已解锁 {unlockedAchievements.length}/{achievements.length} 个成就
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-slate-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 进度条 */}
          <div className="mt-4">
            <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 成就列表 */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
          {/* 已解锁 */}
          {unlockedAchievements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                <span className="text-green-500">✓</span>
                已解锁
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unlockedAchievements.map(achievement => (
                  <div 
                    key={achievement.id}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all hover:scale-[1.02]',
                      rarityBg[achievement.rarity],
                      'border-' + achievement.rarity === 'legendary' ? 'border-amber-300' : ''
                    )}
                    style={{
                      borderColor: achievement.rarity === 'common' ? '#cbd5e1' : 
                                   achievement.rarity === 'rare' ? '#93c5fd' :
                                   achievement.rarity === 'epic' ? '#c4b5fd' : '#fcd34d'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br shadow-md',
                        rarityColors[achievement.rarity]
                      )}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800 dark:text-slate-100">{achievement.title}</h4>
                          <span className={cn(
                            'text-xs px-1.5 py-0.5 rounded',
                            achievement.rarity === 'common' ? 'bg-slate-200 text-slate-600' :
                            achievement.rarity === 'rare' ? 'bg-blue-200 text-blue-700' :
                            achievement.rarity === 'epic' ? 'bg-purple-200 text-purple-700' :
                            'bg-amber-200 text-amber-700'
                          )}>
                            {rarityLabels[achievement.rarity]}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 未解锁 */}
          {lockedAchievements.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                <span className="text-slate-400">🔒</span>
                待解锁
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lockedAchievements.map(achievement => (
                  <div 
                    key={achievement.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-900/50 opacity-60"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-slate-200 dark:bg-slate-700">
                        🔒
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-600 dark:text-slate-400">{achievement.title}</h4>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-500">
                            {rarityLabels[achievement.rarity]}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部统计 */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <div className="grid grid-cols-4 gap-4 text-center text-xs">
            <div>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-200">{completedCount}</div>
              <div className="text-slate-500">章节完成</div>
            </div>
            <div>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-200">{notesCount}</div>
              <div className="text-slate-500">笔记数量</div>
            </div>
            <div>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-200">{bookmarksCount}</div>
              <div className="text-slate-500">收藏数量</div>
            </div>
            <div>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-200">{totalTime}m</div>
              <div className="text-slate-500">学习时长</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
