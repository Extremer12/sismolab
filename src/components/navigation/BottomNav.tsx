import React from 'react';
import { Home, Compass, Gamepad2, Trophy, User } from 'lucide-react';
import { ScreenId, UserMode } from '../../types';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../theme/ThemeContext';

interface BottomNavProps {
  activeScreen: ScreenId;
  userMode: UserMode;
  onNavigate: (screen: ScreenId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeScreen,
  userMode,
  onNavigate
}) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  // Hide bottom nav during splash, active minigame screens and legal pages
  if ([
    'splash',
    'game-what-is',
    'game-safe-home',
    'game-emergency-kit',
    'game-what-would-you-do',
    'game-myth-reality',
    'game-final-challenge'
  ].includes(activeScreen)) {
    return null;
  }

  const playScreen = userMode === 'kids' ? 'kids' : 'adults';

  const navItems = [
    { id: 'home' as ScreenId, label: t.nav.home, icon: Home, matches: ['home', 'preparedness', 'backpack', 'family'] },
    { id: 'history' as ScreenId, label: t.nav.history, icon: Compass, matches: ['history'] },
    { id: playScreen as ScreenId, label: t.nav.play, icon: Gamepad2, matches: ['kids', 'adults'] },
    { id: 'ranking' as ScreenId, label: t.nav.ranking, icon: Trophy, matches: ['ranking'] },
    { id: 'profile' as ScreenId, label: t.nav.profile, icon: User, matches: ['profile', 'credits', 'privacy', 'terms'] },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 py-2.5 px-4 pb-[calc(0.7rem+env(safe-area-inset-bottom))] flex justify-center select-none backdrop-blur-2xl border-t transition-colors duration-200 ${
        isDark
          ? 'bg-navy-950/95 border-brand-cyan/20'
          : 'bg-white/95 border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]'
      }`}
    >
      <div className="w-full max-w-md grid grid-cols-5 gap-1 text-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.matches.includes(activeScreen);

          return (
            <button
              key={item.label}
              onClick={() => {
                sound.playClick();
                onNavigate(item.id);
              }}
              className={`flex flex-col items-center justify-center py-1 transition-all duration-200 group ${
                isActive
                  ? isDark ? 'text-brand-cyan font-black' : 'text-cyan-700 font-black'
                  : isDark ? 'text-slate-400 hover:text-slate-200 font-semibold' : 'text-slate-500 hover:text-slate-900 font-semibold'
              }`}
            >
              <div className="relative flex flex-col items-center">
                <Icon
                  className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                    isActive
                      ? isDark
                        ? 'stroke-[2.5] text-brand-cyan drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]'
                        : 'stroke-[2.5] text-cyan-700 drop-shadow-[0_2px_8px_rgba(14,165,233,0.3)]'
                      : 'stroke-[1.8]'
                  }`}
                />
                <span className="text-[11px] tracking-tight mt-1">{item.label}</span>
                {isActive && (
                  <span
                    className={`w-6 h-1 rounded-full mt-0.5 ${
                      isDark ? 'bg-brand-cyan shadow-glow-cyan' : 'bg-cyan-600'
                    }`}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
