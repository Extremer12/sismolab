import React from 'react';
import { ArrowLeft, Check, Lock, ChevronRight, Flame } from 'lucide-react';
import { ScreenId, UserProfile } from '../../types';
import { sound } from '../../lib/sound';

interface AdultsDashboardPageProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
}

interface AdultMissionItem {
  id: string;
  numberStr: string;
  title: string;
  subtitle: string;
  xpReward: number;
  screenId: ScreenId;
  visualType: 'science' | 'prevention' | 'safety' | 'history' | 'map' | 'final';
  unlockRequirement?: number;
}

const ADULT_MISSIONS: AdultMissionItem[] = [
  {
    id: 'a1',
    numberStr: '01',
    title: 'ENTENDÉ EL SISMO',
    subtitle: 'Física de ondas, placas tectónicas y registro INPRES.',
    xpReward: 400,
    screenId: 'game-what-is',
    visualType: 'science',
  },
  {
    id: 'a2',
    numberStr: '02',
    title: 'PREVENCIÓN & AUTONOMÍA',
    subtitle: 'Mochila de 72 horas y protocolos de contingencia.',
    xpReward: 600,
    screenId: 'game-emergency-kit',
    visualType: 'prevention',
    unlockRequirement: 1,
  },
  {
    id: 'a3',
    numberStr: '03',
    title: 'REFLEJOS DE SUPERVIVENCIA',
    subtitle: 'Protocolos de respuesta inmediata y decisiones en 4s.',
    xpReward: 600,
    screenId: 'game-safe-home',
    visualType: 'safety',
    unlockRequirement: 2,
  },
  {
    id: 'a4',
    numberStr: '04',
    title: 'HISTORIA DE SAN JUAN',
    subtitle: 'Análisis de los terremotos de 1894, 1944 y 1977.',
    xpReward: 500,
    screenId: 'history',
    visualType: 'history',
    unlockRequirement: 3,
  },
  {
    id: 'a5',
    numberStr: '05',
    title: 'MAPA SÍSMICO ACTIVO',
    subtitle: 'Fallas geológicas y monitoreo instrumental.',
    xpReward: 500,
    screenId: 'seismic-map',
    visualType: 'map',
    unlockRequirement: 4,
  },
  {
    id: 'a6',
    numberStr: '06',
    title: 'EVALUACIÓN Y MITOS',
    subtitle: 'Validación técnica de conceptos sismológicos.',
    xpReward: 1000,
    screenId: 'game-final-challenge',
    visualType: 'final',
    unlockRequirement: 5,
  }
];

export const AdultsDashboardPage: React.FC<AdultsDashboardPageProps> = ({
  user,
  onNavigate
}) => {
  const completedIds = user.completed_game_ids || [];
  const completedMissionsCount = ADULT_MISSIONS.filter(m => completedIds.includes(m.screenId)).length;
  const totalMissions = ADULT_MISSIONS.length;

  const renderThumbnail = (type: AdultMissionItem['visualType']) => {
    switch (type) {
      case 'science':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-950 via-purple-950 to-navy-950 border border-purple-500/40 flex items-center justify-center relative overflow-hidden shadow-inner">
            <div className="relative text-4xl">🔬</div>
          </div>
        );
      case 'prevention':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-950 via-cyan-950 to-navy-950 border border-cyan-500/40 flex items-center justify-center relative overflow-hidden shadow-inner">
            <div className="relative text-4xl">🎒</div>
          </div>
        );
      case 'safety':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-950 via-teal-950 to-navy-950 border border-emerald-500/40 flex items-center justify-center relative overflow-hidden shadow-inner">
            <div className="relative text-4xl">🏢</div>
          </div>
        );
      case 'history':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-amber-950 via-orange-950 to-navy-950 border border-amber-500/40 flex items-center justify-center relative overflow-hidden shadow-inner">
            <div className="relative text-4xl">🏛️</div>
          </div>
        );
      case 'map':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-cyan-950 via-navy-900 to-navy-950 border border-brand-cyan/40 flex items-center justify-center relative overflow-hidden shadow-inner">
            <div className="relative text-4xl">🗺️</div>
          </div>
        );
      case 'final':
      default:
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-rose-950 via-red-950 to-navy-950 border border-rose-500/40 flex items-center justify-center relative overflow-hidden shadow-inner">
            <div className="relative text-4xl">⚡</div>
          </div>
        );
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 overflow-x-hidden"
      style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
    >
      {/* Background Dark Overlay */}
      <div className="fixed inset-0 bg-navy-950/75 pointer-events-none z-0" />

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-5 space-y-4 pb-28 max-w-md mx-auto">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pt-1">
          {/* Back Button + Mode Tag */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => { sound.playClick(); onNavigate('home'); }}
              className="w-10 h-10 rounded-full bg-navy-900/90 border border-brand-purple/50 flex items-center justify-center text-purple-300 hover:bg-navy-800 transition-all shadow-glow-purple/20 active:scale-95"
              aria-label="Volver a Inicio"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="px-3.5 py-1.5 rounded-full bg-navy-900/90 border border-brand-purple/50 text-purple-300 font-black text-xs uppercase flex items-center gap-1.5 shadow-sm">
              <span>JÓVENES Y ADULTOS</span>
              <span className="text-sm">🔬</span>
            </div>
          </div>

          {/* Points Pill */}
          <div className="px-3 py-1 rounded-2xl bg-navy-900/90 border border-brand-gold/40 flex items-center gap-1.5 shadow-sm">
            <span className="text-brand-yellow text-sm">★</span>
            <div className="text-left leading-tight">
              <span className="font-black text-xs text-white tabular-nums block">
                {user.total_score.toLocaleString()}
              </span>
              <span className="text-[8px] font-extrabold text-accent-gray tracking-wider uppercase block">
                PUNTOS
              </span>
            </div>
          </div>
        </div>

        {/* Header Title Section */}
        <div className="text-center space-y-1 pt-2">
          <span className="text-[10px] font-black text-purple-300 uppercase tracking-[0.25em] block drop-shadow-md">
            MÓDULO CIENTÍFICO
          </span>
          <h1 className="font-black text-3xl sm:text-4xl text-white tracking-tight uppercase leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            DESAFÍO <span className="text-purple-400">SÍSMICO</span>
          </h1>
          <p className="text-xs text-slate-300 font-medium pt-0.5">
            Ingeniería sismorresistente y prevención INPRES
          </p>
        </div>

        {/* Segmented Glowing Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex gap-1.5 items-center justify-center">
            {ADULT_MISSIONS.map((_, idx) => {
              const isDone = idx < completedMissionsCount;
              const isCurrent = idx === completedMissionsCount;

              return (
                <div
                  key={idx}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    isDone
                      ? 'bg-purple-400 shadow-glow-purple'
                      : isCurrent
                      ? 'bg-brand-electric shadow-glow-electric animate-pulse'
                      : 'bg-navy-900/90 border border-white/10'
                  }`}
                />
              );
            })}
          </div>

          <div className="text-right">
            <span className="text-xs font-black text-white tabular-nums">
              {Math.min(completedMissionsCount, totalMissions)}{' '}
            </span>
            <span className="text-xs text-slate-400 font-bold">
              / {totalMissions} módulos completados
            </span>
          </div>
        </div>

        {/* Summary Stats Box (2 Columns) */}
        <div className="sismo-card p-4 rounded-2xl border border-brand-purple/30 bg-navy-950/85 backdrop-blur-xl grid grid-cols-2 gap-3 text-center">
          <div className="flex items-center gap-3 pl-2">
            <div className="text-2xl text-brand-gold">★</div>
            <div className="text-left">
              <span className="font-black text-base text-white tabular-nums block leading-tight">
                {user.total_score.toLocaleString()} XP
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                Puntos totales
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
            <div className="text-2xl text-orange-500">
              <Flame className="w-7 h-7 text-orange-500 fill-orange-500" />
            </div>
            <div className="text-left">
              <span className="font-black text-base text-white tabular-nums block leading-tight">
                {Math.max(1, user.games_played)}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                Racha actual
              </span>
            </div>
          </div>
        </div>

        {/* Mission Cards List */}
        <div className="space-y-3.5 pt-1">
          {ADULT_MISSIONS.map((mission, idx) => {
            const isCompleted = completedIds.includes(mission.screenId);
            const reqCount = mission.unlockRequirement || 0;
            const isPlayable = idx === 0 || completedMissionsCount >= reqCount || isCompleted;
            const isLocked = !isPlayable;

            let cardBorder = 'border-white/10 bg-navy-950/70 opacity-60';
            let tagBg = 'bg-purple-950 border-purple-800 text-purple-300';

            if (isCompleted) {
              cardBorder = 'border-2 border-emerald-500/70 bg-gradient-to-r from-emerald-950/40 via-navy-950/80 to-navy-950/90 shadow-[0_4px_25px_rgba(16,185,129,0.2)]';
              tagBg = 'bg-emerald-950 border-emerald-500 text-emerald-400';
            } else if (isPlayable) {
              cardBorder = 'border-2 border-brand-purple shadow-[0_4px_25px_rgba(124,58,237,0.35)] bg-gradient-to-r from-purple-950/50 via-navy-950/85 to-navy-950/90';
              tagBg = 'bg-navy-900 border-brand-purple text-purple-300';
            } else {
              cardBorder = 'border border-indigo-900/60 bg-navy-950/80 opacity-70';
              tagBg = 'bg-indigo-950 border-indigo-700 text-indigo-300';
            }

            return (
              <div
                key={mission.id}
                className={`relative sismo-card rounded-3xl p-4 flex items-center gap-3.5 transition-all duration-200 ${cardBorder}`}
              >
                {/* Number Badge */}
                <div
                  className={`absolute -top-2.5 left-3 px-2 py-0.5 rounded-lg font-black text-[11px] border shadow-sm ${tagBg}`}
                >
                  {mission.numberStr}
                </div>

                {/* Left Thumbnail Illustration */}
                <div className="w-18 h-18 sm:w-20 sm:h-20 shrink-0">
                  {renderThumbnail(mission.visualType)}
                </div>

                {/* Middle Content */}
                <div className="flex-1 space-y-0.5 pr-1 min-w-0">
                  <h3 className="font-black text-sm sm:text-base text-white tracking-tight leading-snug uppercase truncate">
                    {mission.title}
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium leading-snug line-clamp-2">
                    {mission.subtitle}
                  </p>

                  {/* XP Reward or Lock Requirement */}
                  {!isLocked ? (
                    <div className="flex items-center gap-1 text-[11px] font-black text-brand-yellow pt-0.5">
                      <span>★</span>
                      <span>+{mission.xpReward} XP</span>
                      {isCompleted && (
                        <span className="text-[9px] font-bold text-emerald-400 ml-1">✓ Completada</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[9px] font-black text-purple-400 uppercase tracking-wider pt-0.5">
                      <Lock className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">Completá {mission.unlockRequirement} módulo(s)</span>
                    </div>
                  )}
                </div>

                {/* Right Action / Status */}
                <div className="shrink-0 flex flex-col items-center justify-center">
                  {isCompleted ? (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onNavigate(mission.screenId);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-400 text-emerald-300 font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-sm hover:bg-emerald-900 active:scale-95 transition-all"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-400" />
                      <span>REJUGAR</span>
                    </button>
                  ) : isPlayable ? (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onNavigate(mission.screenId);
                      }}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-brand-purple to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-glow-purple hover:scale-105 active:scale-95 transition-all"
                    >
                      <span>JUGAR</span>
                      <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  ) : (
                    <div className="flex flex-col items-center gap-1 opacity-70">
                      <div className="w-9 h-9 rounded-full border-2 border-purple-500/50 bg-purple-950/80 text-purple-300 flex items-center justify-center">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] font-black text-purple-400 tracking-wider uppercase">
                        BLOQUEADO
                      </span>
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
