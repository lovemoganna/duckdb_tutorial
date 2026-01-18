import { useState } from 'react';

interface GlossaryTerm {
  term: string;
  definition: string;
  example?: string;
  category: 'ddl' | 'dml' | 'query' | 'general';
  related?: string[];
}

interface GlossaryProps {
  isOpen: boolean;
  onClose: () => void;
}

const glossaryTerms: GlossaryTerm[] = [
  // DDL
  {
    term: 'CREATE TABLE',
    definition: '创建新的数据表，定义列名、数据类型和约束条件。',
    example: 'CREATE TABLE users (id INTEGER PRIMARY KEY, name VARCHAR);',
    category: 'ddl',
    related: ['ALTER TABLE', 'DROP TABLE']
  },
  {
    term: 'ALTER TABLE',
    definition: '修改已存在的表结构，如添加、删除或修改列。',
    example: 'ALTER TABLE users ADD COLUMN email VARCHAR;',
    category: 'ddl',
    related: ['CREATE TABLE']
  },
  {
    term: 'DROP TABLE',
    definition: '删除整个表及其所有数据，此操作不可恢复。',
    example: 'DROP TABLE IF EXISTS old_users;',
    category: 'ddl',
    related: ['TRUNCATE', 'DELETE']
  },
  {
    term: 'CREATE VIEW',
    definition: '创建虚拟表，保存一个 SELECT 查询，可像表一样查询。',
    example: 'CREATE VIEW active_users AS SELECT * FROM users WHERE active = TRUE;',
    category: 'ddl',
    related: ['DROP VIEW']
  },
  {
    term: 'CREATE INDEX',
    definition: '创建索引以加速特定列的查询性能。',
    example: 'CREATE INDEX idx_name ON users(name);',
    category: 'ddl'
  },
  // DML
  {
    term: 'INSERT',
    definition: '向表中插入新的数据行。',
    example: "INSERT INTO users (name) VALUES ('Alice');",
    category: 'dml',
    related: ['UPDATE', 'DELETE']
  },
  {
    term: 'UPDATE',
    definition: '修改表中已存在的数据行。',
    example: "UPDATE users SET name = 'Bob' WHERE id = 1;",
    category: 'dml',
    related: ['INSERT', 'DELETE']
  },
  {
    term: 'DELETE',
    definition: '从表中删除符合条件的数据行。',
    example: 'DELETE FROM users WHERE active = FALSE;',
    category: 'dml',
    related: ['TRUNCATE', 'DROP TABLE']
  },
  {
    term: 'TRUNCATE',
    definition: '快速清空表中所有数据，但保留表结构。',
    example: 'TRUNCATE TABLE logs;',
    category: 'dml',
    related: ['DELETE', 'DROP TABLE']
  },
  // Query
  {
    term: 'SELECT',
    definition: '从表中查询数据，是 SQL 中最常用的语句。',
    example: 'SELECT name, email FROM users WHERE active = TRUE;',
    category: 'query',
    related: ['WHERE', 'ORDER BY', 'LIMIT']
  },
  {
    term: 'WHERE',
    definition: '用于过滤查询结果，只返回满足条件的行。',
    example: "SELECT * FROM users WHERE age > 18;",
    category: 'query',
    related: ['AND', 'OR', 'LIKE']
  },
  {
    term: 'JOIN',
    definition: '连接两个或多个表，基于相关列合并数据。',
    example: 'SELECT * FROM orders JOIN users ON orders.user_id = users.id;',
    category: 'query',
    related: ['LEFT JOIN', 'INNER JOIN', 'RIGHT JOIN']
  },
  {
    term: 'LEFT JOIN',
    definition: '返回左表所有行，右表匹配的行；不匹配则为 NULL。',
    example: 'SELECT * FROM users LEFT JOIN orders ON users.id = orders.user_id;',
    category: 'query',
    related: ['JOIN', 'RIGHT JOIN']
  },
  {
    term: 'GROUP BY',
    definition: '将结果按指定列分组，常与聚合函数一起使用。',
    example: 'SELECT category, COUNT(*) FROM products GROUP BY category;',
    category: 'query',
    related: ['HAVING', 'COUNT', 'SUM']
  },
  {
    term: 'ORDER BY',
    definition: '对查询结果按指定列排序。',
    example: 'SELECT * FROM users ORDER BY created_at DESC;',
    category: 'query',
    related: ['ASC', 'DESC', 'LIMIT']
  },
  {
    term: 'HAVING',
    definition: '过滤分组后的结果，类似于 WHERE 但用于聚合后。',
    example: 'SELECT category, COUNT(*) FROM products GROUP BY category HAVING COUNT(*) > 5;',
    category: 'query',
    related: ['GROUP BY', 'WHERE']
  },
  {
    term: 'LIMIT',
    definition: '限制返回的结果行数。',
    example: 'SELECT * FROM users LIMIT 10;',
    category: 'query',
    related: ['OFFSET', 'ORDER BY']
  },
  {
    term: 'WITH (CTE)',
    definition: '公共表表达式，定义临时结果集，使复杂查询更清晰。',
    example: 'WITH recent AS (SELECT * FROM orders WHERE date > NOW() - INTERVAL 7 DAY) SELECT * FROM recent;',
    category: 'query',
    related: ['RECURSIVE']
  },
  // General
  {
    term: 'PRIMARY KEY',
    definition: '唯一标识表中每一行的列或列组合，不能为 NULL。',
    example: 'id INTEGER PRIMARY KEY',
    category: 'general',
    related: ['FOREIGN KEY', 'UNIQUE']
  },
  {
    term: 'FOREIGN KEY',
    definition: '引用另一表主键的列，用于建立表间关系。',
    example: 'user_id INTEGER REFERENCES users(id)',
    category: 'general',
    related: ['PRIMARY KEY', 'REFERENCES']
  },
  {
    term: 'NULL',
    definition: '表示缺失或未知的值，不等于空字符串或零。',
    example: 'SELECT * FROM users WHERE email IS NULL;',
    category: 'general',
    related: ['IS NULL', 'IS NOT NULL', 'COALESCE']
  },
  {
    term: 'TRANSACTION',
    definition: '一组原子操作，要么全部成功，要么全部失败。',
    example: 'BEGIN; UPDATE ...; COMMIT;',
    category: 'general',
    related: ['COMMIT', 'ROLLBACK', 'BEGIN']
  },
];

const categoryLabels = {
  ddl: { label: 'DDL (数据定义)', color: 'blue' },
  dml: { label: 'DML (数据操作)', color: 'green' },
  query: { label: '查询', color: 'purple' },
  general: { label: '通用', color: 'amber' },
};

export function Glossary({ isOpen, onClose }: GlossaryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const highlightSQL = (code: string) => {
    const keywords = /\b(SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|DROP|TABLE|VIEW|JOIN|LEFT|RIGHT|INNER|ON|AND|OR|NOT|NULL|IS|AS|ORDER|BY|GROUP|HAVING|LIMIT|WITH|RECURSIVE|PRIMARY|KEY|FOREIGN|REFERENCES|DEFAULT|UNIQUE|IF|EXISTS|TRUE|FALSE|BEGIN|COMMIT|ROLLBACK|TRUNCATE|INDEX|ADD|COLUMN|ALTER|INTERVAL)\b/gi;
    return code.replace(keywords, '<span class="text-blue-400 font-semibold">$1</span>')
               .replace(/('[^']*')/g, '<span class="text-green-400">$1</span>');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-slideUp flex flex-col">
        {/* 标题栏 */}
        <div className="flex-shrink-0 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <div>
                <h2 className="text-xl font-bold">SQL 术语表</h2>
                <p className="text-sm text-indigo-100">快速查阅 SQL 核心概念</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 搜索和筛选 */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索术语..."
                className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div className="flex gap-2">
              {Object.entries(categoryLabels).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    selectedCategory === key
                      ? 'bg-white text-indigo-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 术语列表 */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredTerms.map((term) => {
              const cat = categoryLabels[term.category];
              const isExpanded = expandedTerm === term.term;
              
              return (
                <div
                  key={term.term}
                  className={`rounded-lg border transition-all ${
                    isExpanded
                      ? 'bg-slate-50 dark:bg-slate-700 border-indigo-300 dark:border-indigo-600'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <button
                    onClick={() => setExpandedTerm(isExpanded ? null : term.term)}
                    className="w-full p-4 flex items-start gap-3 text-left"
                  >
                    <span className={`flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded ${
                      cat.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                      cat.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                      cat.color === 'purple' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                    }`}>
                      {term.term}
                    </span>
                    <span className="flex-1 text-sm text-slate-600 dark:text-slate-300">
                      {term.definition}
                    </span>
                    <svg 
                      className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-600 pt-3">
                      {term.example && (
                        <div className="mb-3">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">示例：</span>
                          <div className="mt-1 p-2 rounded bg-slate-900 text-sm font-mono overflow-x-auto">
                            <code 
                              className="text-slate-200"
                              dangerouslySetInnerHTML={{ __html: highlightSQL(term.example) }}
                            />
                          </div>
                        </div>
                      )}
                      {term.related && term.related.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">相关：</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {term.related.map((rel) => (
                              <button
                                key={rel}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSearchTerm(rel);
                                  setExpandedTerm(rel);
                                }}
                                className="px-2 py-0.5 text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                              >
                                {rel}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <span className="text-4xl">🔍</span>
              <p className="mt-2">未找到匹配的术语</p>
            </div>
          )}
        </div>

        {/* 底部统计 */}
        <div className="flex-shrink-0 px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
          共 {glossaryTerms.length} 个术语 · 显示 {filteredTerms.length} 个
        </div>
      </div>
    </div>
  );
}
