# BookScape Vibe

BookScape transforms books into cinematic, interactive "worlds" using AI interpretation and atmosphere generation.

This repository contains the Next.js app in the `bookscape/` folder.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Supabase Auth + Postgres (saved worlds)
- Groq API (AI interpretation)
- Google Books API (book metadata, optional)
- Unsplash API (scene imagery, optional)

## Prerequisites

Install the following before running:

- Node.js 20+ (Node 22 LTS recommended)
- npm 10+
- A Supabase project (free tier is fine)
- A Groq API key (required)
- Unsplash API key (optional, but recommended)

## 1) Clone And Install

From the repository root:

```bash
cd bookscape
npm install
```

## 2) Environment Variables

In `bookscape/`, copy the example env file:

```bash
cp .env.example .env.local
```

Then edit `bookscape/.env.local` with real values:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Groq (required)
GROQ_API_KEY=YOUR_GROQ_API_KEY

# Optional
GOOGLE_BOOKS_API_KEY=YOUR_GOOGLE_BOOKS_API_KEY
UNSPLASH_ACCESS_KEY=YOUR_UNSPLASH_ACCESS_KEY

# Optional (only needed for /api/cleanup-covers route)
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

### Where To Get Keys

- Supabase URL + anon key:
	- Supabase Dashboard -> Project Settings -> API
- Groq key:
	- https://console.groq.com/keys
- Unsplash key:
	- https://unsplash.com/developers
- Google Books key (optional):
	- Google Cloud Console -> APIs & Services -> Credentials

## 3) Supabase Setup

### 3.1 Create the `worlds` table

Open Supabase SQL Editor and run:

```sql
create extension if not exists pgcrypto;

create table if not exists public.worlds (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references auth.users(id) on delete cascade,
	book_title text not null,
	author text not null,
	book_cover text,
	interpretation jsonb not null,
	created_at timestamptz not null default now(),
	unique (user_id, book_title, author)
);

create index if not exists worlds_user_id_created_at_idx
	on public.worlds (user_id, created_at desc);
```

### 3.2 Enable Row Level Security (RLS)

Run:

```sql
alter table public.worlds enable row level security;

create policy "Users can view own worlds"
on public.worlds
for select
using (auth.uid() = user_id);

create policy "Users can insert own worlds"
on public.worlds
for insert
with check (auth.uid() = user_id);

create policy "Users can delete own worlds"
on public.worlds
for delete
using (auth.uid() = user_id);
```

### 3.3 Auth Configuration

In Supabase Authentication settings:

- Enable Email provider (email/password auth)
- Set Site URL to `http://localhost:3000`
- Optionally add Redirect URL: `http://localhost:3000/callback`

## 4) Run The App

From `bookscape/`:

```bash
npm run dev
```

Open:

- http://localhost:3000

## 5) Production Commands

From `bookscape/`:

```bash
npm run build
npm run start
```

## What Works Without Optional Keys

- Without `UNSPLASH_ACCESS_KEY`: app still runs, but scene images fallback to gradients/placeholders.
- Without `GOOGLE_BOOKS_API_KEY`: app still runs via public Google Books access and AI fallbacks.

## Quick Smoke Test

1. Start app with `npm run dev`.
2. Open `http://localhost:3000/signin`.
3. Create an account and sign in.
4. Search a book from the homepage.
5. Save the generated world.
6. Confirm it appears in `/library`.

## Troubleshooting

- `Failed to generate interpretation`:
	- Check `GROQ_API_KEY` in `bookscape/.env.local`.
- `Unauthorized` on `/api/worlds`:
	- Ensure user is signed in and Supabase auth is configured.
- Database errors when saving worlds:
	- Confirm `worlds` table, RLS, and policies were created exactly as above.
- Missing scenic images:
	- Add `UNSPLASH_ACCESS_KEY` and restart dev server.

## Project Structure

- `bookscape/`: Next.js application
- `bookscape/src/app/`: routes and API handlers
- `bookscape/src/components/`: UI components
- `bookscape/src/lib/`: shared logic, API clients, types
