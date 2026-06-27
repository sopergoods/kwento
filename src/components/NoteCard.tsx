'use client';

import { Note } from '@/types';
import { formatDate, highlightMatch } from '@/lib/utils';
import { Pin } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  search: string;
  onClick: () => void;
  onPin: () => void;
}

export function NoteCard({ note, search, onClick, onPin }: NoteCardProps) {
  const titleHtml = highlightMatch(note.title, search);
  const bodyHtml = highlightMatch(note.body, search);

  return (
    <article
      onClick={onClick}
      className="
        group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-4
        cursor-pointer transition-all duration-150
        hover:border-violet-500/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-900/20
        active:scale-[0.99]
      "
    >
      {/* Pin badge */}
      {note.pinned && (
        <span className="absolute top-3 right-3 text-violet-400">
          <Pin size={13} fill="currentColor" />
        </span>
      )}

      {/* Title */}
      <h3
        className="font-semibold text-[15px] text-zinc-100 leading-snug mb-1 pr-5 line-clamp-1"
        dangerouslySetInnerHTML={{ __html: titleHtml }}
      />

      {/* Body preview */}
      {note.body && (
        <p
          className="text-zinc-500 text-[13px] leading-relaxed line-clamp-2 mb-3"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <time className="text-[11px] text-zinc-600">{formatDate(note.updatedAt)}</time>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPin();
          }}
          title={note.pinned ? 'Unpin' : 'Pin'}
          className={`
            opacity-0 group-hover:opacity-100 transition-opacity
            p-1 rounded-md hover:bg-zinc-700
            ${note.pinned ? 'text-violet-400' : 'text-zinc-600 hover:text-zinc-300'}
          `}
        >
          <Pin size={13} fill={note.pinned ? 'currentColor' : 'none'} />
        </button>
      </div>
    </article>
  );
}
