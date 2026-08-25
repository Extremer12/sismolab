import React from 'react';
import { ArrowLeft, Check, Lock, ChevronRight, Sparkles, Play, ShieldCheck, Zap } from 'lucide-react';
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
  icon: string;
  xpReward: number;
  screenId: ScreenId;
  themeColor: 'purple' | 'cyan' | 'amber' | 'emerald' | 'rose' | 'gold';
  gradientBg: string;
  unlockRequirement?: number;
}

const ADULT_GAMES: AdultGameCard[] = [
  {
    id: 'a1',
    numberStr: '01',
    title: 'Física y Sismología',
    category: 'CIENCIA INPRES',
    icon: '🔬',
    xpReward: 400,
    screenId: 'game-what-is',
    themeColor: 'purple',
    gradientBg: 'from-purple-950/80 via-indigo-950/60 to-navy-950/90',
  },
  {
    id: 'a2',
    numberStr: '02',
    title: 'Mochila de 72 Horas',
    category: 'PLAN DE EMERGENCIA',
    icon: '🎒',
    xpReward: 600,
    screenId: 'game-emergency-kit',
    themeColor: 'amber',
    gradientBg: 'from-amber-950/80 via-orange-950/60 to-navy-950/90',
    unlockRequirement: 1,
  },
  {
    id: 'a3',
    numberStr: '03',
    title: 'Reflejos en 4 Segundos',
    category: 'ACCIÓN Y DECISIÓN',
    icon: '⚡',
    xpReward: 600,
    screenId: 'game-safe-home',
    themeColor: 'emerald',
    gradientBg: 'from-emerald-950/80 via-teal-950/60 to-navy-950/90',
    unlockRequirement: 2,
  },
  {
    id: 'a4',
    numberStr: '04',
    title: 'Protocolos de Respuesta',
    category: 'ESCENARIOS REALES',
    icon: '🚨',
    xpReward: 500,
    screenId: 'game-what-would-you-do',
    themeColor: 'rose',
    gradientBg: 'from-rose-950/80 via-pink-950/60 to-navy-950/90',
    unlockRequirement: 3,
  },
  {
    id: 'a5',
    numberStr: '05',
    title: 'Mitos vs Realidades',
    category: 'DESMITIFICANDO',
    icon: '🧠',
    xpReward: 500,
    screenId: 'game-myth-reality',
    themeColor: 'cyan',
    gradientBg: 'from-cyan-950/80 via-blue-950/60 to-navy-950/90',
    unlockRequirement: 4,
  },
  {
    id: 'a6',
    numberStr: '06',
    title: 'Evaluación INPRES',
    category: 'DESAFÍO SUPREMO',
    icon: '🏆',
    xpReward: 1000,
    screenId: 'game-final-challenge',
    themeColor: 'gold',
    gradientBg: 'from-yellow-950/85 via-amber-950/70 to-navy-950/90',
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
      {/* Background Dark Overlay */}
      <div className="fixed inset-0 bg-navy-950/80 pointer-events-none z-0" />

      {/* Main Container */}
      <div className="relative z-10 p-4 sm:p-5 space-y-4 pb-28 max-w-md mx-auto">
        
        {/* 1. Top Header */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => { sound.playClick(); onNavigate('home'); }}
            className="w-10 h-10 rounded-2xl bg-navy-900/90 border border-brand-purple/40 flex items-center justify-center text-purple-300 hover:bg-navy-800 active:scale-95 transition-all shadow-sm"
            aria-label="Volver a Inicio"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="px-3.5 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-purple-300 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <span>JÓVENES Y ADULTOS</span>
            <span className="text-xs">🧑‍💼</span>
          </div>

          <div className="px-3 py-1 rounded-2xl bg-navy-900/90 border border-brand-gold/40 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span className="font-black text-xs text-brand-yellow tabular-nums">
              {user.total_score.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* 2. Visual Title & Progress Header */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-950/90 via-navy-900/95 to-navy-950/95 border-2 border-brand-purple/40 shadow-glow-purple/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest block">
                CENTRO DE ENTRENAMIENTO
              </span>
              <h1 className="font-black text-2xl text-white uppercase tracking-tight leading-none mt-0.5">
                DESAFÍO <span className="text-purple-300">CIENTÍFICO</span>
              </h1>
            </div>

            <div className="text-right">
              <span className="text-xs font-black text-brand-yellow">
                {completedCount}/{totalCount}
              </span>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">
                Completados
              </span>
            </div>
          </div>

          {/* Glowing Multi-step Progress Bar */}
          <div className="w-full h-2.5 bg-navy-950 rounded-full p-0.5 border border-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 via-brand-purple to-brand-cyan shadow-glow-purple transition-all duration-700"
              style={{ width: `${Math.max(8, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* 3. Visual Game Cards List */}
        <div className="space-y-3 pt-1">
          {ADULT_GAMES.map((game, idx) => {
            const isCompleted = completedIds.includes(game.screenId);
            const reqCount = game.unlockRequirement || 0;
            const isPlayable = idx === 0 || completedCount >= reqCount || isCompleted;
            const isLocked = !isPlayable;

            let borderStyle = 'border-white/15 hover:border-brand-purple/60';
            let glowStyle = '';

            if (isCompleted) {
              borderStyle = 'border-2 border-emerald-400/80';
              glowStyle = 'shadow-[0_4px_20px_rgba(16,185,129,0.25)]';
            } else if (isPlayable) {
              borderStyle = 'border-2 border-brand-purple/80';
              glowStyle = 'shadow-[0_6px_25px_rgba(168,85,247,0.3)]';
            } else {
              borderStyle = 'border-white/10 opacity-60';
            }

            return (
              <div
                key={game.id}
                onClick={() => {
                  if (isPlayable) {
                    sound.playClick();
                    onNavigate(game.screenId);
                  }
                }}
                className={`relative sismo-card rounded-3xl p-3.5 sm:p-4 bg-gradient-to-r ${game.gradientBg} border transition-all duration-300 flex items-center justify-between gap-3 ${borderStyle} ${glowStyle} ${
                  isPlayable ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : 'cursor-not-allowed'
                }`}
              >
                {/* Left Visual Icon Badge */}
                <div className="relative flex items-center justify-center shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-navy-950/80 border border-white/15 flex items-center justify-center text-3xl shadow-lg group-hover:scale-105 transition-transform">
                    {game.icon}
                  </div>
                  {isCompleted && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-navy-950 text-navy-950 flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Middle Game Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg font-black text-[9px] uppercase tracking-wider border shadow-sm bg-navy-950/80 text-purple-300 border-purple-400/30">
                      NIVEL {game.numberStr}
                    </span>
                    <span className="text-[9.5px] font-black text-slate-300 uppercase tracking-wide truncate">
                      {game.category}
                    </span>
                  </div>

                  <h2 className="font-black text-base sm:text-lg text-white leading-tight truncate">
                    {game.title}
                  </h2>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-brand-yellow flex items-center gap-1">
                      <span>★</span>
                      <span>+{game.xpReward} XP</span>
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] font-black text-emerald-400">
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
                      className="px-3.5 py-2 rounded-2xl bg-emerald-950/90 border border-emerald-400 text-emerald-300 font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-sm hover:bg-emerald-900 transition-all"
                    >
                      <span>Rejugar</span>
                      <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                    </button>
                  ) : isPlayable ? (
                    <button
                      type="button"
                      className="px-4 py-2.5 rounded-2xl bg-brand-purple hover:bg-purple-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-purple transition-all group-hover:scale-105"
                    >
                      <span>JUGAR</span>
                      <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </button>
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-navy-950/90 border border-white/10 flex items-center justify-center text-slate-400">
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
