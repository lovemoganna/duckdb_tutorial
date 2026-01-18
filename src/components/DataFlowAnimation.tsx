import { useState } from 'react';
import { cn } from '../utils/cn';

interface DataFlowAnimationProps {
  type: 'join' | 'filter' | 'group' | 'insert' | 'pivot' | 'transform' | 'transaction';
  title?: string;
  steps?: Array<{
    id: string;
    label: string;
    status: 'idle' | 'active' | 'completed' | 'failed';
    description?: string;
  }>;
  connections?: Array<{
    from: string;
    to: string;
    label?: string;
    type: 'success' | 'failure' | 'normal';
  }>;
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

// 事务状态转换数据
const transactionFlowData = {
  steps: [
    {
      id: 'start',
      label: '开始事务',
      status: 'idle' as const,
      description: 'BEGIN TRANSACTION'
    },
    {
      id: 'execute',
      label: '执行操作',
      status: 'idle' as const,
      description: '执行 SQL 语句'
    },
    {
      id: 'validate',
      label: '验证约束',
      status: 'idle' as const,
      description: '检查完整性约束'
    },
    {
      id: 'prepare',
      label: '准备提交',
      status: 'idle' as const,
      description: '准备阶段 (2PC)'
    },
    {
      id: 'commit',
      label: '提交事务',
      status: 'idle' as const,
      description: 'COMMIT'
    },
    {
      id: 'rollback',
      label: '回滚事务',
      status: 'idle' as const,
      description: 'ROLLBACK'
    }
  ],
  connections: [
    { from: 'start', to: 'execute', type: 'normal' as const },
    { from: 'execute', to: 'validate', type: 'normal' as const },
    { from: 'validate', to: 'prepare', type: 'success' as const, label: '成功' },
    { from: 'validate', to: 'rollback', type: 'failure' as const, label: '失败' },
    { from: 'prepare', to: 'commit', type: 'success' as const, label: '所有参与者就绪' },
    { from: 'prepare', to: 'rollback', type: 'failure' as const, label: '参与者失败' }
  ]
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

// PIVOT 数据
const pivotData = {
  sourceTable: {
    name: 'sales (源数据)',
    headers: ['region', 'category', 'amount'],
    rows: [
      { values: ['East', 'Electronics', '1000'], highlight: 'match' as const },
      { values: ['East', 'Clothing', '500'], highlight: 'match' as const },
      { values: ['West', 'Electronics', '800'], highlight: 'match' as const },
      { values: ['West', 'Clothing', '300'], highlight: 'match' as const },
      { values: ['North', 'Electronics', '600'], highlight: 'match' as const },
      { values: ['North', 'Clothing', '400'], highlight: 'match' as const },
    ],
  },
  pivotTable: {
    name: 'pivoted_sales (结果)',
    headers: ['region', 'Electronics', 'Clothing'],
    rows: [
      { values: ['East', '1000', '500'], highlight: 'result' as const },
      { values: ['West', '800', '300'], highlight: 'result' as const },
      { values: ['North', '600', '400'], highlight: 'result' as const },
    ],
  },
};

// 数据转换动画数据
const transformData = {
  sourceTable: {
    name: 'raw_data (原始数据)',
    headers: ['id', 'name', 'value'],
    rows: [
      { values: ['1', 'Alice', '100'], highlight: 'match' as const },
      { values: ['2', 'Bob', 'abc'], highlight: 'filter' as const },
      { values: ['3', 'Charlie', '200'], highlight: 'match' as const },
      { values: ['4', 'NULL', '300'], highlight: 'match' as const },
    ],
  },
  transformedTable: {
    name: 'cleaned_data (转换后)',
    headers: ['id', 'name', 'value'],
    rows: [
      { values: ['1', 'Alice', '100'], highlight: 'result' as const },
      { values: ['3', 'Charlie', '200'], highlight: 'result' as const },
      { values: ['4', 'Unknown', '300'], highlight: 'result' as const },
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

export function DataFlowAnimation({ type, title, steps, connections }: DataFlowAnimationProps) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const maxSteps = type === 'join' ? 3 : type === 'insert' ? 2 : type === 'pivot' ? 3 : type === 'transform' ? 3 : 2;

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

  const renderPivotAnimation = () => (
    <div className="flex flex-col lg:flex-row items-center gap-4">
      {/* 源数据表 */}
      <div className={cn("transition-all duration-500", step >= 0 ? "opacity-100" : "opacity-30")}>
        <MiniTable {...pivotData.sourceTable} compact />
      </div>

      {/* PIVOT 操作 */}
      <div className={cn(
        "flex flex-col items-center transition-all duration-500",
        step >= 1 ? "opacity-100 scale-100" : "opacity-30 scale-75"
      )}>
        <div className="text-3xl">🔄</div>
        <div className="text-xs text-amber-600 dark:text-amber-400 font-mono mt-1 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded">
          PIVOT
        </div>
        <div className="text-xs text-slate-500 text-center leading-tight">
          <div>SUM(amount)</div>
          <div>FOR category</div>
          <div>IN ('Electronics', 'Clothing')</div>
        </div>
      </div>

      <Arrow />

      {/* 结果表 */}
      <div className={cn("transition-all duration-500", step >= 2 ? "opacity-100 scale-100" : "opacity-30 scale-90")}>
        <MiniTable {...pivotData.pivotTable} compact />
      </div>
    </div>
  );

  const renderTransformAnimation = () => (
    <div className="flex flex-col lg:flex-row items-center gap-4">
      {/* 原始数据 */}
      <div className={cn("transition-all duration-500", step >= 0 ? "opacity-100" : "opacity-30")}>
        <MiniTable {...transformData.sourceTable} compact />
      </div>

      {/* 转换操作 */}
      <div className={cn(
        "flex flex-col items-center transition-all duration-500",
        step >= 1 ? "opacity-100 scale-100" : "opacity-30 scale-75"
      )}>
        <div className="text-3xl">🔄</div>
        <div className="text-xs text-amber-600 dark:text-amber-400 font-mono mt-1 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded">
          数据转换
        </div>
        <div className="text-xs text-slate-500 text-center leading-tight">
          <div>类型转换</div>
          <div>数据清理</div>
          <div>格式标准化</div>
        </div>
      </div>

      <Arrow />

      {/* 转换结果 */}
      <div className={cn("transition-all duration-500", step >= 2 ? "opacity-100 scale-100" : "opacity-30 scale-90")}>
        <MiniTable {...transformData.transformedTable} compact />
      </div>
    </div>
  );

  return (
    <div className="my-6 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 rounded-2xl border border-indigo-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span className="text-xl">🎬</span>
          {title || '数据流动可视化'}
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
        {type === 'pivot' && renderPivotAnimation()}
        {type === 'transform' && renderTransformAnimation()}
        {type === 'transaction' && renderTransactionFlow()}
      </div>

      {/* 图例 */}
      <div className="mt-4 pt-4 border-t border-indigo-200 dark:border-slate-700 flex flex-wrap gap-4 text-xs">
        {type === 'transaction' ? (
          <>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-500 rounded-full"></span>
              <span className="text-slate-600 dark:text-slate-400">活动状态</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-100 dark:bg-green-900/40 border-2 border-green-500 rounded-full"></span>
              <span className="text-slate-600 dark:text-slate-400">成功完成</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-red-100 dark:bg-red-900/40 border-2 border-red-500 rounded-full"></span>
              <span className="text-slate-600 dark:text-slate-400">失败回滚</span>
            </span>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );

  // 事务状态转换流程渲染
  function renderTransactionFlow() {
    const flowSteps = steps || transactionFlowData.steps;
    const flowConnections = connections || transactionFlowData.connections;

    return (
      <div className="flex flex-col items-center space-y-8 py-8">
        {/* 标题 */}
        {title && (
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              展示事务从开始到完成或回滚的完整生命周期
            </p>
          </div>
        )}

        {/* 事务流程图 */}
        <div className="relative w-full max-w-4xl">
          {/* 连接线 */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {flowConnections.map((conn, index) => {
              const fromStep = flowSteps.find(s => s.id === conn.from);
              const toStep = flowSteps.find(s => s.id === conn.to);
              if (!fromStep || !toStep) return null;

              const fromIndex = flowSteps.indexOf(fromStep);
              const toIndex = flowSteps.indexOf(toStep);

              // 计算连接线位置 - 简化为水平布局
              const x1 = 200 + fromIndex * 200;
              const y1 = 100;
              const x2 = 200 + toIndex * 200;
              const y2 = 100;

              const strokeColor = conn.type === 'success' ? '#10b981' :
                                conn.type === 'failure' ? '#ef4444' : '#6b7280';

              return (
                <g key={index}>
                  {/* 主连接线 */}
                  <path
                    d={`M ${x1} ${y1} L ${x2} ${y2}`}
                    stroke={strokeColor}
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* 箭头 */}
                  <polygon
                    points={`${x2-5},${y2-3} ${x2-5},${y2+3} ${x2},${y2}`}
                    fill={strokeColor}
                  />
                  {/* 标签 */}
                  {conn.label && (
                    <text
                      x={(x1 + x2) / 2}
                      y={y1 - 15}
                      textAnchor="middle"
                      className="text-xs fill-current"
                      style={{ fill: strokeColor }}
                    >
                      {conn.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* 步骤节点 */}
          <div className="relative flex justify-center items-center space-x-16 flex-wrap gap-8">
            {flowSteps.map((step, index) => (
              <div
                key={step.id}
                className="relative flex flex-col items-center"
              >
                {/* 步骤圆圈 */}
                <div
                  className={cn(
                    "w-24 h-24 rounded-full border-4 flex items-center justify-center text-center relative z-10",
                    step.status === 'completed'
                      ? "bg-green-100 dark:bg-green-900/40 border-green-500 text-green-700 dark:text-green-300"
                      : step.status === 'failed'
                      ? "bg-red-100 dark:bg-red-900/40 border-red-500 text-red-700 dark:text-red-300"
                      : step.status === 'active'
                      ? "bg-blue-100 dark:bg-blue-900/40 border-blue-500 text-blue-700 dark:text-blue-300 animate-pulse"
                      : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <div className="text-2xl">
                    {step.status === 'completed' ? '✅' :
                     step.status === 'failed' ? '❌' :
                     step.status === 'active' ? '🔄' : '⏳'}
                  </div>
                </div>

                {/* 步骤标签 */}
                <div className="mt-4 text-center max-w-32">
                  <div className={cn(
                    "font-semibold text-sm",
                    step.status === 'active' ? "text-blue-700 dark:text-blue-300" :
                    step.status === 'completed' ? "text-green-700 dark:text-green-300" :
                    "text-slate-700 dark:text-slate-300"
                  )}>
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {step.description}
                    </div>
                  )}
                </div>

                {/* 步骤编号 */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* 流程说明 */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                <span>✅</span>
                成功路径
              </h4>
              <ol className="text-sm text-green-700 dark:text-green-400 space-y-1 list-decimal list-inside">
                <li>开始事务 (BEGIN)</li>
                <li>执行数据库操作</li>
                <li>验证完整性约束</li>
                <li>准备提交阶段 (2PC)</li>
                <li>提交事务 (COMMIT)</li>
              </ol>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
              <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
                <span>❌</span>
                失败路径
              </h4>
              <ol className="text-sm text-red-700 dark:text-red-400 space-y-1 list-decimal list-inside">
                <li>执行过程中发生错误</li>
                <li>约束验证失败</li>
                <li>死锁或超时</li>
                <li>回滚事务 (ROLLBACK)</li>
                <li>恢复到初始状态</li>
              </ol>
            </div>
          </div>

          {/* 关键概念说明 */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
            <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
              <span className="text-xl">🔑</span>
              事务状态转换的关键概念
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-blue-700 dark:text-blue-400 mb-1">原子性 (Atomicity)</div>
                <div className="text-blue-600 dark:text-blue-500">
                  要么全部执行成功，要么全部回滚，不存在部分完成的状态。
                </div>
              </div>
              <div>
                <div className="font-semibold text-blue-700 dark:text-blue-400 mb-1">一致性 (Consistency)</div>
                <div className="text-blue-600 dark:text-blue-500">
                  事务执行前后，数据库从一个一致性状态转换到另一个一致性状态。
                </div>
              </div>
              <div>
                <div className="font-semibold text-blue-700 dark:text-blue-400 mb-1">隔离性 (Isolation)</div>
                <div className="text-blue-600 dark:text-blue-500">
                  并发执行的事务互不干扰，每个事务都感觉自己在独立执行。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
