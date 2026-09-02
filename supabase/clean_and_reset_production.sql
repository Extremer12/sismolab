-- ==============================================================================
-- LIMPIEZA TOTAL DE PRODUCCIÓN - SISMO LAB (INPRES SAN JUAN)
-- Ejecutar en el SQL Editor de Supabase antes del lanzamiento oficial
-- ==============================================================================

-- 1. Vaciar completamente el historial de partidas
TRUNCATE TABLE public.game_sessions CASCADE;

-- 2. Vaciar completamente los perfiles de prueba y pruebas de usuario
TRUNCATE TABLE public.profiles CASCADE;

-- 3. Asegurar que las políticas de RLS e índices estén listos
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- 4. Restablecer la configuración inicial del stand
INSERT INTO public.app_settings (id, event_name, stand_id, admin_pin_hash, is_leaderboard_locked)
VALUES ('stand_config', 'Feria INPRES San Juan 2026', 'STAND-01', crypt('1944', gen_salt('bf')), false)
ON CONFLICT (id) DO UPDATE
SET is_leaderboard_locked = false;

-- 5. Confirmación
SELECT 'Base de datos de SISMO LAB reiniciada a cero con éxito para la presentación oficial.' as status;
