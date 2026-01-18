import { cn } from '../utils/cn';
import { NoteButton } from './NoteButton';
import type { Note } from '../types';

interface InfoBoxProps {
  children: React.ReactNode;
  type?: 'info' | 'tip' | 'warning' | 'experiment' | 'fastai';
  title?: string;
  sectionId?: string;
  blockId?: string;
  notes?: Note[];
  onAddNote?: (content: string) => void;
  onUpdateNote?: (id: string, content: string) => void;
  onDeleteNote?: (id: string) => void;
}

export function InfoBox({ 
  children, 
  type = 'info', 
  title,
  sectionId,
  blockId,
  notes = [],
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: InfoBoxProps) {
  const styles = {
    info: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    tip: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
    warning: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
    experiment: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200',
    fastai: 'bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/50 border-pink-200 dark:border-pink-800 text-pink-800 dark:text-pink-200',
  };

  const icons = {
    info: '💡',
    tip: '✨',
    warning: '⚠️',
    experiment: '🧪',
    fastai: '🚀',
  };

  const defaultTitles = {
    info: '了解更多',
    tip: '小技巧',
    warning: '注意',
    experiment: '动手试试',
    fastai: 'Fast.ai 风格提示',
  };

  const showNoteButton = sectionId && blockId && onAddNote && onUpdateNote && onDeleteNote;

  return (
    <div className={cn(
      'p-5 rounded-xl border my-6 relative transition-all duration-300',
      'hover:shadow-md card-hover animate-fade-in',
      styles[type]
    )}>
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{icons[type]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-semibold mb-2">{title || defaultTitles[type]}</h4>
            {showNoteButton && (
              <NoteButton
                sectionId={sectionId}
                blockId={blockId}
                notes={notes}
                onAdd={onAddNote}
                onUpdate={onUpdateNote}
                onDelete={onDeleteNote}
              />
            )}
          </div>
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
