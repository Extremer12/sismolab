import React from 'react';
import { ArrowLeft, Lock, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
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
  themeColor: 'purple' | 'amber' | 'emerald' | 'rose' | 'cyan' | 'gold';
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
    themeColor: 'purple',
    borderColor: 'border-purple-500/40 hover:border-purple-400',
    badgeBg: 'bg-purple-500/20 border-purple-500/40',
    badgeText: 'text-purple-300',
    lockColor: 'text-purple-400 border-purple-500/30',
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
    themeColor: 'amber',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    badgeBg: 'bg-amber-500/20 border-amber-500/40',
    badgeText: 'text-amber-300',
    lockColor: 'text-amber-400 border-amber-500/30',
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
    themeColor: 'emerald',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    badgeBg: 'bg-emerald-500/20 border-emerald-500/40',
    badgeText: 'text-emerald-300',
    lockColor: 'text-emerald-400 border-emerald-500/30',
    unlockRequirement: 2,
  },
  {
    id: 'a4',
    numberStr: '04',
    titleEs: 'TOMA DE DECISIÓN CRÍTICA',
    titleEn: 'CRITICAL DECISION MAKING',
    categoryEs: 'PROTOCOLOS INPRES',
    categoryEn: 'INPRES PROTOCOLS',
    bannerImage: '/images/Banners/game_scenarios.png',
    xpReward: 500,
    screenId: 'game-what-would-you-do',
    themeColor: 'rose',
    borderColor: 'border-rose-500/40 hover:border-rose-400',
    badgeBg: 'bg-rose-500/20 border-rose-500/40',
    badgeText: 'text-rose-300',
    lockColor: 'text-rose-400 border-rose-500/30',
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
    themeColor: 'cyan',
    borderColor: 'border-brand-cyan/40 hover:border-brand-cyan',
    badgeBg: 'bg-brand-cyan/20 border-brand-cyan/40',
    badgeText: 'text-brand-cyan',
    lockColor: 'text-brand-cyan border-brand-cyan/30',
    unlockRequirement: 4,
  },
  {
    id: 'a6',
    numberStr: '06',
    titleEs: 'DESAFÍO INTEGRAL INPRES',
    titleEn: 'COMPREHENSIVE INPRES EXAM',
    categoryEs: 'EXAMEN FINAL EXPERTO',
    categoryEn: 'EXPERT FINAL EXAM',
    bannerImage: '/images/Banners/game_myths.png',
    xpReward: 1000,
    screenId: 'game-final-challenge',
    themeColor: 'gold',
    borderColor: 'border-yellow-400/50 hover:border-yellow-400',
    badgeBg: 'bg-yellow-950/80 border-yellow-400/50',
    badgeText: 'text-brand-yellow',
    lockColor: 'text-brand-yellow border-yellow-400/40',
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

          {/* Mode Pill Indicator */}
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

        {/* 2. Hero Mission Banner ("CENTRO DE ENTRENAMIENTO · CIENCIA Y PREVENCIÓN") */}
        <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-gradient-to-r from-[#110729] via-[#1a0c3b] to-[#0a0418] shadow-[0_8px_30px_rgba(4,14,27,0.85)] p-4 sm:p-5 min-h-[125px] flex items-center justify-between">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Left Text Content */}
          <div className="relative z-10 space-y-1.5 max-w-[55%]">
            <span className="text-[10px] font-black tracking-widest text-purple-300 uppercase block">
              {language === 'es' ? 'CENTRO DE ENTRENAMIENTO' : 'TRAINING HUB'}
            </span>
            <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight leading-none uppercase">
              {language === 'es' ? 'CIENCIA & ACCIÓN' : 'SCIENCE & ACTION'}
            </h1>

            {/* Progress Counter & Bar */}
            <div className="pt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase">
                <span className="text-brand-yellow font-mono text-sm">{completedCount} / {totalCount}</span>
                <span className="text-slate-300 text-[10px]">{language === 'es' ? 'COMPLETADOS' : 'COMPLETED'}</span>
              </div>
              <div className="w-full h-2 bg-navy-950/90 rounded-full p-0.5 border border-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-brand-electric shadow-glow-purple transition-all duration-700"
                  style={{ width: `${Math.max(6, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Mountain Graphic */}
          <div className="relative z-10 w-[45%] h-24 sm:h-28 flex items-center justify-end">
            <img
              src="/images/Banners/hero_missions.png"
              alt="Ciencia y Acción"
              className="h-full w-full object-contain filter drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            />
          </div>
        </div>

        {/* 3. Rectangular Game Cards (40% Left Graphic / 60% Solid Dark Overlay Right) */}
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
                className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-300 min-h-[112px] sm:min-h-[120px] flex items-center shadow-lg group ${
                  isCompleted
                    ? 'border-emerald-500/60 bg-navy-950/95 cursor-pointer hover:scale-[1.01]'
                    : isPlayable
                    ? `${game.borderColor} bg-navy-950/95 cursor-pointer hover:scale-[1.01] active:scale-[0.99]`
                    : 'border-white/10 bg-navy-950/80 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* 1. Left 38% Area: 3D Illustration Graphic */}
                <div className="relative w-[38%] h-full shrink-0 flex items-center justify-center p-2 self-stretch overflow-hidden bg-gradient-to-r from-purple-950/40 to-transparent">
                  <img
                    src={game.bannerImage}
                    alt={title}
                    className="w-full h-24 sm:h-26 object-contain filter drop-shadow-[0_0_12px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                {/* 2. Right 62% Area: Solid dark surface for high-contrast crisp text */}
                <div className="relative z-10 w-[62%] py-3 pr-3 pl-1 flex items-center justify-between gap-2">
                  <div className="space-y-1 min-w-0 flex-1">
                    {/* Mission Badge & Category */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${game.badgeBg} ${game.badgeText}`}>
                        {language === 'es' ? 'MÓDULO' : 'MODULE'} {game.numberStr}
                      </span>
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wide truncate">
                        {category}
                      </span>
                    </div>

                    {/* Game Title */}
                    <h2 className="font-black text-sm sm:text-base text-white tracking-tight leading-tight line-clamp-2 uppercase">
                      {title}
                    </h2>

                    {/* XP & Status */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-xs font-black text-brand-yellow flex items-center gap-1">
                        <span>★</span>
                        <span>+{game.xpReward} XP</span>
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-black text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{language === 'es' ? 'LISTO' : 'DONE'}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3. Action Right Element (Button or Lock Icon) */}
                  <div className="shrink-0 pl-1">
                    {isCompleted ? (
                      <button
                        type="button"
                        className="px-3.5 py-2 rounded-full bg-emerald-950/90 border border-emerald-400/60 text-emerald-300 font-black text-xs tracking-wider uppercase flex items-center gap-1 hover:bg-emerald-900 transition-all shadow-sm"
                      >
                        <span>{language === 'es' ? 'INICIAR' : 'START'}</span>
                        <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    ) : isPlayable ? (
                      <button
                        type="button"
                        className="px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-brand-blue hover:from-purple-600 hover:to-brand-electric text-white font-black text-xs tracking-wider uppercase flex items-center gap-1 shadow-glow-purple transition-all group-hover:scale-105"
                      >
                        <span>{language === 'es' ? 'INICIAR' : 'START'}</span>
                        <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    ) : (
                      <div className={`w-11 h-11 rounded-full bg-navy-900/90 border flex items-center justify-center shadow-inner ${game.lockColor}`}>
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
              ? '¡Completá los módulos de entrenamiento técnico y sumá puntos para la clasificación general!'
              : 'Complete the technical training modules and gain points for the global leaderboard!'}
          </p>
        </div>

      </div>
    </div>
  );
};
