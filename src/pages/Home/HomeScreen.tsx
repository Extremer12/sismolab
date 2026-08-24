import React from 'react';
import { ArrowRight, ChevronRight, Calendar, MapPin } from 'lucide-react';
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
    <div className="relative min-h-screen select-none font-sans overflow-x-hidden">
      {/* 1. Fullscreen Fixed Background Image fondoinicio.png */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 scale-100"
        style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
      />
      {/* Subtle overlay to guarantee crisp contrast for cards */}
      <div className="fixed inset-0 bg-navy-950/40 pointer-events-none z-0" />

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

        {/* 3. Card 1: MODO NIÑOS (Text placed on the right 55% of the card, completely clear of the character) */}
        <button
          onClick={handleLaunchKids}
          className="w-full relative overflow-hidden rounded-3xl p-4 sm:p-5 text-left border-2 border-brand-cyan/60 shadow-[0_8px_30px_rgba(0,184,255,0.3)] flex items-center justify-between group active:scale-[0.98] transition-all bg-cover bg-left min-h-[140px]"
          style={{
            backgroundImage: `url('/images/fondocardniños.png')`,
            backgroundPosition: 'left center',
            backgroundSize: 'cover'
          }}
        >
          {/* Right Content Area: Aligned to the right half */}
          <div className="relative z-10 w-[55%] ml-auto pr-1 text-left space-y-0.5">
            <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest block drop-shadow-md">
              AVENTURA
            </span>
            <h2 className="font-black text-lg sm:text-xl text-white tracking-tight leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              MODO <span className="text-brand-cyan">NIÑOS</span>
            </h2>
            <p className="text-xs text-slate-100 font-medium leading-snug drop-shadow-md">
              Desafíos y juegos.
            </p>
          </div>

          {/* Circular Action Arrow Button */}
          <div className="relative z-10 w-11 h-11 rounded-full bg-navy-950/85 border-2 border-brand-cyan text-brand-cyan flex items-center justify-center shadow-glow-cyan group-hover:bg-brand-cyan group-hover:text-navy-950 transition-all shrink-0 ml-1">
            <ArrowRight className="w-5 h-5 stroke-[2.8]" />
          </div>
        </button>

        {/* 4. Card 2: JÓVENES Y ADULTOS (Text placed on the right 55% of the card, completely clear of the character) */}
        <button
          onClick={handleLaunchAdults}
          className="w-full relative overflow-hidden rounded-3xl p-4 sm:p-5 text-left border-2 border-brand-purple/70 shadow-[0_8px_30px_rgba(124,58,237,0.35)] flex items-center justify-between group active:scale-[0.98] transition-all bg-cover bg-left min-h-[140px]"
          style={{
            backgroundImage: `url('/images/fondocardjovenesyadultos.png')`,
            backgroundPosition: 'left center',
            backgroundSize: 'cover'
          }}
        >
          {/* Right Content Area: Aligned to the right half */}
          <div className="relative z-10 w-[55%] ml-auto pr-1 text-left space-y-0.5">
            <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest block drop-shadow-md">
              CIENCIA
            </span>
            <h2 className="font-black text-lg sm:text-xl text-white tracking-tight leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              JÓVENES Y <span className="text-purple-300">ADULTOS</span>
            </h2>
            <p className="text-xs text-slate-100 font-medium leading-snug drop-shadow-md">
              Datos y prevención.
            </p>
          </div>

          {/* Circular Action Arrow Button */}
          <div className="relative z-10 w-11 h-11 rounded-full bg-navy-950/85 border-2 border-brand-purple text-purple-300 flex items-center justify-center shadow-glow-purple group-hover:bg-brand-purple group-hover:text-white transition-all shrink-0 ml-1">
            <ArrowRight className="w-5 h-5 stroke-[2.8]" />
          </div>
        </button>

        {/* 5. Quick Access Cards Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Historia San Juan */}
          <button
            onClick={() => { sound.playClick(); onNavigate('history'); }}
            className="sismo-card p-3.5 rounded-2xl border border-brand-cyan/20 bg-navy-950/80 backdrop-blur-md flex items-center justify-between hover:border-brand-cyan/50 transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-navy-900 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight">
                <h3 className="font-bold text-xs text-white group-hover:text-brand-cyan transition-colors">
                  HISTORIA DE SAN JUAN
                </h3>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                  1894, 1944 y 1977
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-cyan shrink-0 ml-1" />
          </button>

          {/* Mapa de Sismos */}
          <button
            onClick={() => { sound.playClick(); onNavigate('seismic-map'); }}
            className="sismo-card p-3.5 rounded-2xl border border-brand-cyan/20 bg-navy-950/80 backdrop-blur-md flex items-center justify-between hover:border-brand-cyan/50 transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-navy-900 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight">
                <h3 className="font-bold text-xs text-white group-hover:text-brand-cyan transition-colors">
                  MAPA DE SISMOS
                </h3>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                  Epicentros y fallas
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-cyan shrink-0 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
