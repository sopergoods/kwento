import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Note, NoteFormData, SortOrder } from '@/types';

interface NotesState {
  notes: Note[];
  search: string;
  sortOrder: SortOrder;
  isLoading: boolean;
  isHydrated: boolean;

  hydrate: () => Promise<void>;
  setSearch: (q: string) => void;
  setSortOrder: (order: SortOrder) => void;
  createNote: (data: NoteFormData) => Promise<Note>;
  updateNote: (id: string, data: Partial<NoteFormData & { pinned: boolean }>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  getFiltered: () => Note[];
}

export const useNotesStore = create<NotesState>()(
  devtools(
    (set, get) => ({
      notes: [],
      search: '',
      sortOrder: 'newest',
      isLoading: false,
      isHydrated: false,

      async hydrate() {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/notes');
          if (!res.ok) throw new Error('Failed to fetch');
          const notes: Note[] = await res.json();
          set({ notes, isHydrated: true });
        } catch (e) {
          console.error('[store] hydrate failed:', e);
        } finally {
          set({ isLoading: false });
        }
      },

      setSearch(q) { set({ search: q }); },
      setSortOrder(order) { set({ sortOrder: order }); },

      async createNote(data) {
        const res = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create note');
        const note: Note = await res.json();
        set((s) => ({ notes: [note, ...s.notes] }));
        return note;
      },

      async updateNote(id, data) {
        const res = await fetch(`/api/notes/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update note');
        const updated: Note = await res.json();
        set((s) => ({ notes: s.notes.map((n) => (n.id === id ? updated : n)) }));
      },

      async deleteNote(id) {
        await fetch(`/api/notes/${id}`, { method: 'DELETE' });
        set((s) => ({ notes: s.notes.filter((n) => n.id !== id) }));
      },

      async togglePin(id) {
        const note = get().notes.find((n) => n.id === id);
        if (!note) return;
        await get().updateNote(id, { pinned: !note.pinned });
      },

      getFiltered() {
        const { notes, search, sortOrder } = get();
        const q = search.toLowerCase().trim();

        let filtered = q
          ? notes.filter(
              (n) =>
                n.title.toLowerCase().includes(q) ||
                n.body.toLowerCase().includes(q)
            )
          : [...notes];

        const pinned = filtered.filter((n) => n.pinned);
        const unpinned = filtered.filter((n) => !n.pinned);

        const sort = (arr: Note[]) => {
          switch (sortOrder) {
            case 'oldest': return arr.sort((a, b) => Date.parse(String(a.createdAt)) - Date.parse(String(b.createdAt)));
            case 'alpha':  return arr.sort((a, b) => a.title.localeCompare(b.title));
            default:       return arr.sort((a, b) => Date.parse(String(b.updatedAt)) - Date.parse(String(a.updatedAt)));
          }
        };

        return [...sort(pinned), ...sort(unpinned)];
      },
    }),
    { name: 'kwento-store' }
  )
);
