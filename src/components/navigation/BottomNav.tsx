import React from 'react';
import { Home, Compass, Gamepad2, Trophy, User } from 'lucide-react';
import { ScreenId, UserMode } from '../../types';
import { sound } from '../../lib/sound';

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
  // Hide bottom nav during splash and active minigame screens
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
    { id: 'home' as ScreenId, label: 'Inicio', icon: Home, matches: ['home'] },
    { id: 'history' as ScreenId, label: 'Explorar', icon: Compass, matches: ['history', 'seismic-map'] },
    { id: playScreen as ScreenId, label: 'Jugar', icon: Gamepad2, matches: ['kids', 'adults'] },
    { id: 'ranking' as ScreenId, label: 'Ranking', icon: Trophy, matches: ['ranking'] },
    { id: 'profile' as ScreenId, label: 'Perfil', icon: User, matches: ['profile'] },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-navy-950/95 backdrop-blur-2xl border-t border-brand-cyan/20 py-2.5 px-4 pb-[calc(0.7rem+env(safe-area-inset-bottom))] flex justify-center select-none">
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
                isActive ? 'text-brand-cyan font-black' : 'text-slate-400 hover:text-slate-200 font-semibold'
              }`}
            >
              <div className="relative flex flex-col items-center">
                <Icon className={`w-6 h-6 transition-transform group-hover:scale-110 ${isActive ? 'stroke-[2.5] text-brand-cyan drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]' : 'stroke-[1.8]'}`} />
                <span className="text-[11px] tracking-tight mt-1">{item.label}</span>
                {isActive && (
                  <span className="w-6 h-1 rounded-full bg-brand-cyan shadow-glow-cyan mt-0.5" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
