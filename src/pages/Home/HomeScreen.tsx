import React from 'react';
import { ArrowRight, ChevronRight, Calendar, FileText, Sparkles } from 'lucide-react';
import { UserProfile, ScreenId, UserMode } from '../../types';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';

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
  const { t } = useLanguage();

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
              {t.home.heroTitle1}<br />
              <span className="text-brand-electric">{t.home.heroTitle2}</span>
            </h1>

            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              {t.home.heroDesc}{' '}
              <button
                onClick={() => { sound.playClick(); onNavigate('ranking'); }}
                className="text-brand-yellow font-bold underline decoration-brand-yellow/60 hover:text-white transition-colors"
              >
                {t.home.rankingLink}
              </button>{' '}
              {t.ranking.subtitle.includes('San Juan') ? 'de la feria.' : 'now.'}
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
          className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-cyan/40 hover:border-brand-cyan transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group flex items-center justify-between p-4 sm:p-5 text-left bg-cover bg-left min-h-[140px] sm:min-h-[155px]"
          style={{ backgroundImage: `url('/images/fondocardniños.png')` }}
        >
          {/* Subtle gradient on the right side to ensure optimal text contrast */}
          <div className="absolute inset-y-0 right-0 w-3/5 bg-gradient-to-l from-navy-950/85 via-navy-950/40 to-transparent z-0 pointer-events-none" />

          {/* Right Content Area: Perfectly placed on the right 56% of the card */}
          <div className="relative z-10 w-[56%] ml-auto flex flex-col justify-center text-left space-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan font-black text-[9.5px] uppercase tracking-wider">
                {t.home.kidsCardBadge}
              </span>
              <span className="w-7 h-7 rounded-full bg-brand-cyan text-navy-950 flex items-center justify-center font-bold text-xs shadow-glow-cyan group-hover:translate-x-1 transition-transform shrink-0 ml-1">
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            </div>

            <h2 className="font-black text-xl sm:text-2xl text-white tracking-tight leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {t.home.kidsCardTitle} <span className="text-brand-cyan">{t.home.kidsCardSpan}</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-200 font-medium leading-tight drop-shadow-md">
              {t.home.kidsCardDesc}
            </p>
          </div>
        </button>

        {/* 3. Secondary Game Mode: JÓVENES Y ADULTOS (Card 2) */}
        <button
          onClick={handleLaunchAdults}
          className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-purple/40 hover:border-brand-purple transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group flex items-center justify-between p-4 sm:p-5 text-left bg-cover bg-left min-h-[140px] sm:min-h-[155px]"
          style={{ backgroundImage: `url('/images/fondocardjovenesyadultos.png')` }}
        >
          {/* Subtle gradient on the right side to ensure optimal text contrast */}
          <div className="absolute inset-y-0 right-0 w-3/5 bg-gradient-to-l from-navy-950/85 via-purple-950/40 to-transparent z-0 pointer-events-none" />

          {/* Right Content Area: Perfectly placed on the right 56% of the card */}
          <div className="relative z-10 w-[56%] ml-auto flex flex-col justify-center text-left space-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-purple-300 font-black text-xs uppercase tracking-wider">
                {t.home.adultsCardBadge}
              </span>
              <span className="w-7 h-7 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold text-xs shadow-glow-purple group-hover:translate-x-1 transition-transform shrink-0 ml-1">
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            </div>

            <h2 className="font-black text-xl sm:text-2xl text-white tracking-tight leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {t.home.adultsCardTitle} <span className="text-purple-300">{t.home.adultsCardSpan}</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-200 font-medium leading-tight drop-shadow-md">
              {t.home.adultsCardDesc}
            </p>
          </div>
        </button>

        {/* 4. Quick Access Grid: Historia Interactiva + Documento PDF */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Historia San Juan */}
          <button
            onClick={() => { sound.playClick(); onNavigate('history'); }}
            className="sismo-card p-3.5 rounded-2xl border border-brand-cyan/25 bg-navy-950/85 backdrop-blur-md flex items-center justify-between hover:border-brand-cyan/60 transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-navy-900 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shrink-0">
                <Calendar className="w-4.5 h-4.5" />
              </div>
              <div className="text-left leading-tight">
                <h3 className="font-black text-xs text-white group-hover:text-brand-cyan transition-colors">
                  {t.home.historyTitle}
                </h3>
                <span className="text-[10px] text-slate-300 font-medium block mt-0.5">
                  {t.home.historyYears}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-cyan shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Documento PDF para Leer o Descargar */}
          <button
            onClick={() => { sound.playClick(); onNavigate('pdf-history'); }}
            className="sismo-card p-3.5 rounded-2xl border border-brand-gold/30 bg-navy-950/85 backdrop-blur-md flex items-center justify-between hover:border-brand-gold/60 transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-navy-900 border border-brand-gold/40 flex items-center justify-center text-brand-gold shrink-0">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <div className="text-left leading-tight">
                <h3 className="font-black text-xs text-brand-yellow group-hover:text-white transition-colors">
                  {t.home.pdfTitle}
                </h3>
                <span className="text-[10px] text-slate-300 font-medium block mt-0.5">
                  {t.home.pdfDesc}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-brand-gold group-hover:text-white shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 5. Institutional Credits Banner (Escuela Policía Federal Argentina & Zion Code) */}
        <button
          onClick={() => { sound.playClick(); onNavigate('credits'); }}
          className="w-full p-3 rounded-2xl bg-navy-900/80 border border-brand-purple/30 hover:border-brand-purple/70 flex items-center justify-between text-xs text-slate-300 transition-all shadow-sm group active:scale-98"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span className="font-bold text-slate-200 group-hover:text-white">
              {t.home.creditsButton}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-purple-300 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
