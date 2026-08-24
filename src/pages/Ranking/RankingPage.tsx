import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Trophy, Crown, Flame, Sparkles, ChevronRight, User } from 'lucide-react';
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

  // Top 3 Podium players
  const first = leaderboard[0] || { id: '1', rank: 1, nickname: 'Martina C.', avatar_emoji: '🦅', score: 2450, mode: 'kids' };
  const second = leaderboard[1] || { id: '2', rank: 2, nickname: 'Prof. Juan', avatar_emoji: '🔬', score: 2280, mode: 'adult' };
  const third = leaderboard[2] || { id: '3', rank: 3, nickname: 'Thiago G.', avatar_emoji: '🦙', score: 2150, mode: 'kids' };

  // Remaining list (#4+)
  const generalList = leaderboard.slice(3);

  // Target score to reach next rank
  const playerAbove = leaderboard.find(p => p.rank === userRank - 1);
  const pointsToNext = playerAbove ? Math.max(0, playerAbove.score - user.total_score + 10) : 0;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 overflow-x-hidden"
      style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
    >
      {/* Background Dark Overlay */}
      <div className="fixed inset-0 bg-navy-950/85 pointer-events-none z-0" />

      {/* Main Content Layout */}
      <div className="relative z-10 p-4 sm:p-5 space-y-4 pb-28 max-w-md mx-auto">
        {/* 1. Header Navigation Bar */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => { sound.playClick(); onNavigate('home'); }}
            className="w-10 h-10 rounded-2xl bg-navy-900/90 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan hover:bg-navy-800 transition-all shadow-glow-cyan/20 active:scale-95"
            aria-label="Volver a Inicio"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Pill: RANKING EN VIVO */}
          <div className="px-4 py-1.5 rounded-full bg-navy-900/90 border border-brand-gold/50 text-brand-yellow font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-gold/20">
            <Trophy className="w-4 h-4 text-brand-gold" />
            <span>STAND INPRES · EN VIVO</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => { sound.playClick(); loadData(); }}
            className={`w-10 h-10 rounded-2xl bg-navy-900/90 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan hover:bg-navy-800 transition-all shadow-glow-cyan/20 active:scale-95 ${isLoading ? 'animate-spin' : ''}`}
            aria-label="Actualizar ranking"
          >
            <RefreshCw className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* 2. Main Title */}
        <div className="text-center space-y-0.5 pt-0.5">
          <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight uppercase leading-none drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
            TABLA DE <span className="text-brand-cyan">POSICIONES</span>
          </h1>
          <p className="text-xs text-slate-300 font-medium">
            Los mejores puntajes de la feria en San Juan
          </p>
        </div>

        {/* 3. Filter Chips (TODOS / NIÑOS / ADULTOS) */}
        <div className="flex gap-2 justify-center pt-0.5">
          {(['all', 'kids', 'adult'] as const).map((mode) => {
            const isActive = filterMode === mode;
            const labels = { all: 'TODOS', kids: '🧒 NIÑOS', adult: '🔬 ADULTOS' };

            return (
              <button
                key={mode}
                onClick={() => {
                  sound.playClick();
                  setFilterMode(mode);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 ${
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

        {/* 4. Redesigned Premium Top 3 Podium */}
        <div className="pt-4 pb-1">
          <div className="grid grid-cols-3 gap-2.5 items-end text-center">
            
            {/* 2nd Place (Silver - Left) */}
            <div className="relative rounded-3xl p-3 border border-slate-400/40 bg-gradient-to-b from-slate-900/95 via-navy-950/95 to-slate-950/95 shadow-[0_8px_30px_rgba(148,163,184,0.15)] flex flex-col items-center space-y-1.5 transition-all hover:scale-102">
              {/* Badge 2° */}
              <div className="absolute -top-3 w-7 h-7 rounded-full bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 text-navy-950 font-black text-xs flex items-center justify-center shadow-md border border-white">
                2°
              </div>

              {/* Glowing Avatar Portrait */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 bg-gradient-to-tr from-slate-400 via-slate-200 to-brand-cyan shadow-md mt-1.5">
                <div className="w-full h-full rounded-full bg-navy-900 flex items-center justify-center text-3xl overflow-hidden border border-slate-400/40">
                  {second.avatar_emoji || '🔬'}
                </div>
              </div>

              {/* Name & Score */}
              <div className="space-y-0.5 w-full">
                <h3 className="font-black text-xs sm:text-sm text-white truncate max-w-full">
                  {second.nickname.split(' ')[0]}
                </h3>
                <span className="font-black text-xs text-brand-cyan tabular-nums block">
                  {second.score.toLocaleString()} <span className="text-[10px] font-bold text-slate-400">pts</span>
                </span>
              </div>

              {/* Metallic Pedestal */}
              <div className="w-full py-1 rounded-xl bg-gradient-to-b from-slate-700/80 to-slate-900/90 flex items-center justify-center border-t border-slate-400/40 text-[10px] font-black text-slate-200 tracking-wider">
                PLATA
              </div>
            </div>

            {/* 1st Place (Gold - Center Protagonist) */}
            <div className="relative rounded-3xl p-3.5 border-2 border-brand-gold bg-gradient-to-b from-amber-950/90 via-navy-900/95 to-navy-950/95 shadow-[0_12px_45px_rgba(245,184,61,0.45)] flex flex-col items-center space-y-1.5 -mt-3 z-10 transition-all hover:scale-105">
              {/* Crown Icon */}
              <div className="absolute -top-6 flex items-center justify-center">
                <Crown className="w-7 h-7 text-brand-yellow drop-shadow-[0_0_12px_rgba(250,204,21,0.9)] animate-bounce" />
              </div>

              {/* Badge 1° */}
              <div className="absolute -top-2.5 w-7 h-7 rounded-full bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-500 text-navy-950 font-black text-xs flex items-center justify-center shadow-glow-gold border border-white">
                1°
              </div>

              {/* Golden Avatar Portrait */}
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-brand-yellow via-amber-400 to-yellow-200 shadow-glow-gold mt-2">
                <div className="w-full h-full rounded-full bg-navy-950 flex items-center justify-center text-4xl overflow-hidden border-2 border-amber-300/60">
                  {first.avatar_emoji || '🦅'}
                </div>
              </div>

              {/* Name & Score */}
              <div className="space-y-0.5 w-full">
                <h3 className="font-black text-sm sm:text-base text-brand-yellow truncate max-w-full">
                  {first.nickname.split(' ')[0]}
                </h3>
                <span className="font-black text-sm text-white tabular-nums block drop-shadow-md">
                  {first.score.toLocaleString()} <span className="text-xs font-bold text-brand-gold">pts</span>
                </span>
              </div>

              {/* Golden Pedestal */}
              <div className="w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 flex items-center justify-center text-navy-950 font-black text-[10px] tracking-wider shadow-md">
                ★ CAMPEÓN ★
              </div>
            </div>

            {/* 3rd Place (Bronze - Right) */}
            <div className="relative rounded-3xl p-3 border border-amber-700/40 bg-gradient-to-b from-amber-950/80 via-navy-950/95 to-slate-950/95 shadow-[0_8px_30px_rgba(180,83,9,0.15)] flex flex-col items-center space-y-1.5 transition-all hover:scale-102">
              {/* Badge 3° */}
              <div className="absolute -top-3 w-7 h-7 rounded-full bg-gradient-to-b from-amber-500 via-amber-600 to-amber-800 text-white font-black text-xs flex items-center justify-center shadow-md border border-amber-400">
                3°
              </div>

              {/* Bronze Avatar Portrait */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-800 shadow-md mt-1.5">
                <div className="w-full h-full rounded-full bg-navy-900 flex items-center justify-center text-3xl overflow-hidden border border-amber-600/40">
                  {third.avatar_emoji || '🦙'}
                </div>
              </div>

              {/* Name & Score */}
              <div className="space-y-0.5 w-full">
                <h3 className="font-black text-xs sm:text-sm text-white truncate max-w-full">
                  {third.nickname.split(' ')[0]}
                </h3>
                <span className="font-black text-xs text-brand-cyan tabular-nums block">
                  {third.score.toLocaleString()} <span className="text-[10px] font-bold text-slate-400">pts</span>
                </span>
              </div>

              {/* Bronze Pedestal */}
              <div className="w-full py-1 rounded-xl bg-gradient-to-b from-amber-800/80 to-amber-950/90 flex items-center justify-center border-t border-amber-700/40 text-[10px] font-black text-amber-300 tracking-wider">
                BRONCE
              </div>
            </div>

          </div>
        </div>

        {/* 5. Sleek Non-Intrusive User Status Banner (Integrated into flow, not floating) */}
        <div className="sismo-card p-3.5 rounded-2xl border border-brand-cyan/40 bg-gradient-to-r from-blue-950/90 via-navy-900/95 to-navy-950/95 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-2xl shrink-0">
              {user.avatar_emoji || '🦅'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-white">{user.nickname}</span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-brand-cyan/20 text-brand-cyan uppercase">
                  TÚ · #{userRank}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                {userRank <= 3 ? '🎉 ¡Estás en el Podio de honor!' : playerAbove ? `Te faltan ${pointsToNext} pts para el puesto #${playerAbove.rank}` : '¡Seguí jugando para subir de puesto!'}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="font-black text-base text-brand-yellow tabular-nums block">
              ★ {user.total_score.toLocaleString()}
            </span>
            <span className="text-[9px] font-black text-accent-gray uppercase tracking-wider block">
              PUNTOS
            </span>
          </div>
        </div>

        {/* 6. General Classification List (#4 to #50) */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between px-1 text-[11px] font-black text-slate-400 uppercase tracking-wider">
            <span>POSICIÓN Y JUGADOR</span>
            <span>PUNTAJE</span>
          </div>

          {generalList.map((player) => {
            const isMe = player.id === user.id || player.rank === userRank;

            return (
              <div
                key={player.id}
                className={`sismo-card p-3 rounded-2xl flex items-center justify-between transition-all duration-200 ${
                  isMe
                    ? 'border-2 border-brand-cyan bg-gradient-to-r from-blue-950/90 via-navy-900/95 to-navy-950/95 shadow-[0_4px_25px_rgba(0,184,255,0.35)]'
                    : 'border-white/10 bg-navy-950/80 hover:border-white/20'
                }`}
              >
                {/* Left: Rank # + Avatar + Name */}
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className={`w-6 font-black text-xs text-center ${isMe ? 'text-brand-cyan' : 'text-slate-400'}`}>
                    #{player.rank}
                  </span>

                  <div className={`relative w-9 h-9 rounded-full p-0.5 ${isMe ? 'bg-brand-cyan shadow-glow-cyan' : 'bg-navy-800 border border-white/10'} shrink-0`}>
                    <div className="w-full h-full rounded-full bg-navy-900 flex items-center justify-center text-xl overflow-hidden">
                      {player.avatar_emoji || '🧒'}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h4 className={`font-black text-xs truncate ${isMe ? 'text-brand-cyan' : 'text-white'}`}>
                      {isMe ? `${user.nickname} (TÚ)` : player.nickname}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {player.mode === 'kids' ? '🧒 Modo Niños' : '🔬 Jóvenes y Adultos'}
                    </span>
                  </div>
                </div>

                {/* Right: Score */}
                <div className="flex items-center gap-1 font-black text-xs text-brand-yellow tabular-nums shrink-0">
                  <span className="text-[10px] text-brand-gold">★</span>
                  <span>{player.score.toLocaleString()} pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
