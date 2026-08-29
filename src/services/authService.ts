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
  { id: 'avatar_1', name: 'Cóndor Andino Guardián', url: '/images/avatar/avatar_1.png', emoji: '🦅', category: 'fauna' },
  { id: 'avatar_2', name: 'Guanaco Cordillerano', url: '/images/avatar/avatar_2.png', emoji: '🦙', category: 'fauna' },
  { id: 'avatar_3', name: 'Puma Geólogo', url: '/images/avatar/avatar_3.png', emoji: '🐆', category: 'fauna' },
  { id: 'avatar_4', name: 'Zorro del Desierto', url: '/images/avatar/avatar_4.png', emoji: '🦊', category: 'fauna' },
  { id: 'avatar_5', name: 'Joven Geofísica', url: '/images/avatar/avatar_5.png', emoji: '👩‍🔬', category: 'science' },
  { id: 'avatar_6', name: 'Geólogo de Campo', url: '/images/avatar/avatar_6.png', emoji: '🧑‍🔬', category: 'science' },
  { id: 'avatar_7', name: 'Ingeniero Sismorresistente', url: '/images/avatar/avatar_7.png', emoji: '👷', category: 'science' },
  { id: 'avatar_8', name: 'Dra. Ciencias de la Tierra', url: '/images/avatar/avatar_8.png', emoji: '🔬', category: 'science' },
  { id: 'avatar_9', name: 'Niño Explorador 72h', url: '/images/avatar/avatar_9.png', emoji: '🎒', category: 'rescue' },
  { id: 'avatar_10', name: 'Capitana de Simulacros', url: '/images/avatar/avatar_10.png', emoji: '👧', category: 'rescue' },
  { id: 'avatar_11', name: 'Rescatista Urbano', url: '/images/avatar/avatar_11.png', emoji: '🚒', category: 'rescue' },
  { id: 'avatar_12', name: 'SISMO-BOT Asistente', url: '/images/avatar/avatar_12.png', emoji: '🤖', category: 'rescue' },
];

const DEFAULT_NAMES = ['Cóndor Valiente', 'Guanaco Ágil', 'Puma Sabio', 'Zorro Veloz', 'Mara Curiosa'];

export function createGuestProfile(nickname?: string, mode: UserMode = 'kids'): UserProfile {
  const chosenName = nickname?.trim() || `${DEFAULT_NAMES[Math.floor(Math.random() * DEFAULT_NAMES.length)]} ${Math.floor(Math.random() * 89 + 10)}`;
  const defaultAvatar = OFFICIAL_AVATARS[0];
  
  const newProfile: UserProfile = {
    id: 'guest_' + Date.now(),
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
    return data ? JSON.parse(data) : null;
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
  const googleName = (meta.full_name || meta.name || meta.display_name || sessionUser.email?.split('@')[0] || 'Explorador') as string;
  const avatarUrl = (meta.avatar_url || meta.picture || OFFICIAL_AVATARS[0].url) as string;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`id.eq.${sessionUser.id},auth_user_id.eq.${sessionUser.id}`)
      .maybeSingle();

    if (!error && data) {
      const isNew = !data.age;
      const loaded: UserProfile = {
        id: data.id || sessionUser.id,
        auth_user_id: sessionUser.id,
        nickname: data.nickname || googleName,
        display_name: data.display_name || googleName,
        avatar_url: data.avatar_url || avatarUrl,
        avatar_emoji: data.avatar_emoji || '🦅',
        age: data.age || undefined,
        mode: data.mode || (data.age && data.age < 13 ? 'kids' : 'adult'),
        total_score: data.total_score || 0,
        level: Math.floor((data.total_score || 0) / 400) + 1,
        games_played: data.games_played || 0,
        completed_game_ids: data.completed_game_ids || [],
        correct_answers_count: data.correct_answers || 0,
        total_answers_count: data.total_answers || 0,
        has_completed_onboarding: Boolean(data.age && data.age > 0),
        created_at: data.created_at || new Date().toISOString()
      };
      saveLocalProfile(loaded);
      return { profile: loaded, isNewUser: isNew };
    }
  } catch (err) {
    console.warn('Error fetching profile from Supabase:', err);
  }

  // Brand new profile in Supabase
  const initialMode: UserMode = 'kids';
  const newProfile: UserProfile = {
    id: sessionUser.id,
    auth_user_id: sessionUser.id,
    nickname: googleName,
    display_name: googleName,
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
      nickname: googleName,
      display_name: googleName,
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
    });
  } catch (err) {
    console.warn('Error creating initial profile in Supabase:', err);
  }

  saveLocalProfile(newProfile);
  return { profile: newProfile, isNewUser: true };
}

export async function syncProfileWithSupabase(profile: UserProfile): Promise<void> {
  saveLocalProfile(profile);

  if (!supabase) return;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    await supabase.from('profiles').upsert({
      id: session.user.id,
      auth_user_id: session.user.id,
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
    });
  } catch (err) {
    console.warn('Sync profile fallback to local:', err);
  }
}
