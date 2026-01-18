import { modules, allSections } from './sections';

// 搜索索引接口
export interface SearchIndexItem {
  id: string;
  sectionId: string;
  moduleId: string;
  title: string;
  content: string;
  tags: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  type: 'tutorial' | 'reference' | 'example';
}

// 教程内容索引
const tutorialContents: Record<string, { content: string; tags: string[]; level: SearchIndexItem['level'] }> = {
  // 快速开始
  'why-duckdb': {
    content: 'DuckDB 是一个嵌入式分析型数据库，专为分析查询优化，支持SQL，支持多种数据格式，包括CSV、Parquet、JSON等。与SQLite类似但专注于分析工作负载，比传统数据库更快。',
    tags: ['duckdb', '分析数据库', '嵌入式', 'sql', 'csv', 'parquet', 'json', '入门'],
    level: 'beginner'
  },
  '5min-start': {
    content: '5分钟快速上手DuckDB：创建数据库连接、创建表、插入数据、查询数据。掌握基本CRUD操作，体验DuckDB的速度和易用性。',
    tags: ['快速开始', '上手', 'create', 'insert', 'select', 'crud', '基础'],
    level: 'beginner'
  },

  // DDL
  'create-table': {
    content: 'CREATE TABLE语句详解：表结构设计、数据类型选择（INTEGER、VARCHAR、BOOLEAN等）、主键约束、外键约束、索引设计。学习如何设计高效的表结构。',
    tags: ['ddl', 'create table', '数据类型', '约束', '主键', '外键', '索引', '表设计'],
    level: 'beginner'
  },
  'alter-table': {
    content: 'ALTER TABLE操作：添加列、删除列、重命名列、修改数据类型。掌握表结构动态调整的方法和最佳实践。',
    tags: ['ddl', 'alter table', '修改表', '添加列', '删除列', '重命名', '数据类型'],
    level: 'intermediate'
  },
  'drop-table': {
    content: 'DROP TABLE和TRUNCATE：删除表、清空数据、级联删除。理解数据删除的不同方式及其影响。',
    tags: ['ddl', 'drop table', 'truncate', '删除表', '清空', '级联删除'],
    level: 'intermediate'
  },

  // DML
  'insert': {
    content: 'INSERT语句详解：单行插入、批量插入、冲突处理（ON CONFLICT）、返回值。掌握高效的数据插入技巧。',
    tags: ['dml', 'insert', '批量插入', '冲突处理', 'on conflict', '返回值'],
    level: 'beginner'
  },
  'select': {
    content: 'SELECT查询基础：FROM、WHERE条件、ORDER BY排序、LIMIT分页、DISTINCT去重。构建复杂查询的基础语法。',
    tags: ['dml', 'select', '查询', 'where', 'order by', 'limit', 'distinct', '分页'],
    level: 'beginner'
  },
  'update': {
    content: 'UPDATE语句：修改数据、条件更新、批量更新。结合事务处理确保数据一致性。',
    tags: ['dml', 'update', '修改数据', '事务', '一致性', '批量更新'],
    level: 'intermediate'
  },
  'delete': {
    content: 'DELETE操作：条件删除、软删除设计。掌握安全删除数据的模式。',
    tags: ['dml', 'delete', '删除数据', '软删除', '条件删除'],
    level: 'intermediate'
  },

  // 高级查询
  'join': {
    content: 'JOIN连接查询：INNER JOIN、LEFT JOIN、RIGHT JOIN、FULL JOIN。掌握多表关联查询，理解不同连接类型的应用场景。',
    tags: ['join', '连接查询', 'inner join', 'left join', 'right join', 'full join', '多表查询'],
    level: 'intermediate'
  },
  'subquery': {
    content: '子查询和CTE：子查询语法、WITH语句、递归查询。学习嵌套查询和公共表表达式的使用。',
    tags: ['子查询', 'cte', 'with', '递归查询', '公共表表达式', '嵌套查询'],
    level: 'advanced'
  },
  'aggregate': {
    content: '聚合函数和分组：COUNT、SUM、AVG、MAX、MIN、GROUP BY、HAVING。掌握数据统计和分组分析。',
    tags: ['聚合', 'group by', 'having', 'count', 'sum', 'avg', 'max', 'min', '统计'],
    level: 'intermediate'
  },
  'window-functions': {
    content: '窗口函数：ROW_NUMBER、RANK、DENSE_RANK、LAG、LEAD、OVER子句。实现复杂的分析查询。',
    tags: ['窗口函数', 'row_number', 'rank', 'lag', 'lead', 'over', '分析函数'],
    level: 'advanced'
  },

  // 函数
  'string-functions': {
    content: '字符串函数：CONCAT、SUBSTR、REPLACE、UPPER、LOWER、正则表达式。文本数据处理的核心函数。',
    tags: ['字符串函数', 'concat', 'substr', 'replace', 'upper', 'lower', '正则表达式'],
    level: 'intermediate'
  },
  'datetime-functions': {
    content: '日期时间函数：NOW、DATE、EXTRACT、INTERVAL、格式化。时间数据的处理和计算。',
    tags: ['日期函数', '时间函数', 'now', 'date', 'extract', 'interval', '格式化'],
    level: 'intermediate'
  },
  'math-stats-functions': {
    content: '数学统计函数：ROUND、CEIL、FLOOR、ABS、POWER、SQRT、统计分布函数。数值计算和统计分析。',
    tags: ['数学函数', '统计函数', 'round', 'abs', 'power', 'sqrt', '分布'],
    level: 'intermediate'
  },

  // 性能优化
  'indexing': {
    content: '索引优化：CREATE INDEX、索引类型选择、复合索引、索引维护。提升查询性能的关键技术。',
    tags: ['索引', 'create index', '复合索引', '性能优化', '查询优化'],
    level: 'advanced'
  },
  'query-optimization': {
    content: '查询优化技巧：EXPLAIN分析、查询重写、JOIN优化、子查询优化。编写高性能SQL的实用方法。',
    tags: ['查询优化', 'explain', 'join优化', '子查询优化', '性能调优'],
    level: 'advanced'
  },

  // 数据导入导出
  'import-csv': {
    content: 'CSV数据导入：COPY FROM、CSV格式选项、错误处理、大文件处理。高效导入CSV数据的完整方案。',
    tags: ['csv', '导入', 'copy from', '数据导入', '文件处理', '大数据'],
    level: 'intermediate'
  },
  'import-json': {
    content: 'JSON数据处理：JSON函数、嵌套结构解析、JSON查询。处理半结构化数据的强大工具。',
    tags: ['json', '半结构化', '嵌套数据', 'json函数', '数据解析'],
    level: 'advanced'
  },

  // 视图
  'view-basics': {
    content: '视图基础：CREATE VIEW、视图查询、视图更新。创建虚拟表简化复杂查询。',
    tags: ['视图', 'create view', '虚拟表', '简化查询'],
    level: 'intermediate'
  },

  // 安全
  'user-permissions': {
    content: '用户权限管理：角色、权限、访问控制。数据库安全的核心机制。',
    tags: ['权限', '用户', '角色', '访问控制', '数据库安全'],
    level: 'advanced'
  },

  // 架构
  'extensions-plugins': {
    content: '扩展和插件：自定义函数、外部语言集成、扩展开发。扩展DuckDB功能的高级技术。',
    tags: ['扩展', '插件', '自定义函数', '外部集成', '高级开发'],
    level: 'advanced'
  },

  // 项目
  'final-project': {
    content: '综合实战项目：数据仓库建模、ETL流程、分析仪表盘。完整的数据分析项目实践。',
    tags: ['实战项目', '数据仓库', 'etl', '仪表盘', '完整项目'],
    level: 'advanced'
  }
};

// 生成搜索索引
export const searchIndex: SearchIndexItem[] = allSections.map(section => {
  const module = modules.find(m => m.sections.some(s => s.id === section.id))!;
  const contentData = tutorialContents[section.id];

  return {
    id: `${section.id}`,
    sectionId: section.id,
    moduleId: module.id,
    title: section.title,
    content: contentData?.content || '',
    tags: contentData?.tags || [],
    level: contentData?.level || 'beginner',
    category: module.title,
    type: 'tutorial'
  };
});

// 搜索相关的工具函数
export function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fff]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1);
}

export function calculateRelevance(query: string, item: SearchIndexItem): number {
  const queryTokens = tokenize(query);
  let score = 0;

  // 标题匹配权重最高
  const titleTokens = tokenize(item.title);
  queryTokens.forEach(token => {
    if (titleTokens.some(titleToken => titleToken.includes(token) || token.includes(titleToken))) {
      score += 10;
    }
  });

  // 标签匹配权重较高
  queryTokens.forEach(token => {
    if (item.tags.some(tag => tag.toLowerCase().includes(token))) {
      score += 5;
    }
  });

  // 内容匹配权重中等
  const contentTokens = tokenize(item.content);
  queryTokens.forEach(token => {
    if (contentTokens.some(contentToken => contentToken.includes(token))) {
      score += 2;
    }
  });

  // 完全匹配额外加分
  if (item.title.toLowerCase().includes(query.toLowerCase())) score += 20;
  if (item.tags.some(tag => tag.toLowerCase() === query.toLowerCase())) score += 15;

  return score;
}
