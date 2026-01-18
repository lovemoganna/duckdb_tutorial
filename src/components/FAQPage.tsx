import { useState } from 'react';
import { FAQ, DEFAULT_FAQ_ITEMS } from './FAQ';
import { Card } from './DesignSystem';
import { cn } from '../utils/cn';

interface FAQPageProps {
  sectionId: string;
  addNote: (sectionId: string, blockId: string, content: string) => void;
  updateNote: (sectionId: string, blockId: string, content: string) => void;
  deleteNote: (sectionId: string, blockId: string) => void;
  getNotesForBlock: (sectionId: string, blockId: string) => any[];
}

export function FAQPage({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: FAQPageProps) {
  const noteProps = (blockId: string) => ({
    sectionId,
    blockId,
    notes: getNotesForBlock(sectionId, blockId),
    onAddNote: (content: string) => addNote(sectionId, blockId, content),
    onUpdateNote: updateNote,
    onDeleteNote: deleteNote,
  });

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">❓</div>
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">
          常见问题解答
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          学习 DuckDB 过程中遇到的常见问题和解决方案
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="text-3xl mb-2">🚀</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{DEFAULT_FAQ_ITEMS.length}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">精选问题</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl mb-2">📚</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {new Set(DEFAULT_FAQ_ITEMS.map(item => item.category).filter(Boolean)).size}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">问题分类</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl mb-2">💡</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {DEFAULT_FAQ_ITEMS.reduce((sum, item) => sum + (item.tags?.length || 0), 0)}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">知识标签</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">100%</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">解决率</div>
        </Card>
      </div>

      {/* FAQ 组件 */}
      <Card className="p-8">
        <FAQ items={DEFAULT_FAQ_ITEMS} />
      </Card>

      {/* 联系支持 */}
      <Card className="text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="space-y-4">
          <div className="text-4xl">💬</div>
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
            还有其他问题？
          </h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            如果你没有找到想要的答案，请通过以下方式获取帮助
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/duckdb/duckdb"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
            >
              <span>📖</span>
              官方文档
            </a>
            <a
              href="https://duckdb.org/community"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <span>💬</span>
              社区论坛
            </a>
          </div>
        </div>
      </Card>

      {/* 贡献指南 */}
      <Card className="p-6 border-dashed">
        <div className="text-center space-y-4">
          <div className="text-3xl">🤝</div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            帮助完善 FAQ
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            如果你有更好的问题解答或发现了新的常见问题，欢迎为这个 FAQ 贡献力量！
          </p>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            💡 可以通过 GitHub Issues 或 Pull Requests 提交建议
          </div>
        </div>
      </Card>
    </div>
  );
}
