import { useState, useEffect, useCallback } from 'react';
import type { Note } from '../types';

const STORAGE_KEY = 'duckdb-tutorial-notes';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  // 从 localStorage 加载笔记
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setNotes(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load notes:', e);
    }
  }, []);

  // 保存笔记到 localStorage
  const saveNotes = useCallback((newNotes: Note[]) => {
    setNotes(newNotes);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
    } catch (e) {
      console.error('Failed to save notes:', e);
    }
  }, []);

  // 添加笔记
  const addNote = useCallback((sectionId: string, blockId: string, content: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sectionId,
      blockId,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveNotes([...notes, newNote]);
    return newNote;
  }, [notes, saveNotes]);

  // 更新笔记
  const updateNote = useCallback((id: string, content: string) => {
    const updated = notes.map(note =>
      note.id === id ? { ...note, content, updatedAt: Date.now() } : note
    );
    saveNotes(updated);
  }, [notes, saveNotes]);

  // 删除笔记
  const deleteNote = useCallback((id: string) => {
    saveNotes(notes.filter(note => note.id !== id));
  }, [notes, saveNotes]);

  // 获取指定位置的笔记
  const getNotesForBlock = useCallback((sectionId: string, blockId: string) => {
    return notes.filter(note => note.sectionId === sectionId && note.blockId === blockId);
  }, [notes]);

  // 获取章节的所有笔记
  const getNotesForSection = useCallback((sectionId: string) => {
    return notes.filter(note => note.sectionId === sectionId);
  }, [notes]);

  // 导出所有笔记
  const exportNotes = useCallback(() => {
    const data = JSON.stringify(notes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `duckdb-notes-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [notes]);

  // 导入笔记
  const importNotes = useCallback((jsonData: string) => {
    try {
      const imported = JSON.parse(jsonData) as Note[];
      saveNotes([...notes, ...imported]);
      return true;
    } catch {
      return false;
    }
  }, [notes, saveNotes]);

  // 清空所有笔记
  const clearAllNotes = useCallback(() => {
    saveNotes([]);
  }, [saveNotes]);

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNotesForBlock,
    getNotesForSection,
    exportNotes,
    importNotes,
    clearAllNotes,
  };
}
