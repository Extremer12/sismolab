import React from 'react';
import { UserProfile, ScreenId } from '../../types';
import { sound } from '../../lib/sound';
import { LanguageToggle, useLanguage } from '../../i18n/LanguageContext';

interface TopBarProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ user, onNavigate }) => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-xl border-b border-brand-cyan/15 px-4 py-3 max-w-md mx-auto w-full flex items-center justify-between select-none">
      {/* Brand Group with Real App Icon */}
      <div
        onClick={() => { sound.playClick(); onNavigate('home'); }}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <img
          src="/images/icono.png"
          alt="SISMO LAB"
          className="w-10 h-10 rounded-2xl object-cover border border-brand-cyan/40 shadow-glow-cyan/40 shrink-0 group-hover:scale-105 transition-transform"
        />
        <div>
          <div className="text-[10px] font-black text-brand-cyan uppercase tracking-wider leading-none">
            INPRES • SAN JUAN
          </div>
          <div className="font-black text-base text-white tracking-tight leading-tight mt-0.5">
            SISMO <span className="text-brand-cyan">LAB</span>
          </div>
        </div>
      </div>

      {/* Right Controls: Language Selector + Score Pill */}
      <div className="flex items-center gap-2">
        <LanguageToggle compact />

        {/* Score Pill */}
        <button
          onClick={() => { sound.playClick(); onNavigate('ranking'); }}
          className="px-3 py-1.5 rounded-2xl bg-navy-900/90 border border-brand-gold/40 flex items-center gap-1.5 shadow-sm hover:border-brand-gold hover:scale-105 active:scale-95 transition-all"
        >
          <span className="text-brand-yellow text-sm">★</span>
          <div className="text-left leading-tight">
            <span className="font-black text-xs text-white tabular-nums block">
              {user.total_score.toLocaleString()}
            </span>
            <span className="text-[8px] font-extrabold text-accent-gray tracking-wider uppercase block">
              {t.common.points}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
