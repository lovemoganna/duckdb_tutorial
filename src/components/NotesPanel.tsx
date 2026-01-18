import { useState } from 'react';
import { cn } from '../utils/cn';
import type { Note } from '../types';

interface NotesPanelProps {
  notes: Note[];
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
  onImport: (data: string) => boolean;
  onClearAll: () => void;
  onNavigate: (sectionId: string) => void;
  getSectionTitle: (sectionId: string) => string;
}

export function NotesPanel({
  notes,
  onUpdate,
  onDelete,
  onExport,
  onImport,
  onClearAll,
  onNavigate,
  getSectionTitle,
}: NotesPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const handleSave = () => {
    if (editingId && editContent.trim()) {
      onUpdate(editingId, editContent);
      setEditingId(null);
      setEditContent('');
    }
  };

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        const success = onImport(text);
        if (success) {
          alert('导入成功！');
        } else {
          alert('导入失败，请检查文件格式');
        }
      }
    };
    input.click();
  };

  const groupedNotes = notes.reduce((acc, note) => {
    if (!acc[note.sectionId]) {
      acc[note.sectionId] = [];
    }
    acc[note.sectionId].push(note);
    return acc;
  }, {} as Record<string, Note[]>);

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-40 flex items-center justify-center transition-all duration-300 hover:scale-110',
          notes.length > 0
            ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
            : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-700'
        )}
        title="查看所有笔记"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        {notes.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
            {notes.length}
          </span>
        )}
      </button>

      {/* 侧边面板 */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-50 flex flex-col">
            {/* 头部 */}
            <div className="p-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span>📒</span>
                  我的学习笔记
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-white/80 mt-1">共 {notes.length} 条笔记</p>
            </div>

            {/* 工具栏 */}
            <div className="p-3 border-b border-slate-200 flex gap-2 bg-slate-50">
              <button
                onClick={onExport}
                disabled={notes.length === 0}
                className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                导出
              </button>
              <button
                onClick={handleImportClick}
                className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                导入
              </button>
              {notes.length > 0 && (
                <button
                  onClick={() => setShowConfirmClear(true)}
                  className="px-3 py-2 text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100"
                >
                  清空
                </button>
              )}
            </div>

            {/* 笔记列表 */}
            <div className="flex-1 overflow-y-auto">
              {notes.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <div className="text-4xl mb-4">📝</div>
                  <p>还没有笔记</p>
                  <p className="text-sm mt-2">在学习过程中点击笔记图标添加</p>
                </div>
              ) : (
                Object.entries(groupedNotes).map(([sectionId, sectionNotes]) => (
                  <div key={sectionId} className="border-b border-slate-100">
                    <button
                      onClick={() => {
                        onNavigate(sectionId);
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-slate-50 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      {getSectionTitle(sectionId)}
                      <span className="ml-auto text-xs text-slate-400">{sectionNotes.length}</span>
                    </button>
                    {sectionNotes.map(note => (
                      <div key={note.id} className="p-4 border-b border-slate-50 last:border-0">
                        {editingId === note.id ? (
                          <div>
                            <textarea
                              value={editContent}
                              onChange={e => setEditContent(e.target.value)}
                              className="w-full p-2 border border-slate-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none"
                              rows={3}
                              autoFocus
                            />
                            <div className="mt-2 flex gap-2 justify-end">
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setEditContent('');
                                }}
                                className="px-3 py-1 text-xs bg-slate-200 text-slate-600 rounded hover:bg-slate-300"
                              >
                                取消
                              </button>
                              <button
                                onClick={handleSave}
                                className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                              >
                                保存
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-slate-600 whitespace-pre-wrap">{note.content}</p>
                            <div className="mt-2 flex justify-between items-center">
                              <span className="text-xs text-slate-400">
                                {new Date(note.updatedAt).toLocaleString()}
                              </span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleEdit(note)}
                                  className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded"
                                >
                                  编辑
                                </button>
                                <button
                                  onClick={() => onDelete(note.id)}
                                  className="px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                                >
                                  删除
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 确认清空对话框 */}
          {showConfirmClear && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4">
                <h3 className="text-lg font-bold text-slate-800 mb-2">确认清空所有笔记？</h3>
                <p className="text-sm text-slate-600 mb-4">此操作不可撤销，所有笔记将被永久删除。</p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {
                      onClearAll();
                      setShowConfirmClear(false);
                    }}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    确认清空
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
