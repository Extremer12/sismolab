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
  bannerImage: string;
  xpReward: number;
  screenId: ScreenId;
  borderColor: string;
  lockColor: string;
  unlockRequirement?: number;
}

const KIDS_GAMES: KidsGameCard[] = [
  {
    id: 'k1',
    numberStr: '01',
    titleEs: '¿QUÉ ES UN SISMO?',
    titleEn: 'WHAT IS AN EARTHQUAKE?',
    bannerImage: '/images/Banners/game_what_is.png',
    xpReward: 400,
    screenId: 'game-what-is',
    borderColor: 'border-cyan-400/50 hover:border-cyan-400',
    lockColor: 'text-cyan-400 border-cyan-400/40',
  },
  {
    id: 'k2',
    numberStr: '02',
    titleEs: 'MOCHILA DE EMERGENCIA',
    titleEn: 'EMERGENCY GO-BAG',
    bannerImage: '/images/Banners/game_emergency_kit.png',
    xpReward: 500,
    screenId: 'game-emergency-kit',
    borderColor: 'border-amber-400/50 hover:border-amber-400',
    lockColor: 'text-amber-400 border-amber-400/40',
    unlockRequirement: 1,
  },
  {
    id: 'k3',
    numberStr: '03',
    titleEs: 'REFLEJOS EN ACCIÓN',
    titleEn: 'SAFETY REFLEXES',
    bannerImage: '/images/Banners/game_reflexes.png',
    xpReward: 600,
    screenId: 'game-safe-home',
    borderColor: 'border-emerald-400/50 hover:border-emerald-400',
    lockColor: 'text-emerald-400 border-emerald-400/40',
    unlockRequirement: 2,
  },
  {
    id: 'k4',
    numberStr: '04',
    titleEs: '¿QUÉ HARÍAS VOS?',
    titleEn: 'WHAT WOULD YOU DO?',
    bannerImage: '/images/Banners/game_scenarios.png',
    xpReward: 600,
    screenId: 'game-what-would-you-do',
    borderColor: 'border-rose-400/50 hover:border-rose-400',
    lockColor: 'text-rose-400 border-rose-400/40',
    unlockRequirement: 3,
  },
  {
    id: 'k5',
    numberStr: '05',
    titleEs: 'CASA SEGURA',
    titleEn: 'SAFE HOME',
    bannerImage: '/images/Banners/game_safe_home.png',
    xpReward: 500,
    screenId: 'game-myth-reality',
    borderColor: 'border-blue-400/50 hover:border-blue-400',
    lockColor: 'text-blue-400 border-blue-400/40',
    unlockRequirement: 4,
  },
  {
    id: 'k6',
    numberStr: '06',
    titleEs: 'MITOS VS REALIDADES',
    titleEn: 'MYTHS VS REALITIES',
    bannerImage: '/images/Banners/game_myths.png',
    xpReward: 1000,
    screenId: 'game-final-challenge',
    borderColor: 'border-purple-400/50 hover:border-purple-400',
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

        {/* 3. Rectangular Game Cards: Title Top + 01 Top-Right / XP Bottom-Left + JUGAR Bottom-Right */}
        <div className="space-y-3 pt-1">
          {KIDS_GAMES.map((game, idx) => {
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
                {/* Dark gradient overlay on the right to ensure razor-sharp text and button contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-navy-950/65 to-navy-950/95 pointer-events-none z-0" />

                {/* Left 32% spacer for 3D graphic */}
                <div className="w-[32%] sm:w-[35%] shrink-0 pointer-events-none" />

                {/* Right Area: Top Title + Number / Bottom XP + JUGAR Button */}
                <div className="relative z-10 flex-1 flex flex-col justify-between py-3.5 pr-4 pl-1 min-w-0">
                  
                  {/* TOP ROW: Title on left, Number (01) on top-right */}
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-black text-base sm:text-lg text-white tracking-tight leading-snug uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] line-clamp-2 pr-1">
                      {title}
                    </h2>
                    <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-navy-900/90 border border-white/20 text-slate-200 font-mono font-black text-xs shadow-sm">
                      {game.numberStr}
                    </span>
                  </div>

                  {/* BOTTOM ROW: XP without star icon on left + JUGAR button on right */}
                  <div className="flex items-center justify-between gap-2 pt-2">
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
