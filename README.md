# 📝 Kwento

> Fast, searchable notes app built with Next.js 15 + TypeScript.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand (with devtools) |
| Icons | Lucide React |
| Persistence | localStorage |
| Deployment | Vercel |

## Features

- ⚡ Real-time keyword search with match highlighting
- 📌 Pin important notes to the top
- 🔃 Sort by newest, oldest, or A–Z
- ✏️ Full create / edit / delete flow
- 💾 Auto-persisted to localStorage
- ⌨️ `Ctrl+S` / `Cmd+S` to save in editor
- 🗑️ Two-tap delete confirmation (no accidents)
- 📱 Responsive (mobile + desktop)

## Getting Started

```bash
# Install deps
npm install

# Run locally
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout + metadata
│   ├── page.tsx          # Main screen controller
│   └── globals.css       # Global styles
├── components/
│   ├── NoteCard.tsx      # Single note card
│   ├── NoteEditor.tsx    # Create / edit editor
│   ├── NotesList.tsx     # Grid of note cards
│   ├── SearchBar.tsx     # Search input
│   └── ui/
│       ├── EmptyState.tsx
│       └── Toast.tsx
├── hooks/
│   ├── useNotes.ts       # Hydration + filtered notes
│   └── useToast.ts       # Toast notifications
├── lib/
│   ├── storage.ts        # localStorage abstraction
│   └── utils.ts          # cn(), formatDate(), highlight()
├── store/
│   └── notes.store.ts    # Zustand store
└── types/
    └── index.ts          # Shared TypeScript types
```

## Deploy to Vercel

```bash
# One-time setup
npm i -g vercel

vercel
```

Or push to GitHub and connect the repo at [vercel.com](https://vercel.com).
