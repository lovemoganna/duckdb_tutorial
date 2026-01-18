import { useState } from 'react';
import { cn } from '../utils/cn';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
}

interface FAQProps {
  items: FAQItem[];
  searchable?: boolean;
  className?: string;
}

export function FAQ({ items, searchable = true, className }: FAQProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(new Set(items.map(item => item.category).filter(Boolean)));

  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      {/* 搜索和筛选 */}
      {(searchable || categories.length > 0) && (
        <div className="mb-8 space-y-4">
          {searchable && (
            <div className="relative">
              <input
                type="text"
                placeholder="搜索问题..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </div>
            </div>
          )}

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  'px-3 py-1 rounded-full text-sm transition-colors',
                  selectedCategory === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                )}
              >
                全部
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category!)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm transition-colors',
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAQ 列表 */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🤔</div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              未找到相关问题
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              尝试调整搜索关键词或浏览其他分类
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
                    {item.question}
                  </h3>
                  {item.category && (
                    <span className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full">
                      {item.category}
                    </span>
                  )}
                </div>
                <div className="ml-4 text-slate-400">
                  {expandedItems.has(item.id) ? '−' : '+'}
                </div>
              </button>

              {expandedItems.has(item.id) && (
                <div className="px-6 pb-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="pt-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                    {item.answer}
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 统计信息 */}
      <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        显示 {filteredItems.length} 个问题
        {searchQuery && `（搜索"${searchQuery}"）`}
        {selectedCategory !== 'all' && `（分类"${selectedCategory}"）`}
      </div>
    </div>
  );
}

// 预定义的 FAQ 数据
export const DEFAULT_FAQ_ITEMS: FAQItem[] = [
  {
    id: 'install-duckdb',
    question: '如何安装和设置 DuckDB？',
    answer: 'DuckDB 支持多种安装方式：\n\n1. **Python**: `pip install duckdb`\n2. **Node.js**: `npm install duckdb`\n3. **命令行**: 下载二进制文件或使用包管理器\n4. **浏览器**: 通过 CDN 或 npm 包使用\n\n安装完成后，可以直接在命令行中输入 `duckdb` 启动交互式 shell。',
    category: '安装配置',
    tags: ['安装', '设置', '环境']
  },
  {
    id: 'connect-database',
    question: '如何连接到数据库文件？',
    answer: 'DuckDB 支持多种连接方式：\n\n```sql\n-- 创建/连接数据库文件\n.open database.db\n\n-- 或者在启动时指定\nduckdb database.db\n\n-- 内存数据库（默认）\n.open :memory:\n```\n\n数据库文件不存在时会自动创建。使用 `:memory:` 表示内存数据库，重启后数据会丢失。',
    category: '基础操作',
    tags: ['连接', '数据库', '文件']
  },
  {
    id: 'import-csv',
    question: '如何导入 CSV 文件？',
    answer: 'DuckDB 提供了多种 CSV 导入方式：\n\n```sql\n-- 自动检测格式\nSELECT * FROM read_csv_auto(\'data.csv\');\n\n-- 手动指定参数\nSELECT * FROM read_csv(\'data.csv\',\n    header=true,\n    delim=\',\',\n    quote=\'"\',\n    escape=\'"\',\n    nullstr=\'\'\n);\n\n-- 创建表并导入\nCREATE TABLE my_table AS\nSELECT * FROM read_csv_auto(\'data.csv\');\n```',
    category: '数据导入',
    tags: ['CSV', '导入', '数据']
  },
  {
    id: 'performance-tuning',
    question: '如何优化查询性能？',
    answer: 'DuckDB 性能优化的关键点：\n\n1. **使用索引**: 为常用查询列创建索引\n2. **查询优化**: 查看执行计划 `EXPLAIN ANALYZE`\n3. **并行处理**: 大查询自动并行\n4. **内存管理**: 合理设置内存限制\n5. **数据类型**: 使用合适的数据类型\n6. **分区**: 对大表进行分区\n\n```sql\n-- 查看执行计划\nEXPLAIN ANALYZE SELECT * FROM large_table WHERE column > 100;\n\n-- 创建索引\nCREATE INDEX idx_column ON table_name(column);\n```',
    category: '性能优化',
    tags: ['性能', '优化', '索引']
  },
  {
    id: 'memory-vs-disk',
    question: '什么时候使用内存数据库，什么时候使用磁盘数据库？',
    answer: '选择数据库类型的考虑因素：\n\n**内存数据库 (:memory:)**\n- ✅ 速度极快\n- ✅ 无磁盘I/O\n- ✅ 临时分析\n- ❌ 重启后数据丢失\n- ❌ 数据量受内存限制\n\n**磁盘数据库 (.db文件)**\n- ✅ 数据持久化\n- ✅ 支持大数据集\n- ✅ 多进程共享\n- ❌ 相对较慢\n- ❌ 需要磁盘空间\n\n**建议**: 小数据集分析用内存，大数据集或需要持久化用磁盘。',
    category: '架构设计',
    tags: ['内存', '磁盘', '数据库']
  },
  {
    id: 'join-performance',
    question: 'JOIN 查询性能优化技巧？',
    answer: 'JOIN 性能优化的最佳实践：\n\n1. **选择合适的 JOIN 类型**\n   - INNER JOIN: 最常用，性能良好\n   - LEFT JOIN: 注意数据分布\n   - CROSS JOIN: 避免大数据集\n\n2. **索引策略**\n   - 为连接键创建索引\n   - 考虑复合索引\n\n3. **查询优化**\n   - 小表在前，大表在后\n   - 提前过滤数据\n   - 使用 EXISTS 替代 JOIN（某些场景）\n\n4. **数据预处理**\n   - 规范化数据\n   - 合理分区\n\n```sql\n-- 优化前\nSELECT * FROM large_table t1\nJOIN small_table t2 ON t1.id = t2.id;\n\n-- 优化后（小表在前）\nSELECT * FROM small_table t2\nJOIN large_table t1 ON t2.id = t1.id;\n```',
    category: '查询优化',
    tags: ['JOIN', '性能', '优化']
  },
  {
    id: 'data-types-best-practices',
    question: '数据类型选择的最佳实践？',
    answer: 'DuckDB 数据类型选择指南：\n\n**数值类型**\n- INTEGER: 整型（-2^63 ~ 2^63-1）\n- DOUBLE: 浮点数（推荐）\n- DECIMAL: 高精度小数\n\n**字符串类型**\n- VARCHAR: 变长字符串\n- TEXT: 长文本\n\n**日期时间**\n- DATE: 日期\n- TIME: 时间\n- TIMESTAMP: 完整时间戳\n\n**复杂类型**\n- ARRAY: 数组\n- STRUCT: 结构体\n- MAP: 键值对\n\n**最佳实践**\n- 选择最小足够的数据类型\n- 使用一致的命名约定\n- 考虑NULL值处理\n- 预留扩展空间',
    category: '数据建模',
    tags: ['数据类型', '最佳实践', '建模']
  },
  {
    id: 'error-handling',
    question: '如何处理查询错误？',
    answer: 'DuckDB 错误处理机制：\n\n**常见错误类型**\n- 语法错误: 检查 SQL 语法\n- 类型错误: 数据类型不匹配\n- 约束错误: 主键/外键冲突\n- 权限错误: 访问权限不足\n\n**错误处理策略**\n```sql\n-- 使用 TRY_CAST 处理类型转换错误\nSELECT TRY_CAST(column AS INTEGER) AS safe_int\nFROM table_name;\n\n-- 使用 COALESCE 处理 NULL 值\nSELECT COALESCE(column, \'default_value\') AS safe_column\nFROM table_name;\n\n-- 检查文件是否存在\nSELECT CASE\n    WHEN file_exists THEN read_csv_auto(filename)\n    ELSE NULL\nEND AS data\nFROM file_list;\n```\n\n**调试技巧**\n- 使用 `EXPLAIN` 查看查询计划\n- 检查数据类型和约束\n- 分步骤执行复杂查询\n- 查看详细错误信息',
    category: '错误处理',
    tags: ['错误', '调试', '异常']
  }
];

export function DefaultFAQ() {
  return <FAQ items={DEFAULT_FAQ_ITEMS} />;
}
