'use client';

import { useState } from 'react';
import { useHydrateNotes, useFilteredNotes } from '@/hooks/useNotes';
import { useNotesStore } from '@/store/notes.store';
import { useToast } from '@/hooks/useToast';
import { Note, NoteFormData, SortOrder } from '@/types';
import { signOut, useSession } from 'next-auth/react';

import { NotesList } from '@/components/NotesList';
import { NoteEditor } from '@/components/NoteEditor';
import { SearchBar } from '@/components/SearchBar';
import { ToastContainer } from '@/components/ui/Toast';
import { PenLine, SortAsc, LogOut } from 'lucide-react';

type Screen = 'list' | 'compose' | 'edit';

export default function HomePage() {
  const { data: session } = useSession();
  const isHydrated = useHydrateNotes();
  const filteredNotes = useFilteredNotes();

  const { search, setSearch, sortOrder, setSortOrder, createNote, updateNote, deleteNote, togglePin, notes, isLoading } =
    useNotesStore();

  const { toasts, show: showToast, dismiss } = useToast();
  const [screen, setScreen] = useState<Screen>('list');
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [saving, setSaving] = useState(false);

  function handleNew() { setActiveNote(null); setScreen('compose'); }
  function handleSelect(note: Note) { setActiveNote(note); setScreen('edit'); }

  async function handleSave(data: NoteFormData) {
    setSaving(true);
    try {
      if (screen === 'edit' && activeNote) {
        await updateNote(activeNote.id, data);
        showToast('Note updated ✓');
      } else {
        await createNote(data);
        showToast('Note saved ✓');
      }
      setScreen('list');
      setActiveNote(null);
    } catch {
      showToast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!activeNote) return;
    await deleteNote(activeNote.id);
    showToast('Note deleted', 'error');
    setScreen('list');
    setActiveNote(null);
  }

  const sortOptions: { label: string; value: SortOrder }[] = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'A–Z', value: 'alpha' },
  ];

  if (!isHydrated || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (screen === 'compose' || screen === 'edit') {
    return (
      <>
        <NoteEditor
          note={screen === 'edit' ? activeNote : null}
          onSave={handleSave}
          onDelete={screen === 'edit' ? handleDelete : undefined}
          onBack={() => { setScreen('list'); setActiveNote(null); }}
          saving={saving}
        />
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
      </>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 pb-24">
        <header className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur pt-6 pb-4 -mx-4 px-4 border-b border-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-zinc-100 tracking-tight">📝 Kwento</h1>
              <p className="text-xs text-zinc-600 mt-0.5">
                {session?.user?.email} · {notes.length} {notes.length === 1 ? 'note' : 'notes'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-zinc-500 hover:text-zinc-300 p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
              <button
                onClick={handleNew}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-violet-900/30"
              >
                <PenLine size={15} />
                New Note
              </button>
            </div>
          </div>

          <SearchBar value={search} onChange={setSearch} />

          <div className="flex items-center gap-1 mt-3">
            <SortAsc size={13} className="text-zinc-600 mr-1" />
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortOrder(opt.value)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors
                  ${sortOrder === opt.value ? 'bg-violet-600/20 text-violet-400' : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800'}`}
              >
                {opt.label}
              </button>
            ))}
            {search && (
              <span className="ml-auto text-xs text-zinc-600">
                {filteredNotes.length} result{filteredNotes.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </header>

        <main className="pt-5">
          <NotesList
            notes={filteredNotes}
            search={search}
            onSelect={handleSelect}
            onPin={async (id) => { await togglePin(id); showToast('Updated', 'info'); }}
          />
        </main>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
