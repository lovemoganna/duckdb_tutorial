import { useState } from 'react';
import { cn } from '../utils/cn';
import type { Note } from '../types';

interface NoteButtonProps {
  sectionId: string;
  blockId: string;
  notes: Note[];
  onAdd: (content: string) => void;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export function NoteButton({ sectionId: _sectionId, blockId: _blockId, notes = [], onAdd, onUpdate, onDelete }: NoteButtonProps) {
  // sectionId and blockId are used by parent components for note management
  void _sectionId;
  void _blockId;
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [content, setContent] = useState('');

  const hasNotes = notes && notes.length > 0;

  const handleSave = () => {
    if (!content.trim()) return;
    
    if (editingId) {
      onUpdate(editingId, content);
      setEditingId(null);
    } else {
      onAdd(content);
    }
    setContent('');
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setContent(note.content);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    if (editingId === id) {
      setEditingId(null);
      setContent('');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setContent('');
    if (!hasNotes) setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'p-1.5 rounded-lg transition-all duration-200 group',
          hasNotes 
            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
            : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
        )}
        title={hasNotes ? `${notes?.length || 0} 条笔记` : '添加笔记'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        {hasNotes && (
          <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {notes?.length || 0}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => {
              setIsOpen(false);
              setEditingId(null);
              setContent('');
            }}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
            <div className="p-3 bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-slate-100">
              <h4 className="font-medium text-slate-700 flex items-center gap-2">
                <span>📝</span>
                <span>我的笔记</span>
              </h4>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {(notes || []).map(note => (
                <div key={note.id} className="p-3 border-b border-slate-100 last:border-0">
                  {editingId === note.id ? (
                    <textarea
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none"
                      rows={3}
                      autoFocus
                    />
                  ) : (
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{note.content}</p>
                  )}
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-slate-400">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-1">
                      {editingId === note.id ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            保存
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-2 py-1 text-xs bg-slate-200 text-slate-600 rounded hover:bg-slate-300"
                          >
                            取消
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(note)}
                            className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDelete(note.id)}
                            className="px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          >
                            删除
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!editingId && (
              <div className="p-3 bg-slate-50">
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="写下你的想法..."
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none"
                  rows={2}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={!content.trim()}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-lg transition-colors',
                      content.trim()
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    )}
                  >
                    添加笔记
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
