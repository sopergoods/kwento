'use client';

import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search notes…"
        className="
          w-full bg-zinc-900 border border-zinc-800 rounded-xl
          pl-10 pr-10 py-3 text-[14px] text-zinc-200
          placeholder:text-zinc-600 outline-none
          focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20
          transition-colors
        "
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
