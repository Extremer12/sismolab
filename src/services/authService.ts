import { supabase } from './supabase';
import { UserProfile, UserMode } from '../types';

const PROFILE_STORAGE_KEY = 'sismolab_user_profile_v1';

const DEFAULT_AVATARS = ['🦅', '🦙', '🐆', '🦊', '🦉', '🦎', '🔬', '👷'];
const DEFAULT_NAMES = ['Cóndor Valiente', 'Guanaco Ágil', 'Puma Sabio', 'Zorro Veloz', 'Mara Curiosa'];

export function createGuestProfile(nickname?: string, mode: UserMode = 'kids'): UserProfile {
  const chosenName = nickname?.trim() || `${DEFAULT_NAMES[Math.floor(Math.random() * DEFAULT_NAMES.length)]} ${Math.floor(Math.random() * 89 + 10)}`;
  const chosenEmoji = DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
  
  const newProfile: UserProfile = {
    id: 'user_' + Date.now(),
    nickname: chosenName,
    display_name: chosenName,
    avatar_emoji: chosenEmoji,
    mode,
    total_score: 0,
    level: 1,
    games_played: 0,
    correct_answers_count: 0,
    total_answers_count: 0,
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

export async function syncProfileWithSupabase(profile: UserProfile): Promise<void> {
  saveLocalProfile(profile);

  if (!supabase) return;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    await supabase.from('profiles').upsert({
      id: profile.id,
      auth_user_id: session.user.id,
      nickname: profile.nickname,
      display_name: profile.display_name,
      avatar_url: profile.avatar_url,
      mode: profile.mode,
      total_score: profile.total_score,
      level: profile.level,
      updated_at: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Sync profile fallback to local:', err);
  }
}
