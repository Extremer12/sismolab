import React from 'react';
import { ArrowLeft, Lock, ChevronRight, Sparkles } from 'lucide-react';
import { ScreenId, UserProfile } from '../../types';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';

interface AdultsDashboardPageProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
}

interface AdultGameCard {
  id: string;
  numberStr: string;
  titleEs: string;
  titleEn: string;
  categoryEs: string;
  categoryEn: string;
  bannerImage: string;
  xpReward: number;
  screenId: ScreenId;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  lockColor: string;
  unlockRequirement?: number;
}

const ADULT_GAMES: AdultGameCard[] = [
  {
    id: 'a1',
    numberStr: '01',
    titleEs: 'FÍSICA Y SISMOLOGÍA',
    titleEn: 'PHYSICS & SEISMOLOGY',
    categoryEs: 'CIENCIA INPRES',
    categoryEn: 'INPRES SCIENCE',
    bannerImage: '/images/Banners/game_what_is.png',
    xpReward: 400,
    screenId: 'game-what-is',
    borderColor: 'border-purple-400/50 hover:border-purple-400',
    badgeBg: 'bg-purple-950/90 border-purple-400/40',
    badgeText: 'text-purple-300',
    lockColor: 'text-purple-400 border-purple-400/40',
  },
  {
    id: 'a2',
    numberStr: '02',
    titleEs: 'MOCHILA DE 72 HORAS',
    titleEn: '72-HOUR SURVIVAL KIT',
    categoryEs: 'PLAN DE EMERGENCIA',
    categoryEn: 'EMERGENCY PLAN',
    bannerImage: '/images/Banners/game_emergency_kit.png',
    xpReward: 600,
    screenId: 'game-emergency-kit',
    borderColor: 'border-amber-400/50 hover:border-amber-400',
    badgeBg: 'bg-amber-950/90 border-amber-400/40',
    badgeText: 'text-amber-300',
    lockColor: 'text-amber-400 border-amber-400/40',
    unlockRequirement: 1,
  },
  {
    id: 'a3',
    numberStr: '03',
    titleEs: 'REFLEJOS EN 4 SEGUNDOS',
    titleEn: '4-SECOND REFLEXES',
    categoryEs: 'ACCIÓN CRÍTICA',
    categoryEn: 'CRITICAL ACTION',
    bannerImage: '/images/Banners/game_reflexes.png',
    xpReward: 600,
    screenId: 'game-safe-home',
    borderColor: 'border-emerald-400/50 hover:border-emerald-400',
    badgeBg: 'bg-emerald-950/90 border-emerald-400/40',
    badgeText: 'text-emerald-300',
    lockColor: 'text-emerald-400 border-emerald-400/40',
    unlockRequirement: 2,
  },
  {
    id: 'a4',
    numberStr: '04',
    titleEs: 'DECISIÓN CRÍTICA',
    titleEn: 'CRITICAL DECISION',
    categoryEs: 'PROTOCOLOS INPRES',
    categoryEn: 'INPRES PROTOCOLS',
    bannerImage: '/images/Banners/game_scenarios.png',
    xpReward: 500,
    screenId: 'game-what-would-you-do',
    borderColor: 'border-rose-400/50 hover:border-rose-400',
    badgeBg: 'bg-rose-950/90 border-rose-400/40',
    badgeText: 'text-rose-300',
    lockColor: 'text-rose-400 border-rose-400/40',
    unlockRequirement: 3,
  },
  {
    id: 'a5',
    numberStr: '05',
    titleEs: 'HOGAR Y ESTRUCTURAS',
    titleEn: 'STRUCTURAL SAFETY',
    categoryEs: 'INGENIERÍA SÍSMICA',
    categoryEn: 'SEISMIC ENGINEERING',
    bannerImage: '/images/Banners/game_safe_home.png',
    xpReward: 500,
    screenId: 'game-myth-reality',
    borderColor: 'border-cyan-400/50 hover:border-cyan-400',
    badgeBg: 'bg-cyan-950/90 border-cyan-400/40',
    badgeText: 'text-cyan-300',
    lockColor: 'text-cyan-400 border-cyan-400/40',
    unlockRequirement: 4,
  },
  {
    id: 'a6',
    numberStr: '06',
    titleEs: 'DESAFÍO INTEGRAL',
    titleEn: 'COMPREHENSIVE EXAM',
    categoryEs: 'EXAMEN FINAL',
    categoryEn: 'FINAL EXAM',
    bannerImage: '/images/Banners/game_myths.png',
    xpReward: 1000,
    screenId: 'game-final-challenge',
    borderColor: 'border-yellow-400/50 hover:border-yellow-400',
    badgeBg: 'bg-yellow-950/90 border-yellow-400/40',
    badgeText: 'text-yellow-300',
    lockColor: 'text-yellow-400 border-yellow-400/40',
    unlockRequirement: 5,
  }
];

export const AdultsDashboardPage: React.FC<AdultsDashboardPageProps> = ({
  user,
  onNavigate
}) => {
  const { t, language } = useLanguage();
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

          {/* XP Pill */}
          <div className="px-3.5 py-1.5 rounded-full bg-navy-900/90 border border-brand-gold/40 flex items-center gap-1.5 shadow-sm">
            <span className="text-brand-yellow font-black text-xs">★</span>
            <span className="font-black text-xs text-brand-yellow tabular-nums">
              {user.total_score.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* 2. Hero Mission Banner (Banner image occupies the whole background) */}
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
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-brand-electric shadow-glow-purple transition-all duration-700"
                  style={{ width: `${Math.max(6, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Rectangular Game Cards (Banner occupies the whole background) */}
        <div className="space-y-3 pt-1">
          {ADULT_GAMES.map((game, idx) => {
            const isCompleted = completedIds.includes(game.screenId);
            const reqCount = game.unlockRequirement || 0;
            const isPlayable = idx === 0 || completedCount >= reqCount || isCompleted;

            const title = language === 'en' ? game.titleEn : game.titleEs;
            const category = language === 'en' ? game.categoryEn : game.categoryEs;

            return (
              <div
                key={game.id}
                onClick={() => {
                  if (isPlayable) {
                    sound.playClick();
                    onNavigate(game.screenId);
                  }
                }}
                className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-300 min-h-[125px] sm:min-h-[135px] flex items-center justify-between p-4 sm:p-5 shadow-2xl bg-cover bg-left ${
                  isCompleted
                    ? 'border-emerald-500/60 cursor-pointer hover:scale-[1.02]'
                    : isPlayable
                    ? `${game.borderColor} cursor-pointer hover:scale-[1.02] active:scale-[0.98]`
                    : 'border-white/10 opacity-50 grayscale-[30%] cursor-not-allowed'
                }`}
                style={{ backgroundImage: `url('${game.bannerImage}')` }}
              >
                {/* Right-side dark gradient overlay */}
                <div className="absolute inset-y-0 right-0 w-[64%] bg-gradient-to-l from-navy-950/95 via-navy-950/75 to-transparent pointer-events-none z-0" />

                {/* Left spacer so text starts on the right 58% of the card */}
                <div className="w-[36%] shrink-0 pointer-events-none" />

                {/* Right Content Area: Minimal, Uncluttered, Sharp */}
                <div className="relative z-10 flex-1 flex items-center justify-between gap-2 pl-2">
                  <div className="space-y-1">
                    {/* Compact Badge */}
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${game.badgeBg} ${game.badgeText}`}>
                      {language === 'es' ? 'MÓDULO' : 'MODULE'} {game.numberStr} · {category}
                    </span>

                    {/* Big Clean Title */}
                    <h2 className="font-black text-lg sm:text-xl text-white tracking-tight leading-tight uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      {title}
                    </h2>

                    {/* XP Reward */}
                    <div className="text-xs font-black text-brand-yellow flex items-center gap-1 drop-shadow-md">
                      <span>★</span>
                      <span>+{game.xpReward} XP</span>
                    </div>
                  </div>

                  {/* Action Element: INICIAR Button or Lock Circle */}
                  <div className="shrink-0 pl-1">
                    {isPlayable ? (
                      <button
                        type="button"
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-brand-blue hover:from-purple-600 hover:to-brand-electric text-white font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-glow-purple transition-all hover:scale-105 active:scale-95"
                      >
                        <span>{language === 'es' ? 'INICIAR' : 'START'}</span>
                        <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    ) : (
                      <div className={`w-12 h-12 rounded-full bg-navy-950/90 border flex items-center justify-center shadow-inner ${game.lockColor}`}>
                        <Lock className="w-5 h-5" />
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
              ? '¡Completá los módulos de entrenamiento técnico y sumá puntos para la clasificación general!'
              : 'Complete the technical training modules and gain points for the global leaderboard!'}
          </p>
        </div>

      </div>
    </div>
  );
};
