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
  icon: string;
  xpReward: number;
  screenId: ScreenId;
  themeColor: 'purple' | 'amber' | 'emerald' | 'rose' | 'cyan' | 'gold';
  borderStyle: string;
  badgeStyle: string;
  unlockRequirement?: number;
}

const ADULT_GAMES: AdultGameCard[] = [
  {
    id: 'a1',
    numberStr: '01',
    title: 'FÍSICA Y SISMOLOGÍA',
    category: 'CIENCIA INPRES',
    icon: '🔬',
    xpReward: 400,
    screenId: 'game-what-is',
    themeColor: 'purple',
    borderStyle: 'border-purple-400/40 hover:border-purple-400 shadow-[0_8px_25px_rgba(168,85,247,0.15)]',
    badgeStyle: 'bg-purple-950/80 text-purple-300 border-purple-400/40',
  },
  {
    id: 'a2',
    numberStr: '02',
    title: 'MOCHILA DE 72 HORAS',
    category: 'PLAN DE EMERGENCIA',
    icon: '🎒',
    xpReward: 600,
    screenId: 'game-emergency-kit',
    themeColor: 'amber',
    borderStyle: 'border-amber-400/40 hover:border-amber-400 shadow-[0_8px_25px_rgba(251,191,36,0.15)]',
    badgeStyle: 'bg-amber-950/80 text-amber-300 border-amber-400/40',
    unlockRequirement: 1,
  },
  {
    id: 'a3',
    numberStr: '03',
    title: 'REFLEJOS EN 4 SEGUNDOS',
    category: 'ACCIÓN CRÍTICA',
    icon: '⚡',
    xpReward: 600,
    screenId: 'game-safe-home',
    themeColor: 'emerald',
    borderStyle: 'border-emerald-400/40 hover:border-emerald-400 shadow-[0_8px_25px_rgba(52,211,153,0.15)]',
    badgeStyle: 'bg-emerald-950/80 text-emerald-300 border-emerald-400/40',
    unlockRequirement: 2,
  },
  {
    id: 'a4',
    numberStr: '04',
    title: 'PROTOCOLOS DE RESPUESTA',
    category: 'ESCENARIOS REALES',
    icon: '🚨',
    xpReward: 500,
    screenId: 'game-what-would-you-do',
    themeColor: 'rose',
    borderStyle: 'border-rose-400/40 hover:border-rose-400 shadow-[0_8px_25px_rgba(251,113,133,0.15)]',
    badgeStyle: 'bg-rose-950/80 text-rose-300 border-rose-400/40',
    unlockRequirement: 3,
  },
  {
    id: 'a5',
    numberStr: '05',
    title: 'MITOS VS REALIDADES',
    category: 'DESMITIFICANDO',
    icon: '🧠',
    xpReward: 500,
    screenId: 'game-myth-reality',
    themeColor: 'cyan',
    borderStyle: 'border-cyan-400/40 hover:border-cyan-400 shadow-[0_8px_25px_rgba(34,211,238,0.15)]',
    badgeStyle: 'bg-cyan-950/80 text-brand-cyan border-cyan-400/40',
    unlockRequirement: 4,
  },
  {
    id: 'a6',
    numberStr: '06',
    title: 'EVALUACIÓN INPRES',
    category: 'DESAFÍO SUPREMO',
    icon: '🏆',
    xpReward: 1000,
    screenId: 'game-final-challenge',
    themeColor: 'gold',
    borderStyle: 'border-yellow-400/50 hover:border-yellow-400 shadow-[0_8px_25px_rgba(250,204,21,0.2)]',
    badgeStyle: 'bg-yellow-950/80 text-brand-yellow border-yellow-400/50',
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
      <div className="fixed inset-0 bg-navy-950/85 pointer-events-none z-0" />

      {/* Main Container */}
      <div className="relative z-10 p-4 sm:p-5 space-y-4 pb-28 max-w-md mx-auto">
        
        {/* 1. Top Navigation Bar */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => { sound.playClick(); onNavigate('home'); }}
            className="w-10 h-10 rounded-2xl bg-navy-900/90 border border-brand-purple/40 flex items-center justify-center text-purple-300 hover:bg-navy-800 active:scale-95 transition-all shadow-sm"
            aria-label="Volver a Inicio"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="px-4 py-1.5 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-purple-300 font-apache text-sm tracking-wider uppercase shadow-sm">
            JÓVENES Y ADULTOS 🧑‍💼
          </div>

          <div className="px-3 py-1 rounded-2xl bg-navy-900/90 border border-brand-gold/40 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span className="font-bold text-xs text-brand-yellow font-tech tabular-nums">
              {user.total_score.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* 2. Hero Level Progress Card */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#190d2f] to-[#040e1d] border-2 border-brand-purple/30 shadow-[0_8px_30px_rgba(4,14,27,0.85)] space-y-2.5">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] font-bold text-purple-300 uppercase tracking-widest block">
                ENTRENAMIENTO SÍSMICO
              </span>
              <h1 className="font-apache text-2xl sm:text-3xl text-white tracking-wide leading-none mt-0.5">
                DESAFÍO CIENTÍFICO
              </h1>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-brand-yellow font-tech">
                {completedCount} / {totalCount}
              </span>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">
                Completados
              </span>
            </div>
          </div>

          {/* Glowing Multi-step Progress Bar */}
          <div className="w-full h-2.5 bg-navy-950/90 rounded-full p-0.5 border border-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 via-brand-purple to-brand-cyan shadow-glow-purple transition-all duration-700"
              style={{ width: `${Math.max(8, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* 3. Spacious, Clean Game Cards List */}
        <div className="space-y-3 pt-1">
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
                className={`relative rounded-3xl p-4 sm:p-5 bg-navy-950/90 backdrop-blur-xl border-2 transition-all duration-200 flex items-center justify-between gap-3 ${
                  isCompleted
                    ? 'border-emerald-500/70 bg-gradient-to-r from-emerald-950/30 to-navy-950/95 shadow-[0_4px_20px_rgba(16,185,129,0.2)]'
                    : isPlayable
                    ? `${game.borderStyle} cursor-pointer hover:scale-[1.01] active:scale-[0.99]`
                    : 'border-white/10 opacity-50 cursor-not-allowed'
                }`}
              >
                {/* Left Icon Badge */}
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-navy-900 border border-white/15 flex items-center justify-center text-3xl shrink-0 shadow-md">
                  {game.icon}
                </div>

                {/* Center Content (Title fully visible and spacious) */}
                <div className="flex-1 min-w-0 space-y-1 pl-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${game.badgeStyle}`}>
                      NIVEL {game.numberStr}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      {game.category}
                    </span>
                  </div>

                  <h2 className="font-apache text-lg sm:text-xl text-white tracking-wide leading-tight">
                    {game.title}
                  </h2>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-yellow flex items-center gap-1 font-tech">
                      <span>★</span>
                      <span>+{game.xpReward} XP</span>
                    </span>
                    {isCompleted && (
                      <span className="text-[11px] font-bold text-emerald-400">
                        • ¡Superado!
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Action Button / Status */}
                <div className="shrink-0 pl-1">
                  {isCompleted ? (
                    <button
                      type="button"
                      className="px-3.5 py-2 rounded-2xl bg-emerald-950/90 border border-emerald-400 text-emerald-300 font-apache text-sm tracking-wider uppercase flex items-center gap-1 hover:bg-emerald-900 transition-all shadow-sm"
                    >
                      <span>REJUGAR</span>
                      <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                    </button>
                  ) : isPlayable ? (
                    <button
                      type="button"
                      className="px-4 py-2.5 rounded-2xl bg-brand-purple hover:bg-purple-600 text-white font-apache text-sm tracking-wider uppercase flex items-center gap-1 shadow-glow-purple transition-all"
                    >
                      <span>JUGAR</span>
                      <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </button>
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-navy-900 border border-white/10 flex items-center justify-center text-slate-400">
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
