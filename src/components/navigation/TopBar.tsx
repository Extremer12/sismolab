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
            ZION CODE · SAN JUAN
          </div>
          <div className="font-black text-base text-white tracking-tight leading-tight mt-0.5">
            SISMO <span className="text-brand-cyan">LAB</span>
          </div>
        </div>
      </div>

      {/* Right Controls: Language Selector + User Avatar & Score Pill */}
      <div className="flex items-center gap-2">
        <LanguageToggle compact />

        {/* Score & Profile Pill */}
        <button
          onClick={() => { sound.playClick(); onNavigate('profile'); }}
          className="pl-1.5 pr-3 py-1.5 rounded-full bg-navy-900/90 border border-brand-gold/40 flex items-center gap-2 shadow-sm hover:border-brand-cyan hover:scale-105 active:scale-95 transition-all group"
        >
          {/* Circular 3D Avatar */}
          <div className="w-7 h-7 rounded-full bg-navy-950 border border-brand-cyan/50 overflow-hidden flex items-center justify-center shrink-0">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.nickname}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-xs">{user.avatar_emoji || '🦅'}</span>
            )}
          </div>

          <div className="text-left leading-tight">
            <span className="font-black text-xs text-brand-yellow tabular-nums block">
              ★ {user.total_score.toLocaleString()}
            </span>
            <span className="text-[8px] font-extrabold text-slate-400 tracking-wider uppercase block truncate max-w-[65px]">
              {user.nickname}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
