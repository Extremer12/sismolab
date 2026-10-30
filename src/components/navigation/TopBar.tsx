import React from 'react';
import { UserProfile, ScreenId } from '../../types';
import { sound } from '../../lib/sound';
import { ThemeToggle, useTheme } from '../../theme/ThemeContext';
import { Settings } from 'lucide-react';

interface TopBarProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ user, onNavigate }) => {
  const { isDark } = useTheme();

  return (
    <header
      className={`sticky top-0 z-40 px-4 py-2.5 max-w-md mx-auto w-full flex items-center justify-between select-none transition-colors duration-200 backdrop-blur-xl border-b ${
        isDark
          ? 'bg-navy-950/90 border-white/10 text-white'
          : 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* Brand Group with App Icon */}
      <div
        onClick={() => {
          sound.playClick();
          onNavigate('home');
        }}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <img
          src="/images/icono.png"
          alt="SISMO LAB"
          className="w-9 h-9 rounded-xl object-cover border border-brand-cyan/40 shadow-sm shrink-0 group-hover:scale-105 transition-transform"
        />
        <div>
          <div className="font-black text-sm tracking-tight leading-tight flex items-center gap-1">
            <span className={isDark ? 'text-white' : 'text-slate-900'}>SISMO</span>
            <span className="text-brand-cyan">LAB</span>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none mt-0.5">
            SAN JUAN · PREVENCIÓN
          </span>
        </div>
      </div>

      {/* Right Controls: Theme Switcher (Claro/Oscuro) + Profile Avatar */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle (Sun / Moon) */}
        <ThemeToggle compact />

        {/* Profile Avatar Button */}
        <button
          onClick={() => {
            sound.playClick();
            onNavigate('profile');
          }}
          className={`p-1 pl-1.5 pr-2 rounded-full border flex items-center gap-2 transition-all active:scale-95 group ${
            isDark
              ? 'bg-navy-900/90 border-white/15 hover:border-brand-cyan text-white'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
          }`}
          title="Configuraciones y Perfil"
          aria-label="Perfil y configuraciones"
        >
          {/* Circular 3D Avatar */}
          <div className="w-7 h-7 rounded-full bg-navy-950 border border-brand-cyan/50 overflow-hidden flex items-center justify-center shrink-0">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.nickname}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== window.location.origin + '/images/avatar/avatar_1.webp') {
                    target.src = '/images/avatar/avatar_1.webp';
                  }
                }}
              />
            ) : (
              <span className="text-xs">{user.avatar_emoji || '🦅'}</span>
            )}
          </div>

          <span className="text-xs font-bold truncate max-w-[80px]">
            {user.nickname || 'Perfil'}
          </span>
        </button>
      </div>
    </header>
  );
};
