import { useState, useMemo } from 'react';
import { cn } from '../utils/cn';

interface SQLCompareProps {
  isOpen: boolean;
  onClose: () => void;
}

// Token 类型
type TokenType = 'keyword' | 'function' | 'type' | 'string' | 'comment' | 'number' | 'operator' | 'punctuation' | 'plain';

interface Token {
  type: TokenType;
  value: string;
}

// SQL 关键词
const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
  'CREATE', 'DROP', 'TABLE', 'VIEW', 'INDEX', 'JOIN', 'LEFT', 'RIGHT', 'INNER',
  'ON', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'AS', 'ORDER', 'BY', 'ASC', 'DESC',
  'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL', 'DISTINCT', 'WITH', 'RECURSIVE'
]);

const SQL_FUNCTIONS = new Set([
  'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'COALESCE', 'ROW_NUMBER', 'RANK'
]);

// Token 颜色
const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: '#7dd3fc',
  function: '#c4b5fd',
  type: '#86efac',
  string: '#fcd34d',
  comment: '#9ca3af',
  number: '#fdba74',
  operator: '#f9a8d4',
  punctuation: '#d1d5db',
  plain: '#f1f5f9',
};

// 词法分析器
function tokenizeSQL(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  
  while (i < code.length) {
    const char = code[i];
    
    if (/\s/.test(char)) {
      let value = '';
      while (i < code.length && /\s/.test(code[i])) {
        value += code[i++];
      }
      tokens.push({ type: 'plain', value });
      continue;
    }
    
    if (code.slice(i, i + 2) === '--') {
      let value = '';
      while (i < code.length && code[i] !== '\n') {
        value += code[i++];
      }
      tokens.push({ type: 'comment', value });
      continue;
    }
    
    if (char === "'") {
      let value = char;
      i++;
      while (i < code.length && code[i] !== "'") {
        value += code[i++];
      }
      if (i < code.length) value += code[i++];
      tokens.push({ type: 'string', value });
      continue;
    }
    
    if (/\d/.test(char)) {
      let value = '';
      while (i < code.length && /[\d.]/.test(code[i])) {
        value += code[i++];
      }
      tokens.push({ type: 'number', value });
      continue;
    }
    
    if (/[a-zA-Z_]/.test(char)) {
      let value = '';
      while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) {
        value += code[i++];
      }
      const upper = value.toUpperCase();
      if (SQL_KEYWORDS.has(upper)) {
        tokens.push({ type: 'keyword', value });
      } else if (SQL_FUNCTIONS.has(upper)) {
        tokens.push({ type: 'function', value });
      } else {
        tokens.push({ type: 'plain', value });
      }
      continue;
    }
    
    if (/[+\-*/<>=!]/.test(char)) {
      tokens.push({ type: 'operator', value: char });
      i++;
      continue;
    }
    
    if (/[(),;.]/.test(char)) {
      tokens.push({ type: 'punctuation', value: char });
      i++;
      continue;
    }
    
    tokens.push({ type: 'plain', value: char });
    i++;
  }
  
  return tokens;
}

function HighlightedCode({ code }: { code: string }) {
  const tokens = useMemo(() => tokenizeSQL(code), [code]);
  
  return (
    <code className="text-sm font-mono">
      {tokens.map((token, i) => (
        <span key={i} style={{ color: TOKEN_COLORS[token.type] }}>
          {token.value}
        </span>
      ))}
    </code>
  );
}

const comparisonExamples = [
  {
    id: 'delete-vs-truncate',
    title: 'DELETE vs TRUNCATE',
    description: '两种清空表数据的方式对比',
    left: {
      title: 'DELETE',
      code: `-- DELETE 逐行删除
DELETE FROM concepts;

-- 可以回滚
BEGIN TRANSACTION;
DELETE FROM concepts;
ROLLBACK;  -- 可以撤销

-- 可以加条件
DELETE FROM concepts
WHERE parent_id IS NULL;`,
      pros: ['可以回滚', '可以带条件', '触发器会执行'],
      cons: ['速度慢', '占用日志空间'],
    },
    right: {
      title: 'TRUNCATE',
      code: `-- TRUNCATE 一次性清空
TRUNCATE TABLE concepts;

-- 不可回滚！
BEGIN TRANSACTION;
TRUNCATE TABLE concepts;
-- 无法 ROLLBACK

-- 不能加条件
-- 只能清空整个表`,
      pros: ['速度极快', '释放存储空间', '重置自增ID'],
      cons: ['不可回滚', '不能带条件', '不触发触发器'],
    },
  },
  {
    id: 'subquery-vs-join',
    title: '子查询 vs JOIN',
    description: '两种多表查询方式对比',
    left: {
      title: '子查询',
      code: `-- 使用子查询
SELECT name
FROM concepts
WHERE id IN (
  SELECT parent_id
  FROM concepts
  WHERE parent_id IS NOT NULL
);

-- EXISTS 子查询
SELECT * FROM concepts c
WHERE EXISTS (
  SELECT 1 FROM properties p
  WHERE p.concept_id = c.id
);`,
      pros: ['逻辑直观', '适合简单判断', '某些场景更优'],
      cons: ['可能效率低', '嵌套复杂', '难以调试'],
    },
    right: {
      title: 'JOIN',
      code: `-- 使用 JOIN
SELECT DISTINCT p.name
FROM concepts c
JOIN concepts p
  ON c.parent_id = p.id
WHERE c.parent_id IS NOT NULL;

-- 直接 JOIN
SELECT c.*, p.property_value
FROM concepts c
JOIN properties p
  ON p.concept_id = c.id;`,
      pros: ['通常更高效', '易于理解', '便于扩展'],
      cons: ['需要理解表关系', '可能返回重复行'],
    },
  },
  {
    id: 'where-vs-having',
    title: 'WHERE vs HAVING',
    description: '两种过滤方式的区别',
    left: {
      title: 'WHERE',
      code: `-- WHERE: 分组前过滤
SELECT parent_id, COUNT(*)
FROM concepts
WHERE parent_id IS NOT NULL  -- 先过滤
GROUP BY parent_id;

-- WHERE 不能使用聚合函数
-- 这是错误的:
-- WHERE COUNT(*) > 1  ❌`,
      pros: ['在分组前过滤', '减少处理数据量', '效率更高'],
      cons: ['不能用聚合函数', '只能过滤原始列'],
    },
    right: {
      title: 'HAVING',
      code: `-- HAVING: 分组后过滤
SELECT parent_id, COUNT(*) as cnt
FROM concepts
WHERE parent_id IS NOT NULL
GROUP BY parent_id
HAVING COUNT(*) > 1;  -- 过滤分组结果

-- HAVING 可以使用聚合函数
HAVING COUNT(*) > 1  ✓`,
      pros: ['可用聚合函数', '过滤分组结果'],
      cons: ['在分组后过滤', '处理完整数据后再过滤'],
    },
  },
  {
    id: 'view-vs-cte',
    title: '视图 vs CTE',
    description: '两种查询抽象方式对比',
    left: {
      title: '视图 (VIEW)',
      code: `-- 创建持久化视图
CREATE VIEW concept_tree AS
SELECT 
  c.name AS child,
  p.name AS parent
FROM concepts c
LEFT JOIN concepts p
  ON c.parent_id = p.id;

-- 像表一样使用
SELECT * FROM concept_tree
WHERE parent = 'Animal';`,
      pros: ['持久保存', '可复用', '权限控制', '简化复杂查询'],
      cons: ['需要维护', '修改需DDL', '可能影响性能'],
    },
    right: {
      title: 'CTE (WITH)',
      code: `-- 临时查询表达式
WITH concept_tree AS (
  SELECT 
    c.name AS child,
    p.name AS parent
  FROM concepts c
  LEFT JOIN concepts p
    ON c.parent_id = p.id
)
SELECT * FROM concept_tree
WHERE parent = 'Animal';`,
      pros: ['临时使用', '无需创建', '支持递归', '自包含'],
      cons: ['每次都要写', '只在当前查询有效'],
    },
  },
];

export function SQLCompare({ isOpen, onClose }: SQLCompareProps) {
  const [activeExample, setActiveExample] = useState(comparisonExamples[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-slideUp max-h-[90vh] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-cyan-500 to-blue-500 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚖️</span>
            <div>
              <h2 className="text-lg font-bold text-white">SQL 语法对比</h2>
              <p className="text-xs text-white/80">并排对比不同 SQL 写法的优缺点</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 标签切换 */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto flex-shrink-0">
          {comparisonExamples.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setActiveExample(ex)}
              className={cn(
                'px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors',
                activeExample.id === ex.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              )}
            >
              {ex.title}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-center">
            {activeExample.description}
          </p>

          {/* 对比面板 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧 */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 font-semibold text-slate-700 dark:text-slate-200">
                {activeExample.left.title}
              </div>
              <div className="bg-slate-900 p-4 overflow-x-auto">
                <pre className="whitespace-pre-wrap">
                  <HighlightedCode code={activeExample.left.code} />
                </pre>
              </div>
              <div className="p-4 space-y-3 bg-white dark:bg-slate-800">
                <div>
                  <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
                    <span>✅</span> 优点
                  </h4>
                  <ul className="space-y-1">
                    {activeExample.left.pros.map((pro, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1">
                    <span>❌</span> 缺点
                  </h4>
                  <ul className="space-y-1">
                    {activeExample.left.cons.map((con, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-red-500">•</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 右侧 */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 font-semibold text-slate-700 dark:text-slate-200">
                {activeExample.right.title}
              </div>
              <div className="bg-slate-900 p-4 overflow-x-auto">
                <pre className="whitespace-pre-wrap">
                  <HighlightedCode code={activeExample.right.code} />
                </pre>
              </div>
              <div className="p-4 space-y-3 bg-white dark:bg-slate-800">
                <div>
                  <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
                    <span>✅</span> 优点
                  </h4>
                  <ul className="space-y-1">
                    {activeExample.right.pros.map((pro, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1">
                    <span>❌</span> 缺点
                  </h4>
                  <ul className="space-y-1">
                    {activeExample.right.cons.map((con, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-red-500">•</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 总结 */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>💡 选择建议：</strong>
              {activeExample.id === 'delete-vs-truncate' && '需要回滚或条件删除用 DELETE；快速清空整表用 TRUNCATE。'}
              {activeExample.id === 'subquery-vs-join' && '多数情况下 JOIN 更高效；EXISTS 检查用子查询更直观。'}
              {activeExample.id === 'where-vs-having' && 'WHERE 过滤原始行，HAVING 过滤聚合结果，两者可以结合使用。'}
              {activeExample.id === 'view-vs-cte' && '需要复用的查询用视图；临时复杂查询用 CTE，递归必须用 CTE。'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
