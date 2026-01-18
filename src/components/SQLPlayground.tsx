import { useState, useEffect, useRef } from 'react';
import { DataVisualization } from './DataVisualization';

interface SQLPlaygroundProps {
  isOpen: boolean;
  onClose: () => void;
}

// 增强的模拟数据库 - 包含更多样例数据
const mockDatabase: Record<string, Record<string, unknown>[]> = {
  concepts: [
    { id: 1, name: 'Entity', description: '万物之源', parent_id: null, created_at: '2024-01-01 00:00:00' },
    { id: 2, name: 'Living Thing', description: '有生命的', parent_id: 1, created_at: '2024-01-01 00:00:01' },
    { id: 3, name: 'Animal', description: '动物界', parent_id: 2, created_at: '2024-01-01 00:00:02' },
    { id: 4, name: 'Mammal', description: '哺乳动物', parent_id: 3, created_at: '2024-01-01 00:00:03' },
    { id: 5, name: 'Dog', description: '人类好朋友', parent_id: 4, created_at: '2024-01-01 00:00:04' },
    { id: 6, name: 'Cat', description: '神秘的生物', parent_id: 4, created_at: '2024-01-01 00:00:05' },
    { id: 7, name: 'Bird', description: '鸟纲', parent_id: 3, created_at: '2024-01-01 00:00:06' },
    { id: 8, name: 'Eagle', description: '鹰', parent_id: 7, created_at: '2024-01-01 00:00:07' },
  ],
  relations: [
    { id: 1, name: 'is-a', description: '继承关系', is_symmetric: false, is_transitive: true },
    { id: 2, name: 'has-part', description: '组成关系', is_symmetric: false, is_transitive: false },
    { id: 3, name: 'related-to', description: '相关关系', is_symmetric: true, is_transitive: false },
  ],
  properties: [
    { id: 1, concept_id: 5, property_name: 'sound', property_value: 'bark', confidence: 1.0 },
    { id: 2, concept_id: 6, property_name: 'sound', property_value: 'meow', confidence: 1.0 },
    { id: 3, concept_id: 8, property_name: 'can_fly', property_value: 'true', confidence: 0.9 },
    { id: 4, concept_id: 4, property_name: 'warm_blooded', property_value: 'true', confidence: 1.0 },
  ],
  concept_relations: [
    { id: 1, source_concept_id: 5, relation_id: 1, target_concept_id: 4, confidence: 1.0 },
    { id: 2, source_concept_id: 6, relation_id: 1, target_concept_id: 4, confidence: 1.0 },
    { id: 3, source_concept_id: 8, relation_id: 1, target_concept_id: 7, confidence: 1.0 },
    { id: 4, source_concept_id: 3, relation_id: 2, target_concept_id: 4, confidence: 0.8 },
  ],
};

// 增强的 SQL 执行引擎
class SQLExecutor {
  private database: Record<string, Record<string, unknown>[]> = { ...mockDatabase };
  private tempTables: Record<string, Record<string, unknown>[]> = {};

  // 获取表数据（包括临时表）
  private getTable(tableName: string): Record<string, unknown>[] | null {
    return this.database[tableName] || this.tempTables[tableName] || null;
  }

  // 设置表数据
  private setTable(tableName: string, data: Record<string, unknown>[], isTemp: boolean = false): void {
    if (isTemp) {
      this.tempTables[tableName] = data;
    } else {
      this.database[tableName] = data;
    }
  }

  // 解析 WHERE 条件
  private evaluateCondition(row: Record<string, unknown>, condition: string): boolean {
    // 简化版条件解析
    condition = condition.trim();

    // IS NULL / IS NOT NULL
    if (condition.includes('is null')) {
      const colMatch = condition.match(/(\w+)\s+is\s+null/);
      if (colMatch) return row[colMatch[1]] === null;
    }

    if (condition.includes('is not null')) {
      const colMatch = condition.match(/(\w+)\s+is\s+not\s+null/);
      if (colMatch) return row[colMatch[1]] !== null;
    }

    // 简单比较
    const eqMatch = condition.match(/(\w+)\s*=\s*(?:'([^']*)'|(\d+(?:\.\d+)?))/);
    if (eqMatch) {
      const col = eqMatch[1];
      const val = eqMatch[2] !== undefined ? eqMatch[2] : (eqMatch[3].includes('.') ? parseFloat(eqMatch[3]) : parseInt(eqMatch[3]));
      return row[col] === val;
    }

    const gtMatch = condition.match(/(\w+)\s*>\s*(\d+(?:\.\d+)?)/);
    if (gtMatch) {
      const col = gtMatch[1];
      const val = parseFloat(gtMatch[2]);
      return (row[col] as number) > val;
    }

    const ltMatch = condition.match(/(\w+)\s*<\s*(\d+(?:\.\d+)?)/);
    if (ltMatch) {
      const col = ltMatch[1];
      const val = parseFloat(ltMatch[2]);
      return (row[col] as number) < val;
    }

    const likeMatch = condition.match(/(\w+)\s+like\s+'([^']*)'/);
    if (likeMatch) {
      const col = likeMatch[1];
      const pattern = likeMatch[2].replace(/%/g, '.*');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(String(row[col]));
    }

    return true;
  }

  // 执行 SELECT 查询
  private executeSelect(sql: string): { columns: string[]; rows: unknown[][]; message: string } {
    // 解析 SELECT 子句
    const selectMatch = sql.match(/select\s+(.+?)\s+from/i);
    if (!selectMatch) throw new Error('无法解析 SELECT 子句');

    const selectClause = selectMatch[1].trim();
    const fromMatch = sql.match(/from\s+(.+?)(?:\s+where|\s+join|\s+group|\s+order|\s+limit|$)/i);
    if (!fromMatch) throw new Error('无法解析 FROM 子句');

    let tableName = fromMatch[1].trim();
    let data = this.getTable(tableName);
    if (!data) throw new Error(`表 "${tableName}" 不存在`);

    // 解析 JOIN
    let joinData = [...data];
    const joinMatch = sql.match(/join\s+(\w+)\s+on\s+(.+?)(?:\s+where|\s+group|\s+order|\s+limit|$)/i);
    if (joinMatch) {
      const joinTable = joinMatch[1];
      const joinCondition = joinMatch[2];
      const joinTableData = this.getTable(joinTable);
      if (!joinTableData) throw new Error(`连接表 "${joinTable}" 不存在`);

      // 简化 JOIN 实现
      joinData = [];
      for (const row1 of data) {
        for (const row2 of joinTableData) {
          // 简单的等值连接
          if (joinCondition.includes('=')) {
            const [left, right] = joinCondition.split('=').map(s => s.trim());
            if (row1[left] === row2[right]) {
              joinData.push({ ...row1, ...row2 });
            }
          }
        }
      }
      data = joinData;
    }

    // 解析 WHERE
    const whereMatch = sql.match(/where\s+(.+?)(?:\s+group|\s+order|\s+limit|$)/i);
    if (whereMatch) {
      const whereClause = whereMatch[1].trim();
      data = data.filter(row => this.evaluateCondition(row, whereClause));
    }

    // 解析聚合函数
    let isAggregate = false;
    let groupByColumns: string[] = [];
    const groupByMatch = sql.match(/group\s+by\s+(.+?)(?:\s+having|\s+order|\s+limit|$)/i);
    if (groupByMatch) {
      groupByColumns = groupByMatch[1].split(',').map(s => s.trim());
    }

    // 解析 SELECT 列
    let columns: string[];
    let columnAliases: Record<string, string> = {};

    if (selectClause === '*') {
      columns = Object.keys(data[0] || {});
    } else {
      const selectParts = selectClause.split(',').map(s => s.trim());
      columns = [];
      columnAliases = {};

      for (const part of selectParts) {
        if (part.includes(' as ')) {
          const [expr, alias] = part.split(/\s+as\s+/i);
          columns.push(expr);
          columnAliases[expr] = alias;
        } else {
          columns.push(part);
        }
      }

      // 检查是否包含聚合函数
      isAggregate = columns.some(col =>
        /\b(count|sum|avg|max|min)\s*\(/i.test(col) ||
        /\b(group_concat|string_agg)\s*\(/i.test(col)
      );
    }

    // 处理聚合查询
    let resultData = data;
    if (isAggregate) {
      if (groupByColumns.length > 0) {
        // GROUP BY 处理
        const groups: Record<string, Record<string, unknown>[]> = {};
        for (const row of data) {
          const groupKey = groupByColumns.map(col => row[col]).join('|');
          if (!groups[groupKey]) groups[groupKey] = [];
          groups[groupKey].push(row);
        }

        resultData = Object.entries(groups).map(([key, groupRows]) => {
          const result: Record<string, unknown> = {};

          // 添加分组列
          const keyParts = key.split('|');
          groupByColumns.forEach((col, idx) => {
            result[col] = keyParts[idx];
          });

          // 计算聚合函数
          for (const col of columns) {
            if (col.includes('count(')) {
              const match = col.match(/count\s*\(\s*(\*|\w+)\s*\)/i);
              if (match) {
                result[col] = groupRows.length;
              }
            } else if (col.includes('sum(')) {
              const match = col.match(/sum\s*\(\s*(\w+)\s*\)/i);
              if (match) {
                const sumCol = match[1];
                result[col] = groupRows.reduce((sum, row) => sum + (Number(row[sumCol]) || 0), 0);
              }
            } else if (col.includes('avg(')) {
              const match = col.match(/avg\s*\(\s*(\w+)\s*\)/i);
              if (match) {
                const avgCol = match[1];
                const sum = groupRows.reduce((sum, row) => sum + (Number(row[avgCol]) || 0), 0);
                result[col] = sum / groupRows.length;
              }
            } else if (col.includes('max(')) {
              const match = col.match(/max\s*\(\s*(\w+)\s*\)/i);
              if (match) {
                const maxCol = match[1];
                result[col] = Math.max(...groupRows.map(row => Number(row[maxCol]) || 0));
              }
            } else if (col.includes('min(')) {
              const match = col.match(/min\s*\(\s*(\w+)\s*\)/i);
              if (match) {
                const minCol = match[1];
                result[col] = Math.min(...groupRows.map(row => Number(row[minCol]) || 0));
              }
            }
          }

          return result;
        });
      } else {
        // 无分组的聚合
        const result: Record<string, unknown> = {};
        for (const col of columns) {
          if (col.includes('count(')) {
            result[col] = data.length;
          } else if (col.includes('sum(')) {
            const match = col.match(/sum\s*\(\s*(\w+)\s*\)/i);
            if (match) {
              const sumCol = match[1];
              result[col] = data.reduce((sum, row) => sum + (Number(row[sumCol]) || 0), 0);
            }
          } else if (col.includes('avg(')) {
            const match = col.match(/avg\s*\(\s*(\w+)\s*\)/i);
            if (match) {
              const avgCol = match[1];
              const sum = data.reduce((sum, row) => sum + (Number(row[avgCol]) || 0), 0);
              result[col] = sum / data.length;
            }
          } else if (col.includes('max(')) {
            const match = col.match(/max\s*\(\s*(\w+)\s*\)/i);
            if (match) {
              const maxCol = match[1];
              result[col] = Math.max(...data.map(row => Number(row[maxCol]) || 0));
            }
          } else if (col.includes('min(')) {
            const match = col.match(/min\s*\(\s*(\w+)\s*\)/i);
            if (match) {
              const minCol = match[1];
              result[col] = Math.min(...data.map(row => Number(row[minCol]) || 0));
            }
          }
        }
        resultData = [result];
      }
    }

    // 解析 ORDER BY
    const orderByMatch = sql.match(/order\s+by\s+(.+?)(?:\s+limit|$)/i);
    if (orderByMatch) {
      const orderBy = orderByMatch[1].trim();
      const [col, direction] = orderBy.split(/\s+/);
      resultData.sort((a, b) => {
        const aVal = a[col];
        const bVal = b[col];
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return direction?.toLowerCase() === 'desc' ? -cmp : cmp;
      });
    }

    // 解析 LIMIT
    const limitMatch = sql.match(/limit\s+(\d+)/i);
    if (limitMatch) {
      resultData = resultData.slice(0, parseInt(limitMatch[1]));
    }

    // 生成最终结果
    const finalColumns = isAggregate ? columns : (selectClause === '*' ? Object.keys(resultData[0] || {}) : columns);
    const rows = resultData.map(row =>
      finalColumns.map(col => {
        const actualCol = Object.keys(row).find(c => c.toLowerCase() === col.toLowerCase()) || col;
        return row[actualCol];
      })
    );

    return {
      columns: finalColumns.map(col => columnAliases[col] || col),
      rows,
      message: `查询成功，返回 ${rows.length} 行数据`
    };
  }

  // 执行 CREATE TABLE
  private executeCreate(sql: string): string {
    const createMatch = sql.match(/create\s+table\s+(\w+)\s*\((.+)\)/i);
    if (!createMatch) throw new Error('CREATE TABLE 语法错误');

    const tableName = createMatch[1];
    const columnsDef = createMatch[2];

    // 简单的列定义解析
    const columns = columnsDef.split(',').map(s => s.trim());
    const sampleRow: Record<string, unknown> = {};

    for (const col of columns) {
      const [name, type] = col.split(/\s+/);
      if (type?.toLowerCase().includes('int')) {
        sampleRow[name] = 0;
      } else if (type?.toLowerCase().includes('bool')) {
        sampleRow[name] = false;
      } else {
        sampleRow[name] = '';
      }
    }

    this.setTable(tableName, [sampleRow], true);
    return `表 "${tableName}" 创建成功`;
  }

  // 执行 INSERT
  private executeInsert(sql: string): string {
    const insertMatch = sql.match(/insert\s+into\s+(\w+)\s*(?:\(([^)]+)\))?\s*values?\s*(?:\((.+)\))/i);
    if (!insertMatch) throw new Error('INSERT 语法错误');

    const tableName = insertMatch[1];
    const columns = insertMatch[2]?.split(',').map(s => s.trim());
    const values = insertMatch[3]?.split(',').map(s => s.trim());

    if (!values) throw new Error('INSERT 缺少 VALUES');

    let table = this.getTable(tableName);
    if (!table) throw new Error(`表 "${tableName}" 不存在`);

    const newRow: Record<string, unknown> = {};
    const allColumns = Object.keys(table[0] || {});

    for (let i = 0; i < values.length; i++) {
      const colName = columns ? columns[i] : allColumns[i];
      let value: unknown = values[i];

      // 解析值
      if (value === 'NULL' || value === 'null') {
        value = null;
      } else if (typeof value === 'string' && value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      } else if (!isNaN(Number(value))) {
        value = Number(value);
      } else if (value === 'TRUE' || value === 'true') {
        value = true;
      } else if (value === 'FALSE' || value === 'false') {
        value = false;
      }

      newRow[colName] = value;
    }

    // 合并到现有数据
    const updatedTable = [...table, newRow];
    this.setTable(tableName, updatedTable, !!this.tempTables[tableName]);

    return `成功插入 1 行数据到表 "${tableName}"`;
  }

  // 主执行方法
  execute(sql: string): { columns: string[]; rows: unknown[][]; message: string } | { error: string } {
    try {
      const trimmed = sql.trim().toLowerCase();

      if (trimmed.startsWith('select')) {
        return this.executeSelect(sql);
      } else if (trimmed.startsWith('create table')) {
        const message = this.executeCreate(sql);
        return {
          columns: ['操作结果'],
          rows: [[message]],
          message
        };
      } else if (trimmed.startsWith('insert')) {
        const message = this.executeInsert(sql);
        return {
          columns: ['操作结果'],
          rows: [[message]],
          message
        };
      } else {
        return { error: '目前支持的 SQL 语句：SELECT、CREATE TABLE、INSERT。\n完整功能请访问 DuckDB 在线环境：https://shell.duckdb.org/' };
      }
    } catch (e) {
      return { error: String(e) };
    }
  }

  // 获取所有表信息
  getTables(): Record<string, { columns: string[]; rowCount: number }> {
    const result: Record<string, { columns: string[]; rowCount: number }> = {};

    // 永久表
    for (const [tableName, data] of Object.entries(this.database)) {
      result[tableName] = {
        columns: Object.keys(data[0] || {}),
        rowCount: data.length
      };
    }

    // 临时表
    for (const [tableName, data] of Object.entries(this.tempTables)) {
      result[tableName] = {
        columns: Object.keys(data[0] || {}),
        rowCount: data.length
      };
    }

    return result;
  }
}

// 全局 SQL 执行器实例
const sqlExecutor = new SQLExecutor();

function executeSQL(sql: string): { columns: string[]; rows: unknown[][]; message: string } | { error: string } {
  return sqlExecutor.execute(sql);
}

export function SQLPlayground({ isOpen, onClose }: SQLPlaygroundProps) {
  const [sql, setSQL] = useState(`SELECT * FROM concepts LIMIT 5;`);
  const [result, setResult] = useState<ReturnType<typeof executeSQL> | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [savedQueries, setSavedQueries] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'query' | 'tables' | 'history'>('query');
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleExecute = () => {
    const startTime = Date.now();
    const res = executeSQL(sql);
    const endTime = Date.now();
    setExecutionTime(endTime - startTime);
    setResult(res);
    if (!('error' in res)) {
      setHistory(prev => [sql, ...prev.slice(0, 9)]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleExecute();
    }
  };

  const saveQuery = () => {
    const name = prompt('请输入查询名称：');
    if (name) {
      setSavedQueries(prev => ({ ...prev, [name]: sql }));
    }
  };

  const loadQuery = (name: string) => {
    setSQL(savedQueries[name]);
  };

  const deleteSavedQuery = (name: string) => {
    setSavedQueries(prev => {
      const newQueries = { ...prev };
      delete newQueries[name];
      return newQueries;
    });
  };

  const exampleQueries = [
    { label: '查询所有概念', sql: 'SELECT * FROM concepts;' },
    { label: '查询根概念', sql: 'SELECT * FROM concepts WHERE parent_id IS NULL;' },
    { label: '查询哺乳动物的子概念', sql: "SELECT * FROM concepts WHERE parent_id = 4;" },
    { label: '查询所有关系类型', sql: 'SELECT * FROM relations;' },
    { label: '带 LIMIT 查询', sql: 'SELECT name, description FROM concepts LIMIT 3;' },
    { label: 'JOIN 查询', sql: 'SELECT c.name, p.name AS parent FROM concepts c LEFT JOIN concepts p ON c.parent_id = p.id;' },
    { label: '聚合查询', sql: 'SELECT parent_id, COUNT(*) as count FROM concepts GROUP BY parent_id;' },
    { label: '创建临时表', sql: 'CREATE TABLE temp_animals (id INTEGER, name VARCHAR, type VARCHAR);' },
    { label: '插入数据', sql: "INSERT INTO temp_animals VALUES (1, 'Dog', 'Pet'), (2, 'Cat', 'Pet');" },
  ];

  const tables = sqlExecutor.getTables();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-emerald-500 to-teal-500">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎮</span>
            <div>
              <h2 className="text-lg font-bold text-white">SQL 练习场</h2>
              <p className="text-xs text-white/80">增强的 SQL 学习环境</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-white/20 rounded-lg p-1">
              {(['query', 'tables', 'history'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    activeTab === tab
                      ? 'bg-white text-emerald-600'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {tab === 'query' ? '查询' : tab === 'tables' ? '表' : '历史'}
                </button>
              ))}
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
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {activeTab === 'query' && (
            <>
              {/* 示例查询 */}
              <div className="mb-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">快速示例：</p>
                <div className="flex flex-wrap gap-2">
                  {exampleQueries.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setSQL(q.sql)}
                      className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 保存的查询 */}
              {Object.keys(savedQueries).length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">保存的查询：</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(savedQueries).map(([name, querySql]) => (
                      <div key={name} className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                        <button
                          onClick={() => loadQuery(name)}
                          className="px-3 py-1 text-xs text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-full transition-colors"
                        >
                          {name}
                        </button>
                        <button
                          onClick={() => deleteSavedQuery(name)}
                          className="p-1 text-blue-500 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SQL 输入 */}
              <div className="relative mb-4">
                <textarea
                  ref={textareaRef}
                  value={sql}
                  onChange={(e) => setSQL(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入 SQL 查询..."
                  className="w-full h-40 p-4 font-mono text-sm bg-slate-900 text-slate-100 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  spellCheck={false}
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    onClick={saveQuery}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    title="保存查询"
                  >
                    💾
                  </button>
                  <span className="text-xs text-slate-500">⌘+Enter 执行</span>
                  <button
                    onClick={handleExecute}
                    className="px-4 py-1.5 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    执行
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'tables' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">数据库表结构</h3>
              {Object.entries(tables).map(([tableName, info]) => (
                <div key={tableName} className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-700 dark:text-slate-300">{tableName}</h4>
                    <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                      {info.rowCount} 行
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <div className="font-medium mb-1">列：</div>
                    <div className="font-mono text-xs bg-white dark:bg-slate-800 p-2 rounded border">
                      {info.columns.join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">执行历史</h3>
              {history.length === 0 ? (
                <p className="text-slate-500 text-center py-8">暂无执行历史</p>
              ) : (
                history.map((query, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-500">#{history.length - i}</span>
                      <button
                        onClick={() => setSQL(query)}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                      >
                        加载
                      </button>
                    </div>
                    <pre className="font-mono text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">
                      {query}
                    </pre>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 结果区域 */}
          {result && activeTab === 'query' && (
            <div className="mt-4">
              {'error' in result ? (
                <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">SQL 错误</span>
                  </div>
                  <p className="mt-2 text-sm text-red-600 dark:text-red-300 whitespace-pre-wrap">{result.error}</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {result.message}
                    </p>
                    <div className="flex items-center gap-2">
                      {executionTime && (
                        <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                          执行时间: {executionTime}ms
                        </span>
                      )}
                      <button
                        onClick={() => setShowVisualization(true)}
                        className="text-xs bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors flex items-center gap-1"
                      >
                        <span>📊</span>
                        可视化
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800">
                          {result.columns.map((col, i) => (
                            <th key={i} className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            {row.map((cell, j) => (
                              <td key={j} className="px-4 py-2 text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 max-w-xs truncate">
                                {cell === null ? (
                                  <span className="text-slate-400 italic">NULL</span>
                                ) : typeof cell === 'boolean' ? (
                                  <span className={cell ? 'text-green-600' : 'text-red-600'}>
                                    {cell ? 'TRUE' : 'FALSE'}
                                  </span>
                                ) : (
                                  String(cell)
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 功能提示 */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">🎯 支持的功能</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700 dark:text-blue-400">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>SELECT 查询（含 JOIN、聚合、排序）</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>CREATE TABLE（临时表）</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>INSERT INTO（数据插入）</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>查询历史和保存</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>数据可视化（图表、统计）</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
              <p className="text-sm">
                💡 要体验完整的 DuckDB 功能，请访问{' '}
                <a
                  href="https://shell.duckdb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800 dark:hover:text-blue-200"
                >
                  DuckDB 在线环境
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 数据可视化弹窗 */}
      {showVisualization && result && !('error' in result) && (
        <DataVisualization
          data={result.rows.map(row =>
            result.columns.reduce((obj, col, idx) => {
              obj[col] = row[idx];
              return obj;
            }, {} as Record<string, unknown>)
          )}
          columns={result.columns}
          onClose={() => setShowVisualization(false)}
        />
      )}
    </div>
  );
}
