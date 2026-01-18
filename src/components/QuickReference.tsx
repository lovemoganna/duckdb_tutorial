import { useState } from 'react';
import { cn } from '../utils/cn';

interface QuickReferenceProps {
  isOpen: boolean;
  onClose: () => void;
}

const references = [
  {
    category: '数据定义 (DDL)',
    color: 'blue',
    commands: [
      { syntax: 'CREATE TABLE name (columns...)', desc: '创建表' },
      { syntax: 'ALTER TABLE name ADD COLUMN col TYPE', desc: '添加列' },
      { syntax: 'ALTER TABLE name DROP COLUMN col', desc: '删除列' },
      { syntax: 'DROP TABLE [IF EXISTS] name', desc: '删除表' },
      { syntax: 'CREATE INDEX idx ON table(col)', desc: '创建索引' },
    ],
  },
  {
    category: '数据操作 (DML)',
    color: 'green',
    commands: [
      { syntax: 'INSERT INTO table VALUES (...)', desc: '插入数据' },
      { syntax: 'SELECT cols FROM table WHERE cond', desc: '查询数据' },
      { syntax: 'UPDATE table SET col=val WHERE cond', desc: '更新数据' },
      { syntax: 'DELETE FROM table WHERE cond', desc: '删除数据' },
      { syntax: 'TRUNCATE TABLE name', desc: '清空表' },
    ],
  },
  {
    category: '查询子句',
    color: 'purple',
    commands: [
      { syntax: 'WHERE condition', desc: '条件过滤' },
      { syntax: 'ORDER BY col [ASC|DESC]', desc: '排序' },
      { syntax: 'LIMIT n OFFSET m', desc: '分页' },
      { syntax: 'GROUP BY col HAVING cond', desc: '分组聚合' },
      { syntax: 'DISTINCT col', desc: '去重' },
    ],
  },
  {
    category: 'JOIN 连接',
    color: 'amber',
    commands: [
      { syntax: 'INNER JOIN t2 ON t1.a = t2.b', desc: '内连接' },
      { syntax: 'LEFT JOIN t2 ON t1.a = t2.b', desc: '左连接' },
      { syntax: 'RIGHT JOIN t2 ON t1.a = t2.b', desc: '右连接' },
      { syntax: 'FULL OUTER JOIN t2 ON ...', desc: '全外连接' },
      { syntax: 'CROSS JOIN t2', desc: '交叉连接' },
    ],
  },
  {
    category: '聚合函数',
    color: 'rose',
    commands: [
      { syntax: 'COUNT(*) / COUNT(col)', desc: '计数' },
      { syntax: 'SUM(col) / AVG(col)', desc: '求和/平均' },
      { syntax: 'MAX(col) / MIN(col)', desc: '最大/最小' },
      { syntax: 'GROUP_CONCAT(col)', desc: '字符串聚合' },
      { syntax: 'ARRAY_AGG(col)', desc: '数组聚合' },
    ],
  },
  {
    category: '视图与CTE',
    color: 'cyan',
    commands: [
      { syntax: 'CREATE VIEW name AS SELECT...', desc: '创建视图' },
      { syntax: 'CREATE OR REPLACE VIEW...', desc: '替换视图' },
      { syntax: 'WITH cte AS (SELECT...) SELECT...', desc: 'CTE表达式' },
      { syntax: 'WITH RECURSIVE cte AS (...)', desc: '递归CTE' },
      { syntax: 'DROP VIEW [IF EXISTS] name', desc: '删除视图' },
    ],
  },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200',
  green: 'bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200',
  purple: 'bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-700 text-purple-800 dark:text-purple-200',
  amber: 'bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-200',
  rose: 'bg-rose-100 dark:bg-rose-900/40 border-rose-200 dark:border-rose-700 text-rose-800 dark:text-rose-200',
  cyan: 'bg-cyan-100 dark:bg-cyan-900/40 border-cyan-200 dark:border-cyan-700 text-cyan-800 dark:text-cyan-200',
};

export function QuickReference({ isOpen, onClose }: QuickReferenceProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredRefs = references.map(cat => ({
    ...cat,
    commands: cat.commands.filter(
      cmd => 
        cmd.syntax.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.desc.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(cat => cat.commands.length > 0);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">SQL 快速参考</h2>
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
          <input
            type="text"
            placeholder="搜索命令或关键词..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400"
            autoFocus
          />
        </div>

        {/* 内容 */}
        <div className="p-4 overflow-y-auto max-h-[calc(85vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRefs.map(cat => (
              <div 
                key={cat.category}
                className={cn('p-4 rounded-xl border', colorMap[cat.color])}
              >
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  {cat.category}
                </h3>
                <div className="space-y-2">
                  {cat.commands.map((cmd, i) => (
                    <div key={i} className="text-sm">
                      <code className="block font-mono text-xs bg-black/10 dark:bg-white/10 px-2 py-1 rounded mb-1">
                        {cmd.syntax}
                      </code>
                      <span className="text-xs opacity-80">{cmd.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredRefs.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              没有找到匹配的命令
            </div>
          )}
        </div>

        {/* 底部提示 */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-center text-xs text-slate-500">
          按 <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">ESC</kbd> 关闭
        </div>
      </div>
    </div>
  );
}
