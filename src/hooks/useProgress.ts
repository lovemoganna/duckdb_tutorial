import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'duckdb-tutorial-progress';

interface Progress {
  completedSections: string[];
  currentSection: string;
  totalReadingTime: number; // 秒
  lastVisit: number;
  bookmarks: string[];
  sectionReadingTime: Record<string, number>; // 每章阅读时间
}

const initialProgress: Progress = {
  completedSections: [],
  currentSection: 'why-duckdb',
  totalReadingTime: 0,
  lastVisit: Date.now(),
  bookmarks: [],
  sectionReadingTime: {},
};

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [currentSectionStartTime, setCurrentSectionStartTime] = useState(Date.now());

  // 从 localStorage 加载进度
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProgress({ ...initialProgress, ...parsed });
      }
    } catch (e) {
      console.error('Failed to load progress:', e);
    }
  }, []);

  // 保存进度到 localStorage
  const saveProgress = useCallback((newProgress: Progress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }, []);

  // 标记章节完成
  const markComplete = useCallback((sectionId: string) => {
    if (!progress.completedSections.includes(sectionId)) {
      saveProgress({
        ...progress,
        completedSections: [...progress.completedSections, sectionId],
      });
    }
  }, [progress, saveProgress]);

  // 标记章节未完成
  const markIncomplete = useCallback((sectionId: string) => {
    saveProgress({
      ...progress,
      completedSections: progress.completedSections.filter(id => id !== sectionId),
    });
  }, [progress, saveProgress]);

  // 切换书签
  const toggleBookmark = useCallback((sectionId: string) => {
    const isBookmarked = progress.bookmarks.includes(sectionId);
    saveProgress({
      ...progress,
      bookmarks: isBookmarked
        ? progress.bookmarks.filter(id => id !== sectionId)
        : [...progress.bookmarks, sectionId],
    });
  }, [progress, saveProgress]);

  // 更新当前章节
  const setCurrentSection = useCallback((sectionId: string) => {
    const now = Date.now();
    const timeSpent = Math.floor((now - currentSectionStartTime) / 1000);
    
    // 保存上一章的阅读时间
    const prevSection = progress.currentSection;
    const prevTime = progress.sectionReadingTime[prevSection] || 0;
    
    saveProgress({
      ...progress,
      currentSection: sectionId,
      totalReadingTime: progress.totalReadingTime + timeSpent,
      sectionReadingTime: {
        ...progress.sectionReadingTime,
        [prevSection]: prevTime + timeSpent,
      },
      lastVisit: now,
    });
    
    setCurrentSectionStartTime(now);
  }, [progress, saveProgress, currentSectionStartTime]);

  // 获取学习统计
  const getStats = useCallback(() => {
    const now = Date.now();
    const sessionTime = Math.floor((now - sessionStartTime) / 1000);
    
    return {
      completedCount: progress.completedSections.length,
      completedSections: progress.completedSections,
      bookmarkCount: progress.bookmarks.length,
      bookmarkedSections: progress.bookmarks,
      totalTime: Math.floor((progress.totalReadingTime + sessionTime) / 60), // 转换为分钟
      lastVisit: progress.lastVisit,
    };
  }, [progress, sessionStartTime]);

  // 重置进度
  const resetProgress = useCallback(() => {
    saveProgress(initialProgress);
    setSessionStartTime(Date.now());
    setCurrentSectionStartTime(Date.now());
  }, [saveProgress]);

  // 检查是否完成
  const isCompleted = useCallback((sectionId: string) => {
    return progress.completedSections.includes(sectionId);
  }, [progress.completedSections]);

  // 检查是否书签
  const isBookmarked = useCallback((sectionId: string) => {
    return progress.bookmarks.includes(sectionId);
  }, [progress.bookmarks]);

  return {
    progress,
    markComplete,
    markIncomplete,
    toggleBookmark,
    setCurrentSection,
    getStats,
    resetProgress,
    isCompleted,
    isBookmarked,
  };
}
