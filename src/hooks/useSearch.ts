import { useState, useCallback, useMemo, useEffect } from 'react';
import { searchIndex, calculateRelevance } from '../data/searchIndex';
import { modules } from '../data/sections';

export interface SearchResult {
  sectionId: string;
  title: string;
  moduleTitle: string;
  icon: string;
  matchType: 'title' | 'content' | 'tags';
  relevance: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  excerpt: string;
}

export interface SearchFilters {
  level?: 'beginner' | 'intermediate' | 'advanced';
  module?: string;
  type?: 'tutorial' | 'reference' | 'example';
}

export interface SearchHistory {
  query: string;
  timestamp: number;
  resultCount: number;
}

const STORAGE_KEY = 'duckdb-search-history';
const MAX_HISTORY = 10;

export function useSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 加载搜索历史
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to load search history:', e);
      }
    }
  }, []);

  // 保存搜索历史
  const saveToHistory = useCallback((searchQuery: string, resultCount: number) => {
    if (!searchQuery.trim()) return;

    const newEntry: SearchHistory = {
      query: searchQuery,
      timestamp: Date.now(),
      resultCount
    };

    setHistory(prev => {
      const filtered = prev.filter(h => h.query !== searchQuery);
      const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 生成内容摘要
  const generateExcerpt = useCallback((content: string, query: string): string => {
    if (!query.trim()) return content.slice(0, 100) + '...';

    const index = content.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return content.slice(0, 100) + '...';

    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + query.length + 50);
    const excerpt = content.slice(start, end);

    return start > 0 ? '...' + excerpt + '...' : excerpt + '...';
  }, []);

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const matches: SearchResult[] = [];

    for (const item of searchIndex) {
      // 应用过滤器
      if (filters.level && item.level !== filters.level) continue;
      if (filters.module && item.moduleId !== filters.module) continue;
      if (filters.type && item.type !== filters.type) continue;

      const relevance = calculateRelevance(q, item);

      if (relevance > 0) {
        const module = modules.find(m => m.id === item.moduleId);
        let matchType: SearchResult['matchType'] = 'content';

        // 确定匹配类型
        if (item.title.toLowerCase().includes(q)) {
          matchType = 'title';
        } else if (item.tags.some(tag => tag.toLowerCase().includes(q))) {
          matchType = 'tags';
        }

        matches.push({
          sectionId: item.sectionId,
          title: item.title,
          moduleTitle: module?.title || item.category,
          icon: item.title.split(' ')[0] || '📄',
          matchType,
          relevance,
          level: item.level,
          tags: item.tags,
          excerpt: generateExcerpt(item.content, q)
        });
      }
    }

    // 按相关度排序
    return matches.sort((a, b) => b.relevance - a.relevance);
  }, [query, filters, generateExcerpt]);

  // 智能建议
  const suggestions = useMemo(() => {
    if (!query.trim()) {
      // 显示热门搜索
      const popular = history
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5)
        .map(h => h.query);
      return popular.length > 0 ? popular : [
        'join 查询',
        '索引优化',
        '聚合函数',
        '子查询',
        '性能优化'
      ];
    }

    // 基于历史和当前输入的建议
    const suggestions: string[] = [];
    const queryLower = query.toLowerCase();

    // 从历史中找相似查询
    history.forEach(h => {
      if (h.query.toLowerCase().includes(queryLower) && h.query !== query) {
        suggestions.push(h.query);
      }
    });

    // 从标签中找相关建议
    const allTags = Array.from(new Set(searchIndex.flatMap(item => item.tags)));
    allTags.forEach(tag => {
      if (tag.toLowerCase().includes(queryLower) && tag !== query) {
        suggestions.push(tag);
      }
    });

    return [...new Set(suggestions)].slice(0, 5);
  }, [query, history]);

  // 键盘导航
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        saveToHistory(query, results.length);
        // 这里可以触发导航逻辑
      } else if (e.key === 'Escape') {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, query, saveToHistory]);

  const openSearch = useCallback(() => {
    setIsOpen(true);
    setSelectedIndex(0);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const applyFilter = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // 当查询改变时重置选中索引
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return {
    query,
    setQuery,
    results,
    suggestions,
    history,
    filters,
    isOpen,
    selectedIndex,
    openSearch,
    closeSearch,
    clearHistory,
    applyFilter,
    clearFilters,
    saveToHistory: () => saveToHistory(query, results.length)
  };
}
