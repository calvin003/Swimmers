-- Run this once in the Supabase dashboard: SQL Editor → New query → paste → Run.

-- 1. Table to hold waitlist signups
create table if not exists public.waitlist (
  id         bigint generated always as identity primary key,
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- 2. Turn on Row-Level Security (locks the table by default)
alter table public.waitlist enable row level security;

-- 3. Allow anonymous visitors to INSERT their email only.
--    No select/update/delete policy exists, so the public anon key
--    cannot read, change, or delete anyone's email.
create policy "anyone can join the waitlist"
  on public.waitlist
  for insert
  to anon
  with check (true);
