import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onPrevSection: () => void;
  onNextSection: () => void;
  onSearch: () => void;
  onToggleNotes: () => void;
}

export function KeyboardShortcuts({
  onPrevSection,
  onNextSection,
  onSearch,
  onToggleNotes,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果在输入框中，不响应快捷键
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Ctrl/Cmd + K: 搜索
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onSearch();
        return;
      }

      // Ctrl/Cmd + N: 笔记
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        onToggleNotes();
        return;
      }

      // 左右箭头：翻页
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrevSection();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNextSection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPrevSection, onNextSection, onSearch, onToggleNotes]);

  return null;
}
