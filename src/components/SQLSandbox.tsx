import { useState } from 'react';

interface SQLSandboxProps {
  initialCode: string;
  expectedOutput?: string[][];
  hint?: string;
  darkMode: boolean;
}

// 模拟的数据库数据
const mockDatabase = {
  concepts: [
    { id: 1, name: '实体', description: '具有独立存在的事物', parent_id: null },
    { id: 2, name: '物理实体', description: '可触摸的实体', parent_id: 1 },
    { id: 3, name: '抽象实体', description: '不可触摸的概念', parent_id: 1 },
    { id: 4, name: '生物', description: '有生命的物理实体', parent_id: 2 },
    { id: 5, name: '人工制品', description: '人类创造的物体', parent_id: 2 },
  ],
  relations: [
    { id: 1, name: 'is-a', description: '是一种', is_symmetric: false, is_transitive: true },
    { id: 2, name: 'part-of', description: '是...的一部分', is_symmetric: false, is_transitive: true },
    { id: 3, name: 'related-to', description: '与...相关', is_symmetric: true, is_transitive: false },
  ],
  properties: [
    { concept_id: 1, property_name: 'exists', property_value: 'true', value_type: 'boolean' },
    { concept_id: 2, property_name: 'tangible', property_value: 'true', value_type: 'boolean' },
    { concept_id: 4, property_name: 'alive', property_value: 'true', value_type: 'boolean' },
  ]
};

export function SQLSandbox({ initialCode, expectedOutput, hint, darkMode }: SQLSandboxProps) {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<string[][] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // 简单的 SQL 解析器（仅用于演示）
  const executeSQL = (sql: string) => {
    setIsRunning(true);
    setError(null);
    setResult(null);

    setTimeout(() => {
      try {
        const normalizedSQL = sql.trim().toUpperCase();
        
        if (normalizedSQL.startsWith('SELECT')) {
          // 解析 SELECT 语句
          const fromMatch = sql.match(/FROM\s+(\w+)/i);
          if (!fromMatch) {
            throw new Error('缺少 FROM 子句');
          }
          
          const tableName = fromMatch[1].toLowerCase();
          const tableData = mockDatabase[tableName as keyof typeof mockDatabase];
          
          if (!tableData) {
            throw new Error(`表 "${fromMatch[1]}" 不存在。可用的表：concepts, relations, properties`);
          }

          // 解析 SELECT 列
          const selectMatch = sql.match(/SELECT\s+(.+?)\s+FROM/i);
          if (!selectMatch) {
            throw new Error('无效的 SELECT 语句');
          }

          const selectPart = selectMatch[1].trim();
          let columns: string[];
          
          if (selectPart === '*') {
            columns = Object.keys(tableData[0]);
          } else {
            columns = selectPart.split(',').map(c => c.trim().toLowerCase());
          }

          // 解析 WHERE 子句
          let filteredData = [...tableData];
          const whereMatch = sql.match(/WHERE\s+(.+?)(?:ORDER|GROUP|LIMIT|$)/i);
          if (whereMatch) {
            const whereClause = whereMatch[1].trim();
            // 简单的条件解析
            const conditionMatch = whereClause.match(/(\w+)\s*(=|>|<|>=|<=|IS|LIKE)\s*(.+)/i);
            if (conditionMatch) {
              const [, col, op, val] = conditionMatch;
              const cleanVal = val.replace(/['"]/g, '').trim();
              
              filteredData = filteredData.filter((row: Record<string, unknown>) => {
                const rowVal = row[col.toLowerCase()];
                if (op.toUpperCase() === 'IS' && cleanVal.toUpperCase() === 'NULL') {
                  return rowVal === null;
                }
                if (op.toUpperCase() === 'IS' && cleanVal.toUpperCase().includes('NOT NULL')) {
                  return rowVal !== null;
                }
                if (op === '=') return String(rowVal) === cleanVal;
                if (op === '>') return Number(rowVal) > Number(cleanVal);
                if (op === '<') return Number(rowVal) < Number(cleanVal);
                return true;
              });
            }
          }

          // 解析 LIMIT
          const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
          if (limitMatch) {
            filteredData = filteredData.slice(0, parseInt(limitMatch[1]));
          }

          // 构建结果
          const headers = columns;
          const rows = filteredData.map((row: Record<string, unknown>) => 
            columns.map(col => {
              const val = row[col.toLowerCase()];
              return val === null ? 'NULL' : String(val);
            })
          );

          setResult([headers, ...rows]);
        } else if (normalizedSQL.startsWith('SHOW TABLES')) {
          setResult([
            ['table_name'],
            ['concepts'],
            ['relations'],
            ['properties']
          ]);
        } else if (normalizedSQL.startsWith('DESCRIBE') || normalizedSQL.startsWith('DESC')) {
          const tableMatch = sql.match(/(?:DESCRIBE|DESC)\s+(\w+)/i);
          if (tableMatch) {
            const tableName = tableMatch[1].toLowerCase();
            const tableData = mockDatabase[tableName as keyof typeof mockDatabase];
            if (tableData && tableData[0]) {
              const columns = Object.keys(tableData[0]);
              setResult([
                ['column_name', 'type'],
                ...columns.map(c => [c, typeof tableData[0][c as keyof typeof tableData[0]]])
              ]);
            } else {
              throw new Error(`表 "${tableMatch[1]}" 不存在`);
            }
          }
        } else {
          throw new Error('此沙盒仅支持 SELECT、SHOW TABLES 和 DESCRIBE 语句');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setIsRunning(false);
      }
    }, 500);
  };

  const checkAnswer = () => {
    if (!expectedOutput || !result) return null;
    const resultStr = JSON.stringify(result);
    const expectedStr = JSON.stringify(expectedOutput);
    return resultStr === expectedStr;
  };

  const answerStatus = checkAnswer();

  return (
    <div className={`my-6 rounded-xl overflow-hidden border ${
      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    } shadow-lg`}>
      {/* 标题栏 */}
      <div className={`px-4 py-3 flex items-center justify-between border-b ${
        darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              SQL 沙盒 - 动手试试
            </h4>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              编辑并运行 SQL 查询
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hint && (
            <button
              onClick={() => setShowHint(!showHint)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                showHint
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : darkMode 
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              💡 提示
            </button>
          )}
          <button
            onClick={() => setCode(initialCode)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              darkMode 
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ↺ 重置
          </button>
        </div>
      </div>

      {/* 提示区域 */}
      {showHint && hint && (
        <div className={`px-4 py-3 border-b ${
          darkMode ? 'bg-amber-900/20 border-amber-700/30' : 'bg-amber-50 border-amber-200'
        }`}>
          <p className={`text-sm ${darkMode ? 'text-amber-200' : 'text-amber-800'}`}>
            💡 {hint}
          </p>
        </div>
      )}

      {/* 编辑器 */}
      <div className="p-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={`w-full h-32 p-4 font-mono text-sm rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode 
              ? 'bg-slate-900 border-slate-700 text-slate-100' 
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
          placeholder="在此输入 SQL..."
          spellCheck={false}
        />
        
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={() => executeSQL(code)}
            disabled={isRunning}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              isRunning
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {isRunning ? (
              <>
                <div className="loading-dots">
                  <span></span><span></span><span></span>
                </div>
                执行中...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
                运行 SQL
              </>
            )}
          </button>

          {answerStatus !== null && (
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              answerStatus 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {answerStatus ? '✓ 正确！' : '✗ 结果不匹配，再试试'}
            </span>
          )}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className={`mx-4 mb-4 p-4 rounded-lg ${
          darkMode ? 'bg-red-900/30 border border-red-700/50' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className={`font-medium ${darkMode ? 'text-red-300' : 'text-red-800'}`}>执行错误</p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-red-200' : 'text-red-600'}`}>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 结果表格 */}
      {result && (
        <div className={`mx-4 mb-4 rounded-lg overflow-hidden border ${
          darkMode ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <div className={`px-3 py-2 text-xs font-medium ${
            darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
          }`}>
            📊 查询结果 ({result.length - 1} 行)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={darkMode ? 'bg-slate-800' : 'bg-slate-50'}>
                  {result[0].map((header, i) => (
                    <th key={i} className={`px-4 py-2 text-left font-semibold border-b ${
                      darkMode ? 'text-slate-200 border-slate-700' : 'text-slate-700 border-slate-200'
                    }`}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.slice(1).map((row, i) => (
                  <tr key={i} className={`${
                    darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                  }`}>
                    {row.map((cell, j) => (
                      <td key={j} className={`px-4 py-2 border-b ${
                        darkMode ? 'text-slate-300 border-slate-700/50' : 'text-slate-600 border-slate-100'
                      } ${cell === 'NULL' ? 'italic text-slate-400' : ''}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 可用表格信息 */}
      <div className={`px-4 py-3 border-t text-xs ${
        darkMode ? 'bg-slate-900/50 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
      }`}>
        <span className="font-medium">可用表格：</span>
        <span className="ml-2 font-mono">concepts</span>
        <span className="mx-1">•</span>
        <span className="font-mono">relations</span>
        <span className="mx-1">•</span>
        <span className="font-mono">properties</span>
        <span className="mx-3">|</span>
        <span>输入 <code className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">SHOW TABLES</code> 或 <code className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">DESCRIBE concepts</code> 查看更多</span>
      </div>
    </div>
  );
}
