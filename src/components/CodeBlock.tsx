import { useState, useMemo } from 'react';
import { NoteButton } from './NoteButton';
import type { Note } from '../types';

interface CodeBlockProps {
  code: string;
  title?: string;
  sectionId?: string;
  blockId?: string;
  notes?: Note[];
  onAddNote?: (content: string) => void;
  onUpdateNote?: (id: string, content: string) => void;
  onDeleteNote?: (id: string) => void;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  language?: 'sql' | 'text' | 'json';
}

// Token 类型
type TokenType = 'keyword' | 'function' | 'type' | 'string' | 'comment' | 'number' | 'operator' | 'punctuation' | 'plain';

interface Token {
  type: TokenType;
  value: string;
}

// SQL 关键词列表
const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 
  'CREATE', 'DROP', 'TABLE', 'VIEW', 'INDEX', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 
  'FULL', 'CROSS', 'ON', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'AS', 'ORDER', 'BY', 'ASC', 
  'DESC', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL', 'DISTINCT', 'CASE', 
  'WHEN', 'THEN', 'ELSE', 'END', 'WITH', 'RECURSIVE', 'PRIMARY', 'KEY', 'FOREIGN', 
  'REFERENCES', 'DEFAULT', 'UNIQUE', 'IF', 'EXISTS', 'CASCADE', 'REPLACE', 'ALTER', 
  'ADD', 'COLUMN', 'COMMENT', 'BEGIN', 'TRANSACTION', 'COMMIT', 'ROLLBACK', 'TRUNCATE', 
  'LIKE', 'IN', 'BETWEEN', 'OVER', 'PARTITION', 'RETURNING', 'USING', 'NATURAL', 
  'EXCEPT', 'INTERSECT', 'TRUE', 'FALSE'
]);

const SQL_FUNCTIONS = new Set([
  'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'COALESCE', 'NULLIF', 'CAST', 'CONCAT', 
  'SUBSTRING', 'TRIM', 'UPPER', 'LOWER', 'LENGTH', 'REPLACE', 'ROUND', 'FLOOR', 
  'CEIL', 'ABS', 'NOW', 'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 
  'DATE', 'TIME', 'YEAR', 'MONTH', 'DAY', 'EXTRACT', 'ROW_NUMBER', 'RANK', 
  'DENSE_RANK', 'NTILE', 'LAG', 'LEAD', 'FIRST_VALUE', 'LAST_VALUE', 'STRING_AGG',
  'ARRAY_AGG', 'JSON_AGG', 'READ_CSV', 'READ_PARQUET', 'READ_JSON', 'TYPEOF'
]);

const SQL_TYPES = new Set([
  'INTEGER', 'INT', 'VARCHAR', 'TEXT', 'BOOLEAN', 'BOOL', 'DECIMAL', 'FLOAT', 
  'DOUBLE', 'TIMESTAMP', 'DATE', 'TIME', 'BIGINT', 'SMALLINT', 'TINYINT', 'REAL', 
  'NUMERIC', 'CHAR', 'BLOB', 'UUID', 'JSON', 'ARRAY', 'HUGEINT'
]);

// Token 颜色映射 - 高对比度配色方案
const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: '#38bdf8',    // sky-400 - 明亮蓝色
  function: '#a78bfa',   // violet-400 - 紫色
  type: '#4ade80',       // green-400 - 亮绿色
  string: '#facc15',     // yellow-400 - 黄色
  comment: '#94a3b8',    // slate-400 - 灰色（注释偏淡）
  number: '#fb923c',     // orange-400 - 橙色
  operator: '#f472b6',   // pink-400 - 粉色
  punctuation: '#e2e8f0', // slate-200 - 浅色标点
  plain: '#f8fafc',      // slate-50 - 高亮白色
};

// SQL 词法分析器
function tokenizeSQL(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  
  while (i < code.length) {
    const char = code[i];
    
    // 空白字符
    if (/\s/.test(char)) {
      let value = '';
      while (i < code.length && /\s/.test(code[i])) {
        value += code[i];
        i++;
      }
      tokens.push({ type: 'plain', value });
      continue;
    }
    
    // 单行注释
    if (code.slice(i, i + 2) === '--') {
      let value = '';
      while (i < code.length && code[i] !== '\n') {
        value += code[i];
        i++;
      }
      tokens.push({ type: 'comment', value });
      continue;
    }
    
    // 字符串 (单引号)
    if (char === "'") {
      let value = char;
      i++;
      while (i < code.length) {
        value += code[i];
        if (code[i] === "'" && code[i - 1] !== '\\') {
          if (code[i + 1] === "'") {
            // 转义的单引号
            i++;
            value += code[i];
          } else {
            i++;
            break;
          }
        }
        i++;
      }
      tokens.push({ type: 'string', value });
      continue;
    }
    
    // 数字
    if (/\d/.test(char)) {
      let value = '';
      while (i < code.length && /[\d.]/.test(code[i])) {
        value += code[i];
        i++;
      }
      tokens.push({ type: 'number', value });
      continue;
    }
    
    // 标识符和关键词
    if (/[a-zA-Z_]/.test(char)) {
      let value = '';
      while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) {
        value += code[i];
        i++;
      }
      const upperValue = value.toUpperCase();
      
      if (SQL_KEYWORDS.has(upperValue)) {
        tokens.push({ type: 'keyword', value });
      } else if (SQL_FUNCTIONS.has(upperValue)) {
        tokens.push({ type: 'function', value });
      } else if (SQL_TYPES.has(upperValue)) {
        tokens.push({ type: 'type', value });
      } else {
        tokens.push({ type: 'plain', value });
      }
      continue;
    }
    
    // 操作符
    if (/[+\-*/<>=!|&]/.test(char)) {
      let value = char;
      i++;
      // 多字符操作符
      if (i < code.length && /[=<>|&]/.test(code[i])) {
        value += code[i];
        i++;
      }
      tokens.push({ type: 'operator', value });
      continue;
    }
    
    // 标点符号
    if (/[(),;.]/.test(char)) {
      tokens.push({ type: 'punctuation', value: char });
      i++;
      continue;
    }
    
    // 其他字符
    tokens.push({ type: 'plain', value: char });
    i++;
  }
  
  return tokens;
}

// 渲染 Token 为 React 元素
function renderTokens(tokens: Token[]): React.ReactNode[] {
  return tokens.map((token, index) => (
    <span
      key={index}
      style={{
        color: TOKEN_COLORS[token.type],
        fontWeight: token.type === 'keyword' ? 700 : token.type === 'function' ? 600 : 400,
        fontStyle: token.type === 'comment' ? 'italic' : 'normal',
        textShadow: token.type === 'keyword' ? '0 0 1px rgba(56, 189, 248, 0.3)' : 'none',
      }}
    >
      {token.value}
    </span>
  ));
}

export function CodeBlock({ 
  code, 
  title, 
  sectionId, 
  blockId, 
  notes, 
  onAddNote, 
  onUpdateNote, 
  onDeleteNote,
  showLineNumbers = true,
  highlightLines = [],
  language = 'sql'
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');
  const lineCount = lines.length;

  // 对每行进行语法高亮
  const highlightedLines = useMemo(() => {
    if (language !== 'sql') {
      return lines.map(line => [{ type: 'plain' as TokenType, value: line }]);
    }
    return lines.map(line => tokenizeSQL(line));
  }, [code, language, lines]);

  return (
    <div className="my-6 rounded-xl overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-xl border border-slate-600">
      {/* 标题栏 - macOS 风格 */}
      <div className="px-4 py-3 flex justify-between items-center"
           style={{ background: 'linear-gradient(to right, #1e293b, #334155, #1e293b)' }}>
        <div className="flex items-center gap-3">
          {/* 窗口按钮 */}
          <div className="flex gap-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
              title={isExpanded ? "收起代码" : "展开代码"}
            />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <button 
              onClick={copyToClipboard}
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
              title="复制代码"
            />
          </div>
          {title && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500">|</span>
              <span className="text-slate-200 text-sm font-medium">{title}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* 语言标签 */}
          <span className="px-2 py-0.5 text-xs rounded font-mono"
                style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            {language.toUpperCase()}
          </span>
          {/* 行数标签 */}
          <span className="text-xs text-slate-400">
            {lineCount} 行
          </span>
          {notes !== undefined && onAddNote && onUpdateNote && onDeleteNote && sectionId && blockId && (
            <NoteButton
              sectionId={sectionId}
              blockId={blockId}
              notes={notes}
              onAdd={onAddNote}
              onUpdate={onUpdateNote}
              onDelete={onDeleteNote}
            />
          )}
          <button
            onClick={copyToClipboard}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 border ${
              copied 
                ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                : 'bg-slate-600/50 hover:bg-slate-500/50 text-slate-200 border-slate-500/30'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                已复制
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                复制
              </>
            )}
          </button>
        </div>
      </div>

      {/* 代码区域 */}
      <div 
        className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ background: '#0f172a' }}
      >
        <div className="relative flex">
          {/* 行号区域 */}
          {showLineNumbers && (
            <div className="flex-shrink-0 py-4 pr-2 text-right select-none"
                 style={{ borderRight: '1px solid #334155', background: '#0c1222' }}>
              {lines.map((_, index) => (
                <div 
                  key={index} 
                  className={`px-3 text-xs font-mono ${
                    highlightLines.includes(index + 1)
                      ? 'text-amber-400 font-bold'
                      : 'text-slate-600'
                  }`}
                  style={{ lineHeight: '1.75rem' }}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          )}

          {/* 代码内容 */}
          <pre className="flex-1 p-4 overflow-x-auto" style={{ margin: 0 }}>
            <code className="text-sm font-mono block" style={{ fontFamily: "'SF Mono', 'Fira Code', 'JetBrains Mono', Consolas, monospace" }}>
              {highlightedLines.map((tokens, lineIndex) => (
                <div 
                  key={lineIndex}
                  className={`${
                    highlightLines.includes(lineIndex + 1)
                      ? 'bg-amber-500/10 -mx-4 px-4 border-l-2 border-amber-400'
                      : ''
                  }`}
                  style={{ lineHeight: '1.75rem', minHeight: '1.75rem' }}
                >
                  {tokens.length > 0 ? renderTokens(tokens) : <span>&nbsp;</span>}
                </div>
              ))}
            </code>
          </pre>
        </div>

        {/* 底部装饰线 */}
        <div className="h-1" style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)' }} />
      </div>

      {/* 收起状态提示 */}
      {!isExpanded && (
        <button 
          onClick={() => setIsExpanded(true)}
          className="w-full py-2 text-sm transition-colors flex items-center justify-center gap-2"
          style={{ background: '#1e293b', color: '#94a3b8' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          点击展开代码 ({lineCount} 行)
        </button>
      )}
    </div>
  );
}
