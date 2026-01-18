import { useState } from 'react';
import { cn } from '../utils/cn';

interface DataFlowAnimationProps {
  type: 'join' | 'filter' | 'group' | 'insert';
}

interface TableRow {
  values: string[];
  highlight?: 'match' | 'filter' | 'result';
}

// JOIN 动画数据
const joinData = {
  leftTable: {
    name: 'concepts',
    headers: ['id', 'name', 'parent_id'],
    rows: [
      { values: ['1', 'Entity', 'NULL'], highlight: undefined },
      { values: ['2', 'Animal', '1'], highlight: 'match' as const },
      { values: ['3', 'Dog', '2'], highlight: 'match' as const },
    ],
  },
  rightTable: {
    name: 'concepts (as parent)',
    headers: ['id', 'name'],
    rows: [
      { values: ['1', 'Entity'], highlight: 'match' as const },
      { values: ['2', 'Animal'], highlight: 'match' as const },
    ],
  },
  resultTable: {
    name: '结果',
    headers: ['name', 'parent_name'],
    rows: [
      { values: ['Entity', 'NULL'], highlight: 'result' as const },
      { values: ['Animal', 'Entity'], highlight: 'result' as const },
      { values: ['Dog', 'Animal'], highlight: 'result' as const },
    ],
  },
};

// 过滤动画数据
const filterData = {
  sourceTable: {
    name: 'concepts',
    headers: ['id', 'name', 'parent_id'],
    rows: [
      { values: ['1', 'Entity', 'NULL'], highlight: 'filter' as const },
      { values: ['2', 'Animal', '1'], highlight: undefined },
      { values: ['3', 'Mammal', '2'], highlight: 'match' as const },
      { values: ['4', 'Dog', '3'], highlight: 'match' as const },
      { values: ['5', 'Cat', '3'], highlight: 'match' as const },
    ],
  },
  condition: 'WHERE parent_id = 3',
  resultTable: {
    name: '结果',
    headers: ['id', 'name', 'parent_id'],
    rows: [
      { values: ['4', 'Dog', '3'], highlight: 'result' as const },
      { values: ['5', 'Cat', '3'], highlight: 'result' as const },
    ],
  },
};

// 分组聚合数据
const groupData = {
  sourceTable: {
    name: 'concepts',
    headers: ['id', 'name', 'parent_id'],
    rows: [
      { values: ['3', 'Mammal', '2'], highlight: undefined },
      { values: ['4', 'Dog', '3'], highlight: 'match' as const },
      { values: ['5', 'Cat', '3'], highlight: 'match' as const },
      { values: ['6', 'Bird', '2'], highlight: undefined },
      { values: ['7', 'Eagle', '6'], highlight: 'filter' as const },
    ],
  },
  groupBy: 'GROUP BY parent_id',
  resultTable: {
    name: '结果',
    headers: ['parent_id', 'count(*)'],
    rows: [
      { values: ['2', '2'], highlight: 'result' as const },
      { values: ['3', '2'], highlight: 'result' as const },
      { values: ['6', '1'], highlight: 'result' as const },
    ],
  },
};

// 插入数据
const insertData = {
  newRows: [
    { values: ['8', 'Wolf', '3'], highlight: 'match' as const },
    { values: ['9', 'Lion', '3'], highlight: 'match' as const },
  ],
  targetTable: {
    name: 'concepts',
    headers: ['id', 'name', 'parent_id'],
    existingRows: [
      { values: ['4', 'Dog', '3'], highlight: undefined },
      { values: ['5', 'Cat', '3'], highlight: undefined },
    ],
  },
};

const highlightColors = {
  match: 'bg-green-100 dark:bg-green-900/40 border-green-400',
  filter: 'bg-red-100 dark:bg-red-900/40 border-red-400 opacity-50',
  result: 'bg-blue-100 dark:bg-blue-900/40 border-blue-400',
};

function MiniTable({ 
  name, 
  headers, 
  rows,
  compact = false,
}: { 
  name: string; 
  headers: string[]; 
  rows: TableRow[];
  compact?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-600">
      <div className="bg-slate-100 dark:bg-slate-700 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300">
        📋 {name}
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-700/50">
            {headers.map((h, i) => (
              <th key={i} className={cn(
                "text-left font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-600",
                compact ? "px-2 py-1" : "px-3 py-2"
              )}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr 
              key={i} 
              className={cn(
                "transition-all border-l-2",
                row.highlight ? highlightColors[row.highlight] : "border-transparent"
              )}
            >
              {row.values.map((v, j) => (
                <td key={j} className={cn(
                  "font-mono text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700",
                  compact ? "px-2 py-1" : "px-3 py-2"
                )}>
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Arrow({ direction = 'right' }: { direction?: 'right' | 'down' }) {
  if (direction === 'down') {
    return (
      <div className="flex justify-center py-2">
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-400 to-indigo-600"></div>
          <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center px-2">
      <div className="flex items-center">
        <div className="w-8 h-0.5 bg-gradient-to-r from-indigo-400 to-indigo-600"></div>
        <svg className="w-4 h-4 text-indigo-600 -ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
        </svg>
      </div>
    </div>
  );
}

export function DataFlowAnimation({ type }: DataFlowAnimationProps) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const maxSteps = type === 'join' ? 3 : type === 'insert' ? 2 : 2;

  const play = () => {
    setIsPlaying(true);
    setStep(0);
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= maxSteps) {
        clearInterval(interval);
        setIsPlaying(false);
        setStep(maxSteps - 1);
      } else {
        setStep(current);
      }
    }, 1500);
  };

  const renderJoinAnimation = () => (
    <div className="flex flex-col lg:flex-row items-center gap-4">
      {/* 左表 */}
      <div className={cn("transition-all duration-500", step >= 0 ? "opacity-100" : "opacity-30")}>
        <MiniTable {...joinData.leftTable} compact />
      </div>
      
      {/* 连接符号 */}
      <div className={cn(
        "flex flex-col items-center transition-all duration-500",
        step >= 1 ? "opacity-100 scale-100" : "opacity-30 scale-75"
      )}>
        <div className="text-3xl">🔗</div>
        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-1">LEFT JOIN</div>
        <div className="text-xs text-slate-500">ON parent_id = id</div>
      </div>
      
      {/* 右表 */}
      <div className={cn("transition-all duration-500", step >= 0 ? "opacity-100" : "opacity-30")}>
        <MiniTable {...joinData.rightTable} compact />
      </div>
      
      <Arrow />
      
      {/* 结果 */}
      <div className={cn("transition-all duration-500", step >= 2 ? "opacity-100 scale-100" : "opacity-30 scale-90")}>
        <MiniTable {...joinData.resultTable} compact />
      </div>
    </div>
  );

  const renderFilterAnimation = () => (
    <div className="flex flex-col lg:flex-row items-center gap-4">
      {/* 源表 */}
      <div className={cn("transition-all duration-500", step >= 0 ? "opacity-100" : "opacity-30")}>
        <MiniTable {...filterData.sourceTable} compact />
      </div>
      
      {/* 过滤条件 */}
      <div className={cn(
        "flex flex-col items-center transition-all duration-500",
        step >= 1 ? "opacity-100 scale-100" : "opacity-30 scale-75"
      )}>
        <div className="text-3xl">🔍</div>
        <code className="text-xs text-amber-600 dark:text-amber-400 font-mono mt-1 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded">
          {filterData.condition}
        </code>
      </div>
      
      <Arrow />
      
      {/* 结果 */}
      <div className={cn("transition-all duration-500", step >= 1 ? "opacity-100 scale-100" : "opacity-30 scale-90")}>
        <MiniTable {...filterData.resultTable} compact />
      </div>
    </div>
  );

  const renderGroupAnimation = () => (
    <div className="flex flex-col lg:flex-row items-center gap-4">
      {/* 源表 */}
      <div className={cn("transition-all duration-500", step >= 0 ? "opacity-100" : "opacity-30")}>
        <MiniTable {...groupData.sourceTable} compact />
      </div>
      
      {/* 分组条件 */}
      <div className={cn(
        "flex flex-col items-center transition-all duration-500",
        step >= 1 ? "opacity-100 scale-100" : "opacity-30 scale-75"
      )}>
        <div className="text-3xl">📊</div>
        <code className="text-xs text-purple-600 dark:text-purple-400 font-mono mt-1 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded">
          {groupData.groupBy}
        </code>
      </div>
      
      <Arrow />
      
      {/* 结果 */}
      <div className={cn("transition-all duration-500", step >= 1 ? "opacity-100 scale-100" : "opacity-30 scale-90")}>
        <MiniTable {...groupData.resultTable} compact />
      </div>
    </div>
  );

  const renderInsertAnimation = () => (
    <div className="flex flex-col lg:flex-row items-center gap-4">
      {/* 新数据 */}
      <div className={cn("transition-all duration-500", step >= 0 ? "opacity-100" : "opacity-30")}>
        <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-3 border border-green-200 dark:border-green-700">
          <div className="text-xs font-bold text-green-700 dark:text-green-300 mb-2">📥 新数据</div>
          {insertData.newRows.map((row, i) => (
            <div key={i} className="font-mono text-xs text-green-600 dark:text-green-400">
              ({row.values.join(', ')})
            </div>
          ))}
        </div>
      </div>
      
      {/* 插入符号 */}
      <div className={cn(
        "flex flex-col items-center transition-all duration-500",
        step >= 1 ? "opacity-100 scale-100" : "opacity-30 scale-75"
      )}>
        <div className="text-3xl">➕</div>
        <div className="text-xs text-green-600 dark:text-green-400 font-mono mt-1">INSERT INTO</div>
      </div>
      
      <Arrow />
      
      {/* 目标表 */}
      <div className={cn("transition-all duration-500", step >= 1 ? "opacity-100 scale-100" : "opacity-30 scale-90")}>
        <MiniTable 
          name={insertData.targetTable.name}
          headers={insertData.targetTable.headers}
          rows={[
            ...insertData.targetTable.existingRows,
            ...(step >= 1 ? insertData.newRows : []),
          ]}
          compact 
        />
      </div>
    </div>
  );

  return (
    <div className="my-6 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 rounded-2xl border border-indigo-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span className="text-xl">🎬</span>
          数据流动可视化
        </h4>
        <button
          onClick={play}
          disabled={isPlaying}
          className={cn(
            "px-4 py-2 text-sm rounded-lg font-medium transition-all flex items-center gap-2",
            isPlaying
              ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-md hover:shadow-lg"
          )}
        >
          {isPlaying ? (
            <>
              <span className="animate-spin">⏳</span>
              演示中...
            </>
          ) : (
            <>
              <span>▶️</span>
              播放动画
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto py-4">
        {type === 'join' && renderJoinAnimation()}
        {type === 'filter' && renderFilterAnimation()}
        {type === 'group' && renderGroupAnimation()}
        {type === 'insert' && renderInsertAnimation()}
      </div>

      {/* 图例 */}
      <div className="mt-4 pt-4 border-t border-indigo-200 dark:border-slate-700 flex flex-wrap gap-4 text-xs">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-100 dark:bg-green-900/40 border border-green-400 rounded"></span>
          <span className="text-slate-600 dark:text-slate-400">匹配/选中</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-100 dark:bg-red-900/40 border border-red-400 rounded opacity-50"></span>
          <span className="text-slate-600 dark:text-slate-400">被过滤</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-blue-100 dark:bg-blue-900/40 border border-blue-400 rounded"></span>
          <span className="text-slate-600 dark:text-slate-400">结果</span>
        </span>
      </div>
    </div>
  );
}
