import { useState, useCallback, useMemo } from 'react';
import { modules } from '../data/sections';

interface SearchResult {
  sectionId: string;
  title: string;
  moduleTitle: string;
  icon: string;
  matchType: 'title' | 'content';
}

// 简单的搜索关键词映射（实际应用中可以更丰富）
const contentKeywords: Record<string, string[]> = {
  'why-duckdb': ['duckdb', '为什么', '入门', '快速', 'sqlite', 'mysql', 'csv', 'parquet', 'json', '分析'],
  '5min-start': ['快速', '上手', '创建', '表', '插入', '查询', 'create', 'insert', 'select'],
  'create-table': ['创建', '表', 'create', 'table', '数据类型', 'integer', 'varchar', 'boolean', '主键', '外键', '约束'],
  'alter-table': ['修改', '表', 'alter', 'add', 'drop', 'column', '列', '重命名', 'rename'],
  'drop-table': ['删除', '表', 'drop', 'truncate', '清空', '级联', 'cascade'],
  'insert': ['插入', 'insert', 'values', '批量', 'conflict', '冲突'],
  'select': ['查询', 'select', 'from', 'where', '条件', '排序', 'order', 'limit', '分页', 'distinct'],
  'update': ['更新', 'update', 'set', '修改', '事务', 'transaction', 'commit', 'rollback'],
  'delete': ['删除', 'delete', '软删除', 'is_deleted', '清除'],
  'join': ['连接', 'join', 'inner', 'left', 'right', 'full', '关联', '多表'],
  'subquery': ['子查询', 'cte', 'with', 'recursive', '递归', '嵌套'],
  'aggregate': ['聚合', '分组', 'group', 'count', 'sum', 'avg', 'max', 'min', 'having'],
  'view-basics': ['视图', 'view', 'create view', '虚拟表'],
  'view-advanced': ['高级视图', '递归视图', '物化视图', '统计视图'],
  'final-project': ['综合', '练习', '项目', '实战'],
};

export function useSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    
    const q = query.toLowerCase();
    const matches: SearchResult[] = [];
    
    for (const module of modules) {
      for (const section of module.sections) {
        // 标题匹配
        if (section.title.toLowerCase().includes(q)) {
          matches.push({
            sectionId: section.id,
            title: section.title,
            moduleTitle: module.title,
            icon: section.icon,
            matchType: 'title',
          });
          continue;
        }
        
        // 内容关键词匹配
        const keywords = contentKeywords[section.id] || [];
        if (keywords.some(k => k.toLowerCase().includes(q) || q.includes(k.toLowerCase()))) {
          matches.push({
            sectionId: section.id,
            title: section.title,
            moduleTitle: module.title,
            icon: section.icon,
            matchType: 'content',
          });
        }
      }
    }
    
    return matches;
  }, [query]);

  const openSearch = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  return {
    query,
    setQuery,
    results,
    isOpen,
    openSearch,
    closeSearch,
  };
}
