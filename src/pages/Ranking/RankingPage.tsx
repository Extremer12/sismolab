import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Trophy, Crown, TrendingUp, ChevronDown, Lock } from 'lucide-react';
import { ScreenId, UserProfile, RankEntry, UserMode } from '../../types';
import { fetchLeaderboard, calculateUserRank } from '../../services/scoresService';
import { sound } from '../../lib/sound';

interface RankingPageProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
}

export const RankingPage: React.FC<RankingPageProps> = ({ user, onNavigate }) => {
  const [filterMode, setFilterMode] = useState<'all' | UserMode>('all');
  const [leaderboard, setLeaderboard] = useState<RankEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    const data = await fetchLeaderboard(filterMode);
    setLeaderboard(data);
    setIsLoading(false);
  }, [filterMode]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const userRank = calculateUserRank(user.total_score, leaderboard);

  // Top 3 Podium
  const first = leaderboard[0] || { id: '1', rank: 1, nickname: 'Marcha', avatar_emoji: '🧒', score: 2450, mode: 'kids' };
  const second = leaderboard[1] || { id: '2', rank: 2, nickname: 'Prof. Juan', avatar_emoji: '🔬', score: 2280, mode: 'adult' };
  const third = leaderboard[2] || { id: '3', rank: 3, nickname: 'Thiago', avatar_emoji: '🦙', score: 2120, mode: 'kids' };

  // Remaining list
  const generalList = leaderboard.slice(3);

  // Target score to reach next rank
  const playerAbove = leaderboard.find(p => p.rank === userRank - 1);
  const pointsToNext = playerAbove ? Math.max(0, playerAbove.score - user.total_score + 10) : 0;
  const progressToNext = playerAbove ? Math.min(100, Math.max(10, (user.total_score / playerAbove.score) * 100)) : 100;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 overflow-x-hidden"
      style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
    >
      {/* Background Dark Overlay */}
      <div className="fixed inset-0 bg-navy-950/80 pointer-events-none z-0" />

      {/* Main Content Layout */}
      <div className="relative z-10 p-4 sm:p-5 space-y-4 pb-36 max-w-md mx-auto">
        {/* 1. Header Navigation Bar */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => { sound.playClick(); onNavigate('home'); }}
            className="w-10 h-10 rounded-full bg-navy-900/90 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan hover:bg-navy-800 transition-all shadow-glow-cyan/20 active:scale-95"
            aria-label="Volver a Inicio"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Pill: RANKING EN VIVO */}
          <div className="px-4 py-1.5 rounded-full bg-navy-900/90 border border-brand-gold/50 text-brand-yellow font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-gold/20">
            <Trophy className="w-4 h-4 text-brand-gold" />
            <span>RANKING EN VIVO</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => { sound.playClick(); loadData(); }}
            className={`w-10 h-10 rounded-full bg-navy-900/90 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan hover:bg-navy-800 transition-all shadow-glow-cyan/20 active:scale-95 ${isLoading ? 'animate-spin' : ''}`}
            aria-label="Actualizar ranking"
          >
            <RefreshCw className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* 2. Main Title */}
        <div className="text-center space-y-0.5 pt-1">
          <h1 className="font-black text-3xl sm:text-4xl text-white tracking-tight uppercase leading-none drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
            TABLA DE <span className="text-brand-cyan">POSICIONES</span>
          </h1>
          <p className="text-xs text-slate-300 font-medium pt-0.5">
            ¿Podrás llegar al primer puesto del stand <strong className="text-brand-cyan">INPRES</strong>?
          </p>
        </div>

        {/* 3. Filter Chips (TODOS / NIÑOS / ADULTOS) */}
        <div className="flex gap-2.5 justify-center pt-1">
          {(['all', 'kids', 'adult'] as const).map((mode) => {
            const isActive = filterMode === mode;
            const labels = { all: 'TODOS', kids: 'NIÑOS', adult: 'ADULTOS' };

            return (
              <button
                key={mode}
                onClick={() => {
                  sound.playClick();
                  setFilterMode(mode);
                }}
                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-cyan text-navy-950 shadow-glow-cyan scale-105'
                    : 'bg-navy-900/90 text-slate-300 border border-white/10 hover:border-brand-cyan/40 hover:text-white'
                }`}
              >
                {labels[mode]}
              </button>
            );
          })}
        </div>

        {/* 4. Protagonist Top 3 Podium */}
        <div className="pt-6 pb-2">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 items-end text-center">
            {/* 2nd Place (Silver - Left) */}
            <div className="relative rounded-3xl p-3 border border-slate-400/50 bg-gradient-to-b from-slate-900/90 via-navy-950/95 to-slate-950/95 shadow-[0_8px_25px_rgba(148,163,184,0.15)] flex flex-col items-center space-y-1.5">
              {/* Badge 2° */}
              <div className="absolute -top-3.5 w-7 h-7 rounded-full bg-gradient-to-b from-slate-200 to-slate-400 text-navy-950 font-black text-xs flex items-center justify-center shadow-md border border-white">
                2°
              </div>

              {/* Avatar */}
              <div className="w-15 h-15 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-slate-300 to-brand-blue shadow-md mt-2">
                <div className="w-full h-full rounded-full bg-navy-900 flex items-center justify-center text-3xl overflow-hidden">
                  {second.avatar_emoji || '🔬'}
                </div>
              </div>

              {/* Name & Score */}
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-xs sm:text-sm text-white truncate max-w-[80px]">
                  {second.nickname.split(' ')[0]}
                </h3>
                <span className="font-black text-xs text-brand-cyan tabular-nums block">
                  {second.score} pts
                </span>
              </div>

              {/* Pedestal Base */}
              <div className="w-full h-8 rounded-xl bg-gradient-to-b from-slate-700/60 to-slate-900 flex items-center justify-center border-t border-slate-400/40 text-slate-300">
                ★
              </div>
            </div>

            {/* 1st Place (Gold - Center Protagonist & Elevated) */}
            <div className="relative rounded-3xl p-3.5 border-2 border-brand-gold bg-gradient-to-b from-amber-950/80 via-navy-900/95 to-navy-950/95 shadow-[0_12px_40px_rgba(245,184,61,0.4)] flex flex-col items-center space-y-2 -mt-4 z-10">
              {/* Floating Crown */}
              <Crown className="w-7 h-7 text-brand-yellow drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-bounce" />

              {/* Badge 1° */}
              <div className="absolute top-2 w-8 h-8 rounded-full bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-500 text-navy-950 font-black text-sm flex items-center justify-center shadow-glow-gold border-2 border-white">
                1°
              </div>

              {/* Large Avatar */}
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-brand-yellow via-amber-400 to-brand-gold shadow-glow-gold mt-4">
                <div className="w-full h-full rounded-full bg-navy-950 flex items-center justify-center text-4xl overflow-hidden border border-amber-300/40">
                  {first.avatar_emoji || '🧒'}
                </div>
              </div>

              {/* Name & Score */}
              <div className="space-y-0.5">
                <h3 className="font-black text-sm sm:text-base text-brand-yellow truncate max-w-[100px]">
                  {first.nickname.split(' ')[0]}
                </h3>
                <span className="font-black text-sm sm:text-base text-white tabular-nums block drop-shadow-md">
                  {first.score} pts
                </span>
              </div>

              {/* Pedestal Base with Trophy */}
              <div className="w-full h-10 rounded-xl bg-gradient-to-b from-amber-500 via-amber-600 to-yellow-700 flex items-center justify-center text-navy-950 shadow-md font-black">
                <Trophy className="w-5 h-5 text-navy-950 stroke-[2.5]" />
              </div>
            </div>

            {/* 3rd Place (Bronze - Right) */}
            <div className="relative rounded-3xl p-3 border border-amber-700/50 bg-gradient-to-b from-amber-950/70 via-navy-950/95 to-slate-950/95 shadow-[0_8px_25px_rgba(180,83,9,0.15)] flex flex-col items-center space-y-1.5">
              {/* Badge 3° */}
              <div className="absolute -top-3.5 w-7 h-7 rounded-full bg-gradient-to-b from-amber-600 to-amber-800 text-white font-black text-xs flex items-center justify-center shadow-md border border-amber-400">
                3°
              </div>

              {/* Avatar */}
              <div className="w-15 h-15 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-600 to-amber-800 shadow-md mt-2">
                <div className="w-full h-full rounded-full bg-navy-900 flex items-center justify-center text-3xl overflow-hidden">
                  {third.avatar_emoji || '🦙'}
                </div>
              </div>

              {/* Name & Score */}
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-xs sm:text-sm text-white truncate max-w-[80px]">
                  {third.nickname.split(' ')[0]}
                </h3>
                <span className="font-black text-xs text-brand-cyan tabular-nums block">
                  {third.score} pts
                </span>
              </div>

              {/* Pedestal Base */}
              <div className="w-full h-8 rounded-xl bg-gradient-to-b from-amber-800/60 to-amber-950 flex items-center justify-center border-t border-amber-700/40 text-amber-400">
                ★
              </div>
            </div>
          </div>
        </div>

        {/* 5. General Classification List (Spacious & Highly Readable Rows) */}
        <div className="space-y-2.5 pt-2">
          {generalList.map((player) => {
            const isMe = player.id === user.id || player.rank === userRank;

            return (
              <div
                key={player.id}
                className={`sismo-card p-3.5 rounded-2xl flex items-center justify-between transition-all duration-200 ${
                  isMe
                    ? 'border-2 border-brand-cyan bg-gradient-to-r from-blue-950/90 via-navy-900/95 to-navy-950/95 shadow-[0_4px_30px_rgba(0,184,255,0.4)]'
                    : 'border-white/10 bg-navy-950/80 hover:border-white/20'
                }`}
              >
                {/* Left: Rank # + Avatar + Name + Subtitle */}
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className={`w-7 font-black text-sm ${isMe ? 'text-brand-cyan' : 'text-slate-400'}`}>
                    #{player.rank}
                  </span>

                  <div className={`relative w-11 h-11 rounded-full p-0.5 ${isMe ? 'bg-brand-cyan shadow-glow-cyan' : 'bg-navy-800 border border-white/10'} shrink-0`}>
                    <div className="w-full h-full rounded-full bg-navy-900 flex items-center justify-center text-2xl overflow-hidden">
                      {player.avatar_emoji || '🧒'}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h4 className={`font-black text-sm truncate ${isMe ? 'text-brand-cyan' : 'text-white'}`}>
                      {isMe ? `${user.nickname} (TÚ)` : player.nickname}
                    </h4>

                    {/* Gap to next player indicator if applicable */}
                    {isMe && playerAbove && (
                      <div className="space-y-1 pt-0.5">
                        <span className="text-[10px] text-slate-300 font-bold block">
                          Faltan <strong className="text-brand-cyan">{pointsToNext} pts</strong> para alcanzar al puesto #{playerAbove.rank}
                        </span>
                        <div className="w-32 h-1.5 bg-navy-900 rounded-full overflow-hidden border border-white/10">
                          <div className="h-full bg-brand-cyan rounded-full" style={{ width: `${progressToNext}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Score + Action Icon */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 font-black text-sm text-brand-yellow tabular-nums">
                    <span className="text-xs text-brand-gold">★</span>
                    <span>{player.score} pts</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Fixed Highlighted Bottom Card: "TU POSICIÓN EN LA FERIA" */}
      <div className="fixed bottom-20 left-0 right-0 z-30 px-4 max-w-md mx-auto">
        <div className="sismo-card p-4 rounded-3xl border-2 border-brand-cyan bg-gradient-to-r from-blue-950/95 via-navy-900/95 to-navy-950/95 shadow-[0_8px_35px_rgba(0,184,255,0.45)] backdrop-blur-2xl flex items-center justify-between">
          {/* Chart Icon */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-cyan/20 border border-brand-cyan/50 flex items-center justify-center text-brand-cyan shadow-glow-cyan shrink-0">
              <TrendingUp className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-[9px] font-black text-brand-cyan uppercase tracking-widest block">
                TU POSICIÓN EN LA FERIA
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-black text-2xl text-white">
                  #{userRank}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {userRank <= 3 ? '¡Estás en el Podio!' : '¡Sigue así, puedes subir más!'}
                </span>
              </div>
            </div>
          </div>

          {/* Live Score */}
          <div className="text-right shrink-0">
            <div className="font-black text-base text-brand-yellow flex items-center justify-end gap-1 tabular-nums">
              <span>★</span>
              <span>{user.total_score.toLocaleString()}</span>
              <span className="text-xs text-brand-gold font-bold">pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
