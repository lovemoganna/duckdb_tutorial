import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

interface FlashcardsProps {
  isOpen: boolean;
  onClose: () => void;
}

const flashcards = [
  { 
    q: 'SQL 中如何创建一个新表？', 
    a: 'CREATE TABLE 表名 (列名 数据类型 [约束], ...);',
    category: 'DDL'
  },
  { 
    q: '如何查询表中所有数据？', 
    a: 'SELECT * FROM 表名;',
    category: 'DML'
  },
  { 
    q: 'INSERT INTO 语句的基本语法是什么？', 
    a: 'INSERT INTO 表名 (列1, 列2) VALUES (值1, 值2);',
    category: 'DML'
  },
  { 
    q: 'WHERE 和 HAVING 的区别是什么？', 
    a: 'WHERE 在分组前过滤行，HAVING 在分组后过滤组',
    category: 'Query'
  },
  { 
    q: 'INNER JOIN 和 LEFT JOIN 的区别？', 
    a: 'INNER JOIN 只返回匹配行；LEFT JOIN 返回左表所有行，右表无匹配则为 NULL',
    category: 'JOIN'
  },
  { 
    q: '如何删除表中的所有数据但保留表结构？', 
    a: 'TRUNCATE TABLE 表名; 或 DELETE FROM 表名;',
    category: 'DML'
  },
  { 
    q: 'CTE 是什么？如何使用？', 
    a: 'Common Table Expression，用 WITH cte AS (SELECT...) 定义临时结果集',
    category: 'Advanced'
  },
  { 
    q: '视图（View）的主要优点有哪些？', 
    a: '1. 简化复杂查询 2. 代码复用 3. 安全控制 4. 逻辑抽象',
    category: 'View'
  },
  { 
    q: '如何实现递归查询层级结构？', 
    a: 'WITH RECURSIVE cte AS (基础查询 UNION ALL 递归查询) SELECT...',
    category: 'Advanced'
  },
  { 
    q: 'PRIMARY KEY 和 UNIQUE 约束的区别？', 
    a: 'PRIMARY KEY 不允许 NULL 且每表只能有一个；UNIQUE 允许一个 NULL 可多个',
    category: 'DDL'
  },
  { 
    q: 'DuckDB 相比传统数据库的优势是什么？', 
    a: '零配置嵌入式、极快的分析性能、直接查询 CSV/Parquet/JSON 文件',
    category: 'Concept'
  },
  { 
    q: '软删除与硬删除的区别？', 
    a: '软删除：标记 is_deleted=TRUE，可恢复；硬删除：DELETE 永久删除',
    category: 'Best Practice'
  },
];

export function Flashcards({ isOpen, onClose }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState<Set<number>>(new Set());
  const [shuffled, setShuffled] = useState<typeof flashcards>([]);

  // 初始化打乱顺序
  useEffect(() => {
    if (isOpen) {
      setShuffled([...flashcards].sort(() => Math.random() - 0.5));
      setCurrentIndex(0);
      setFlipped(false);
    }
  }, [isOpen]);

  if (!isOpen || shuffled.length === 0) return null;

  const currentCard = shuffled[currentIndex];
  const progress = ((currentIndex + 1) / shuffled.length) * 100;

  const handleNext = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % shuffled.length);
    }, 200);
  };

  const handlePrev = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + shuffled.length) % shuffled.length);
    }, 200);
  };

  const toggleMastered = () => {
    setMastered(prev => {
      const next = new Set(prev);
      if (next.has(currentIndex)) {
        next.delete(currentIndex);
      } else {
        next.add(currentIndex);
      }
      return next;
    });
  };

  const categoryColors: Record<string, string> = {
    DDL: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    DML: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    Query: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
    JOIN: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    View: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
    Advanced: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
    Concept: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    'Best Practice': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🃏</span>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">闪卡复习</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                已掌握 {mastered.size}/{shuffled.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 进度条 */}
        <div className="h-1 bg-slate-200 dark:bg-slate-700">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 卡片 */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className={cn('text-xs px-2 py-1 rounded-full', categoryColors[currentCard.category] || 'bg-slate-100 text-slate-600')}>
              {currentCard.category}
            </span>
            <span className="text-sm text-slate-400">
              {currentIndex + 1} / {shuffled.length}
            </span>
          </div>

          {/* 翻转卡片 */}
          <div 
            className={cn(
              'relative h-52 cursor-pointer perspective-1000',
            )}
            onClick={() => setFlipped(!flipped)}
          >
            <div className={cn(
              'absolute inset-0 rounded-xl transition-all duration-500 preserve-3d',
              flipped ? 'rotate-y-180' : ''
            )}>
              {/* 正面 - 问题 */}
              <div className={cn(
                'absolute inset-0 rounded-xl p-6 flex flex-col justify-center items-center text-center backface-hidden',
                'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-700 dark:to-slate-600',
                'border-2 border-amber-200 dark:border-amber-700'
              )}>
                <span className="text-3xl mb-4">❓</span>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-200">{currentCard.q}</p>
                <p className="text-xs text-slate-400 mt-4">点击翻转查看答案</p>
              </div>

              {/* 背面 - 答案 */}
              <div className={cn(
                'absolute inset-0 rounded-xl p-6 flex flex-col justify-center items-center text-center backface-hidden rotate-y-180',
                'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-700 dark:to-slate-600',
                'border-2 border-green-200 dark:border-green-700'
              )}>
                <span className="text-3xl mb-4">💡</span>
                <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed">{currentCard.a}</p>
              </div>
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={toggleMastered}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
                mastered.has(currentIndex)
                  ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-900/30'
              )}
            >
              {mastered.has(currentIndex) ? '✓ 已掌握' : '标记掌握'}
            </button>

            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 transition-colors text-white shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-center text-xs text-slate-500">
          点击卡片翻转 · 使用箭头切换
        </div>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
