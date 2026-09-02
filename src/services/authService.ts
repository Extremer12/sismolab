import { supabase } from './supabase';
import { UserProfile, UserMode } from '../types';

const PROFILE_STORAGE_KEY = 'sismolab_user_profile_v2';

export interface AvatarOption {
  id: string;
  name: string;
  url: string;
  emoji: string;
  category: 'fauna' | 'science' | 'rescue';
}

export const OFFICIAL_AVATARS: AvatarOption[] = [
  { id: 'avatar_1', name: 'Cóndor Andino Guardián', url: '/images/avatar/avatar_1.webp', emoji: '🦅', category: 'fauna' },
  { id: 'avatar_2', name: 'Guanaco Cordillerano', url: '/images/avatar/avatar_2.webp', emoji: '🦙', category: 'fauna' },
  { id: 'avatar_3', name: 'Puma Geólogo', url: '/images/avatar/avatar_3.webp', emoji: '🐆', category: 'fauna' },
  { id: 'avatar_4', name: 'Zorro del Desierto', url: '/images/avatar/avatar_4.webp', emoji: '🦊', category: 'fauna' },
  { id: 'avatar_5', name: 'Joven Geofísica', url: '/images/avatar/avatar_5.webp', emoji: '👩‍🔬', category: 'science' },
  { id: 'avatar_6', name: 'Geólogo de Campo', url: '/images/avatar/avatar_6.webp', emoji: '🧑‍🔬', category: 'science' },
  { id: 'avatar_7', name: 'Ingeniero Sismorresistente', url: '/images/avatar/avatar_7.webp', emoji: '👷', category: 'science' },
  { id: 'avatar_8', name: 'Dra. Ciencias de la Tierra', url: '/images/avatar/avatar_8.webp', emoji: '🔬', category: 'science' },
  { id: 'avatar_9', name: 'Niño Explorador 72h', url: '/images/avatar/avatar_9.webp', emoji: '🎒', category: 'rescue' },
  { id: 'avatar_10', name: 'Capitana de Simulacros', url: '/images/avatar/avatar_10.webp', emoji: '👧', category: 'rescue' },
  { id: 'avatar_11', name: 'Rescatista Urbano', url: '/images/avatar/avatar_11.webp', emoji: '🚒', category: 'rescue' },
  { id: 'avatar_12', name: 'SISMO-BOT Asistente', url: '/images/avatar/avatar_12.webp', emoji: '🤖', category: 'rescue' },
];

const DEFAULT_NAMES = ['Cóndor Valiente', 'Guanaco Ágil', 'Puma Sabio', 'Zorro Veloz', 'Mara Curiosa'];

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function isNicknameAvailable(
  nickname: string,
  excludeUserId?: string
): Promise<{ available: boolean; error?: string }> {
  const clean = nickname.trim();
  if (!clean || clean.length < 3) {
    return { available: false, error: 'El nombre debe tener al menos 3 letras' };
  }
  if (clean.length > 18) {
    return { available: false, error: 'El nombre no puede tener más de 18 letras' };
  }

  // 1. Check against Supabase profiles database
  if (supabase) {
    try {
      let query = supabase
        .from('profiles')
        .select('id, auth_user_id, nickname')
        .ilike('nickname', clean)
        .limit(5);

      if (excludeUserId) {
        query = query.neq('id', excludeUserId).neq('auth_user_id', excludeUserId);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const hasOtherUserWithSameName = data.some(
          item => item.id !== excludeUserId && item.auth_user_id !== excludeUserId
        );
        if (hasOtherUserWithSameName) {
          return { available: false, error: '¡Ese nombre ya está en uso! Por favor elegí uno diferente.' };
        }
      }
    } catch {
      // Offline fallback
    }
  }

  // 2. Check local leaderboard copy
  try {
    const raw = localStorage.getItem('sismolab_leaderboard_v2');
    if (raw) {
      const list: any[] = JSON.parse(raw);
      const exists = list.some(item => 
        item.nickname?.trim().toLowerCase() === clean.toLowerCase() && 
        item.id !== excludeUserId &&
        item.auth_user_id !== excludeUserId
      );
      if (exists) {
        return { available: false, error: '¡Ese nombre ya está registrado! Elegí uno diferente.' };
      }
    }
  } catch {}

  return { available: true };
}

export function createGuestProfile(nickname?: string, mode: UserMode = 'kids'): UserProfile {
  const chosenName = nickname?.trim() || '';
  const defaultAvatar = OFFICIAL_AVATARS[0];
  
  const newProfile: UserProfile = {
    id: generateUUID(),
    nickname: chosenName,
    display_name: chosenName,
    avatar_emoji: defaultAvatar.emoji,
    avatar_url: defaultAvatar.url,
    mode,
    total_score: 0,
    level: 1,
    games_played: 0,
    completed_game_ids: [],
    game_high_scores: {},
    correct_answers_count: 0,
    total_answers_count: 0,
    has_completed_onboarding: false,
    created_at: new Date().toISOString()
  };

  saveLocalProfile(newProfile);
  return newProfile;
}

export function loadLocalProfile(): UserProfile | null {
  try {
    const data = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!data) return null;
    const parsed: UserProfile = JSON.parse(data);
    
    // Auto-migrate legacy guest IDs that were not valid UUIDs
    if (!parsed.id || parsed.id.startsWith('guest_') || parsed.id.length !== 36) {
      parsed.id = generateUUID();
      saveLocalProfile(parsed);
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveLocalProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Fallback
  }
}

export async function signInWithGoogle(): Promise<{ error?: string }> {
  if (!supabase) {
    return { error: 'Supabase no configurado' };
  }

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) return { error: error.message };
    return {};
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido al conectar con Google';
    return { error: errorMessage };
  }
}

export async function fetchOrCreateUserProfile(sessionUser: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}): Promise<{ profile: UserProfile; isNewUser: boolean }> {
  const meta = sessionUser.user_metadata || {};
  // Default to email username (e.g. "juan.perez" from "juan.perez@gmail.com"), fallback to full name
  const emailUsername = sessionUser.email ? sessionUser.email.split('@')[0].slice(0, 18) : '';
  const fullName = ((meta.full_name || meta.name || meta.display_name) as string)?.slice(0, 18);
  const initialName = emailUsername || fullName || 'Explorador';
  const avatarUrl = (meta.avatar_url || meta.picture || OFFICIAL_AVATARS[0].url) as string;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`id.eq.${sessionUser.id},auth_user_id.eq.${sessionUser.id}`)
      .maybeSingle();

    if (!error && data) {
      const hasValidAge = Boolean(data.age && typeof data.age === 'number' && data.age >= 5);
      const isNew = !hasValidAge || !data.nickname || data.nickname === 'Explorador';
      const loaded: UserProfile = {
        id: data.id || sessionUser.id,
        auth_user_id: sessionUser.id,
        nickname: data.nickname || initialName,
        display_name: data.display_name || data.nickname || initialName,
        avatar_url: data.avatar_url || avatarUrl,
        avatar_emoji: data.avatar_emoji || '🦅',
        age: hasValidAge ? data.age : undefined,
        mode: data.mode || (hasValidAge && data.age < 13 ? 'kids' : 'adult'),
        total_score: data.total_score || 0,
        level: Math.floor((data.total_score || 0) / 400) + 1,
        games_played: data.games_played || 0,
        completed_game_ids: data.completed_game_ids || [],
        correct_answers_count: data.correct_answers || 0,
        total_answers_count: data.total_answers || 0,
        has_completed_onboarding: hasValidAge,
        created_at: data.created_at || new Date().toISOString()
      };
      saveLocalProfile(loaded);
      return { profile: loaded, isNewUser: isNew };
    }
  } catch (err) {
    console.warn('Error fetching profile from Supabase:', err);
  }

  // New profile for authenticated user
  const initialMode: UserMode = 'kids';
  const newProfile: UserProfile = {
    id: sessionUser.id,
    auth_user_id: sessionUser.id,
    nickname: initialName,
    display_name: initialName,
    avatar_url: avatarUrl,
    avatar_emoji: '🦅',
    age: undefined,
    mode: initialMode,
    total_score: 0,
    level: 1,
    games_played: 0,
    completed_game_ids: [],
    game_high_scores: {},
    correct_answers_count: 0,
    total_answers_count: 0,
    has_completed_onboarding: false,
    created_at: new Date().toISOString()
  };

  try {
    await supabase.from('profiles').upsert({
      id: sessionUser.id,
      auth_user_id: sessionUser.id,
      nickname: initialName,
      display_name: initialName,
      avatar_url: avatarUrl,
      avatar_emoji: '🦅',
      mode: initialMode,
      total_score: 0,
      games_played: 0,
      correct_answers: 0,
      total_answers: 0,
      completed_game_ids: [],
      is_active: true,
      last_active_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
  } catch (err) {
    console.warn('Error creating initial profile in Supabase:', err);
  }

  saveLocalProfile(newProfile);
  return { profile: newProfile, isNewUser: true };
}

export async function syncProfileWithSupabase(profile: UserProfile): Promise<void> {
  saveLocalProfile(profile);

  // Only sync to remote database if the user is authenticated with Google/Supabase
  if (!supabase || !profile.id || !profile.auth_user_id) return;

  try {
    const profilePayload: Record<string, unknown> = {
      id: profile.id,
      auth_user_id: profile.auth_user_id,
      nickname: profile.nickname,
      display_name: profile.display_name || profile.nickname,
      avatar_url: profile.avatar_url,
      avatar_emoji: profile.avatar_emoji,
      age: profile.age || null,
      mode: profile.mode,
      total_score: profile.total_score,
      games_played: profile.games_played,
      correct_answers: profile.correct_answers_count,
      total_answers: profile.total_answers_count,
      completed_game_ids: profile.completed_game_ids || [],
      is_active: true,
      last_active_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await supabase.from('profiles').upsert(profilePayload, { onConflict: 'id' });
  } catch (err) {
    console.warn('Sync profile fallback to local:', err);
  }
}

let syncDebounceTimer: ReturnType<typeof setTimeout> | null = null;

export function syncProfileWithSupabaseDebounced(profile: UserProfile, delayMs: number = 450): void {
  saveLocalProfile(profile);

  if (!profile.auth_user_id) return;

  if (syncDebounceTimer) {
    clearTimeout(syncDebounceTimer);
  }

  syncDebounceTimer = setTimeout(() => {
    syncProfileWithSupabase(profile);
  }, delayMs);
}

export async function deleteUserAccount(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (supabase && userId) {
      try {
        await supabase.rpc('delete_user_account', { p_user_id: userId });
      } catch {}
      try {
        await supabase.from('game_sessions').delete().eq('player_id', userId);
      } catch {}
      try {
        await supabase.from('profiles').delete().or(`id.eq.${userId},auth_user_id.eq.${userId}`);
      } catch {}
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem('sismolab_leaderboard_v2');
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al eliminar la cuenta';
    return { success: false, error: errorMsg };
  }
}


