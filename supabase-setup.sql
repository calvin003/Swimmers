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
drop policy if exists "anyone can join the waitlist" on public.waitlist;
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
drop policy if exists "anyone can log a heart check" on public.heart_rate;
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

-- ---------------------------------------------------------------
-- Profile photos (heart.html "Change a profile photo" tool)
--
-- Photos are stored as small data-URL JPEGs, keyed by a normalised
-- name (lower(trim(name))) — the only swimmer identifier the public
-- leaderboard/profile pages can see. No email is stored here, so the
-- table is safe to read publicly. Emails never leave the database:
-- the lookup + save go through SECURITY DEFINER functions below.
-- ---------------------------------------------------------------

create table if not exists public.avatars (
  name_key   text primary key,                 -- lower(trim(name))
  avatar_url text not null,
  updated_at timestamptz not null default now()
);

alter table public.avatars enable row level security;

-- Anyone may READ avatars (name_key -> image only; no PII here).
drop policy if exists "avatars are public" on public.avatars;
create policy "avatars are public"
  on public.avatars
  for select
  to anon
  using (true);
-- No insert/update/delete policy: writes happen only via set_swimmer_avatar().

-- Find a swimmer by email (latest heart check), returning their name and
-- current photo. Runs as owner so it can read heart_rate without exposing
-- the whole email list through the public API.
create or replace function public.find_swimmer(p_email text)
returns table(name text, avatar_url text)
language sql
security definer
set search_path = public
as $$
  select h.name, a.avatar_url
  from public.heart_rate h
  left join public.avatars a on a.name_key = lower(trim(h.name))
  where lower(h.email) = lower(trim(p_email))
  order by h.created_at desc
  limit 1;
$$;

-- Set (or replace) a swimmer's photo by email. Returns the swimmer's name,
-- or null if no swimmer has that email.
create or replace function public.set_swimmer_avatar(p_email text, p_avatar text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare v_name text;
begin
  select h.name into v_name
  from public.heart_rate h
  where lower(h.email) = lower(trim(p_email))
  order by h.created_at desc
  limit 1;

  if v_name is null then
    return null;
  end if;

  insert into public.avatars(name_key, avatar_url, updated_at)
  values (lower(trim(v_name)), p_avatar, now())
  on conflict (name_key)
  do update set avatar_url = excluded.avatar_url, updated_at = now();

  return v_name;
end;
$$;

grant execute on function public.find_swimmer(text)            to anon;
grant execute on function public.set_swimmer_avatar(text, text) to anon;

-- ---------------------------------------------------------------
-- Leagues (create.html) + members (join.html)
--
-- A "league" is a private group competition. The host creates one and
-- shares a code/link; friends join via join.html?code=CODE.
--
-- The leagues table holds NO personal data (just league settings + the
-- commissioner's display name), so it is safe to read publicly. The
-- league_members table DOES hold emails, so it has no public select
-- policy — the board is read through a SECURITY DEFINER function that
-- returns names + scores only, never emails (same model as avatars).
-- ---------------------------------------------------------------

create table if not exists public.leagues (
  id         bigint generated always as identity primary key,
  code       text not null unique,                        -- shareable, e.g. SPLASH7
  name       text not null,
  host_name  text not null,
  emoji      text not null default '🏊',
  rank_by    text not null default 'score'  check (rank_by in ('score','count','motility')),
  season     text not null default 'month'  check (season in ('week','month','quarter')),
  access     text not null default 'link'   check (access in ('link','approve')),
  entry      text not null default 'admin'  check (entry  in ('admin','self')),
  ends_at    date,
  created_at timestamptz not null default now()
);

alter table public.leagues enable row level security;

-- Anyone can create a league.
drop policy if exists "anyone can create a league" on public.leagues;
create policy "anyone can create a league"
  on public.leagues for insert to anon with check (true);

-- League settings are public (no PII stored here) so join.html can read them
-- and the insert .select() round-trip returns the new row to the creator.
drop policy if exists "leagues are public" on public.leagues;
create policy "leagues are public"
  on public.leagues for select to anon using (true);

create table if not exists public.league_members (
  id         bigint generated always as identity primary key,
  league_id  bigint not null references public.leagues(id) on delete cascade,
  name       text not null,
  email      text not null,
  count      int,
  motility   int,
  morphology int,
  volume     numeric,
  swim_score int,
  join_state text not null default 'self'   check (join_state in ('synced','self','admin','manual')),
  status     text not null default 'joined' check (status in ('joined','pending')),
  created_at timestamptz not null default now()
);

alter table public.league_members enable row level security;

-- Anyone can join a league (insert). No select/update/delete policy exists,
-- so emails can never be read back through the public anon key.
drop policy if exists "anyone can join a league" on public.league_members;
create policy "anyone can join a league"
  on public.league_members for insert to anon with check (true);

-- Public board for a league by code: names + scores only, never emails.
-- Runs as owner so it can read league_members without a public select policy.
create or replace function public.league_board(p_code text)
returns table(name text, swim_score int, join_state text, status text, created_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select m.name, m.swim_score, m.join_state, m.status, m.created_at
  from public.league_members m
  join public.leagues l on l.id = m.league_id
  where upper(l.code) = upper(trim(p_code))
    and m.status = 'joined'
  order by m.swim_score desc nulls last, m.created_at asc;
$$;

grant execute on function public.league_board(text) to anon;
