import { supabase } from './supabase';
import { RankEntry, UserProfile, UserMode } from '../types';

const LEADERBOARD_STORAGE_KEY = 'sismolab_leaderboard_v1';

const SEED_LEADERBOARD: RankEntry[] = [
  { id: '1', rank: 1, nickname: 'Martina C.', avatar_emoji: '🦅', score: 2450, mode: 'kids' },
  { id: '2', rank: 2, nickname: 'Prof. Alejandro', avatar_emoji: '🔬', score: 2280, mode: 'adult' },
  { id: '3', rank: 3, nickname: 'Thiago G.', avatar_emoji: '🦙', score: 2150, mode: 'kids' },
  { id: '4', rank: 4, nickname: 'Ing. Valenzuela', avatar_emoji: '👷', score: 1980, mode: 'adult' },
  { id: '5', rank: 5, nickname: 'Sofía M.', avatar_emoji: '🦊', score: 1820, mode: 'kids' },
  { id: '6', rank: 6, nickname: 'Mateo R.', avatar_emoji: '🐆', score: 1690, mode: 'adult' },
  { id: '7', rank: 7, nickname: 'Lucía B.', avatar_emoji: '🦉', score: 1450, mode: 'kids' },
  { id: '8', rank: 8, nickname: 'Joaquín P.', avatar_emoji: '🐇', score: 1280, mode: 'kids' }
];

export async function fetchLeaderboard(filterMode: 'all' | UserMode = 'all'): Promise<RankEntry[]> {
  if (supabase) {
    try {
      let query = supabase
        .from('profiles')
        .select('id, nickname, avatar_emoji, total_score, mode')
        .order('total_score', { ascending: false })
        .limit(50);

      if (filterMode !== 'all') {
        query = query.eq('mode', filterMode);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((item, idx) => ({
          id: item.id,
          rank: idx + 1,
          nickname: item.nickname,
          avatar_emoji: item.avatar_emoji || '🦅',
          score: item.total_score || 0,
          mode: item.mode as UserMode
        }));
      }
    } catch (err) {
      console.warn('Leaderboard Supabase fallback to local:', err);
    }
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

export function saveUserScoreLocally(user: UserProfile): void {
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    let list: RankEntry[] = raw ? JSON.parse(raw) : SEED_LEADERBOARD;

    const existingIdx = list.findIndex(item => item.id === user.id);
    const updatedEntry: RankEntry = {
      id: user.id,
      rank: 0,
      nickname: user.nickname,
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

export function calculateUserRank(score: number, allRankings: RankEntry[]): number {
  if (!allRankings || allRankings.length === 0) return 1;
  const higherScores = allRankings.filter(r => r.score > score).length;
  return higherScores + 1;
}
