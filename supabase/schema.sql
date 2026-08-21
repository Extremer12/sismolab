-- Script de inicialización de Supabase para SAN JUAN · TIERRA QUE CUENTA

create table if not exists public.rankings (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  score integer not null,
  profile text not null default 'explorador',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Políticas RLS (Row Level Security) para permitir lecturas e inserciones públicas
alter table public.rankings enable row level security;

create policy "Permitir lectura pública del ranking"
  on public.rankings for select
  using (true);

create policy "Permitir inserción pública de puntuaciones"
  on public.rankings for insert
  with check (true);

-- Índice de rendimiento para ordenación por puntuación
create index if not exists rankings_score_idx on public.rankings (score desc);
