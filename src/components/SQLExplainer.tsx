import { useState, useMemo } from 'react';
import { cn } from '../utils/cn';

interface SQLExplainerProps {
  sql: string;
  explanations: ExplanationStep[];
  title?: string;
}

interface ExplanationStep {
  code: string;
  explanation: string;
  tip?: string;
}

interface Token {
  type: 'keyword' | 'type' | 'function' | 'string' | 'number' | 'comment' | 'operator' | 'punctuation' | 'identifier' | 'whitespace';
  value: string;
}

// SQL 词法分析器
function tokenizeSQL(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  
  const keywords = new Set([
    'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
    'CREATE', 'DROP', 'TABLE', 'VIEW', 'INDEX', 'JOIN', 'LEFT', 'RIGHT', 'INNER',
    'OUTER', 'FULL', 'CROSS', 'ON', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'AS', 'ORDER',
    'BY', 'ASC', 'DESC', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL',
    'DISTINCT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'WITH', 'RECURSIVE',
    'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'DEFAULT', 'UNIQUE', 'IF', 'EXISTS',
    'CASCADE', 'REPLACE', 'ALTER', 'ADD', 'COLUMN', 'BEGIN', 'TRANSACTION', 'COMMIT',
    'ROLLBACK', 'TRUNCATE', 'LIKE', 'IN', 'BETWEEN', 'OVER', 'PARTITION', 'TRUE', 'FALSE'
  ]);
  
  const functions = new Set([
    'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'COALESCE', 'NULLIF', 'CAST', 'CONVERT',
    'UPPER', 'LOWER', 'TRIM', 'SUBSTRING', 'LENGTH', 'CONCAT', 'NOW', 'DATE',
    'YEAR', 'MONTH', 'DAY', 'HOUR', 'MINUTE', 'SECOND', 'ROW_NUMBER', 'RANK',
    'DENSE_RANK', 'LAG', 'LEAD', 'FIRST_VALUE', 'LAST_VALUE', 'ROUND', 'FLOOR',
    'CEIL', 'ABS', 'RANDOM', 'STRFTIME', 'PRINTF', 'TYPEOF', 'IFNULL'
  ]);
  
  const types = new Set([
    'INTEGER', 'INT', 'VARCHAR', 'TEXT', 'BOOLEAN', 'BOOL', 'DECIMAL', 'FLOAT',
    'DOUBLE', 'TIMESTAMP', 'DATE', 'TIME', 'BIGINT', 'SMALLINT', 'REAL', 'BLOB',
    'NUMERIC', 'CHAR', 'DATETIME'
  ]);

  while (i < code.length) {
    // 单行注释
    if (code.slice(i, i + 2) === '--') {
      let value = '';
      while (i < code.length && code[i] !== '\n') {
        value += code[i++];
      }
      tokens.push({ type: 'comment', value });
      continue;
    }
    
    // 多行注释
    if (code.slice(i, i + 2) === '/*') {
      let value = '/*';
      i += 2;
      while (i < code.length && code.slice(i, i + 2) !== '*/') {
        value += code[i++];
      }
      if (i < code.length) {
        value += '*/';
        i += 2;
      }
      tokens.push({ type: 'comment', value });
      continue;
    }
    
    // 空白字符
    if (/\s/.test(code[i])) {
      let value = '';
      while (i < code.length && /\s/.test(code[i])) {
        value += code[i++];
      }
      tokens.push({ type: 'whitespace', value });
      continue;
    }
    
    // 字符串（单引号）
    if (code[i] === "'") {
      let value = "'";
      i++;
      while (i < code.length) {
        if (code[i] === "'" && code[i + 1] === "'") {
          value += "''";
          i += 2;
        } else if (code[i] === "'") {
          value += "'";
          i++;
          break;
        } else {
          value += code[i++];
        }
      }
      tokens.push({ type: 'string', value });
      continue;
    }
    
    // 字符串（双引号）
    if (code[i] === '"') {
      let value = '"';
      i++;
      while (i < code.length && code[i] !== '"') {
        value += code[i++];
      }
      if (i < code.length) {
        value += '"';
        i++;
      }
      tokens.push({ type: 'identifier', value });
      continue;
    }
    
    // 数字
    if (/\d/.test(code[i]) || (code[i] === '.' && /\d/.test(code[i + 1]))) {
      let value = '';
      while (i < code.length && /[\d.]/.test(code[i])) {
        value += code[i++];
      }
      tokens.push({ type: 'number', value });
      continue;
    }
    
    // 标识符和关键词
    if (/[a-zA-Z_]/.test(code[i])) {
      let value = '';
      while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) {
        value += code[i++];
      }
      const upperValue = value.toUpperCase();
      
      if (keywords.has(upperValue)) {
        tokens.push({ type: 'keyword', value });
      } else if (functions.has(upperValue)) {
        tokens.push({ type: 'function', value });
      } else if (types.has(upperValue)) {
        tokens.push({ type: 'type', value });
      } else {
        tokens.push({ type: 'identifier', value });
      }
      continue;
    }
    
    // 运算符
    if (/[+\-*/%=<>!&|^~]/.test(code[i])) {
      let value = code[i++];
      if (i < code.length && /[=<>]/.test(code[i])) {
        value += code[i++];
      }
      tokens.push({ type: 'operator', value });
      continue;
    }
    
    // 标点符号
    if (/[(),;.]/.test(code[i])) {
      tokens.push({ type: 'punctuation', value: code[i++] });
      continue;
    }
    
    // 其他字符
    tokens.push({ type: 'identifier', value: code[i++] });
  }
  
  return tokens;
}

// Token 样式映射
const tokenStyles: Record<Token['type'], { className: string; style: React.CSSProperties }> = {
  keyword: {
    className: 'font-semibold',
    style: { color: '#7dd3fc' } // sky-300
  },
  function: {
    className: 'font-medium',
    style: { color: '#c4b5fd' } // violet-300
  },
  type: {
    className: '',
    style: { color: '#86efac' } // green-300
  },
  string: {
    className: '',
    style: { color: '#fcd34d' } // amber-300
  },
  number: {
    className: '',
    style: { color: '#fdba74' } // orange-300
  },
  comment: {
    className: 'italic',
    style: { color: '#94a3b8' } // slate-400
  },
  operator: {
    className: 'font-medium',
    style: { color: '#f0abfc' } // fuchsia-300
  },
  punctuation: {
    className: '',
    style: { color: '#cbd5e1' } // slate-300
  },
  identifier: {
    className: '',
    style: { color: '#e2e8f0' } // slate-200
  },
  whitespace: {
    className: '',
    style: {}
  }
};

// SQL 高亮渲染器
function HighlightedSQL({ code }: { code: string }) {
  const tokens = useMemo(() => tokenizeSQL(code), [code]);
  
  return (
    <>
      {tokens.map((token, index) => {
        if (token.type === 'whitespace') {
          return <span key={index}>{token.value}</span>;
        }
        const { className, style } = tokenStyles[token.type];
        return (
          <span key={index} className={className} style={style}>
            {token.value}
          </span>
        );
      })}
    </>
  );
}

// 行内代码高亮
function InlineCodeHighlight({ code }: { code: string }) {
  const tokens = useMemo(() => tokenizeSQL(code), [code]);
  
  return (
    <code className="font-mono text-sm">
      {tokens.map((token, index) => {
        if (token.type === 'whitespace') {
          return <span key={index}>{token.value}</span>;
        }
        
        // 浅色模式使用不同的颜色
        const lightStyles: Record<Token['type'], React.CSSProperties> = {
          keyword: { color: '#4f46e5' }, // indigo-600
          function: { color: '#7c3aed' }, // violet-600
          type: { color: '#059669' }, // emerald-600
          string: { color: '#d97706' }, // amber-600
          number: { color: '#ea580c' }, // orange-600
          comment: { color: '#64748b' }, // slate-500
          operator: { color: '#c026d3' }, // fuchsia-600
          punctuation: { color: '#475569' }, // slate-600
          identifier: { color: '#4f46e5' }, // indigo-600
          whitespace: {}
        };
        
        return (
          <span key={index} style={lightStyles[token.type]}>
            {token.value}
          </span>
        );
      })}
    </code>
  );
}

export function SQLExplainer({ sql, explanations, title = 'SQL 逐行解析' }: SQLExplainerProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 flex items-center justify-between">
        <h4 className="font-bold text-white flex items-center gap-2">
          <span className="text-xl">🔬</span>
          {title}
        </h4>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
        >
          {showAll ? '收起解释' : '展开全部'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* SQL 代码区域 */}
        <div className="lg:w-1/2 bg-slate-900 p-5 border-r border-slate-700">
          <div className="text-xs text-slate-400 mb-3 uppercase tracking-wide font-medium">SQL 语句</div>
          <pre className="text-sm font-mono leading-relaxed overflow-x-auto">
            <code>
              <HighlightedSQL code={sql} />
            </code>
          </pre>
        </div>

        {/* 解释区域 */}
        <div className="lg:w-1/2 bg-slate-50 dark:bg-slate-800 p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide font-medium">逐步解析</div>
          <div className="space-y-3">
            {explanations.map((step, index) => (
              <div
                key={index}
                className={cn(
                  'rounded-xl overflow-hidden transition-all duration-300 cursor-pointer border',
                  activeStep === index
                    ? 'border-indigo-400 dark:border-indigo-500 shadow-md'
                    : 'border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-600'
                )}
                onClick={() => setActiveStep(activeStep === index ? null : index)}
              >
                {/* 步骤头 */}
                <div className={cn(
                  'px-4 py-2.5 flex items-center gap-3 transition-colors',
                  activeStep === index
                    ? 'bg-indigo-100 dark:bg-indigo-900/40'
                    : 'bg-white dark:bg-slate-700'
                )}>
                  <span className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                    activeStep === index
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                  )}>
                    {index + 1}
                  </span>
                  <div className="flex-1 overflow-x-auto">
                    <InlineCodeHighlight code={step.code} />
                  </div>
                  <svg
                    className={cn(
                      'w-4 h-4 transition-transform text-slate-400 flex-shrink-0',
                      (activeStep === index || showAll) ? 'rotate-180' : ''
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* 解释内容 */}
                {(activeStep === index || showAll) && (
                  <div className="px-4 py-3 bg-white dark:bg-slate-700/50 border-t border-slate-100 dark:border-slate-600">
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.explanation}
                    </p>
                    {step.tip && (
                      <div className="mt-3 px-3 py-2.5 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-700/50">
                        <p className="text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
                          <span className="flex-shrink-0">💡</span>
                          <span>{step.tip}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="bg-slate-100 dark:bg-slate-900 px-5 py-2.5 text-xs text-slate-500 dark:text-slate-400 text-center border-t border-slate-200 dark:border-slate-700">
        💡 点击每个步骤查看详细解释 · 实际执行顺序可能因优化器而异
      </div>
    </div>
  );
}
