import { type ClassValue, clsx } from 'clsx';

// Lightweight cn() without needing full clsx install
export function cn(...inputs: ClassValue[]) {
  return inputs
    .flat()
    .filter((x) => typeof x === 'string' && x)
    .join(' ');
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatDate(timestamp: number | string): string {
  const d = new Date(typeof timestamp === 'string' ? timestamp : timestamp);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function highlightMatch(text: string, query: string): string {
  // Returns text with <mark> injected — rendered via dangerouslySetInnerHTML safely
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

export function matchesSearch(note: { title: string; body: string }, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return note.title.toLowerCase().includes(q) || note.body.toLowerCase().includes(q);
}
