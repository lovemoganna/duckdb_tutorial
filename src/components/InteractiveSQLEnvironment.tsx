import { useState, useCallback, useMemo } from 'react';
import { cn } from '../utils/cn';
import { OntologicalCard, OntologicalButton, OntologicalInput, LoadingState } from './DesignSystem';
import { EnhancedDataVisualization } from './EnhancedDataVisualization';

interface InteractiveSQLEnvironmentProps {
  onClose?: () => void;
}

interface QueryResult {
  columns: string[];
  data: Record<string, unknown>[];
  executionTime: number;
  error?: string;
}

export function InteractiveSQLEnvironment({ onClose }: InteractiveSQLEnvironmentProps) {
  const [sqlQuery, setSqlQuery] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentResult, setCurrentResult] = useState<QueryResult | null>(null);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [showVisualization, setShowVisualization] = useState(false);

  // 模拟的示例数据
  const sampleData = useMemo(() => ({
    users: [
      { id: 1, name: 'Alice', age: 25, city: 'New York', salary: 75000 },
      { id: 2, name: 'Bob', age: 30, city: 'San Francisco', salary: 85000 },
      { id: 3, name: 'Charlie', age: 35, city: 'Chicago', salary: 95000 },
      { id: 4, name: 'Diana', age: 28, city: 'New York', salary: 80000 },
      { id: 5, name: 'Eve', age: 32, city: 'Los Angeles', salary: 78000 },
    ],
    orders: [
      { order_id: 1001, user_id: 1, product: 'Laptop', quantity: 1, price: 1200.00, order_date: '2024-01-15' },
      { order_id: 1002, user_id: 2, product: 'Mouse', quantity: 2, price: 25.00, order_date: '2024-01-16' },
      { order_id: 1003, user_id: 1, product: 'Keyboard', quantity: 1, price: 80.00, order_date: '2024-01-17' },
      { order_id: 1004, user_id: 3, product: 'Monitor', quantity: 1, price: 300.00, order_date: '2024-01-18' },
      { order_id: 1005, user_id: 4, product: 'Headphones', quantity: 1, price: 150.00, order_date: '2024-01-19' },
    ],
    products: [
      { product_id: 1, name: 'Laptop', category: 'Electronics', price: 1200.00, stock: 50 },
      { product_id: 2, name: 'Mouse', category: 'Accessories', price: 25.00, stock: 200 },
      { product_id: 3, name: 'Keyboard', category: 'Accessories', price: 80.00, stock: 150 },
      { product_id: 4, name: 'Monitor', category: 'Electronics', price: 300.00, stock: 75 },
      { product_id: 5, name: 'Headphones', category: 'Audio', price: 150.00, stock: 100 },
    ]
  }), []);

  // SQL查询执行模拟
  const executeQuery = useCallback(async (query: string) => {
    setIsExecuting(true);
    setCurrentResult(null);

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    try {
      const startTime = Date.now();
      const result = simulateSQLExecution(query, sampleData);
      const executionTime = Date.now() - startTime;

      setCurrentResult({ ...result, executionTime });

      // 添加到历史记录
      setQueryHistory(prev => {
        const newHistory = [query, ...prev.filter(q => q !== query)].slice(0, 10);
        localStorage.setItem('sql-history', JSON.stringify(newHistory));
        return newHistory;
      });

    } catch (error) {
      setCurrentResult({
        columns: [],
        data: [],
        executionTime: 0,
        error: error instanceof Error ? error.message : '查询执行失败'
      });
    } finally {
      setIsExecuting(false);
    }
  }, [sampleData]);

  // 从历史记录加载
  useState(() => {
    const saved = localStorage.getItem('sql-history');
    if (saved) {
      try {
        setQueryHistory(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to load SQL history:', e);
      }
    }
  });

  // 示例查询
  const exampleQueries = [
    {
      name: '基础查询',
      query: 'SELECT * FROM users LIMIT 3;',
      description: '查询用户表前3条记录'
    },
    {
      name: '聚合查询',
      query: 'SELECT city, COUNT(*) as user_count, AVG(salary) as avg_salary FROM users GROUP BY city;',
      description: '按城市分组统计用户数量和平均薪资'
    },
    {
      name: '连接查询',
      query: 'SELECT u.name, o.product, o.price FROM users u JOIN orders o ON u.id = o.user_id LIMIT 5;',
      description: '查询用户订单信息'
    },
    {
      name: '子查询',
      query: 'SELECT * FROM users WHERE salary > (SELECT AVG(salary) FROM users);',
      description: '查询薪资高于平均水平的用户'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <OntologicalCard className="w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💻</span>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">交互式 SQL 环境</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                在线执行 SQL 查询，实时查看结果
              </p>
            </div>
          </div>
          {onClose && (
            <OntologicalButton variant="secondary" size="sm" onClick={onClose}>
              关闭
            </OntologicalButton>
          )}
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* 左侧面板 - 查询输入 */}
          <div className="w-1/2 flex flex-col border-r border-slate-200 dark:border-slate-700">
            {/* 查询输入区域 */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">SQL 查询</label>
                  <textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="输入 SQL 查询语句..."
                    className="w-full h-32 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 resize-none font-mono text-sm"
                  />
                </div>

                <div className="flex gap-3">
                  <OntologicalButton
                    onClick={() => executeQuery(sqlQuery)}
                    disabled={!sqlQuery.trim() || isExecuting}
                    className="flex-1"
                  >
                    {isExecuting ? <LoadingState size="sm" variant="spinner" /> : '执行查询'}
                  </OntologicalButton>

                  {currentResult && !currentResult.error && (
                    <OntologicalButton
                      variant="secondary"
                      onClick={() => setShowVisualization(true)}
                    >
                      📊 可视化
                    </OntologicalButton>
                  )}
                </div>
              </div>
            </div>

            {/* 示例查询 */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">示例查询</h3>
              <div className="space-y-3">
                {exampleQueries.map((example, index) => (
                  <OntologicalCard
                    key={index}
                    variant="outlined"
                    className="cursor-pointer hover:border-amber-300 dark:hover:border-amber-600"
                    onClick={() => setSqlQuery(example.query)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-lg mt-1">💡</div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{example.name}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {example.description}
                        </p>
                        <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono">
                          {example.query}
                        </code>
                      </div>
                    </div>
                  </OntologicalCard>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧面板 - 结果显示 */}
          <div className="w-1/2 flex flex-col">
            {/* 查询历史 */}
            {queryHistory.length > 0 && (
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-medium mb-2">查询历史</h3>
                <div className="flex flex-wrap gap-2">
                  {queryHistory.slice(0, 5).map((query, index) => (
                    <button
                      key={index}
                      onClick={() => setSqlQuery(query)}
                      className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors truncate max-w-32"
                    >
                      {query.length > 20 ? query.substring(0, 20) + '...' : query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 查询结果 */}
            <div className="flex-1 p-6 overflow-y-auto">
              {isExecuting ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <LoadingState size="lg" variant="dots" />
                    <p className="mt-4 text-slate-500">正在执行查询...</p>
                  </div>
                </div>
              ) : currentResult ? (
                <div className="space-y-4">
                  {/* 执行信息 */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      {currentResult.error ? (
                        <span className="text-red-500">❌</span>
                      ) : (
                        <span className="text-green-500">✅</span>
                      )}
                      <span className="text-sm font-medium">
                        {currentResult.error ? '查询失败' : '查询成功'}
                      </span>
                    </div>
                    <span className="text-sm text-slate-500">
                      执行时间: {currentResult.executionTime}ms
                    </span>
                  </div>

                  {/* 错误信息 */}
                  {currentResult.error && (
                    <OntologicalCard variant="outlined" className="border-red-200 dark:border-red-800">
                      <div className="flex items-start gap-3">
                        <span className="text-red-500 text-lg">⚠️</span>
                        <div>
                          <h4 className="font-medium text-red-700 dark:text-red-300 mb-2">查询错误</h4>
                          <p className="text-sm text-red-600 dark:text-red-400 font-mono">
                            {currentResult.error}
                          </p>
                        </div>
                      </div>
                    </OntologicalCard>
                  )}

                  {/* 查询结果 */}
                  {!currentResult.error && (
                    <OntologicalCard>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          查询结果 ({currentResult.data.length} 行)
                        </h3>
                        <span className="text-sm text-slate-500">
                          {currentResult.columns.length} 列
                        </span>
                      </div>

                      {currentResult.data.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                          <span className="text-4xl mb-4 block">📭</span>
                          <p>查询无结果</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm border-collapse">
                            <thead>
                              <tr className="bg-slate-50 dark:bg-slate-800">
                                {currentResult.columns.map((col, i) => (
                                  <th key={i} className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {currentResult.data.slice(0, 50).map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                  {currentResult.columns.map((col, j) => (
                                    <td key={j} className="px-4 py-3 text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 max-w-xs truncate">
                                      {row[col] === null ? (
                                        <span className="text-slate-400 italic">NULL</span>
                                      ) : String(row[col])}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {currentResult.data.length > 50 && (
                            <div className="p-3 text-center text-slate-500 dark:text-slate-400 text-sm">
                              ... 还有 {currentResult.data.length - 50} 行数据
                            </div>
                          )}
                        </div>
                      )}
                    </OntologicalCard>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <div className="text-center">
                    <span className="text-6xl mb-4 block">🚀</span>
                    <h3 className="text-lg font-medium mb-2">开始你的 SQL 之旅</h3>
                    <p className="text-sm">在左侧输入 SQL 查询，然后点击执行</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 可视化弹窗 */}
        {showVisualization && currentResult && !currentResult.error && (
          <EnhancedDataVisualization
            data={currentResult.data}
            columns={currentResult.columns}
            title="查询结果可视化"
            onClose={() => setShowVisualization(false)}
          />
        )}
      </OntologicalCard>
    </div>
  );
}

// 简化的 SQL 执行模拟器
function simulateSQLExecution(query: string, sampleData: any): QueryResult {
  const normalizedQuery = query.trim().toUpperCase();

  // 基础验证
  if (!normalizedQuery.includes('SELECT')) {
    throw new Error('只支持 SELECT 查询');
  }

  // 简单的表名提取和验证
  const tableMatch = query.match(/FROM\s+(\w+)/i);
  if (!tableMatch) {
    throw new Error('查询必须包含 FROM 子句');
  }

  const tableName = tableMatch[1].toLowerCase();
  if (!sampleData[tableName]) {
    throw new Error(`表 '${tableName}' 不存在。可用表: ${Object.keys(sampleData).join(', ')}`);
  }

  const tableData = sampleData[tableName];
  if (!Array.isArray(tableData) || tableData.length === 0) {
    return {
      columns: [],
      data: []
    };
  }

  // 提取列
  let columns: string[] = [];
  const selectMatch = query.match(/SELECT\s+(.*?)\s+FROM/i);
  if (selectMatch) {
    const selectPart = selectMatch[1].trim();
    if (selectPart === '*') {
      columns = Object.keys(tableData[0]);
    } else {
      // 简单处理列名
      columns = selectPart.split(',').map(col => col.trim().toLowerCase());
    }
  } else {
    columns = Object.keys(tableData[0]);
  }

  // 验证列存在
  const availableColumns = Object.keys(tableData[0]);
  const invalidColumns = columns.filter(col => !availableColumns.includes(col));
  if (invalidColumns.length > 0) {
    throw new Error(`列 '${invalidColumns.join(', ')}' 不存在。可用列: ${availableColumns.join(', ')}`);
  }

  // 简单的 LIMIT 处理
  let resultData = [...tableData];
  const limitMatch = query.match(/LIMIT\s+(\d+)/i);
  if (limitMatch) {
    const limit = parseInt(limitMatch[1]);
    resultData = resultData.slice(0, limit);
  }

  // 映射数据到指定列
  const mappedData = resultData.map(row =>
    columns.reduce((acc, col) => {
      acc[col] = row[col];
      return acc;
    }, {} as Record<string, unknown>)
  );

  return {
    columns,
    data: mappedData
  };
}
