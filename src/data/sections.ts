import type { Module } from '../types';

export const modules: Module[] = [
  {
    id: 'quickstart',
    title: '🚀 先跑起来',
    icon: '🚀',
    sections: [
      { id: 'why-duckdb', title: '为什么学 DuckDB？', icon: '🤔' },
      { id: '5min-start', title: '5分钟快速上手', icon: '⚡' },
    ],
  },
  {
    id: 'ddl',
    title: '📐 数据定义 (DDL)',
    icon: '📐',
    sections: [
      { id: 'create-table', title: '创建表', icon: '🏗️' },
      { id: 'alter-table', title: '修改表', icon: '🔧' },
      { id: 'drop-table', title: '删除表', icon: '💥' },
      { id: 'data-types', title: '数据类型详解', icon: '🔤' },
    ],
  },
  {
    id: 'dml',
    title: '✏️ 数据操作 (DML)',
    icon: '✏️',
    sections: [
      { id: 'insert', title: 'INSERT - 插入', icon: '➕' },
      { id: 'select', title: 'SELECT - 查询', icon: '🔍' },
      { id: 'update', title: 'UPDATE - 更新', icon: '📝' },
      { id: 'delete', title: 'DELETE - 删除', icon: '🗑️' },
    ],
  },
  {
    id: 'transactions',
    title: '🔄 事务处理',
    icon: '🔄',
    sections: [
      { id: 'transaction-basics', title: '事务基础概念', icon: '📚' },
      { id: 'acid-properties', title: 'ACID 属性详解', icon: '🔍' },
      { id: 'isolation-levels', title: '隔离级别与并发控制', icon: '🎛️' },
      { id: 'concurrency-problems', title: '并发问题分析', icon: '⚠️' },
      { id: 'savepoints-nested', title: '保存点与嵌套事务', icon: '🔖' },
      { id: 'transaction-patterns', title: '事务设计模式', icon: '🎯' },
      { id: 'real-world-examples', title: '实际应用案例', icon: '💼' },
      { id: 'performance-tuning', title: '性能优化与监控', icon: '🚀' },
    ],
  },
  {
    id: 'advanced',
    title: '🎯 进阶查询',
    icon: '🎯',
    sections: [
      { id: 'join', title: 'JOIN - 连接查询', icon: '🔗' },
      { id: 'subquery', title: '子查询与 CTE', icon: '🎭' },
      { id: 'aggregate', title: '聚合与分组', icon: '📊' },
      { id: 'window-functions', title: '窗口函数', icon: '🪟' },
      { id: 'conditional', title: '条件表达式', icon: '❓' },
      { id: 'recursive', title: '递归查询', icon: '🔄' },
      { id: 'pivot', title: 'PIVOT/UNPIVOT', icon: '🔄' },
      { id: 'set-operations', title: '集合操作', icon: '∪' },
      { id: 'advanced-analytics', title: '分析函数进阶', icon: '📈' },
      { id: 'lateral-join', title: 'LATERAL JOIN', icon: '↗️' },
      { id: 'qualify', title: 'QUALIFY 子句', icon: '✅' },
      { id: 'sampling', title: 'SAMPLE 采样', icon: '🎲' },
      { id: 'pattern-matching', title: '模式匹配', icon: '🔍' },
      { id: 'advanced-aggregation', title: '高级聚合', icon: '📊' },
      { id: 'fulltext-search', title: '全文搜索', icon: '🔎' },
      { id: 'approximate-computing', title: '近似计算', icon: '≈' },
    ],
  },
  {
    id: 'functions',
    title: '🛠️ 内置函数',
    icon: '🛠️',
    sections: [
      { id: 'string-functions', title: '字符串函数', icon: '📝' },
      { id: 'datetime-functions', title: '日期时间函数', icon: '📅' },
      { id: 'math-stats-functions', title: '数学与统计函数', icon: '🔢' },
      { id: 'type-conversion', title: '类型转换函数', icon: '🔄' },
      { id: 'array-struct', title: '数组与结构体', icon: '📦' },
      { id: 'null-handling', title: 'NULL 处理', icon: '🚫' },
      { id: 'spatial-functions', title: '地理空间函数', icon: '🗺️' },
      { id: 'sequence-generation', title: '序列生成', icon: '🔢' },
      { id: 'list-functions', title: '列表函数', icon: '📋' },
      { id: 'regex-functions', title: '正则表达式', icon: '🔤' },
      { id: 'crypto-functions', title: '加密函数', icon: '🔐' },
    ],
  },
  {
    id: 'data-io',
    title: '📁 数据导入导出',
    icon: '📁',
    sections: [
      { id: 'import-csv', title: '读取 CSV/Excel', icon: '📄' },
      { id: 'import-json', title: 'JSON 数据处理', icon: '🔖' },
      { id: 'export-data', title: '导出数据', icon: '📤' },
      { id: 'external-sources', title: '外部数据源', icon: '🔗' },
      { id: 'incremental-processing', title: '增量数据处理', icon: '📈' },
      { id: 'streaming-processing', title: '流式数据处理', icon: '🌊' },
      { id: 'delta-lake', title: 'Delta Lake', icon: 'Δ' },
    ],
  },
  {
    id: 'views',
    title: '👁️ 视图',
    icon: '👁️',
    sections: [
      { id: 'view-basics', title: '视图基础', icon: '📋' },
      { id: 'view-advanced', title: '高级视图', icon: '🔮' },
      { id: 'materialized-views', title: '物化视图', icon: '💾' },
      { id: 'dynamic-views', title: '动态视图', icon: '🔄' },
    ],
  },
  {
    id: 'security',
    title: '🔒 安全与权限',
    icon: '🔒',
    sections: [
      { id: 'user-permissions', title: '用户与权限管理', icon: '👤' },
      { id: 'encryption-masking', title: '数据加密与脱敏', icon: '🔐' },
      { id: 'audit-logs', title: '审计日志', icon: '📝' },
      { id: 'row-level-security', title: '行级安全', icon: '🔒' },
      { id: 'column-level-security', title: '列级安全', icon: '🔐' },
    ],
  },
  {
    id: 'optimization',
    title: '⚡ 性能优化',
    icon: '⚡',
    sections: [
      { id: 'indexing', title: '索引使用', icon: '📇' },
      { id: 'query-optimization', title: '查询优化技巧', icon: '🚀' },
      { id: 'query-plans', title: '查询计划分析', icon: '📊' },
      { id: 'memory-caching', title: '内存与缓存优化', icon: '🧠' },
      { id: 'parallel-processing', title: '并行处理', icon: '⚡' },
      { id: 'statistics-info', title: '统计信息', icon: '📈' },
      { id: 'partitioning', title: '分区策略', icon: '📂' },
      { id: 'vectorization', title: '向量化执行', icon: '🚀' },
    ],
  },
  {
    id: 'architecture',
    title: '🏗️ 架构设计',
    icon: '🏗️',
    sections: [
      { id: 'extensions-plugins', title: '扩展与插件', icon: '🔌' },
      { id: 'best-practices', title: '最佳实践', icon: '⭐' },
      { id: 'migration', title: '版本迁移', icon: '🔄' },
      { id: 'high-availability', title: '高可用设计', icon: '🛡️' },
    ],
  },
  {
    id: 'project',
    title: '🎓 实战项目',
    icon: '🎓',
    sections: [
      { id: 'final-project', title: '综合练习', icon: '🏆' },
      { id: 'data-warehouse', title: '数据仓库建模', icon: '🏭' },
      { id: 'data-analysis', title: '数据分析案例', icon: '📊' },
      { id: 'api-integration', title: 'API数据集成', icon: '🔗' },
      { id: 'time-series', title: '时间序列分析', icon: '📈' },
      { id: 'ml-preprocessing', title: '机器学习预处理', icon: '🤖' },
      { id: 'realtime-dashboard', title: '实时仪表盘', icon: '📺' },
      { id: 'log-analysis', title: '日志分析系统', icon: '📋' },
      { id: 'recommendation-system', title: '推荐系统', icon: '👍' },
      { id: 'graph-analysis', title: '图数据分析', icon: '🔗' },
      { id: 'data-lineage', title: '数据血缘追踪', icon: '🧬' },
      { id: 'data-quality', title: '数据质量监控', icon: '✅' },
    ],
  },
  {
    id: 'distributed',
    title: '🌐 分布式架构',
    icon: '🌐',
    sections: [
      { id: 'distributed-concepts', title: '分布式基础概念', icon: '📚' },
      { id: 'duckdb-clusters', title: 'DuckDB 集群部署', icon: '🔗' },
      { id: 'data-partitioning', title: '数据分区策略', icon: '📂' },
      { id: 'distributed-queries', title: '分布式查询', icon: '🔍' },
      { id: 'load-balancing', title: '负载均衡', icon: '⚖️' },
      { id: 'fault-tolerance', title: '容错机制', icon: '🛡️' },
      { id: 'distributed-transactions', title: '分布式事务', icon: '🔄' },
      { id: 'performance-monitoring', title: '性能监控', icon: '📊' },
    ],
  },
  {
    id: 'bigdata',
    title: '📊 大数据处理',
    icon: '📊',
    sections: [
      { id: 'bigdata-concepts', title: '大数据基础', icon: '🎯' },
      { id: 'data-lakes', title: '数据湖架构', icon: '🏞️' },
      { id: 'streaming-data', title: '流数据处理', icon: '🌊' },
      { id: 'batch-processing', title: '批处理优化', icon: '📦' },
      { id: 'data-compression', title: '数据压缩技术', icon: '🗜️' },
      { id: 'memory-management', title: '内存管理策略', icon: '🧠' },
      { id: 'parallel-computing', title: '并行计算', icon: '⚡' },
      { id: 'data-skipping', title: '数据跳跃技术', icon: '⏭️' },
    ],
  },
  {
    id: 'ml-integration',
    title: '🤖 机器学习集成',
    icon: '🤖',
    sections: [
      { id: 'ml-concepts', title: 'ML 与数据库集成', icon: '🔗' },
      { id: 'feature-engineering', title: '特征工程', icon: '⚙️' },
      { id: 'model-training', title: '模型训练数据流', icon: '🎓' },
      { id: 'prediction-queries', title: '预测查询', icon: '🔮' },
      { id: 'ml-pipelines', title: 'ML 管道', icon: '🔧' },
      { id: 'model-evaluation', title: '模型评估', icon: '📊' },
      { id: 'online-learning', title: '在线学习', icon: '📈' },
      { id: 'ml-optimization', title: 'ML 查询优化', icon: '🚀' },
    ],
  },
  {
    id: 'faq',
    title: '❓ 常见问题',
    icon: '❓',
    sections: [
      { id: 'faq-main', title: 'FAQ - 常见问题解答', icon: '💡' },
    ],
  },
];

export const allSections = modules.flatMap(m => m.sections);

export function getSectionTitle(sectionId: string): string {
  for (const module of modules) {
    const section = module.sections.find(s => s.id === sectionId);
    if (section) return `${section.icon} ${section.title}`;
  }
  return sectionId;
}

export function getNextSection(currentId: string): string | null {
  const idx = allSections.findIndex(s => s.id === currentId);
  return idx >= 0 && idx < allSections.length - 1 ? allSections[idx + 1].id : null;
}

export function getPrevSection(currentId: string): string | null {
  const idx = allSections.findIndex(s => s.id === currentId);
  return idx > 0 ? allSections[idx - 1].id : null;
}
