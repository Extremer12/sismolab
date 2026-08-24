import React from 'react';
import { ArrowRight, ChevronRight, Calendar } from 'lucide-react';
import { UserProfile, ScreenId, UserMode } from '../../types';
import { sound } from '../../lib/sound';

interface HomeScreenProps {
  user: UserProfile;
  onSelectMode: (mode: UserMode) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  onSelectMode,
  onNavigate
}) => {
  const handleLaunchKids = () => {
    sound.playClick();
    onSelectMode('kids');
    onNavigate('kids');
  };

  const handleLaunchAdults = () => {
    sound.playClick();
    onSelectMode('adult');
    onNavigate('adults');
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 overflow-x-hidden"
      style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
    >
      {/* Background Dark Overlay */}
      <div className="fixed inset-0 bg-navy-950/80 pointer-events-none z-0" />

      {/* Main Content Layout */}
      <div className="relative z-10 p-4 sm:p-5 space-y-4 pb-24 max-w-md mx-auto">
        {/* 1. Hero Section: ¿ESTÁS LISTO PARA EL DESAFÍO? + San Juan Map Graphic */}
        <div className="relative py-1 px-1 flex items-center justify-between overflow-hidden">
          <div className="max-w-[210px] space-y-1.5 z-10">
            <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight uppercase leading-none">
              ¿ESTÁS LISTO<br />
              <span className="text-brand-electric">PARA EL DESAFÍO?</span>
            </h1>

            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              Aprendé sobre sismos y{' '}
              <button
                onClick={() => { sound.playClick(); onNavigate('ranking'); }}
                className="text-brand-yellow font-bold underline decoration-brand-yellow/60 hover:text-white transition-colors"
              >
                subí al ranking
              </button>{' '}
              de la feria.
            </p>

            {/* Seismic Waveform Graphic */}
            <div className="pt-0.5 w-28 opacity-90">
              <svg viewBox="0 0 120 18" fill="none" className="w-full text-brand-cyan">
                <path
                  d="M0 9 H25 L32 2 L38 16 L45 5 L52 13 L58 9 H120"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Glowing San Juan Map Silhouette with Pulsing Epicenter */}
          <div className="w-36 h-36 relative shrink-0 -mr-2 flex items-center justify-center">
            <img
              src="/images/sanjuanforma.png"
              alt="Mapa de San Juan"
              className="w-full h-full object-contain filter drop-shadow-[0_0_18px_rgba(0,184,255,0.75)]"
            />
            {/* Animated Epicenter Radar Rings */}
            <div className="absolute top-[52%] left-[53%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <span className="absolute -inset-2.5 rounded-full border-2 border-brand-cyan opacity-80 animate-ping" style={{ animationDuration: '2.2s' }} />
              <span className="absolute -inset-5 rounded-full border border-brand-electric opacity-50 animate-ping" style={{ animationDuration: '3.2s' }} />
              <span className="relative block w-4 h-4 rounded-full bg-brand-cyan shadow-glow-cyan border-2 border-white" />
            </div>
          </div>
        </div>

        {/* 2. Primary Game Mode: NIÑOS (Card 1) */}
        <button
          onClick={handleLaunchKids}
          className="relative w-full aspect-[16/7.5] sm:aspect-[16/7] rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-cyan/40 hover:border-brand-cyan transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group flex flex-col justify-end p-4 sm:p-5 text-left bg-cover bg-center"
          style={{ backgroundImage: `url('/images/fondocardniños.png')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-900/40 to-transparent z-0" />
          
          <div className="relative z-10 space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="px-3 py-0.5 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan font-black text-[10px] uppercase tracking-wider">
                DE 6 A 12 AÑOS
              </span>
              <span className="w-8 h-8 rounded-full bg-brand-cyan text-navy-950 flex items-center justify-center font-bold text-sm shadow-glow-cyan group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>

            <h2 className="font-black text-2xl sm:text-3xl text-white tracking-tight leading-none drop-shadow-md">
              MODO NIÑOS
            </h2>
            <p className="text-xs text-slate-200 font-medium leading-tight">
              Misiones divertidas, mochila de emergencia y trivias interactivas.
            </p>
          </div>
        </button>

        {/* 3. Secondary Game Mode: JÓVENES Y ADULTOS (Card 2) */}
        <button
          onClick={handleLaunchAdults}
          className="relative w-full aspect-[16/7.5] sm:aspect-[16/7] rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-purple/40 hover:border-brand-purple transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group flex flex-col justify-end p-4 sm:p-5 text-left bg-cover bg-center"
          style={{ backgroundImage: `url('/images/fondocardjovenesyadultos.png')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-purple-950/40 to-transparent z-0" />
          
          <div className="relative z-10 space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="px-3 py-0.5 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-purple-300 font-black text-[10px] uppercase tracking-wider">
                +13 AÑOS Y FAMILIAS
              </span>
              <span className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold text-sm shadow-glow-purple group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>

            <h2 className="font-black text-2xl sm:text-3xl text-white tracking-tight leading-none drop-shadow-md">
              JÓVENES Y ADULTOS
            </h2>
            <p className="text-xs text-slate-200 font-medium leading-tight">
              Sismología, mitos, reflejos de supervivencia y desafío final.
            </p>
          </div>
        </button>

        {/* 4. Quick Access: Historia de San Juan (Full Width Banner) */}
        <div className="pt-1">
          <button
            onClick={() => { sound.playClick(); onNavigate('history'); }}
            className="w-full sismo-card p-4 rounded-2xl border border-brand-cyan/30 bg-navy-950/85 backdrop-blur-md flex items-center justify-between hover:border-brand-cyan/60 transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-navy-900 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shrink-0 shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-left leading-tight">
                <h3 className="font-black text-sm text-white group-hover:text-brand-cyan transition-colors">
                  HISTORIA SÍSMICA DE SAN JUAN
                </h3>
                <span className="text-xs text-slate-300 font-medium block mt-0.5">
                  Conocé los terremotos de 1894, 1944, 1977 y 2021
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-brand-cyan shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
