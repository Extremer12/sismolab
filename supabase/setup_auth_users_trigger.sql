-- ==============================================================================
-- TRIGGER AUTOMÁTICO: Sincronizar Usuarios de Supabase Auth a Profiles
-- Ejecutar en el SQL Editor de Supabase
-- ==============================================================================

-- 1. Función manejadora que se ejecuta tras cada registro en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_raw_meta JSONB := NEW.raw_user_meta_data;
  v_email_name TEXT := SPLIT_PART(NEW.email, '@', 1);
  v_full_name TEXT := COALESCE(v_raw_meta->>'full_name', v_raw_meta->>'name', v_raw_meta->>'display_name', v_email_name, 'Explorador');
  v_avatar TEXT := COALESCE(v_raw_meta->>'avatar_url', v_raw_meta->>'picture', '/images/avatar/avatar_1.webp');
BEGIN
  INSERT INTO public.profiles (
    id,
    auth_user_id,
    nickname,
    display_name,
    avatar_url,
    avatar_emoji,
    age,
    mode,
    total_score,
    games_played,
    correct_answers,
    total_answers,
    is_active,
    last_active_at,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.id,
    SUBSTRING(v_full_name FROM 1 FOR 18),
    SUBSTRING(v_full_name FROM 1 FOR 18),
    v_avatar,
    '🦅',
    NULL,
    'kids',
    0,
    0,
    0,
    0,
    TRUE,
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    auth_user_id = EXCLUDED.auth_user_id,
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
    is_active = TRUE,
    updated_at = NOW();

  RETURN NEW;
END;
$$;

-- 2. Trigger en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Sincronizar usuarios existentes en auth.users que no estén en public.profiles
INSERT INTO public.profiles (
  id,
  auth_user_id,
  nickname,
  display_name,
  avatar_url,
  avatar_emoji,
  mode,
  total_score,
  games_played,
  correct_answers,
  total_answers,
  is_active,
  last_active_at,
  created_at,
  updated_at
)
SELECT
  u.id,
  u.id,
  COALESCE(SUBSTRING(u.raw_user_meta_data->>'full_name' FROM 1 FOR 18), SPLIT_PART(u.email, '@', 1), 'Explorador'),
  COALESCE(SUBSTRING(u.raw_user_meta_data->>'full_name' FROM 1 FOR 18), SPLIT_PART(u.email, '@', 1), 'Explorador'),
  COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture', '/images/avatar/avatar_1.webp'),
  '🦅',
  'kids',
  0,
  0,
  0,
  0,
  TRUE,
  NOW(),
  NOW(),
  NOW()
FROM auth.users u
ON CONFLICT (id) DO UPDATE
SET 
  auth_user_id = EXCLUDED.auth_user_id,
  avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
  is_active = TRUE,
  updated_at = NOW();
