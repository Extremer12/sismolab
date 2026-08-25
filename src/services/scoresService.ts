import { supabase } from './supabase';
import { RankEntry, UserProfile, UserMode } from '../types';

const LEADERBOARD_STORAGE_KEY = 'sismolab_leaderboard_v1';

const SEED_LEADERBOARD: RankEntry[] = [
  { id: '1', rank: 1, nickname: 'SantiGamer', avatar_emoji: '⚡', score: 2450, mode: 'kids' },
  { id: '2', rank: 2, nickname: 'Dra. Flores', avatar_emoji: '🔬', score: 2280, mode: 'adult' },
  { id: '3', rank: 3, nickname: 'Matías', avatar_emoji: '🦖', score: 2150, mode: 'kids' },
  { id: '4', rank: 4, nickname: 'Ing. Ruiz', avatar_emoji: '🏗️', score: 1980, mode: 'adult' },
  { id: '5', rank: 5, nickname: 'Lucía', avatar_emoji: '⭐', score: 1820, mode: 'kids' },
  { id: '6', rank: 6, nickname: 'Profe Laura', avatar_emoji: '🏛️', score: 1690, mode: 'adult' },
  { id: '7', rank: 7, nickname: 'Valentín', avatar_emoji: '🚀', score: 1450, mode: 'kids' },
  { id: '8', rank: 8, nickname: 'Gabriela', avatar_emoji: '🌋', score: 1280, mode: 'adult' }
];

export async function fetchLeaderboard(filterMode: 'all' | UserMode = 'all'): Promise<RankEntry[]> {
  try {
    let query = supabase
      .from('profiles')
      .select('id, nickname, display_name, avatar_emoji, total_score, mode, updated_at')
      .eq('is_active', true)
      .order('total_score', { ascending: false })
      .order('updated_at', { ascending: true })
      .limit(60);

    if (filterMode !== 'all') {
      query = query.eq('mode', filterMode);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map((item, idx) => ({
        id: item.id,
        rank: idx + 1,
        nickname: item.display_name || item.nickname || 'Explorador',
        avatar_emoji: item.avatar_emoji || '🦁',
        score: item.total_score || 0,
        mode: item.mode as UserMode
      }));
    }
  } catch (err) {
    console.warn('Leaderboard Supabase fallback to local:', err);
  }

  // Local Storage Fallback
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    let list: RankEntry[] = raw ? JSON.parse(raw) : SEED_LEADERBOARD;
    
    if (filterMode !== 'all') {
      list = list.filter(item => item.mode === filterMode);
    }

    return list
      .sort((a, b) => b.score - a.score)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
  } catch {
    return SEED_LEADERBOARD.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }
}

export async function submitGameScoreToSupabase(
  user: UserProfile,
  gameId: string,
  earnedScore: number,
  correctCount: number,
  totalCount: number
): Promise<void> {
  // Always update locally first for zero-latency UI
  saveUserScoreLocally(user);

  try {
    // 1. Sync / Upsert User in Supabase
    await supabase.from('profiles').upsert({
      id: user.id.length === 36 ? user.id : undefined, // Ensure valid UUID or let supabase generate
      nickname: user.nickname,
      display_name: user.display_name || user.nickname,
      avatar_emoji: user.avatar_emoji,
      avatar_url: user.avatar_url,
      mode: user.mode,
      total_score: user.total_score,
      games_played: user.games_played,
      correct_answers: user.correct_answers_count,
      total_answers: user.total_answers_count,
      completed_game_ids: user.completed_game_ids,
      updated_at: new Date().toISOString()
    }, { onConflict: 'nickname' });

    // 2. Log Game Session
    await supabase.from('game_sessions').insert({
      game_id: gameId,
      mode: user.mode,
      score: earnedScore,
      correct_count: correctCount,
      total_count: totalCount,
      metadata: {
        nickname: user.nickname,
        avatar: user.avatar_emoji
      }
    });
  } catch (err) {
    console.warn('Error syncing game score with Supabase:', err);
  }
}

export function saveUserScoreLocally(user: UserProfile): void {
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    let list: RankEntry[] = raw ? JSON.parse(raw) : SEED_LEADERBOARD;

    const existingIdx = list.findIndex(item => item.id === user.id || item.nickname === user.nickname);
    const updatedEntry: RankEntry = {
      id: user.id,
      rank: 0,
      nickname: user.display_name || user.nickname,
      avatar_emoji: user.avatar_emoji,
      score: user.total_score,
      mode: user.mode,
      isCurrentUser: true
    };

    if (existingIdx >= 0) {
      list[existingIdx] = updatedEntry;
    } else {
      list.push(updatedEntry);
    }

    list = list
      .sort((a, b) => b.score - a.score)
      .map((item, idx) => ({ ...item, rank: idx + 1 }))
      .slice(0, 60);

    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Fallback
  }
}

export async function resetStandLeaderboard(adminPin: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('admin_reset_leaderboard', {
      p_admin_pin: adminPin
    });

    if (error) throw error;
    
    // Clear local storage copy too
    localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
    
    return data as { success: boolean; message?: string; error?: string };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al conectar con la base de datos';
    return { success: false, error: errorMsg };
  }
}

export function calculateUserRank(score: number, allRankings: RankEntry[]): number {
  if (!allRankings || allRankings.length === 0) return 1;
  const higherScores = allRankings.filter(r => r.score > score).length;
  return higherScores + 1;
}
