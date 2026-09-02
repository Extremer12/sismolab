import React, { useState } from 'react';
import { ArrowLeft, Lock, ChevronRight, Sparkles, HelpCircle } from 'lucide-react';
import { ScreenId, UserProfile } from '../../types';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import { GameInfoModal } from '../../components/games/GameInfoModal';

interface AdultsDashboardPageProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
}

interface AdultGameCard {
  id: string;
  numberStr: string;
  titleEs: string;
  titleEn: string;
  bannerImage: string;
  xpReward: number;
  screenId: ScreenId;
  borderColor: string;
  lockColor: string;
  unlockRequirement?: number;
}

const ADULT_GAMES: AdultGameCard[] = [
  {
    id: 'a1',
    numberStr: '01',
    titleEs: 'FÍSICA Y SISMOLOGÍA',
    titleEn: 'PHYSICS & SEISMOLOGY',
    bannerImage: '/images/Banners/game_what_is.webp',
    xpReward: 400,
    screenId: 'game-what-is',
    borderColor: 'border-purple-400/50 hover:border-purple-400',
    lockColor: 'text-purple-400 border-purple-400/40',
  },
  {
    id: 'a2',
    numberStr: '02',
    titleEs: 'MOCHILA DE 72 HORAS',
    titleEn: '72-HOUR SURVIVAL KIT',
    bannerImage: '/images/Banners/game_emergency_kit.webp',
    xpReward: 600,
    screenId: 'game-emergency-kit',
    borderColor: 'border-amber-400/50 hover:border-amber-400',
    lockColor: 'text-amber-400 border-amber-400/40',
    unlockRequirement: 1,
  },
  {
    id: 'a3',
    numberStr: '03',
    titleEs: 'REFLEJOS EN 4 SEGUNDOS',
    titleEn: '4-SECOND REFLEXES',
    bannerImage: '/images/Banners/game_reflexes.webp',
    xpReward: 600,
    screenId: 'game-safe-home',
    borderColor: 'border-emerald-400/50 hover:border-emerald-400',
    lockColor: 'text-emerald-400 border-emerald-400/40',
    unlockRequirement: 2,
  },
  {
    id: 'a4',
    numberStr: '04',
    titleEs: 'DECISIÓN EN CRISIS',
    titleEn: 'CRITICAL DECISION',
    bannerImage: '/images/Banners/game_scenarios.webp',
    xpReward: 500,
    screenId: 'game-what-would-you-do',
    borderColor: 'border-rose-400/50 hover:border-rose-400',
    lockColor: 'text-rose-400 border-rose-400/40',
    unlockRequirement: 3,
  },
  {
    id: 'a5',
    numberStr: '05',
    titleEs: 'MITOS Y REALIDADES',
    titleEn: 'MYTHS & REALITIES',
    bannerImage: '/images/Banners/game_myths.webp',
    xpReward: 500,
    screenId: 'game-myth-reality',
    borderColor: 'border-cyan-400/50 hover:border-cyan-400',
    lockColor: 'text-cyan-400 border-cyan-400/40',
    unlockRequirement: 4,
  },
  {
    id: 'a6',
    numberStr: '06',
    titleEs: 'DESAFÍO INTEGRAL',
    titleEn: 'COMPREHENSIVE EXAM',
    bannerImage: '/images/Banners/hero_missions.webp',
    xpReward: 1000,
    screenId: 'game-final-challenge',
    borderColor: 'border-yellow-400/50 hover:border-yellow-400',
    lockColor: 'text-yellow-400 border-yellow-400/40',
    unlockRequirement: 5,
  }
];

export const AdultsDashboardPage: React.FC<AdultsDashboardPageProps> = ({
  user,
  onNavigate
}) => {
  const { t, language } = useLanguage();
  const [showInfoModal, setShowInfoModal] = useState(false);

  const completedIds = user.completed_game_ids || [];
  const completedCount = ADULT_GAMES.filter(g => completedIds.includes(g.screenId)).length;
  const totalCount = ADULT_GAMES.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 overflow-x-hidden"
      style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
    >
      {/* Dark Ambient Overlay */}
      <div className="fixed inset-0 bg-navy-950/85 pointer-events-none z-0" />

      {/* Rules & Scoring Modal */}
      <GameInfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />

      {/* Main Container */}
      <div className="relative z-10 p-4 sm:p-5 space-y-4 pb-28 max-w-md mx-auto">
        
        {/* 1. Top Navigation Bar */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => { sound.playClick(); onNavigate('home'); }}
            className="w-10 h-10 rounded-full bg-navy-900/90 border border-purple-500/40 flex items-center justify-center text-purple-300 hover:bg-navy-800 active:scale-95 transition-all shadow-sm"
            aria-label={t.common.back}
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Mode Pill */}
          <div className="px-5 py-1.5 rounded-full bg-navy-900/90 border border-purple-500/40 text-purple-300 font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
            <span>{language === 'es' ? 'JÓVENES Y ADULTOS' : 'YOUTH & ADULTS'}</span>
            <span>🔬</span>
          </div>

          {/* Info Button & XP Pill */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { sound.playClick(); setShowInfoModal(true); }}
              className="w-9 h-9 rounded-full bg-navy-900/90 border border-purple-400/40 hover:border-purple-400 flex items-center justify-center text-purple-300 hover:text-white transition-all shadow-sm active:scale-95"
              title="Reglas y Sistema de Puntos"
              aria-label="Información de juego"
            >
              <HelpCircle className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="px-3 py-1.5 rounded-full bg-navy-900/90 border border-brand-gold/40 flex items-center gap-1.5 shadow-sm">
              <span className="font-black text-xs text-brand-yellow tabular-nums">
                {user.total_score.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>

        {/* 2. Hero Mission Banner */}
        <div
          className="relative rounded-3xl overflow-hidden border border-purple-500/40 p-4 sm:p-5 min-h-[135px] sm:min-h-[145px] flex items-center justify-between shadow-2xl bg-cover bg-right"
          style={{ backgroundImage: `url('/images/Banners/hero_missions.png')` }}
        >
          {/* Subtle dark gradient overlay on the left */}
          <div className="absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-transparent pointer-events-none z-0" />

          {/* Left Text Content */}
          <div className="relative z-10 space-y-1.5 max-w-[65%]">
            <span className="text-[10px] font-black tracking-widest text-purple-300 uppercase block">
              {language === 'es' ? 'CENTRO DE ENTRENAMIENTO' : 'TRAINING HUB'}
            </span>
            <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight leading-none uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {language === 'es' ? 'CIENCIA & ACCIÓN' : 'SCIENCE & ACTION'}
            </h1>

            {/* Progress Counter & Bar */}
            <div className="pt-1.5 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase">
                <span className="text-brand-yellow font-mono text-sm">{completedCount} / {totalCount}</span>
                <span className="text-slate-300 text-[10px]">{language === 'es' ? 'COMPLETADOS' : 'COMPLETED'}</span>
              </div>
              <div className="w-44 sm:w-52 h-2.5 bg-navy-950/90 rounded-full p-0.5 border border-white/15 overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 via-brand-electric to-brand-cyan shadow-glow-purple transition-all duration-700"
                  style={{ width: `${Math.max(6, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Rectangular Game Cards: 01 Top-Left + Expanded Title Top-Right + XP & JUGAR Bottom-Right */}
        <div className="space-y-3 pt-1">
          {ADULT_GAMES.map((game, idx) => {
            const isCompleted = completedIds.includes(game.screenId);
            const reqCount = game.unlockRequirement || 0;
            const isPlayable = idx === 0 || completedCount >= reqCount || isCompleted;

            const title = language === 'en' ? game.titleEn : game.titleEs;

            return (
              <div
                key={game.id}
                onClick={() => {
                  if (isPlayable) {
                    sound.playClick();
                    onNavigate(game.screenId);
                  }
                }}
                className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-300 min-h-[135px] sm:min-h-[145px] flex shadow-2xl bg-cover bg-left ${
                  isCompleted
                    ? 'border-emerald-500/60 cursor-pointer hover:scale-[1.02]'
                    : isPlayable
                    ? `${game.borderColor} cursor-pointer hover:scale-[1.02] active:scale-[0.98]`
                    : 'border-white/10 opacity-50 grayscale-[30%] cursor-not-allowed'
                }`}
                style={{ backgroundImage: `url('${game.bannerImage}')` }}
              >
                {/* Top-Left Number Only Badge */}
                <div className="absolute top-3 left-3 z-20 px-2.5 py-0.5 rounded-full bg-navy-950/90 backdrop-blur-md border border-white/25 text-brand-yellow font-mono font-black text-xs shadow-md">
                  {game.numberStr}
                </div>

                {/* Dark gradient overlay on the right */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-navy-950/65 to-navy-950/95 pointer-events-none z-0" />

                {/* Left 32% spacer for 3D graphic */}
                <div className="w-[32%] sm:w-[34%] shrink-0 pointer-events-none" />

                {/* Right Area: Expanded Title Top / XP + JUGAR Button Bottom-Right */}
                <div className="relative z-10 flex-1 flex flex-col justify-between py-3 pr-2.5 pl-0.5 min-w-0">
                  
                  {/* TOP ROW: Title spanning almost completely to right border */}
                  <div className="w-full">
                    <h2 className="font-black text-base sm:text-lg text-white tracking-tight leading-snug uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] w-full">
                      {title}
                    </h2>
                  </div>

                  {/* BOTTOM ROW: XP pushed rightward next to JUGAR button */}
                  <div className="flex items-center justify-end gap-2.5 pt-1.5 pr-0.5">
                    {/* XP without star icon */}
                    <span className="font-mono font-black text-sm text-brand-yellow tabular-nums tracking-wide drop-shadow-md">
                      +{game.xpReward} XP
                    </span>

                    {/* JUGAR Button or Lock Circle */}
                    {isPlayable ? (
                      <button
                        type="button"
                        className="h-9 px-5 rounded-full bg-gradient-to-r from-brand-electric to-brand-cyan hover:from-brand-blue hover:to-brand-electric text-navy-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-glow-cyan shrink-0 hover:scale-105 active:scale-95 transition-all"
                      >
                        <span>{language === 'es' ? 'JUGAR' : 'PLAY'}</span>
                        <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    ) : (
                      <div className={`w-9 h-9 rounded-full bg-navy-950/90 border flex items-center justify-center shrink-0 shadow-inner ${game.lockColor}`}>
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* 4. Bottom Motivational Banner */}
        <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-r from-navy-950 via-purple-950/40 to-navy-950 p-3.5 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-[11px] text-slate-300 font-bold leading-tight">
            {language === 'es'
              ? '¡Completá los entrenamientos técnicos y sumá puntos para la clasificación general!'
              : 'Complete the technical training modules and gain points for the global leaderboard!'}
          </p>
        </div>

      </div>
    </div>
  );
};
