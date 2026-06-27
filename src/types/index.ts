export interface Note {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export type NoteFormData = Pick<Note, 'title' | 'body'>;

export type SortOrder = 'newest' | 'oldest' | 'alpha';
