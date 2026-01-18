import { NoteButton } from './NoteButton';
import type { Note } from '../types';

interface ParagraphProps {
  children: React.ReactNode;
  sectionId: string;
  blockId: string;
  notes: Note[];
  onAddNote: (content: string) => void;
  onUpdateNote: (id: string, content: string) => void;
  onDeleteNote: (id: string) => void;
  className?: string;
}

export function Paragraph({
  children,
  sectionId,
  blockId,
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  className = '',
}: ParagraphProps) {
  return (
    <div className={`group relative flex items-start gap-2 my-4 ${className}`}>
      <p className="flex-1 text-slate-600 leading-relaxed">{children}</p>
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <NoteButton
          sectionId={sectionId}
          blockId={blockId}
          notes={notes}
          onAdd={onAddNote}
          onUpdate={onUpdateNote}
          onDelete={onDeleteNote}
        />
      </div>
    </div>
  );
}
