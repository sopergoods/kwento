interface EmptyStateProps {
  search: string;
}

export function EmptyState({ search }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center select-none">
      <div className="text-5xl mb-4">{search ? '🔍' : '📝'}</div>
      <p className="text-zinc-400 font-semibold text-base mb-1">
        {search ? 'No results found' : 'No notes yet'}
      </p>
      <p className="text-zinc-600 text-sm">
        {search
          ? `Nothing matched "${search}"`
          : 'Hit "+ New Note" to get started'}
      </p>
    </div>
  );
}
