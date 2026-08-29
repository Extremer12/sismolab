import React from 'react';
import { ArrowLeft, Lock, ChevronRight, Sparkles } from 'lucide-react';
import { ScreenId, UserProfile } from '../../types';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';

interface KidsAdventurePageProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
}

interface KidsGameCard {
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

const KIDS_GAMES: KidsGameCard[] = [
  {
    id: 'k1',
    numberStr: '01',
    titleEs: '¿QUÉ ES UN SISMO?',
    titleEn: 'WHAT IS AN EARTHQUAKE?',
    categoryEs: 'QUIZ ILUSTRADO',
    categoryEn: 'ILLUSTRATED QUIZ',
    bannerImage: '/images/Banners/game_what_is.png',
    xpReward: 400,
    screenId: 'game-what-is',
    borderColor: 'border-cyan-400/50 hover:border-cyan-400',
    badgeBg: 'bg-cyan-950/90 border-cyan-400/40',
    badgeText: 'text-cyan-300',
    lockColor: 'text-cyan-400 border-cyan-400/40',
  },
  {
    id: 'k2',
    numberStr: '02',
    titleEs: 'MOCHILA DE EMERGENCIA',
    titleEn: 'EMERGENCY GO-BAG',
    categoryEs: 'ARMAR & SALVAR',
    categoryEn: 'PACK & PREPARE',
    bannerImage: '/images/Banners/game_emergency_kit.png',
    xpReward: 500,
    screenId: 'game-emergency-kit',
    borderColor: 'border-amber-400/50 hover:border-amber-400',
    badgeBg: 'bg-amber-950/90 border-amber-400/40',
    badgeText: 'text-amber-300',
    lockColor: 'text-amber-400 border-amber-400/40',
    unlockRequirement: 1,
  },
  {
    id: 'k3',
    numberStr: '03',
    titleEs: 'REFLEJOS EN ACCIÓN',
    titleEn: 'SAFETY REFLEXES',
    categoryEs: 'DECISIÓN RÁPIDA',
    categoryEn: 'QUICK REACTION',
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
    id: 'k4',
    numberStr: '04',
    titleEs: '¿QUÉ HARÍAS VOS?',
    titleEn: 'WHAT WOULD YOU DO?',
    categoryEs: 'HISTORIAS REALES',
    categoryEn: 'REAL SCENARIOS',
    bannerImage: '/images/Banners/game_scenarios.png',
    xpReward: 600,
    screenId: 'game-what-would-you-do',
    borderColor: 'border-rose-400/50 hover:border-rose-400',
    badgeBg: 'bg-rose-950/90 border-rose-400/40',
    badgeText: 'text-rose-300',
    lockColor: 'text-rose-400 border-rose-400/40',
    unlockRequirement: 3,
  },
  {
    id: 'k5',
    numberStr: '05',
    titleEs: 'CASA SEGURA',
    titleEn: 'SAFE HOME',
    categoryEs: 'PREVENCIÓN HOGAR',
    categoryEn: 'HOME SAFETY',
    bannerImage: '/images/Banners/game_safe_home.png',
    xpReward: 500,
    screenId: 'game-myth-reality',
    borderColor: 'border-blue-400/50 hover:border-blue-400',
    badgeBg: 'bg-blue-950/90 border-blue-400/40',
    badgeText: 'text-blue-300',
    lockColor: 'text-blue-400 border-blue-400/40',
    unlockRequirement: 4,
  },
  {
    id: 'k6',
    numberStr: '06',
    titleEs: 'MITOS VS REALIDADES',
    titleEn: 'MYTHS VS REALITIES',
    categoryEs: 'DESAFÍO FINAL',
    categoryEn: 'FINAL CHALLENGE',
    bannerImage: '/images/Banners/game_myths.png',
    xpReward: 1000,
    screenId: 'game-final-challenge',
    borderColor: 'border-purple-400/50 hover:border-purple-400',
    badgeBg: 'bg-purple-950/90 border-purple-400/40',
    badgeText: 'text-purple-300',
    lockColor: 'text-purple-400 border-purple-400/40',
    unlockRequirement: 5,
  }
];

export const KidsAdventurePage: React.FC<KidsAdventurePageProps> = ({
  user,
  onNavigate
}) => {
  const { t, language } = useLanguage();
  const completedIds = user.completed_game_ids || [];
  const completedCount = KIDS_GAMES.filter(g => completedIds.includes(g.screenId)).length;
  const totalCount = KIDS_GAMES.length;
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
            className="w-10 h-10 rounded-full bg-navy-900/90 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan hover:bg-navy-800 active:scale-95 transition-all shadow-sm"
            aria-label={t.common.back}
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Mode Pill */}
          <div className="px-5 py-1.5 rounded-full bg-navy-900/90 border border-brand-cyan/40 text-brand-cyan font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
            <span>{language === 'es' ? 'MODO NIÑOS' : 'KIDS MODE'}</span>
            <span>🧒</span>
          </div>

          {/* XP Pill */}
          <div className="px-3.5 py-1.5 rounded-full bg-navy-900/90 border border-brand-gold/40 flex items-center gap-1.5 shadow-sm">
            <span className="text-brand-yellow font-black text-xs">★</span>
            <span className="font-black text-xs text-brand-yellow tabular-nums">
              {user.total_score.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* 2. Hero Mission Banner */}
        <div
          className="relative rounded-3xl overflow-hidden border border-brand-cyan/40 p-4 sm:p-5 min-h-[135px] sm:min-h-[145px] flex items-center justify-between shadow-2xl bg-cover bg-right"
          style={{ backgroundImage: `url('/images/Banners/hero_missions.png')` }}
        >
          {/* Subtle dark gradient overlay on the left */}
          <div className="absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-transparent pointer-events-none z-0" />

          {/* Left Text Content */}
          <div className="relative z-10 space-y-1.5 max-w-[65%]">
            <span className="text-[10px] font-black tracking-widest text-brand-cyan uppercase block">
              {language === 'es' ? 'CENTRO DE MISIONES' : 'MISSION HUB'}
            </span>
            <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight leading-none uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {language === 'es' ? 'AVENTURA SÍSMICA' : 'SEISMIC QUEST'}
            </h1>

            {/* Progress Counter & Bar */}
            <div className="pt-1.5 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase">
                <span className="text-brand-yellow font-mono text-sm">{completedCount} / {totalCount}</span>
                <span className="text-slate-300 text-[10px]">{language === 'es' ? 'COMPLETADOS' : 'COMPLETED'}</span>
              </div>
              <div className="w-44 sm:w-52 h-2.5 bg-navy-950/90 rounded-full p-0.5 border border-white/15 overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-electric via-brand-cyan to-brand-cyan shadow-glow-cyan transition-all duration-700"
                  style={{ width: `${Math.max(6, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Rectangular Game Cards (Spacious, Uncluttered, Pixel-Perfect Buttons) */}
        <div className="space-y-3 pt-1">
          {KIDS_GAMES.map((game, idx) => {
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
                className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-300 min-h-[132px] sm:min-h-[142px] flex items-center justify-between p-4 sm:p-5 shadow-2xl bg-cover bg-left ${
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

                {/* Left spacer for 3D illustration */}
                <div className="w-[36%] shrink-0 pointer-events-none" />

                {/* Right Content Area */}
                <div className="relative z-10 flex-1 flex items-center justify-between gap-3 pl-2">
                  <div className="space-y-1.5 min-w-0 flex-1 pr-1">
                    {/* Mission Badge */}
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${game.badgeBg} ${game.badgeText}`}>
                      {language === 'es' ? 'MISIÓN' : 'MISSION'} {game.numberStr} · {category}
                    </span>

                    {/* Big Title */}
                    <h2 className="font-black text-base sm:text-lg text-white tracking-tight leading-snug uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] truncate sm:whitespace-normal">
                      {title}
                    </h2>

                    {/* XP Reward */}
                    <div className="text-xs font-black text-brand-yellow flex items-center gap-1 drop-shadow-md">
                      <span>★</span>
                      <span>+{game.xpReward} XP</span>
                    </div>
                  </div>

                  {/* Standardized Action Element */}
                  <div className="shrink-0">
                    {isPlayable ? (
                      <button
                        type="button"
                        className="h-11 px-5 rounded-full bg-gradient-to-r from-brand-electric to-brand-cyan hover:from-brand-blue hover:to-brand-electric text-navy-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-glow-cyan shrink-0 hover:scale-105 active:scale-95 transition-all"
                      >
                        <span>{language === 'es' ? 'JUGAR' : 'PLAY'}</span>
                        <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    ) : (
                      <div className={`w-11 h-11 rounded-full bg-navy-950/85 border flex items-center justify-center shrink-0 shadow-inner ${game.lockColor}`}>
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
        <div className="rounded-3xl border border-brand-cyan/20 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 p-3.5 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-2xl bg-brand-cyan/15 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-[11px] text-slate-300 font-bold leading-tight">
            {language === 'es'
              ? '¡Completá misiones y sumá XP para convertirte en un experto de autoprotección sísmica!'
              : 'Complete missions and earn XP to become a certified seismic self-protection expert!'}
          </p>
        </div>

      </div>
    </div>
  );
};
