import { supabase } from './supabase';
import { RankEntry, UserProfile, UserMode } from '../types';

const LEADERBOARD_STORAGE_KEY = 'sismolab_leaderboard_v2';

export async function fetchLeaderboard(filterMode: 'all' | UserMode = 'all'): Promise<RankEntry[]> {
  try {
    let query = supabase
      .from('profiles')
      .select('id, nickname, display_name, avatar_emoji, avatar_url, total_score, mode, updated_at')
      .eq('is_active', true)
      .neq('nickname', '')
      .gte('total_score', 0)
      .order('total_score', { ascending: false })
      .order('updated_at', { ascending: true })
      .limit(100);

    if (filterMode !== 'all') {
      query = query.eq('mode', filterMode);
    }

    const { data, error } = await query;
    if (!error && data !== null) {
      const mapped = data.map((item, idx) => ({
        id: item.id,
        rank: idx + 1,
        nickname: item.display_name || item.nickname || 'Explorador',
        avatar_emoji: item.avatar_emoji || '🦅',
        avatar_url: item.avatar_url || '/images/avatar/avatar_1.webp',
        score: item.total_score || 0,
        mode: item.mode as UserMode
      }));

      // If fetching all, sync fresh leaderboard to local storage cache
      if (filterMode === 'all') {
        try {
          localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(mapped));
        } catch {}
      }

      return mapped;
    }
  } catch (err) {
    console.warn('Leaderboard Supabase fallback to local (offline):', err);
  }

  // Offline Fallback Only when network fails
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    let list: RankEntry[] = raw ? JSON.parse(raw) : [];
    
    if (filterMode !== 'all') {
      list = list.filter(item => item.mode === filterMode);
    }

    return list
      .filter(item => item.nickname && item.nickname.trim().length > 0)
      .sort((a, b) => b.score - a.score)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
  } catch {
    return [];
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

  if (!supabase || !user.id || !user.auth_user_id) return;

  try {
    // 1. Try secure Server-Side RPC first
    const { data: rpcData, error: rpcError } = await supabase.rpc('submit_game_score', {
      p_player_id: user.id,
      p_nickname: user.nickname,
      p_display_name: user.display_name || user.nickname,
      p_avatar_emoji: user.avatar_emoji,
      p_avatar_url: user.avatar_url,
      p_mode: user.mode,
      p_game_id: gameId,
      p_score: earnedScore,
      p_total_score: user.total_score,
      p_correct_count: correctCount,
      p_total_count: totalCount,
      p_completed_game_ids: user.completed_game_ids || [],
      p_game_high_scores: user.game_high_scores || {}
    });

    if (!rpcError && rpcData?.success) {
      return;
    }

    // 2. Fallback to direct upsert if RPC is not yet created in Supabase
    const profilePayload: Record<string, unknown> = {
      id: user.id,
      nickname: user.nickname,
      display_name: user.display_name || user.nickname,
      avatar_emoji: user.avatar_emoji,
      avatar_url: user.avatar_url,
      age: user.age || null,
      mode: user.mode,
      total_score: user.total_score,
      games_played: user.games_played,
      correct_answers: user.correct_answers_count,
      total_answers: user.total_answers_count,
      completed_game_ids: user.completed_game_ids || [],
      is_active: true,
      last_active_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (user.auth_user_id) {
      profilePayload.auth_user_id = user.auth_user_id;
    }

    await supabase
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' });

    // Log Game Session
    await supabase.from('game_sessions').insert({
      player_id: user.id,
      game_id: gameId,
      mode: user.mode,
      score: earnedScore,
      correct_count: correctCount,
      total_count: totalCount,
      metadata: {
        nickname: user.nickname,
        avatar: user.avatar_emoji,
        age: user.age,
        completed_at: new Date().toISOString()
      }
    });
  } catch (err) {
    console.warn('Error syncing game score with Supabase:', err);
  }
}

export function saveUserScoreLocally(user: UserProfile): void {
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    let list: RankEntry[] = raw ? JSON.parse(raw) : [];

    const existingIdx = list.findIndex(item => item.id === user.id);
    const updatedEntry: RankEntry = {
      id: user.id,
      rank: 0,
      nickname: user.display_name || user.nickname,
      avatar_emoji: user.avatar_emoji,
      avatar_url: user.avatar_url,
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
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item, idx) => ({ ...item, rank: idx + 1 }))
      .slice(0, 100);

    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Fallback
  }
}

// SECURE SERVER-SIDE PIN VALIDATION
export async function verifyAdminPin(adminPin: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('admin_verify_pin', {
      p_admin_pin: adminPin.trim()
    });

    if (error) throw error;
    return {
      valid: Boolean(data?.valid),
      error: data?.error
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al conectar con la base de datos';
    return { valid: false, error: errorMsg };
  }
}

// REAL LIVE METRICS FETCHING
export interface LiveAdminMetrics {
  total_visitors: number;
  total_games: number;
  avg_score: number;
  max_score?: number;
  kids_count: number;
  adults_count: number;
  total_correct?: number;
  total_questions?: number;
  global_accuracy?: number;
  popular_games: {
    game_id: string;
    session_count: number;
    avg_score?: number;
    total_correct?: number;
    total_questions?: number;
    accuracy_pct?: number;
  }[];
  profiles: {
    id: string;
    nickname: string;
    display_name: string;
    mode: string;
    total_score: number;
    games_played: number;
    correct_answers: number;
    total_answers: number;
    accuracy_pct?: number;
    updated_at: string;
  }[];
}

export async function fetchAdminMetrics(adminPin: string): Promise<{ success: boolean; data?: LiveAdminMetrics; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('admin_get_metrics', {
      p_admin_pin: adminPin.trim()
    });

    if (error) throw error;
    if (!data?.success) {
      return { success: false, error: data?.error || 'PIN no autorizado' };
    }

    return {
      success: true,
      data: data as LiveAdminMetrics
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al obtener métricas del servidor';
    return { success: false, error: errorMsg };
  }
}

export async function resetStandLeaderboard(adminPin: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('admin_reset_leaderboard', {
      p_admin_pin: adminPin.trim()
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
