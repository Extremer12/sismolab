import React from 'react';
import { ArrowRight, ChevronRight, Calendar, FileText, Play, CheckCircle2, Target, Trophy } from 'lucide-react';
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
  const { t, language } = useLanguage();

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

  // 1. Calculate user's seismic learning progression
  const completedIds = user.completed_game_ids || [];
  const totalMissions = 6;
  const completedCount = Math.min(totalMissions, completedIds.length);
  const progressPercent = Math.round((completedCount / totalMissions) * 100);

  // 2. Determine next pedagogical mission based on completed activities
  const getNextMission = (): {
    id: ScreenId;
    title: string;
    stepNumber: number;
    category: string;
    desc: string;
    iconEmoji: string;
  } => {
    if (!completedIds.includes('game-what-is')) {
      return {
        id: 'game-what-is',
        stepNumber: 1,
        title: language === 'es' ? '¿Qué es un sismo?' : 'What is an Earthquake?',
        category: language === 'es' ? 'Fundamentos' : 'Basics',
        desc: language === 'es'
          ? 'Comprendé cómo se originan las fallas geológicas y las ondas sísmicas en San Juan.'
          : 'Understand how geological faults and seismic waves originate in San Juan.',
        iconEmoji: '🌍'
      };
    }
    if (!completedIds.includes('game-emergency-kit')) {
      return {
        id: 'game-emergency-kit',
        stepNumber: 2,
        title: language === 'es' ? 'Mochila de Emergencia' : 'Emergency Backpack',
        category: language === 'es' ? 'Preparación' : 'Preparedness',
        desc: language === 'es'
          ? 'Aprendé a equipar los suministros indispensables para resistir 72 horas.'
          : 'Learn to pack the essential supplies to endure 72 hours safely.',
        iconEmoji: '🎒'
      };
    }
    if (!completedIds.includes('game-safe-home')) {
      return {
        id: 'game-safe-home',
        stepNumber: 3,
        title: language === 'es' ? 'Inspección de Casa Segura' : 'Safe Home Inspection',
        category: language === 'es' ? 'Prevención' : 'Prevention',
        desc: language === 'es'
          ? 'Detectá riesgos estructurales en el hogar y asegurá objetos peligrosos.'
          : 'Detect structural hazards at home and secure heavy objects before a quake.',
        iconEmoji: '🏠'
      };
    }
    if (!completedIds.includes('game-myth-reality')) {
      return {
        id: 'game-myth-reality',
        stepNumber: 4,
        title: language === 'es' ? 'Mitos y Realidades' : 'Myths & Realities',
        category: language === 'es' ? 'Conocimiento' : 'Knowledge',
        desc: language === 'es'
          ? 'Derribá creencias falsas y aprendé las conductas científicamente validadas.'
          : 'Debunk misconceptions and learn scientifically proven safety protocols.',
        iconEmoji: '🔍'
      };
    }
    if (!completedIds.includes('game-what-would-you-do')) {
      return {
        id: 'game-what-would-you-do',
        stepNumber: 5,
        title: language === 'es' ? 'Toma de Decisiones' : 'Decision Making',
        category: language === 'es' ? 'Reacción' : 'Reaction',
        desc: language === 'es'
          ? 'Reaccioná a tiempo: agacharse, cubrirse, sujetarse y buscar zonas seguras.'
          : 'React in time: drop, cover, hold on, and identify safe zones.',
        iconEmoji: '⚡'
      };
    }
    return {
      id: 'game-final-challenge',
      stepNumber: 6,
      title: language === 'es' ? 'Desafío Sísmico Final' : 'Final Seismic Challenge',
      category: language === 'es' ? 'Evaluación' : 'Mastery',
      desc: language === 'es'
        ? '¡Poné a prueba tu preparación total y consolidá tu puntaje máximo en el ranking!'
        : 'Test your total preparedness and lock in your top ranking score!',
      iconEmoji: '🏆'
    };
  };

  const nextMission = getNextMission();

  const handleLaunchMission = (screenId: ScreenId) => {
    sound.playClick();
    onNavigate(screenId);
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 overflow-x-hidden"
      style={{ backgroundImage: `url('/images/fondoinicio.webp')` }}
    >
      {/* Background Dark Overlay with Soft Vignette */}
      <div className="fixed inset-0 bg-navy-950/85 pointer-events-none z-0" />

      {/* Main Container Layout */}
      <div className="relative z-10 p-4 sm:p-5 space-y-5 pb-24 max-w-md mx-auto">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: Title & Composition with San Juan Silhouette             */}
        {/* ========================================================================= */}
        <div className="relative pt-2 pb-1 px-1 flex items-center justify-between gap-3 overflow-hidden">
          <div className="flex-1 space-y-2 z-10 min-w-0">
            <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight uppercase leading-[1.1]">
              {t.home.heroTitle1}<br />
              <span className="text-brand-cyan">{t.home.heroTitle2}</span>
            </h1>

            <p className="text-sm text-slate-300 font-medium leading-snug">
              {t.home.heroDesc}{' '}
              <button
                onClick={() => { sound.playClick(); onNavigate('ranking'); }}
                className="text-brand-yellow font-bold underline decoration-brand-yellow/60 hover:text-white transition-colors"
              >
                {t.home.rankingLink}
              </button>
            </p>

            {/* Subtle Seismic Waveform */}
            <div className="pt-1 w-28 opacity-80">
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

          {/* San Juan Map Silhouette */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 relative shrink-0 flex items-center justify-center">
            <img
              src="/images/sanjuanforma.webp"
              alt="Mapa de San Juan"
              className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(32,217,245,0.45)]"
            />
            {/* Animated Epicenter Radar Rings */}
            <div className="absolute top-[52%] left-[53%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <span className="absolute -inset-2.5 rounded-full border-2 border-brand-cyan opacity-75 animate-ping" style={{ animationDuration: '2.5s' }} />
              <span className="relative block w-3.5 h-3.5 rounded-full bg-brand-cyan shadow-glow-cyan border-2 border-white" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. CONTINUAR APRENDIENDO / PRÓXIMA MISIÓN (Centro Pedagógico)            */}
        {/* ========================================================================= */}
        <div className="sismo-card-featured p-4 sm:p-5 space-y-3.5 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-brand-cyan/15 rounded-full blur-2xl pointer-events-none" />

          {/* Header Row: Badge & Progress Percentage */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/15 border border-brand-cyan/35 text-brand-cyan font-black text-xs uppercase tracking-wider">
              <Target className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{t.home.continueLearningBadge}</span>
            </div>

            <span className="text-xs font-black text-slate-300 tabular-nums">
              {completedCount}/{totalMissions} ({progressPercent}%)
            </span>
          </div>

          {/* Mission Content */}
          <div className="flex items-start gap-3.5 pt-0.5">
            <div className="w-12 h-12 rounded-2xl bg-navy-950 border border-brand-cyan/30 flex items-center justify-center text-2xl shrink-0 shadow-inner">
              {nextMission.iconEmoji}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-brand-cyan">
                  {nextMission.category}
                </span>
                <span className="text-slate-500 text-xs">·</span>
                <span className="text-[11px] font-bold text-slate-400">
                  {language === 'es' ? `Misión ${nextMission.stepNumber} de 6` : `Mission ${nextMission.stepNumber} of 6`}
                </span>
              </div>
              
              <h2 className="font-black text-base sm:text-lg text-white tracking-tight leading-snug mt-0.5">
                {nextMission.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mt-1">
                {nextMission.desc}
              </p>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-400">
              <span>{t.home.overallProgress}</span>
              <span className="text-brand-cyan">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-navy-950/90 border border-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-cyan via-brand-cyan to-brand-electric transition-all duration-500 shadow-glow-cyan"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>
          </div>

          {/* Primary Action Button (CTA Continuar Aprendiendo) */}
          <button
            onClick={() => handleLaunchMission(nextMission.id)}
            className="w-full sismo-btn-primary flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition-all duration-200 mt-2"
          >
            <Play className="w-4 h-4 fill-navy-950" />
            <span>{progressPercent === 100 ? (language === 'es' ? 'Repasar Misión' : 'Review Mission') : t.home.continueLearningTitle}</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 3. RECORRIDOS EDUCATIVOS POR EDAD                                        */}
        {/* ========================================================================= */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {language === 'es' ? 'Recorridos por edad' : 'Learning paths by age'}
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">
              {language === 'es' ? '2 modalidades' : '2 modes'}
            </span>
          </div>

          {/* Tarjeta 1: MODO NIÑOS */}
          <button
            onClick={handleLaunchKids}
            className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-cyan/30 hover:border-brand-cyan transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.98] group flex items-center justify-between p-4 sm:p-5 text-left bg-cover bg-left min-h-[140px] sm:min-h-[155px] shadow-lg"
            style={{ backgroundImage: `url('/images/fondocardniños.webp')` }}
          >
            {/* Contrast Gradient Overlay */}
            <div className="absolute inset-y-0 right-0 w-3/5 bg-gradient-to-l from-navy-950/95 via-navy-950/60 to-transparent z-0 pointer-events-none" />

            <div className="relative z-10 w-[58%] ml-auto flex flex-col justify-center text-left space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan font-black text-[10px] uppercase tracking-wider">
                  {t.home.kidsCardBadge}
                </span>
                <span className="w-8 h-8 rounded-full bg-brand-cyan text-navy-950 flex items-center justify-center font-bold text-xs shadow-glow-cyan group-hover:translate-x-1 transition-transform shrink-0 ml-1">
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </span>
              </div>

              <h2 className="font-black text-xl sm:text-2xl text-white tracking-tight leading-tight">
                {t.home.kidsCardTitle} <span className="text-brand-cyan">{t.home.kidsCardSpan}</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
                {t.home.kidsCardDesc}
              </p>
            </div>
          </button>

          {/* Tarjeta 2: MODO JÓVENES Y ADULTOS */}
          <button
            onClick={handleLaunchAdults}
            className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-purple/40 hover:border-brand-purple transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.98] group flex items-center justify-between p-4 sm:p-5 text-left bg-cover bg-left min-h-[140px] sm:min-h-[155px] shadow-lg"
            style={{ backgroundImage: `url('/images/fondocardjovenesyadultos.webp')` }}
          >
            {/* Contrast Gradient Overlay */}
            <div className="absolute inset-y-0 right-0 w-3/5 bg-gradient-to-l from-navy-950/95 via-purple-950/60 to-transparent z-0 pointer-events-none" />

            <div className="relative z-10 w-[58%] ml-auto flex flex-col justify-center text-left space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-purple/25 border border-brand-purple/50 text-purple-300 font-black text-[10px] uppercase tracking-wider">
                  {t.home.adultsCardBadge}
                </span>
                <span className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold text-xs shadow-glow-purple group-hover:translate-x-1 transition-transform shrink-0 ml-1">
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </span>
              </div>

              <h2 className="font-black text-xl sm:text-2xl text-white tracking-tight leading-tight">
                {t.home.adultsCardTitle} <span className="text-purple-300">{t.home.adultsCardSpan}</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
                {t.home.adultsCardDesc}
              </p>
            </div>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 4. RECURSOS COMPLEMENTARIOS: Historia Interactiva + Documento PDF         */}
        {/* ========================================================================= */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {language === 'es' ? 'Memoria y documentos' : 'History & documents'}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Historia San Juan */}
            <button
              onClick={() => { sound.playClick(); onNavigate('history'); }}
              className="sismo-card p-3.5 rounded-2xl flex items-center justify-between hover:border-brand-cyan/50 transition-all active:scale-[0.98] group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-navy-950 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-left leading-tight min-w-0">
                  <h4 className="font-black text-xs sm:text-sm text-white group-hover:text-brand-cyan transition-colors truncate">
                    {t.home.historyTitle}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium block mt-0.5 truncate">
                    {t.home.historyYears}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-brand-cyan shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Documento PDF */}
            <button
              onClick={() => { sound.playClick(); onNavigate('pdf-history'); }}
              className="sismo-card p-3.5 rounded-2xl flex items-center justify-between hover:border-brand-gold/50 transition-all active:scale-[0.98] group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-navy-950 border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-left leading-tight min-w-0">
                  <h4 className="font-black text-xs sm:text-sm text-brand-yellow group-hover:text-white transition-colors truncate">
                    {t.home.pdfTitle}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium block mt-0.5 truncate">
                    {t.home.pdfDesc}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-brand-gold group-hover:text-white shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. FOOTER INSTITUCIONAL                                                  */}
        {/* ========================================================================= */}
        <button
          onClick={() => { sound.playClick(); onNavigate('credits'); }}
          className="w-full p-3 rounded-2xl sismo-card flex items-center justify-between text-xs text-slate-300 hover:text-white hover:border-brand-cyan/40 transition-all group active:scale-[0.99]"
        >
          <div className="flex items-center gap-2.5">
            <img
              src="/images/logozioncode-sinfondo.webp"
              alt="Zion Code"
              className="w-6 h-6 object-contain shrink-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/logozioncode-sinfondo.png';
              }}
            />
            <span className="font-bold text-slate-300 group-hover:text-white">
              {t.home.creditsButton}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-cyan group-hover:translate-x-0.5 transition-transform" />
        </button>

      </div>
    </div>
  );
};
