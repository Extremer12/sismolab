import React from 'react';
import { Sparkles, Activity } from 'lucide-react';
import { UserProfile, ScreenId } from '../../types';
import { sound } from '../../lib/sound';

interface TopBarProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ user, onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-xl border-b border-brand-cyan/15 px-4 py-3 max-w-md mx-auto w-full flex items-center justify-between select-none">
      {/* Brand Group */}
      <div
        onClick={() => { sound.playClick(); onNavigate('home'); }}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-navy-850 to-navy-900 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shadow-glow-cyan/40">
          <Activity className="w-5 h-5 animate-pulse text-brand-cyan" />
        </div>
        <div>
          <div className="text-[10px] font-black text-brand-cyan uppercase tracking-wider leading-none">
            INPRES • SAN JUAN
          </div>
          <div className="font-black text-base text-white tracking-tight leading-tight mt-0.5">
            SISMO <span className="text-brand-cyan">LAB</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Mode Pill */}
        <button
          onClick={() => { sound.playClick(); onNavigate('profile'); }}
          className="px-3 py-1.5 rounded-full bg-navy-900/90 border border-brand-cyan/30 text-brand-cyan font-black text-xs uppercase flex items-center gap-1.5 hover:border-brand-cyan transition-all"
        >
          <span>MODO</span>
          <span className="text-sm">☺</span>
        </button>

        {/* Score Pill */}
        <button
          onClick={() => { sound.playClick(); onNavigate('ranking'); }}
          className="px-3 py-1 rounded-2xl bg-navy-900/90 border border-brand-gold/40 flex items-center gap-2 shadow-sm hover:border-brand-gold transition-all"
        >
          <span className="text-brand-yellow text-sm">★</span>
          <div className="text-left leading-tight">
            <span className="font-black text-xs text-white tabular-nums block">
              {user.total_score.toLocaleString()}
            </span>
            <span className="text-[8px] font-extrabold text-accent-gray tracking-wider uppercase block">
              PUNTOS
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
