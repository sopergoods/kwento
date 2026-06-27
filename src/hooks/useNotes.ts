'use client';

import { useEffect } from 'react';
import { useNotesStore } from '@/store/notes.store';

/**
 * Hydrates the store from localStorage on mount.
 * Call once at the layout/root level.
 */
export function useHydrateNotes() {
  const hydrate = useNotesStore((s) => s.hydrate);
  const isHydrated = useNotesStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) hydrate();
  }, [hydrate, isHydrated]);

  return isHydrated;
}

/**
 * Returns filtered + sorted notes based on current search/sort state.
 */
export function useFilteredNotes() {
  const getFiltered = useNotesStore((s) => s.getFiltered);
  const search = useNotesStore((s) => s.search);
  const sortOrder = useNotesStore((s) => s.sortOrder);
  // Re-derive on any store change
  return getFiltered();
}
