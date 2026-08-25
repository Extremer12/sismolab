import React from 'react';
import { ArrowLeft, Check, Lock, ChevronRight, Sparkles, Play } from 'lucide-react';
import { ScreenId, UserProfile } from '../../types';
import { sound } from '../../lib/sound';

interface AdultsDashboardPageProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
}

interface AdultGameCard {
  id: string;
  numberStr: string;
  title: string;
  category: string;
  artImage: string;
  xpReward: number;
  screenId: ScreenId;
  accentGlow: string;
  badgeColor: string;
  unlockRequirement?: number;
}

const ADULT_GAMES: AdultGameCard[] = [
  {
    id: 'a1',
    numberStr: '01',
    title: 'Física y Sismología',
    category: 'CIENCIA INPRES',
    artImage: '/images/quiz/adults/q1.png',
    xpReward: 400,
    screenId: 'game-what-is',
    accentGlow: 'from-purple-500/25 to-indigo-600/10 border-purple-400/40 hover:border-purple-400',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
  },
  {
    id: 'a2',
    numberStr: '02',
    title: 'Mochila de 72 Horas',
    category: 'PLAN DE EMERGENCIA',
    artImage: '/images/quiz/adults/q4.jpg',
    xpReward: 600,
    screenId: 'game-emergency-kit',
    accentGlow: 'from-amber-500/25 to-orange-600/10 border-amber-400/40 hover:border-amber-400',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    unlockRequirement: 1,
  },
  {
    id: 'a3',
    numberStr: '03',
    title: 'Reflejos en 4 Segundos',
    category: 'ACCIÓN CRÍTICA',
    artImage: '/images/quiz/adults/q10.png',
    xpReward: 600,
    screenId: 'game-safe-home',
    accentGlow: 'from-emerald-500/25 to-teal-600/10 border-emerald-400/40 hover:border-emerald-400',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    unlockRequirement: 2,
  },
  {
    id: 'a4',
    numberStr: '04',
    title: 'Protocolos de Respuesta',
    category: 'ESCENARIOS REALES',
    artImage: '/images/quiz/adults/q7.png',
    xpReward: 500,
    screenId: 'game-what-would-you-do',
    accentGlow: 'from-rose-500/25 to-pink-600/10 border-rose-400/40 hover:border-rose-400',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    unlockRequirement: 3,
  },
  {
    id: 'a5',
    numberStr: '05',
    title: 'Mitos vs Realidades',
    category: 'DESMITIFICANDO',
    artImage: '/images/quiz/adults/q6.png',
    xpReward: 500,
    screenId: 'game-myth-reality',
    accentGlow: 'from-cyan-500/25 to-blue-600/10 border-cyan-400/40 hover:border-cyan-400',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    unlockRequirement: 4,
  },
  {
    id: 'a6',
    numberStr: '06',
    title: 'Evaluación INPRES',
    category: 'DESAFÍO SUPREMO',
    artImage: '/images/quiz/adults/q9.png',
    xpReward: 1000,
    screenId: 'game-final-challenge',
    accentGlow: 'from-yellow-500/30 via-amber-500/20 to-orange-600/10 border-yellow-400/50 hover:border-yellow-400',
    badgeColor: 'bg-yellow-500/25 text-yellow-300 border-yellow-400/50',
    unlockRequirement: 5,
  }
];

export const AdultsDashboardPage: React.FC<AdultsDashboardPageProps> = ({
  user,
  onNavigate
}) => {
  const completedIds = user.completed_game_ids || [];
  const completedCount = ADULT_GAMES.filter(g => completedIds.includes(g.screenId)).length;
  const totalCount = ADULT_GAMES.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 overflow-x-hidden"
      style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
    >
      {/* Dark Ambient Layer */}
      <div className="fixed inset-0 bg-navy-950/85 backdrop-blur-[2px] pointer-events-none z-0" />

      {/* Main Container */}
      <div className="relative z-10 p-4 sm:p-5 space-y-4 pb-28 max-w-md mx-auto">
        
        {/* 1. Header Navigation Bar */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => { sound.playClick(); onNavigate('home'); }}
            className="w-10 h-10 rounded-2xl bg-navy-900/90 border border-brand-purple/40 flex items-center justify-center text-purple-300 hover:bg-navy-800 active:scale-95 transition-all shadow-md"
            aria-label="Volver a Inicio"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="px-3.5 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-purple-300 font-black text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-sm font-tech">
            <span className="w-2 h-2 rounded-full bg-brand-purple animate-ping" />
            <span>JÓVENES Y ADULTOS</span>
          </div>

          <div className="px-3 py-1 rounded-2xl bg-navy-900/90 border border-brand-gold/40 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span className="font-black text-xs text-brand-yellow font-tech tabular-nums">
              {user.total_score.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* 2. Hero Level Progress Card */}
        <div className="relative p-5 rounded-3xl bg-gradient-to-b from-[#180d2e] to-[#040e1d] border-2 border-brand-purple/40 shadow-[0_10px_35px_rgba(4,14,27,0.9)] overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-brand-purple/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[10px] font-black text-purple-300 tracking-[0.2em] uppercase block font-tech">
                  ENTRENAMIENTO SÍSMICO
                </span>
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-none mt-1">
                  DESAFÍO <span className="text-purple-300">CIENTÍFICO</span>
                </h1>
              </div>

              <div className="text-right font-tech">
                <span className="text-sm font-black text-brand-yellow tabular-nums">
                  {completedCount} / {totalCount}
                </span>
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">
                  Niveles
                </span>
              </div>
            </div>

            {/* Glowing Segmented Progress Bar */}
            <div className="w-full h-2.5 bg-navy-950/90 rounded-full p-0.5 border border-white/15 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-600 via-brand-purple to-brand-cyan shadow-glow-purple transition-all duration-700"
                style={{ width: `${Math.max(6, progressPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Showcase Game Cards List */}
        <div className="space-y-3.5 pt-1">
          {ADULT_GAMES.map((game, idx) => {
            const isCompleted = completedIds.includes(game.screenId);
            const reqCount = game.unlockRequirement || 0;
            const isPlayable = idx === 0 || completedCount >= reqCount || isCompleted;
            const isLocked = !isPlayable;

            return (
              <div
                key={game.id}
                onClick={() => {
                  if (isPlayable) {
                    sound.playClick();
                    onNavigate(game.screenId);
                  }
                }}
                className={`relative rounded-3xl p-4 bg-gradient-to-r ${game.accentGlow} bg-[#070b1a] backdrop-blur-xl border-2 transition-all duration-300 flex items-center justify-between gap-3.5 shadow-lg group ${
                  isCompleted
                    ? 'border-emerald-500/70 shadow-[0_4px_25px_rgba(16,185,129,0.25)]'
                    : isPlayable
                    ? 'shadow-[0_8px_30px_rgba(168,85,247,0.25)] hover:scale-[1.02] cursor-pointer active:scale-[0.98]'
                    : 'border-white/10 opacity-55 cursor-not-allowed'
                }`}
              >
                {/* Left 3D Artwork Image Container */}
                <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border border-white/20 shadow-xl shrink-0 bg-navy-950 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <img
                    src={game.artImage}
                    alt={game.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Pinned Level Tag */}
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-navy-950/90 border border-white/20 text-[9px] font-black text-white font-tech backdrop-blur-md">
                    #{game.numberStr}
                  </div>

                  {isCompleted && (
                    <div className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-navy-950 text-navy-950 flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3 stroke-[3.5]" />
                    </div>
                  )}
                </div>

                {/* Middle Game Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md font-black text-[9px] uppercase tracking-wider border shadow-sm ${game.badgeColor} font-tech`}>
                      {game.category}
                    </span>
                  </div>

                  <h2 className="font-display font-extrabold text-base sm:text-lg text-white leading-tight truncate">
                    {game.title}
                  </h2>

                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-xs font-black text-brand-yellow flex items-center gap-1 font-tech">
                      <span>★</span>
                      <span>+{game.xpReward} XP</span>
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] font-black text-emerald-400 uppercase font-tech">
                        • ¡Superado!
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Action Button / Lock */}
                <div className="shrink-0">
                  {isCompleted ? (
                    <button
                      type="button"
                      className="px-3.5 py-2.5 rounded-2xl bg-emerald-950/90 border border-emerald-400 text-emerald-300 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1 shadow-md hover:bg-emerald-900 transition-all active:scale-95"
                    >
                      <span>Rejugar</span>
                      <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                    </button>
                  ) : isPlayable ? (
                    <button
                      type="button"
                      className="px-4 py-3 rounded-2xl bg-brand-purple hover:bg-purple-600 text-white font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-purple transition-all group-hover:scale-105 active:scale-95"
                    >
                      <span>JUGAR</span>
                      <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </button>
                  ) : (
                    <div className="w-11 h-11 rounded-2xl bg-navy-950/90 border border-white/15 flex items-center justify-center text-slate-400 shadow-inner">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
