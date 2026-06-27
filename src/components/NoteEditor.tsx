'use client';

import { useState, useEffect, useRef } from 'react';
import { Note, NoteFormData } from '@/types';
import { ArrowLeft, Trash2 } from 'lucide-react';

interface NoteEditorProps {
  note?: Note | null;
  onSave: (data: NoteFormData) => void;
  onDelete?: () => void;
  onBack: () => void;
  saving?: boolean;
}

export function NoteEditor({ note, onSave, onDelete, onBack, saving }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title ?? '');
  const [body, setBody] = useState(note?.body ?? '');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => { titleRef.current?.focus(); }, []);

  const isDirty = title !== (note?.title ?? '') || body !== (note?.body ?? '');
  const canSave = title.trim().length > 0;

  function handleSave() { if (canSave) onSave({ title, body }); }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); handleSave(); }
  }

  return (
    <div className="flex flex-col h-full min-h-screen bg-zinc-950" onKeyDown={handleKeyDown}>
      <header className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur border-b border-zinc-800 px-5 py-3.5 flex items-center gap-3">
        <button onClick={onBack} className="text-zinc-400 hover:text-zinc-100 transition-colors p-1 -ml-1 rounded-lg hover:bg-zinc-800">
          <ArrowLeft size={20} />
        </button>

        <span className="flex-1 text-sm text-zinc-500 font-medium">
          {note ? 'Edit note' : 'New note'}
          {isDirty && <span className="ml-2 text-violet-400">•</span>}
        </span>

        <div className="flex items-center gap-2">
          {note && onDelete && (
            <button
              onClick={() => { if (confirmDelete) { onDelete(); } else { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); } }}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all
                ${confirmDelete ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-red-400 hover:bg-zinc-800'}`}
            >
              <Trash2 size={15} className="inline mr-1" />
              {confirmDelete ? 'Sure?' : 'Delete'}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!canSave || saving}
            className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-all bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col px-5 pt-6 pb-10 max-w-2xl mx-auto w-full">
        <input
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-transparent border-none outline-none text-2xl font-bold text-zinc-100 placeholder:text-zinc-700 mb-4"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your note…"
          className="flex-1 w-full bg-transparent border-none outline-none resize-none text-[15px] text-zinc-400 placeholder:text-zinc-700 leading-relaxed min-h-[60vh] font-normal"
        />
        <p className="text-xs text-zinc-700 mt-4 select-none">
          {body.split(/\s+/).filter(Boolean).length} words · ⌘S to save
        </p>
      </div>
    </div>
  );
}
