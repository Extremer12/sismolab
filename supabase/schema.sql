-- ==========================================================
-- SCRIPT DE INICIALIZACIÓN DE SUPABASE: SISMO LAB (INPRES SAN JUAN)
-- ==========================================================

-- 1. TABLA DE PERFILES DE USUARIOS (Leaderboard & Stats)
create table if not exists public.profiles (
  id text primary key,
  auth_user_id uuid references auth.users(id) on delete set null,
  nickname text not null,
  display_name text not null,
  avatar_url text,
  avatar_emoji text default '🦅',
  mode text not null default 'kids' check (mode in ('kids', 'adult')),
  total_score integer not null default 0,
  level integer not null default 1,
  games_played integer not null default 0,
  correct_answers_count integer not null default 0,
  total_answers_count integer not null default 0,
  completed_game_ids jsonb default '[]'::jsonb,
  game_high_scores jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Políticas RLS para perfiles (lectura y escritura anónima / autenticada)
create policy "Permitir lectura pública de perfiles"
  on public.profiles for select
  using (true);

create policy "Permitir inserción y actualización de perfiles"
  on public.profiles for insert
  with check (true);

create policy "Permitir update de perfiles"
  on public.profiles for update
  using (true);

-- Índices de alto rendimiento para el ranking
create index if not exists profiles_total_score_idx on public.profiles (total_score desc);
create index if not exists profiles_mode_idx on public.profiles (mode);
create index if not exists profiles_auth_user_id_idx on public.profiles (auth_user_id);
