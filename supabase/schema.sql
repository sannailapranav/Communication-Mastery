-- =====================================================================
-- COMMUNICATION MASTERY — SUPABASE DATABASE SCHEMA WITH ROW LEVEL SECURITY
-- =====================================================================
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor).
-- This provisions the relational user profiles and learning progress tables,
-- enforces Row-Level Security (RLS), and registers the automatic user profile
-- creation trigger on auth.users.
-- =====================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. PUBLIC PROFILES TABLE (Associated with auth.users.id)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  learning_level text default 'BEGINNER',
  goals text[] default array['CONFIDENCE', 'STRUCTURE']::text[],
  mother_tongue text default 'Telugu',
  learning_language text default 'English',
  preferred_ai_language text default 'Telugu (Tenglish)',
  script_preference text default 'romanized',
  conversational_style text default 'natural',
  is_onboarded boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

-- Profiles Policies: Users can only read, insert, and update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 3. USER LEVEL PROGRESS TABLE
create table if not exists public.user_level_progress (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  level_number integer not null,
  status text not null default 'LOCKED',
  current_step integer default 0,
  score numeric,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_level_progress enable row level security;

create policy "Users can view own level progress"
  on public.user_level_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own level progress"
  on public.user_level_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own level progress"
  on public.user_level_progress for update
  using (auth.uid() = user_id);

-- 4. USER ANSWERS TABLE
create table if not exists public.user_answers (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  progress_id text,
  level_number integer not null,
  question_id text not null,
  question_number integer not null,
  answer_text text not null,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_answers enable row level security;

create policy "Users can view own answers"
  on public.user_answers for select
  using (auth.uid() = user_id);

create policy "Users can insert own answers"
  on public.user_answers for insert
  with check (auth.uid() = user_id);

-- 5. USER AI FEEDBACK TABLE
create table if not exists public.user_ai_feedback (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  progress_id text,
  level_number integer not null,
  overall_score numeric,
  depth_of_reflection numeric,
  self_awareness_score numeric,
  communication_clarity numeric,
  individual_answers_feedback jsonb default '[]'::jsonb,
  what_you_understood text[] default array[]::text[],
  what_you_noticed text[] default array[]::text[],
  needs_deeper_understanding text[] default array[]::text[],
  communication_insight text,
  mentor_verdict text,
  one_key_principle text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_ai_feedback enable row level security;

create policy "Users can view own ai feedback"
  on public.user_ai_feedback for select
  using (auth.uid() = user_id);

create policy "Users can insert own ai feedback"
  on public.user_ai_feedback for insert
  with check (auth.uid() = user_id);

-- 6. PRACTICE ATTEMPTS TABLE
create table if not exists public.practice_attempts (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  exercise_id text not null,
  exercise_title text not null,
  exercise_type text not null,
  response_text text not null,
  input_mode text default 'TEXT',
  audio_duration_seconds numeric,
  evaluation jsonb not null,
  selected_choice_id text,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.practice_attempts enable row level security;

create policy "Users can view own practice attempts"
  on public.practice_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert own practice attempts"
  on public.practice_attempts for insert
  with check (auth.uid() = user_id);

-- 7. SĀKSHI (NORMAL AI) CONVERSATIONS & MESSAGES
create table if not exists public.ai_conversations (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'New Conversation',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ai_conversations enable row level security;

create policy "Users can view own conversations"
  on public.ai_conversations for select
  using (auth.uid() = user_id);

create policy "Users can insert own conversations"
  on public.ai_conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own conversations"
  on public.ai_conversations for update
  using (auth.uid() = user_id);

create table if not exists public.ai_messages (
  id text primary key,
  conversation_id text references public.ai_conversations(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'model')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ai_messages enable row level security;

create policy "Users can view own messages"
  on public.ai_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert own messages"
  on public.ai_messages for insert
  with check (auth.uid() = user_id);

-- 8. AUTOMATIC PROFILE TRIGGER ON AUTH.USERS INSERT
-- When a user signs in with Google or signs up via Supabase Auth,
-- this automatically provisions their row in public.profiles without duplicates.
create or replace function public.handle_new_user()
returns trigger as $$
declare
  extracted_name text;
begin
  extracted_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'display_name',
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (
    id,
    email,
    display_name,
    avatar_url,
    learning_level,
    mother_tongue,
    learning_language,
    preferred_ai_language,
    is_onboarded
  )
  values (
    new.id,
    new.email,
    extracted_name,
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    'BEGINNER',
    'Telugu',
    'English',
    'Telugu (Tenglish)',
    false
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();

  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
