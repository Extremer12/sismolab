import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Calendar, FileText, Activity, ShieldAlert, ShoppingBag, Users, CheckCircle2 } from 'lucide-react';
import { UserProfile, ScreenId, UserMode } from '../../types';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../theme/ThemeContext';
import { loadFamilyPlan, loadBackpackInventory, calculatePreparednessIndex } from '../../services/familyBackpackService';

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
  const { isDark } = useTheme();

  const [familyPlan] = useState(() => loadFamilyPlan(user.display_name || user.nickname));
  const [backpackItems] = useState(() => loadBackpackInventory(familyPlan.members.length));
  const preparedness = calculatePreparednessIndex(familyPlan, backpackItems);

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
      className={`relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans overflow-x-hidden transition-colors duration-200 ${
        isDark ? 'text-slate-100' : 'text-slate-900'
      }`}
      style={{ backgroundImage: `url('/images/fondoinicio.webp')` }}
    >
      {/* Background Overlay: Deep navy wash in dark mode, clean slate glass wash in light mode */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 transition-colors duration-300 ${
          isDark ? 'bg-navy-950/85' : 'bg-slate-50/92 backdrop-blur-[2px]'
        }`}
      />

      {/* Main Container Layout */}
      <div className="relative z-10 p-4 sm:p-5 space-y-5 pb-24 max-w-md mx-auto">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: Title & Composition with San Juan Silhouette             */}
        {/* ========================================================================= */}
        <div className="relative pt-2 pb-1 px-1 flex items-center justify-between gap-3 overflow-hidden">
          <div className="flex-1 space-y-2 z-10 min-w-0">
            <h1
              className={`font-black text-2xl sm:text-3xl tracking-tight uppercase leading-[1.1] ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {t.home.heroTitle1}<br />
              <span className={isDark ? 'text-brand-cyan' : 'text-cyan-600'}>
                {t.home.heroTitle2}
              </span>
            </h1>

            {/* Subtle Seismic Waveform */}
            <div className="pt-1.5 w-28 opacity-85">
              <svg
                viewBox="0 0 120 18"
                fill="none"
                className={`w-full ${isDark ? 'text-brand-cyan' : 'text-cyan-600'}`}
              >
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
              className={`w-full h-full object-contain filter ${
                isDark
                  ? 'drop-shadow-[0_0_15px_rgba(32,217,245,0.45)]'
                  : 'drop-shadow-[0_4px_12px_rgba(2,132,199,0.3)]'
              }`}
            />
            {/* Animated Epicenter Radar Rings */}
            <div className="absolute top-[52%] left-[53%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <span
                className={`absolute -inset-2.5 rounded-full border-2 opacity-75 animate-ping ${
                  isDark ? 'border-brand-cyan' : 'border-cyan-500'
                }`}
                style={{ animationDuration: '2.5s' }}
              />
              <span
                className={`relative block w-3.5 h-3.5 rounded-full border-2 ${
                  isDark
                    ? 'bg-brand-cyan shadow-glow-cyan border-white'
                    : 'bg-cyan-500 shadow-md border-white'
                }`}
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. ÍNDICE DE PREPARACIÓN FAMILIAR & ACCESOS RÁPIDOS                      */}
        {/* ========================================================================= */}
        <section
          className={`p-4 rounded-2xl border transition-all duration-200 space-y-3 ${
            isDark
              ? 'bg-gradient-to-br from-navy-900 via-navy-900 to-navy-850 border-brand-cyan/25 shadow-card-navy text-white'
              : 'bg-white border-slate-200 shadow-sm text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span
                className={`text-[10px] font-mono font-black uppercase tracking-widest block ${
                  isDark ? 'text-brand-cyan' : 'text-cyan-700'
                }`}
              >
                {language === 'es' ? 'NIVEL DE PROTECCIÓN HOGAR' : 'HOME PROTECTION INDEX'}
              </span>
              <h2
                className={`font-black text-sm uppercase tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {language === 'es' ? 'Preparación Familiar' : 'Family Readiness'}
              </h2>
            </div>
            <div className="text-right">
              <span
                className={`font-mono text-xl font-black tabular-nums block ${
                  isDark ? 'text-brand-cyan' : 'text-cyan-600'
                }`}
              >
                {preparedness.totalScore}%
              </span>
            </div>
          </div>

          {/* Barra de progreso */}
          <div
            className={`w-full h-2 rounded-full overflow-hidden border ${
              isDark ? 'bg-navy-950 border-white/10' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-emerald-400 transition-all duration-500"
              style={{ width: `${preparedness.totalScore}%` }}
            />
          </div>

          {/* Grid de 2 accesos tácticos: Mochila + Familia */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Tarjeta Mochila */}
            <button
              onClick={() => { sound.playClick(); onNavigate('backpack'); }}
              className={`p-3 rounded-xl border text-left transition-all active:scale-95 group ${
                isDark
                  ? 'bg-navy-950/80 border-white/10 hover:border-brand-gold/40 text-white'
                  : 'bg-slate-50 border-slate-200 hover:border-amber-400/60 text-slate-900 shadow-xs'
              }`}
            >
              <div
                className={`flex items-center justify-between mb-1.5 ${
                  isDark ? 'text-brand-gold' : 'text-amber-600'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold">
                  {backpackItems.filter(i => i.is_packed).length}/{backpackItems.length}
                </span>
              </div>
              <h3
                className={`font-black text-xs transition-colors truncate ${
                  isDark ? 'text-white group-hover:text-brand-gold' : 'text-slate-900 group-hover:text-amber-700'
                }`}
              >
                {language === 'es' ? 'Mochila 72h' : 'Emergency Kit'}
              </h3>
              <p
                className={`text-[10px] truncate mt-0.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {preparedness.missingItemsCount > 0 
                  ? (language === 'es' ? `Faltan ${preparedness.missingItemsCount} insumos` : `${preparedness.missingItemsCount} items missing`)
                  : (language === 'es' ? 'Completada 100%' : '100% Ready')}
              </p>
            </button>

            {/* Tarjeta Familia */}
            <button
              onClick={() => { sound.playClick(); onNavigate('family'); }}
              className={`p-3 rounded-xl border text-left transition-all active:scale-95 group ${
                isDark
                  ? 'bg-navy-950/80 border-white/10 hover:border-brand-purple/40 text-white'
                  : 'bg-slate-50 border-slate-200 hover:border-purple-400/60 text-slate-900 shadow-xs'
              }`}
            >
              <div
                className={`flex items-center justify-between mb-1.5 ${
                  isDark ? 'text-purple-300' : 'text-purple-600'
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold">
                  {familyPlan.members.length} {language === 'es' ? 'miembros' : 'members'}
                </span>
              </div>
              <h3
                className={`font-black text-xs transition-colors truncate ${
                  isDark ? 'text-white group-hover:text-purple-300' : 'text-slate-900 group-hover:text-purple-700'
                }`}
              >
                {language === 'es' ? 'Plan Familiar' : 'Family Plan'}
              </h3>
              <p
                className={`text-[10px] truncate mt-0.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {familyPlan.invite_code} · {language === 'es' ? 'Roles listos' : 'Roles set'}
              </p>
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. MONITOR SÍSMICO (datos reales)                                         */}
        {/* ========================================================================= */}
        <button
          onClick={() => { sound.playClick(); onNavigate('seismic'); }}
          className={`w-full p-4 rounded-2xl border flex items-center gap-3.5 text-left active:scale-[0.99] transition-all group ${
            isDark
              ? 'sismo-card-featured'
              : 'bg-white border-slate-200 hover:border-cyan-400/60 shadow-sm'
          }`}
        >
          <div
            className={`relative w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${
              isDark
                ? 'bg-navy-950 border-brand-cyan/30 text-brand-cyan'
                : 'bg-cyan-50 border-cyan-200 text-cyan-600'
            }`}
          >
            <Activity className="w-6 h-6" />
            <span
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 animate-pulse ${
                isDark ? 'border-navy-900' : 'border-white'
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2
              className={`font-black text-base leading-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {language === 'es' ? 'Sismos recientes' : 'Recent earthquakes'}
            </h2>
            <p
              className={`text-xs mt-0.5 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {language === 'es' ? 'Mapa de epicentros en San Juan, Argentina y Chile' : 'Epicenter map for San Juan, Argentina and Chile'}
            </p>
          </div>
          <ChevronRight
            className={`w-5 h-5 shrink-0 group-hover:translate-x-0.5 transition-transform ${
              isDark ? 'text-brand-cyan' : 'text-cyan-600'
            }`}
          />
        </button>

        {/* ========================================================================= */}
        {/* 3. MANUAL DE CONTINGENCIAS Y EMERGENCIAS                                  */}
        {/* ========================================================================= */}
        <button
          onClick={() => { sound.playClick(); onNavigate('preparedness'); }}
          className={`w-full rounded-2xl p-4 border flex items-center gap-3.5 text-left active:scale-[0.99] transition-all group ${
            isDark
              ? 'bg-navy-900/80 border-white/10 hover:border-white/25 text-white'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-sm'
          }`}
        >
          <div
            className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
              isDark
                ? 'bg-navy-950 border-white/15 text-slate-300 group-hover:border-brand-cyan/40 group-hover:text-white'
                : 'bg-slate-100 border-slate-200 text-slate-600 group-hover:border-slate-300 group-hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-5 h-5 stroke-[1.8]" />
          </div>
          <div className="flex-1 min-w-0">
            <span
              className={`text-[10px] font-black uppercase tracking-[0.16em] block ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {language === 'es' ? 'AUTOPROTECCIÓN CIUDADANA' : 'CITIZEN PREPAREDNESS'}
            </span>
            <h2
              className={`font-black text-base tracking-tight leading-tight mt-0.5 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {language === 'es' ? 'Líneas y Manual de Emergencia' : 'Hotlines & Emergency Manual'}
            </h2>
            <p
              className={`text-xs mt-0.5 truncate ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {language === 'es' ? 'Llamada directa 911 / 107 / 103 · Protocolos El Niño' : 'Direct lines 911 / 107 / 103 · El Niño protocols'}
            </p>
          </div>
          <ChevronRight
            className={`w-5 h-5 shrink-0 group-hover:translate-x-0.5 transition-transform ${
              isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-900'
            }`}
          />
        </button>

        {/* ========================================================================= */}
        {/* 3. RECORRIDOS EDUCATIVOS POR EDAD                                        */}
        {/* ========================================================================= */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <h3
              className={`text-xs font-black uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {language === 'es' ? 'Recorridos por edad' : 'Learning paths by age'}
            </h3>
            <span
              className={`text-[11px] font-semibold ${
                isDark ? 'text-slate-500' : 'text-slate-500'
              }`}
            >
              {language === 'es' ? '2 modalidades' : '2 modes'}
            </span>
          </div>

          {/* Tarjeta 1: MODO NIÑOS */}
          <button
            onClick={handleLaunchKids}
            className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.98] group flex items-center justify-between p-4 sm:p-5 text-left bg-cover bg-left min-h-[140px] sm:min-h-[155px] shadow-lg ${
              isDark
                ? 'border-brand-cyan/30 hover:border-brand-cyan'
                : 'border-cyan-300 hover:border-cyan-500'
            }`}
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
            className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.98] group flex items-center justify-between p-4 sm:p-5 text-left bg-cover bg-left min-h-[140px] sm:min-h-[155px] shadow-lg ${
              isDark
                ? 'border-brand-purple/40 hover:border-brand-purple'
                : 'border-purple-300 hover:border-purple-500'
            }`}
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
        {/* 3. RECURSOS COMPLEMENTARIOS: Historia Interactiva + Documento PDF         */}
        {/* ========================================================================= */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between px-1">
            <h3
              className={`text-xs font-black uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {language === 'es' ? 'Memoria y documentos' : 'History & documents'}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Historia San Juan */}
            <button
              onClick={() => { sound.playClick(); onNavigate('history'); }}
              className={`p-3.5 rounded-2xl flex items-center justify-between transition-all active:scale-[0.98] group border ${
                isDark
                  ? 'sismo-card hover:border-brand-cyan/50'
                  : 'bg-white border-slate-200 hover:border-cyan-400/60 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                    isDark
                      ? 'bg-navy-950 border-brand-cyan/30 text-brand-cyan'
                      : 'bg-cyan-50 border-cyan-200 text-cyan-600'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-left leading-tight min-w-0">
                  <h4
                    className={`font-black text-xs sm:text-sm transition-colors truncate ${
                      isDark
                        ? 'text-white group-hover:text-brand-cyan'
                        : 'text-slate-900 group-hover:text-cyan-700'
                    }`}
                  >
                    {t.home.historyTitle}
                  </h4>
                  <span
                    className={`text-[11px] font-medium block mt-0.5 truncate ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {t.home.historyYears}
                  </span>
                </div>
              </div>
              <ChevronRight
                className={`w-4 h-4 shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform ${
                  isDark ? 'text-slate-500 group-hover:text-brand-cyan' : 'text-slate-400 group-hover:text-cyan-600'
                }`}
              />
            </button>

            {/* Documento PDF */}
            <button
              onClick={() => { sound.playClick(); onNavigate('pdf-history'); }}
              className={`p-3.5 rounded-2xl flex items-center justify-between transition-all active:scale-[0.98] group border ${
                isDark
                  ? 'sismo-card hover:border-brand-gold/50'
                  : 'bg-white border-slate-200 hover:border-amber-400/60 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                    isDark
                      ? 'bg-navy-950 border-brand-gold/30 text-brand-gold'
                      : 'bg-amber-50 border-amber-200 text-amber-600'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-left leading-tight min-w-0">
                  <h4
                    className={`font-black text-xs sm:text-sm transition-colors truncate ${
                      isDark
                        ? 'text-brand-yellow group-hover:text-white'
                        : 'text-amber-800 group-hover:text-amber-950'
                    }`}
                  >
                    {t.home.pdfTitle}
                  </h4>
                  <span
                    className={`text-[11px] font-medium block mt-0.5 truncate ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {t.home.pdfDesc}
                  </span>
                </div>
              </div>
              <ChevronRight
                className={`w-4 h-4 shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform ${
                  isDark ? 'text-brand-gold group-hover:text-white' : 'text-amber-600 group-hover:text-amber-800'
                }`}
              />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. FOOTER INSTITUCIONAL                                                  */}
        {/* ========================================================================= */}
        <button
          onClick={() => { sound.playClick(); onNavigate('credits'); }}
          className={`w-full p-3 rounded-2xl border flex items-center justify-between text-xs transition-all group active:scale-[0.99] ${
            isDark
              ? 'sismo-card text-slate-300 hover:text-white hover:border-brand-cyan/40'
              : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:border-slate-300 shadow-sm'
          }`}
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
            <span
              className={`font-bold transition-colors ${
                isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'
              }`}
            >
              {t.home.creditsButton}
            </span>
          </div>
          <ChevronRight
            className={`w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform ${
              isDark ? 'text-slate-400 group-hover:text-brand-cyan' : 'text-slate-400 group-hover:text-slate-900'
            }`}
          />
        </button>

      </div>
    </div>
  );
};
