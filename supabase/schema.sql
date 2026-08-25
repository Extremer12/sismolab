-- ==============================================================================
-- SCHEMA COMPLETO DE BASE DE DATOS: SISMO LAB (INPRES SAN JUAN)
-- Plataforma Educativa e Interactiva de Prevención Sísmica
-- ==============================================================================

-- 1. TABLA: PROFILES (Perfiles de usuario, puntuaciones y progreso)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nickname TEXT NOT NULL CONSTRAINT profiles_nickname_unique UNIQUE,
  display_name TEXT NOT NULL,
  avatar_emoji TEXT DEFAULT '🦅',
  avatar_url TEXT,
  mode TEXT NOT NULL DEFAULT 'kids' CHECK (mode IN ('kids', 'adult')),
  total_score INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  games_played INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_answers INTEGER NOT NULL DEFAULT 0,
  perfect_rounds INTEGER NOT NULL DEFAULT 0,
  completed_game_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  achievements JSONB DEFAULT '[]'::JSONB,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL
);

-- 2. TABLA: GAME_SESSIONS (Registro individual de cada partida jugada)
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('kids', 'adult')),
  score INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  total_count INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL
);

-- 3. TABLA: APP_SETTINGS (Configuración del Stand de la Feria y PIN de Administración)
CREATE TABLE IF NOT EXISTS public.app_settings (
  id TEXT PRIMARY KEY,
  event_name TEXT NOT NULL DEFAULT 'Feria INPRES San Juan 2026',
  stand_id TEXT NOT NULL DEFAULT 'STAND-01',
  admin_pin_hash TEXT NOT NULL DEFAULT '1944',
  is_leaderboard_locked BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL
);

-- Configuración inicial del Stand
INSERT INTO public.app_settings (id, event_name, stand_id, admin_pin_hash, is_leaderboard_locked)
VALUES ('stand_config', 'Feria INPRES San Juan 2026', 'STAND-01', '1944', false)
ON CONFLICT (id) DO NOTHING;

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura y escritura para Profiles
CREATE POLICY "Permitir lectura pública de perfiles activos"
  ON public.profiles FOR SELECT
  USING (is_active = true);

CREATE POLICY "Permitir inserción y actualización de perfiles"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir actualización de perfiles propios"
  ON public.profiles FOR UPDATE
  USING (true);

-- Políticas para Game Sessions
CREATE POLICY "Permitir lectura de sesiones"
  ON public.game_sessions FOR SELECT
  USING (true);

CREATE POLICY "Permitir registro de sesiones de juego"
  ON public.game_sessions FOR INSERT
  WITH CHECK (true);

-- Políticas para App Settings (solo lectura de configuración básica pública)
CREATE POLICY "Permitir lectura de configuración de evento"
  ON public.app_settings FOR SELECT
  USING (true);

-- 5. ÍNDICES DE ALTO RENDIMIENTO
CREATE INDEX IF NOT EXISTS profiles_total_score_idx ON public.profiles (total_score DESC);
CREATE INDEX IF NOT EXISTS profiles_mode_score_idx ON public.profiles (mode, total_score DESC);
CREATE INDEX IF NOT EXISTS profiles_nickname_idx ON public.profiles (nickname);
CREATE INDEX IF NOT EXISTS game_sessions_game_id_idx ON public.game_sessions (game_id);
CREATE INDEX IF NOT EXISTS game_sessions_created_at_idx ON public.game_sessions (created_at DESC);

-- ==============================================================================
-- 6. FUNCIONES RPC (PROCEDIMIENTOS ALMACENADOS)
-- ==============================================================================

-- RPC: Verificar PIN de Administración de manera segura en el servidor
CREATE OR REPLACE FUNCTION public.admin_verify_pin(p_admin_pin TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_stored_pin TEXT;
BEGIN
  SELECT admin_pin_hash INTO v_stored_pin FROM public.app_settings WHERE id = 'stand_config';
  
  IF v_stored_pin IS NOT NULL AND p_admin_pin = v_stored_pin THEN
    RETURN jsonb_build_object('success', true, 'valid', true);
  ELSE
    RETURN jsonb_build_object('success', true, 'valid', false, 'error', 'PIN de administrador incorrecto');
  END IF;
END;
$$;

-- RPC: Obtener Métricas en tiempo real para el Panel de Administración
CREATE OR REPLACE FUNCTION public.admin_get_metrics(p_admin_pin TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_stored_pin TEXT;
  v_total_visitors INT;
  v_total_games INT;
  v_avg_score NUMERIC;
  v_kids_count INT;
  v_adults_count INT;
  v_popular_games JSONB;
  v_recent_profiles JSONB;
BEGIN
  SELECT admin_pin_hash INTO v_stored_pin FROM public.app_settings WHERE id = 'stand_config';
  
  IF v_stored_pin IS NULL OR p_admin_pin != v_stored_pin THEN
    RETURN jsonb_build_object('success', false, 'error', 'PIN no autorizado');
  END IF;

  SELECT COUNT(*), COALESCE(AVG(total_score), 0),
         COUNT(*) FILTER (WHERE mode = 'kids'),
         COUNT(*) FILTER (WHERE mode = 'adult')
  INTO v_total_visitors, v_avg_score, v_kids_count, v_adults_count
  FROM public.profiles
  WHERE is_active = true;

  SELECT COUNT(*) INTO v_total_games FROM public.game_sessions;

  -- Popular games breakdown
  SELECT COALESCE(jsonb_agg(g), '[]'::jsonb) INTO v_popular_games
  FROM (
    SELECT game_id, COUNT(*) as session_count
    FROM public.game_sessions
    GROUP BY game_id
    ORDER BY session_count DESC
  ) g;

  -- Recent active profiles for export
  SELECT COALESCE(jsonb_agg(p), '[]'::jsonb) INTO v_recent_profiles
  FROM (
    SELECT id, nickname, display_name, mode, total_score, games_played, correct_answers, total_answers, updated_at
    FROM public.profiles
    WHERE is_active = true
    ORDER BY total_score DESC
    LIMIT 200
  ) p;

  RETURN jsonb_build_object(
    'success', true,
    'total_visitors', v_total_visitors,
    'total_games', v_total_games,
    'avg_score', ROUND(v_avg_score, 0),
    'kids_count', v_kids_count,
    'adults_count', v_adults_count,
    'popular_games', v_popular_games,
    'profiles', v_recent_profiles
  );
END;
$$;

-- RPC: Reiniciar el Leaderboard del Stand para un nuevo turno/evento
CREATE OR REPLACE FUNCTION public.admin_reset_leaderboard(p_admin_pin TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_stored_pin TEXT;
BEGIN
  SELECT admin_pin_hash INTO v_stored_pin FROM public.app_settings WHERE id = 'stand_config';

  IF v_stored_pin IS NULL OR p_admin_pin != v_stored_pin THEN
    RETURN jsonb_build_object('success', false, 'error', 'PIN de administrador inválido');
  END IF;

  -- Reset all scores
  UPDATE public.profiles
  SET 
    total_score = 0,
    games_played = 0,
    correct_answers = 0,
    total_answers = 0,
    perfect_rounds = 0,
    completed_game_ids = ARRAY[]::TEXT[],
    updated_at = timezone('utc'::TEXT, now());

  -- Clear historical sessions
  DELETE FROM public.game_sessions;

  RETURN jsonb_build_object('success', true, 'message', 'Tabla de posiciones reiniciada exitosamente para la feria');
END;
$$;
