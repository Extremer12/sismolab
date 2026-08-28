import React from 'react';
import { ArrowLeft, Lock, ChevronRight, Sparkles, Play } from 'lucide-react';
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
  icon: string;
  xpReward: number;
  screenId: ScreenId;
  themeColor: 'cyan' | 'amber' | 'emerald' | 'rose' | 'purple' | 'gold';
  borderStyle: string;
  badgeStyle: string;
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
    icon: '🌍',
    xpReward: 400,
    screenId: 'game-what-is',
    themeColor: 'cyan',
    borderStyle: 'border-cyan-400/40 hover:border-cyan-400 shadow-[0_8px_25px_rgba(34,211,238,0.15)]',
    badgeStyle: 'bg-cyan-950/80 text-brand-cyan border-cyan-400/40',
  },
  {
    id: 'k2',
    numberStr: '02',
    titleEs: 'MOCHILA DE EMERGENCIA',
    titleEn: 'EMERGENCY GO-BAG',
    categoryEs: 'ARMAR & SALVAR',
    categoryEn: 'PACK & PREPARE',
    icon: '🎒',
    xpReward: 500,
    screenId: 'game-emergency-kit',
    themeColor: 'amber',
    borderStyle: 'border-amber-400/40 hover:border-amber-400 shadow-[0_8px_25px_rgba(251,191,36,0.15)]',
    badgeStyle: 'bg-amber-950/80 text-amber-300 border-amber-400/40',
    unlockRequirement: 1,
  },
  {
    id: 'k3',
    numberStr: '03',
    titleEs: 'REFLEJOS EN ACCIÓN',
    titleEn: 'SAFETY REFLEXES',
    categoryEs: 'DECISIÓN RÁPIDA',
    categoryEn: 'QUICK REACTION',
    icon: '⚡',
    xpReward: 600,
    screenId: 'game-safe-home',
    themeColor: 'emerald',
    borderStyle: 'border-emerald-400/40 hover:border-emerald-400 shadow-[0_8px_25px_rgba(52,211,153,0.15)]',
    badgeStyle: 'bg-emerald-950/80 text-emerald-300 border-emerald-400/40',
    unlockRequirement: 2,
  },
  {
    id: 'k4',
    numberStr: '04',
    titleEs: '¿QUÉ HARÍAS VOS?',
    titleEn: 'WHAT WOULD YOU DO?',
    categoryEs: 'HISTORIAS REALES',
    categoryEn: 'REAL SCENARIOS',
    icon: '🚨',
    xpReward: 500,
    screenId: 'game-what-would-you-do',
    themeColor: 'rose',
    borderStyle: 'border-rose-400/40 hover:border-rose-400 shadow-[0_8px_25px_rgba(251,113,133,0.15)]',
    badgeStyle: 'bg-rose-950/80 text-rose-300 border-rose-400/40',
    unlockRequirement: 3,
  },
  {
    id: 'k5',
    numberStr: '05',
    titleEs: 'MITO O REALIDAD',
    titleEn: 'MYTH OR REALITY',
    categoryEs: 'DESAFÍO MENTAL',
    categoryEn: 'BRAIN CHALLENGE',
    icon: '🧠',
    xpReward: 500,
    screenId: 'game-myth-reality',
    themeColor: 'purple',
    borderStyle: 'border-purple-400/40 hover:border-purple-400 shadow-[0_8px_25px_rgba(192,132,252,0.15)]',
    badgeStyle: 'bg-purple-950/80 text-purple-300 border-purple-400/40',
    unlockRequirement: 4,
  },
  {
    id: 'k6',
    numberStr: '06',
    titleEs: 'GRAN DESAFÍO FINAL',
    titleEn: 'GRAND FINAL CHALLENGE',
    categoryEs: 'MISIÓN SUPREMA',
    categoryEn: 'SUPREME MISSION',
    icon: '🏆',
    xpReward: 1000,
    screenId: 'game-final-challenge',
    themeColor: 'gold',
    borderStyle: 'border-yellow-400/50 hover:border-yellow-400 shadow-[0_8px_25px_rgba(250,204,21,0.2)]',
    badgeStyle: 'bg-yellow-950/80 text-brand-yellow border-yellow-400/50',
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
      {/* Background Dark Overlay */}
      <div className="fixed inset-0 bg-navy-950/85 pointer-events-none z-0" />

      {/* Main Container */}
      <div className="relative z-10 p-4 sm:p-5 space-y-4 pb-28 max-w-md mx-auto">
        
        {/* 1. Top Navigation Bar */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => { sound.playClick(); onNavigate('home'); }}
            className="w-10 h-10 rounded-2xl bg-navy-900/90 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan hover:bg-navy-800 active:scale-95 transition-all shadow-sm"
            aria-label={t.common.back}
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="px-4 py-1.5 rounded-full bg-brand-cyan/15 border border-brand-cyan/40 text-brand-cyan font-apache text-sm tracking-wider uppercase shadow-sm">
            {t.kids.badge}
          </div>

          <div className="px-3 py-1 rounded-2xl bg-navy-900/90 border border-brand-gold/40 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span className="font-bold text-xs text-brand-yellow font-tech tabular-nums">
              {user.total_score.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* 2. Hero Level Progress Card */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#091a33] to-[#040e1d] border-2 border-brand-cyan/30 shadow-[0_8px_30px_rgba(4,14,27,0.85)] space-y-2.5">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] font-bold text-brand-cyan uppercase tracking-widest block">
                {t.kids.missionCenter}
              </span>
              <h1 className="font-apache text-2xl sm:text-3xl text-white tracking-wide leading-none mt-0.5">
                {t.kids.adventureTitle}
              </h1>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-brand-yellow font-tech">
                {completedCount} / {totalCount}
              </span>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">
                {t.kids.completedCount}
              </span>
            </div>
          </div>

          {/* Glowing Multi-step Progress Bar */}
          <div className="w-full h-2.5 bg-navy-950/90 rounded-full p-0.5 border border-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-electric via-brand-cyan to-emerald-400 shadow-glow-cyan transition-all duration-700"
              style={{ width: `${Math.max(8, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* 3. Spacious, Clean Game Cards List */}
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

                {/* Center Content */}
                <div className="flex-1 min-w-0 space-y-1 pl-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${game.badgeStyle}`}>
                      {t.kids.missionLabel} {game.numberStr}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      {category}
                    </span>
                  </div>

                  <h2 className="font-apache text-lg sm:text-xl text-white tracking-wide leading-tight">
                    {title}
                  </h2>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-yellow flex items-center gap-1 font-tech">
                      <span>★</span>
                      <span>+{game.xpReward} XP</span>
                    </span>
                    {isCompleted && (
                      <span className="text-[11px] font-bold text-emerald-400">
                        • {t.common.completed}!
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
                      <span>{t.common.replay}</span>
                      <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                    </button>
                  ) : isPlayable ? (
                    <button
                      type="button"
                      className="px-4 py-2.5 rounded-2xl bg-brand-cyan hover:bg-brand-electric text-navy-950 font-apache text-sm tracking-wider uppercase flex items-center gap-1 shadow-glow-cyan transition-all"
                    >
                      <span>{t.common.play}</span>
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
