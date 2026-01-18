import { cn } from '../utils/cn';

interface SQLFlowDiagramProps {
  type: 'select' | 'insert' | 'update' | 'delete' | 'join' | 'create' | 'cte';
  className?: string;
}

interface FlowStep {
  id: string;
  label: string;
  icon: string;
  description: string;
  color: string;
}

const flowConfigs: Record<string, { title: string; steps: FlowStep[]; connections: string[][] }> = {
  select: {
    title: 'SELECT 执行流程',
    steps: [
      { id: 'from', label: 'FROM', icon: '📦', description: '确定数据源表', color: 'blue' },
      { id: 'where', label: 'WHERE', icon: '🔍', description: '过滤行数据', color: 'amber' },
      { id: 'group', label: 'GROUP BY', icon: '📊', description: '分组聚合', color: 'purple' },
      { id: 'having', label: 'HAVING', icon: '✂️', description: '过滤分组', color: 'rose' },
      { id: 'select', label: 'SELECT', icon: '✅', description: '选择列', color: 'green' },
      { id: 'order', label: 'ORDER BY', icon: '🔢', description: '排序结果', color: 'cyan' },
      { id: 'limit', label: 'LIMIT', icon: '📄', description: '限制行数', color: 'slate' },
    ],
    connections: [['from', 'where'], ['where', 'group'], ['group', 'having'], ['having', 'select'], ['select', 'order'], ['order', 'limit']],
  },
  insert: {
    title: 'INSERT 执行流程',
    steps: [
      { id: 'parse', label: '解析', icon: '📝', description: '解析 INSERT 语句', color: 'slate' },
      { id: 'validate', label: '验证', icon: '🔒', description: '检查约束条件', color: 'amber' },
      { id: 'transform', label: '转换', icon: '🔄', description: '数据类型转换', color: 'purple' },
      { id: 'insert', label: '插入', icon: '➕', description: '写入存储', color: 'green' },
      { id: 'index', label: '索引', icon: '📇', description: '更新索引', color: 'blue' },
      { id: 'commit', label: '提交', icon: '✅', description: '确认事务', color: 'emerald' },
    ],
    connections: [['parse', 'validate'], ['validate', 'transform'], ['transform', 'insert'], ['insert', 'index'], ['index', 'commit']],
  },
  update: {
    title: 'UPDATE 执行流程',
    steps: [
      { id: 'parse', label: '解析', icon: '📝', description: '解析 UPDATE 语句', color: 'slate' },
      { id: 'locate', label: '定位', icon: '🎯', description: 'WHERE 条件筛选', color: 'amber' },
      { id: 'lock', label: '加锁', icon: '🔐', description: '行级锁定', color: 'rose' },
      { id: 'update', label: '更新', icon: '📝', description: '修改数据', color: 'blue' },
      { id: 'index', label: '索引', icon: '📇', description: '更新索引', color: 'purple' },
      { id: 'commit', label: '提交', icon: '✅', description: '释放锁/提交', color: 'green' },
    ],
    connections: [['parse', 'locate'], ['locate', 'lock'], ['lock', 'update'], ['update', 'index'], ['index', 'commit']],
  },
  delete: {
    title: 'DELETE 执行流程',
    steps: [
      { id: 'parse', label: '解析', icon: '📝', description: '解析 DELETE 语句', color: 'slate' },
      { id: 'locate', label: '定位', icon: '🎯', description: 'WHERE 条件筛选', color: 'amber' },
      { id: 'check', label: '检查', icon: '🔗', description: '外键约束检查', color: 'rose' },
      { id: 'delete', label: '删除', icon: '🗑️', description: '标记删除', color: 'red' },
      { id: 'index', label: '索引', icon: '📇', description: '更新索引', color: 'purple' },
      { id: 'commit', label: '提交', icon: '✅', description: '确认删除', color: 'green' },
    ],
    connections: [['parse', 'locate'], ['locate', 'check'], ['check', 'delete'], ['delete', 'index'], ['index', 'commit']],
  },
  join: {
    title: 'JOIN 执行流程',
    steps: [
      { id: 'left', label: '左表', icon: '📦', description: '读取左表数据', color: 'blue' },
      { id: 'right', label: '右表', icon: '📦', description: '读取右表数据', color: 'cyan' },
      { id: 'match', label: '匹配', icon: '🔗', description: 'ON 条件匹配', color: 'amber' },
      { id: 'combine', label: '合并', icon: '🔀', description: '合并匹配行', color: 'purple' },
      { id: 'filter', label: '过滤', icon: '🔍', description: 'WHERE 过滤', color: 'rose' },
      { id: 'result', label: '结果', icon: '✅', description: '返回结果集', color: 'green' },
    ],
    connections: [['left', 'match'], ['right', 'match'], ['match', 'combine'], ['combine', 'filter'], ['filter', 'result']],
  },
  create: {
    title: 'CREATE TABLE 执行流程',
    steps: [
      { id: 'parse', label: '解析', icon: '📝', description: '解析 DDL 语句', color: 'slate' },
      { id: 'check', label: '检查', icon: '🔍', description: '检查表是否存在', color: 'amber' },
      { id: 'validate', label: '验证', icon: '✔️', description: '验证列定义', color: 'purple' },
      { id: 'create', label: '创建', icon: '🏗️', description: '创建表结构', color: 'blue' },
      { id: 'meta', label: '元数据', icon: '📋', description: '更新系统表', color: 'cyan' },
      { id: 'done', label: '完成', icon: '✅', description: '表创建成功', color: 'green' },
    ],
    connections: [['parse', 'check'], ['check', 'validate'], ['validate', 'create'], ['create', 'meta'], ['meta', 'done']],
  },
  cte: {
    title: 'CTE 执行流程',
    steps: [
      { id: 'define', label: '定义', icon: '📝', description: 'WITH 定义 CTE', color: 'slate' },
      { id: 'base', label: '基础', icon: '🌱', description: '执行基础查询', color: 'green' },
      { id: 'recurse', label: '递归', icon: '🔄', description: '递归迭代', color: 'amber' },
      { id: 'union', label: '合并', icon: '🔀', description: 'UNION ALL 合并', color: 'purple' },
      { id: 'main', label: '主查询', icon: '🔍', description: '执行主 SELECT', color: 'blue' },
      { id: 'result', label: '结果', icon: '✅', description: '返回结果', color: 'cyan' },
    ],
    connections: [['define', 'base'], ['base', 'recurse'], ['recurse', 'union'], ['union', 'main'], ['main', 'result']],
  },
};

const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/40', border: 'border-blue-400 dark:border-blue-600', text: 'text-blue-700 dark:text-blue-300' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/40', border: 'border-amber-400 dark:border-amber-600', text: 'text-amber-700 dark:text-amber-300' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/40', border: 'border-purple-400 dark:border-purple-600', text: 'text-purple-700 dark:text-purple-300' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/40', border: 'border-rose-400 dark:border-rose-600', text: 'text-rose-700 dark:text-rose-300' },
  green: { bg: 'bg-green-100 dark:bg-green-900/40', border: 'border-green-400 dark:border-green-600', text: 'text-green-700 dark:text-green-300' },
  cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/40', border: 'border-cyan-400 dark:border-cyan-600', text: 'text-cyan-700 dark:text-cyan-300' },
  slate: { bg: 'bg-slate-100 dark:bg-slate-700', border: 'border-slate-400 dark:border-slate-500', text: 'text-slate-700 dark:text-slate-300' },
  red: { bg: 'bg-red-100 dark:bg-red-900/40', border: 'border-red-400 dark:border-red-600', text: 'text-red-700 dark:text-red-300' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', border: 'border-emerald-400 dark:border-emerald-600', text: 'text-emerald-700 dark:text-emerald-300' },
};

export function SQLFlowDiagram({ type, className }: SQLFlowDiagramProps) {
  const config = flowConfigs[type];
  if (!config) return null;

  return (
    <div className={cn('my-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700', className)}>
      <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
        <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm">
          📊
        </span>
        {config.title}
      </h4>
      
      {/* 流程图 */}
      <div className="relative">
        {/* 水平流程 */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4">
          {config.steps.map((step, index) => {
            const colors = colorClasses[step.color] || colorClasses.slate;
            return (
              <div key={step.id} className="flex items-center">
                {/* 步骤节点 */}
                <div className="flex flex-col items-center min-w-[100px]">
                  <div className={cn(
                    'w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center shadow-md transition-transform hover:scale-105',
                    colors.bg,
                    colors.border
                  )}>
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <span className={cn('text-xs font-bold mt-2', colors.text)}>
                    {step.label}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center max-w-[100px]">
                    {step.description}
                  </span>
                </div>
                
                {/* 连接箭头 */}
                {index < config.steps.length - 1 && (
                  <div className="flex items-center mx-1 flex-shrink-0 mt-[-40px]">
                    <div className="w-6 h-0.5 bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500"></div>
                    <svg className="w-3 h-3 text-slate-400 dark:text-slate-500 -ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 图例 */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="text-slate-500 dark:text-slate-400">执行顺序：</span>
          {config.steps.map((step, i) => (
            <span key={step.id} className="flex items-center gap-1">
              <span className="font-mono text-slate-600 dark:text-slate-300">{i + 1}.</span>
              <span className={colorClasses[step.color]?.text || 'text-slate-600'}>{step.label}</span>
              {i < config.steps.length - 1 && <span className="text-slate-400 ml-1">→</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
