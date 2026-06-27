'use client';

import { Note } from '@/types';
import { NoteCard } from './NoteCard';
import { EmptyState } from './ui/EmptyState';

interface NotesListProps {
  notes: Note[];
  search: string;
  onSelect: (note: Note) => void;
  onPin: (id: string) => void;
}

export function NotesList({ notes, search, onSelect, onPin }: NotesListProps) {
  if (notes.length === 0) {
    return <EmptyState search={search} />;
  }

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          search={search}
          onClick={() => onSelect(note)}
          onPin={() => onPin(note.id)}
        />
      ))}
    </div>
  );
}
