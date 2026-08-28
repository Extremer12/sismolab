export type UserMode = 'kids' | 'adult';

export type GameCategory = 
  | 'science' 
  | 'prevention' 
  | 'safety' 
  | 'history' 
  | 'emergency' 
  | 'challenge';

export type ScreenId = 
  | 'splash'
  | 'home'
  | 'kids'
  | 'adults'
  | 'game-what-is'
  | 'game-safe-home'
  | 'game-emergency-kit'
  | 'game-what-would-you-do'
  | 'game-myth-reality'
  | 'game-final-challenge'
  | 'history'
  | 'pdf-history'
  | 'ranking'
  | 'profile'
  | 'admin'
  | 'privacy'
  | 'terms'
  | 'credits';

export interface UserProfile {
  id: string;
  auth_user_id?: string;
  nickname: string;
  display_name: string;
  avatar_url?: string;
  avatar_emoji: string;
  age?: number;
  mode: UserMode;
  total_score: number;
  level: number;
  games_played: number;
  completed_game_ids?: string[];
  game_high_scores?: Record<string, number>;
  correct_answers_count: number;
  total_answers_count: number;
  has_completed_onboarding?: boolean;
  created_at: string;
}

export interface GameInfo {
  id: string;
  title: string;
  slug: string;
  description: string;
  mode: UserMode | 'all';
  category: GameCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  icon: string;
  is_active: boolean;
  sort_order: number;
}

export interface Question {
  id: string;
  game_id: string;
  question: string;
  description?: string;
  image_url?: string;
  option_a: string;
  option_b: string;
  option_c?: string;
  option_d?: string;
  correct_option: 'a' | 'b' | 'c' | 'd';
  explanation: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  sort_order: number;
}

export interface SafeHomeHazard {
  id: string;
  name: string;
  x: number; // percentage in room
  y: number; // percentage in room
  icon: string;
  hazardDescription: string;
  solution: string;
  isSecured: boolean;
}

export interface EmergencyKitItem {
  id: string;
  name: string;
  icon: string;
  image?: string;
  isEssential: boolean;
  category: 'vital' | 'no-essential';
  reason: string;
}

export interface ScenarioChoice {
  id: string;
  scenarioTitle: string;
  context: 'casa' | 'escuela' | 'calle' | 'lugar_publico' | 'vehiculo';
  situation: string;
  icon: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

export interface MythStatement {
  id: string;
  statement: string;
  isReality: boolean;
  explanation: string;
  category: string;
}

export interface HistoricalEvent {
  id: string;
  year: number;
  dateStr: string;
  title: string;
  location: string;
  magnitude: number;
  depthKm?: number;
  intensityMercalli: string;
  description: string;
  image_url?: string;
  source: string;
  source_url?: string;
  sort_order: number;
  coordinates?: { x: number; y: number };
}

export interface SeismicEvent {
  id: string;
  event_date: string;
  event_time: string;
  latitude: number;
  longitude: number;
  depth: number;
  magnitude: number;
  location: string;
  province: string;
  intensity: string;
  description: string;
  source: string;
  source_url?: string;
}

export interface Achievement {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  condition_type: 'score' | 'games_count' | 'perfect_game' | 'history_read' | 'hazards_found' | 'speed';
  condition_value: number;
}

export interface UserAchievement {
  achievement_id: string;
  unlocked_at: string;
}

export interface RankEntry {
  id: string;
  nickname: string;
  avatar_emoji: string;
  score: number;
  mode: UserMode;
  rank: number;
  isCurrentUser?: boolean;
}

export interface AdminMetrics {
  totalVisitors: number;
  totalGamesPlayed: number;
  averageScore: number;
  kidsPercentage: number;
  adultsPercentage: number;
  popularGames: { name: string; count: number }[];
  difficultQuestions: { question: string; errorRate: number }[];
}
