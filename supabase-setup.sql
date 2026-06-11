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

-- ---------------------------------------------------------------
-- Heart check (heart.html): heart rate recovery entries
-- ---------------------------------------------------------------

create table if not exists public.heart_rate (
  id               bigint generated always as identity primary key,
  name             text not null,
  email            text not null,
  resting_hr       int  not null check (resting_hr between 30 and 120),
  active_hr        int  not null check (active_hr between 60 and 230),
  recovery_seconds int  not null check (recovery_seconds between 5 and 3600),
  created_at       timestamptz not null default now()
);

alter table public.heart_rate enable row level security;

-- Insert-only for the public anon key, same model as the waitlist:
-- visitors can log an entry but cannot read, change, or delete any.
create policy "anyone can log a heart check"
  on public.heart_rate
  for insert
  to anon
  with check (true);

-- SpO2 + ECG readings added to heart checks (already applied in the dashboard)
alter table public.heart_rate
  add column if not exists spo2 int check (spo2 between 70 and 100),
  add column if not exists ecg_reading text;

-- origin: where the participant was sourced (e.g. Stanford, SF)
alter table public.heart_rate add column if not exists origin text;
