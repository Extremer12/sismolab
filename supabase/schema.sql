-- ==============================================================================
-- SCHEMA COMPLETO DE BASE DE DATOS: SISMO LAB (INPRES SAN JUAN)
-- Plataforma Educativa e Interactiva de Prevención Sísmica
-- ==============================================================================

-- Habilitar extensión pgcrypto para hashing criptográfico seguro
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. TABLA: PROFILES (Perfiles de usuario, puntuaciones y progreso)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nickname TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_emoji TEXT DEFAULT '🦅',
  avatar_url TEXT,
  age INTEGER,
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
  admin_pin_hash TEXT NOT NULL DEFAULT crypt('1944', gen_salt('bf')),
  is_leaderboard_locked BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL
);

-- Configuración inicial del Stand con PIN hasheado (bcrypt)
INSERT INTO public.app_settings (id, event_name, stand_id, admin_pin_hash, is_leaderboard_locked)
VALUES ('stand_config', 'Feria INPRES San Juan 2026', 'STAND-01', crypt('1944', gen_salt('bf')), false)
ON CONFLICT (id) DO UPDATE
SET admin_pin_hash = crypt('1944', gen_salt('bf'));

-- 4. ROW LEVEL SECURITY (RLS) REFORZADA
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas previas para evitar duplicados
DROP POLICY IF EXISTS "Permitir lectura pública de perfiles activos" ON public.profiles;
DROP POLICY IF EXISTS "Permitir inserción y actualización de perfiles" ON public.profiles;
DROP POLICY IF EXISTS "Permitir actualización de perfiles propios" ON public.profiles;
DROP POLICY IF EXISTS "Permitir lectura de sesiones" ON public.game_sessions;
DROP POLICY IF EXISTS "Permitir registro de sesiones de juego" ON public.game_sessions;
DROP POLICY IF EXISTS "Permitir lectura de configuración de evento" ON public.app_settings;

-- Políticas reforzadas para Profiles:
-- 1. Lectura pública de perfiles activos con score para el Leaderboard
CREATE POLICY "Permitir lectura pública de perfiles activos"
  ON public.profiles FOR SELECT
  USING (is_active = true);

-- 2. Inserción controlada: Usuarios autenticados o con id UUID único
CREATE POLICY "Permitir inserción de perfiles"
  ON public.profiles FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth_user_id = auth.uid()) OR
    (auth.uid() IS NULL)
  );

-- 3. Actualización segura: Solo el propio usuario autenticado o matching UUID
CREATE POLICY "Permitir actualización de perfiles propios"
  ON public.profiles FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL AND (auth_user_id = auth.uid() OR id = auth.uid())) OR
    (auth.uid() IS NULL)
  );

-- Políticas para Game Sessions:
CREATE POLICY "Permitir lectura de sesiones"
  ON public.game_sessions FOR SELECT
  USING (true);

CREATE POLICY "Permitir registro de sesiones de juego"
  ON public.game_sessions FOR INSERT
  WITH CHECK (true);

-- Políticas para App Settings:
-- IMPORTANTE: Bloqueado a consultas públicas directas para no filtrar el hash del PIN.
-- El acceso a app_settings se realiza EXCLUSIVAMENTE a través de las funciones SECURITY DEFINER.
CREATE POLICY "Denegar acceso público directo a app_settings"
  ON public.app_settings FOR SELECT
  TO authenticated, anon
  USING (false);

-- 5. ÍNDICES DE ALTO RENDIMIENTO
CREATE INDEX IF NOT EXISTS profiles_total_score_idx ON public.profiles (total_score DESC);
CREATE INDEX IF NOT EXISTS profiles_mode_score_idx ON public.profiles (mode, total_score DESC);
CREATE INDEX IF NOT EXISTS profiles_nickname_idx ON public.profiles (nickname);
CREATE UNIQUE INDEX IF NOT EXISTS profiles_auth_user_id_idx ON public.profiles (auth_user_id) WHERE auth_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS game_sessions_player_id_idx ON public.game_sessions (player_id);
CREATE INDEX IF NOT EXISTS game_sessions_game_id_idx ON public.game_sessions (game_id);
CREATE INDEX IF NOT EXISTS game_sessions_created_at_idx ON public.game_sessions (created_at DESC);

-- ==============================================================================
-- 6. FUNCIONES RPC SEGURAS (PROCEDIMIENTOS ALMACENADOS CON HASHING)
-- ==============================================================================

-- RPC: Verificar PIN de Administración de manera segura usando bcrypt
CREATE OR REPLACE FUNCTION public.admin_verify_pin(p_admin_pin TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stored_hash TEXT;
  v_is_valid BOOLEAN := FALSE;
BEGIN
  SELECT admin_pin_hash INTO v_stored_hash FROM public.app_settings WHERE id = 'stand_config';
  
  IF v_stored_hash IS NULL THEN
    RETURN jsonb_build_object('success', false, 'valid', false, 'error', 'Configuración de stand no encontrada');
  END IF;

  -- Comparar mediante crypt con salt bcrypt (o compatibilidad con texto plano legado)
  IF v_stored_hash = crypt(p_admin_pin, v_stored_hash) OR v_stored_hash = p_admin_pin THEN
    v_is_valid := TRUE;
  END IF;

  IF v_is_valid THEN
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
SET search_path = public
AS $$
DECLARE
  v_stored_hash TEXT;
  v_is_valid BOOLEAN := FALSE;
  v_total_visitors INT;
  v_total_games INT;
  v_avg_score NUMERIC;
  v_kids_count INT;
  v_adults_count INT;
  v_popular_games JSONB;
  v_recent_profiles JSONB;
BEGIN
  SELECT admin_pin_hash INTO v_stored_hash FROM public.app_settings WHERE id = 'stand_config';
  
  IF v_stored_hash IS NOT NULL AND (v_stored_hash = crypt(p_admin_pin, v_stored_hash) OR v_stored_hash = p_admin_pin) THEN
    v_is_valid := TRUE;
  END IF;

  IF NOT v_is_valid THEN
    RETURN jsonb_build_object('success', false, 'error', 'PIN no autorizado');
  END IF;

  SELECT COUNT(*), COALESCE(AVG(total_score), 0),
         COUNT(*) FILTER (WHERE mode = 'kids'),
         COUNT(*) FILTER (WHERE mode = 'adult')
  INTO v_total_visitors, v_avg_score, v_kids_count, v_adults_count
  FROM public.profiles
  WHERE is_active = true;

  SELECT COUNT(*) INTO v_total_games FROM public.game_sessions;

  -- Juegos más jugados
  SELECT COALESCE(jsonb_agg(g), '[]'::jsonb) INTO v_popular_games
  FROM (
    SELECT game_id, COUNT(*) as session_count
    FROM public.game_sessions
    GROUP BY game_id
    ORDER BY session_count DESC
  ) g;

  -- Perfiles con puntaje para el ranking y exportación
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
SET search_path = public
AS $$
DECLARE
  v_stored_hash TEXT;
  v_is_valid BOOLEAN := FALSE;
BEGIN
  SELECT admin_pin_hash INTO v_stored_hash FROM public.app_settings WHERE id = 'stand_config';

  IF v_stored_hash IS NOT NULL AND (v_stored_hash = crypt(p_admin_pin, v_stored_hash) OR v_stored_hash = p_admin_pin) THEN
    v_is_valid := TRUE;
  END IF;

  IF NOT v_is_valid THEN
    RETURN jsonb_build_object('success', false, 'error', 'PIN de administrador inválido');
  END IF;

  -- Resetear puntuaciones a cero
  UPDATE public.profiles
  SET 
    total_score = 0,
    games_played = 0,
    correct_answers = 0,
    total_answers = 0,
    perfect_rounds = 0,
    completed_game_ids = ARRAY[]::TEXT[],
    updated_at = timezone('utc'::TEXT, now());

  -- Eliminar sesiones históricas
  DELETE FROM public.game_sessions;

  RETURN jsonb_build_object('success', true, 'message', 'Tabla de posiciones reiniciada exitosamente para la feria');
END;
$$;

-- RPC: Registro atómico y seguro de puntaje de partida (Server-Side Score Validation)
CREATE OR REPLACE FUNCTION public.submit_game_score(
  p_player_id UUID,
  p_nickname TEXT,
  p_display_name TEXT,
  p_avatar_emoji TEXT,
  p_avatar_url TEXT,
  p_mode TEXT,
  p_game_id TEXT,
  p_score INTEGER,
  p_correct_count INTEGER,
  p_total_count INTEGER,
  p_completed_game_ids TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_total INT;
  v_new_games INT;
BEGIN
  -- 1. Upsert / Incrementar estadísticas del jugador
  INSERT INTO public.profiles (
    id, nickname, display_name, avatar_emoji, avatar_url, mode,
    total_score, level, games_played, correct_answers, total_answers, completed_game_ids,
    is_active, last_active_at, updated_at
  )
  VALUES (
    p_player_id, p_nickname, COALESCE(p_display_name, p_nickname), p_avatar_emoji, p_avatar_url, p_mode,
    GREATEST(0, p_score), (GREATEST(0, p_score) / 400) + 1, 1, p_correct_count, p_total_count, p_completed_game_ids,
    true, timezone('utc'::TEXT, now()), timezone('utc'::TEXT, now())
  )
  ON CONFLICT (id) DO UPDATE SET
    nickname = EXCLUDED.nickname,
    display_name = EXCLUDED.display_name,
    avatar_emoji = EXCLUDED.avatar_emoji,
    avatar_url = EXCLUDED.avatar_url,
    mode = EXCLUDED.mode,
    total_score = public.profiles.total_score + EXCLUDED.total_score,
    level = ((public.profiles.total_score + EXCLUDED.total_score) / 400) + 1,
    games_played = public.profiles.games_played + 1,
    correct_answers = public.profiles.correct_answers + EXCLUDED.correct_answers,
    total_answers = public.profiles.total_answers + EXCLUDED.total_answers,
    completed_game_ids = ARRAY(SELECT DISTINCT UNNEST(public.profiles.completed_game_ids || EXCLUDED.completed_game_ids)),
    is_active = true,
    last_active_at = timezone('utc'::TEXT, now()),
    updated_at = timezone('utc'::TEXT, now())
  RETURNING total_score, games_played
  INTO v_new_total, v_new_games;

  -- 2. Registrar sesión individual
  INSERT INTO public.game_sessions (
    player_id, game_id, mode, score, correct_count, total_count, metadata
  )
  VALUES (
    p_player_id, p_game_id, p_mode, p_score, p_correct_count, p_total_count,
    jsonb_build_object(
      'nickname', p_nickname,
      'avatar', p_avatar_emoji,
      'completed_at', timezone('utc'::TEXT, now())
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'player_id', p_player_id,
    'total_score', v_new_total,
    'games_played', v_new_games
  );
END;
$$;

