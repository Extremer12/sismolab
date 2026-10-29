import React, { useState } from 'react';
import {
  ArrowLeft,
  PhoneCall,
  ShieldAlert,
  CloudLightning,
  Waves,
  Wind,
  Bug,
  ZapOff,
  Activity,
  Smartphone,
  Info,
  ChevronDown,
  ExternalLink,
  Flame,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { ScreenId } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../lib/sound';
import {
  EMERGENCY_NUMBERS,
  EL_NINO_IMPACTS,
  HAZARD_GUIDES,
  ANDROID_ALERTS_STEPS,
  NON_AFFILIATION_NOTICE,
  OFFICIAL_SOURCES,
  HazardId,
} from '../../data/emergencyContent';

interface PreparednessPageProps {
  onNavigate: (screen: ScreenId) => void;
}

export const PreparednessPage: React.FC<PreparednessPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const es = language === 'es';

  const [selectedHazardId, setSelectedHazardId] = useState<HazardId>('tormenta');
  const [activeStepTab, setActiveStepTab] = useState<'before' | 'during' | 'after'>('during');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const selectedHazard = HAZARD_GUIDES.find((h) => h.id === selectedHazardId) || HAZARD_GUIDES[0];

  const handleCopy = (num: string) => {
    sound.playClick();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(num).catch(() => {});
    }
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const getHazardIcon = (id: HazardId) => {
    switch (id) {
      case 'tormenta':
        return <CloudLightning className="w-5 h-5 text-sky-400" />;
      case 'aluvion':
        return <Waves className="w-5 h-5 text-amber-400" />;
      case 'sismo':
        return <Activity className="w-5 h-5 text-brand-cyan" />;
      case 'zonda':
        return <Wind className="w-5 h-5 text-orange-400" />;
      case 'dengue':
        return <Bug className="w-5 h-5 text-lime-400" />;
      case 'corte-luz':
        return <ZapOff className="w-5 h-5 text-violet-400" />;
    }
  };

  const getNumberColorClass = (tone: 'red' | 'orange' | 'cyan' | 'emerald') => {
    switch (tone) {
      case 'red':
        return {
          badge: 'bg-red-500/20 text-red-300 border-red-500/40',
          btn: 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]',
          border: 'border-red-500/30 hover:border-red-500/60',
        };
      case 'orange':
        return {
          badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          btn: 'bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]',
          border: 'border-orange-500/30 hover:border-orange-500/60',
        };
      case 'cyan':
        return {
          badge: 'bg-brand-cyan/20 text-cyan-300 border-brand-cyan/40',
          btn: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(32,217,245,0.4)]',
          border: 'border-brand-cyan/30 hover:border-brand-cyan/60',
        };
      case 'emerald':
        return {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          btn: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]',
          border: 'border-emerald-500/30 hover:border-emerald-500/60',
        };
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 p-4 sm:p-6 pb-28 max-w-xl mx-auto font-sans selection:bg-brand-cyan selection:text-navy-950">
      
      {/* 1. Header con botón volver */}
      <header className="flex items-center justify-between pb-4 border-b border-white/10">
        <button
          onClick={() => {
            sound.playClick();
            onNavigate('home');
          }}
          className="w-10 h-10 rounded-full bg-navy-900 border border-white/10 hover:border-brand-cyan/50 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95"
          aria-label={es ? 'Volver al inicio' : 'Back to home'}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-cyan block">
            {es ? 'AUTOPROTECCIÓN CIUDADANA' : 'CITIZEN SELF-PROTECTION'}
          </span>
          <h1 className="font-black text-lg sm:text-xl text-white tracking-tight uppercase">
            {es ? 'Guías y Emergencias' : 'Guides & Emergencies'}
          </h1>
        </div>

        <div className="w-10" />
      </header>

      {/* 2. Sección Números de Emergencia San Juan (Acceso Rápido) */}
      <section className="pt-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-brand-cyan" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-300">
              {es ? 'Números de Emergencia · San Juan' : 'Emergency Numbers · San Juan'}
            </h2>
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {es ? 'Llamada directa 24 h' : 'Direct 24/7 call'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {EMERGENCY_NUMBERS.map((item) => {
            const styles = getNumberColorClass(item.tone);
            const isCopied = copiedNumber === item.number;

            return (
              <div
                key={item.number}
                className={`p-3.5 rounded-2xl bg-navy-900/80 border ${styles.border} flex flex-col justify-between gap-3 transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black text-2xl tracking-tight text-white">
                      {item.number}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${styles.badge}`}>
                      {item.name[language]}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                    {item.description[language]}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`tel:${item.number}`}
                    onClick={() => sound.playClick()}
                    className={`flex-1 py-2 px-3 rounded-xl ${styles.btn} flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-transform active:scale-95`}
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{es ? 'Llamar' : 'Call'}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopy(item.number)}
                    className="p-2 rounded-xl bg-navy-950 border border-white/10 hover:border-brand-cyan/40 text-slate-400 hover:text-white transition-all active:scale-95"
                    title={es ? 'Copiar número' : 'Copy number'}
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Especial: Temporada Súper Niño en San Juan */}
      <section className="pt-6 space-y-3">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-navy-900 via-navy-900 to-sky-950/40 border border-sky-400/30 relative overflow-hidden space-y-3">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-400/20 border border-sky-400/40 text-sky-300 font-black text-[10px] uppercase tracking-wider">
              <CloudLightning className="w-3.5 h-3.5" />
              <span>{es ? 'TEMPORADA CLIMÁTICA' : 'CLIMATE SEASON'}</span>
            </div>
            <span className="text-[11px] font-bold text-sky-200">
              {es ? 'El Niño en San Juan' : 'El Niño in San Juan'}
            </span>
          </div>

          <div>
            <h3 className="font-black text-lg text-white tracking-tight leading-snug">
              {es ? '¿Cómo impacta El Niño en nuestra provincia?' : 'How does El Niño impact our province?'}
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {es
                ? 'A diferencia de otras regiones del país donde desbordan grandes ríos, en San Juan el impacto principal se da en tormentas cortas pero muy intensas, bajadas de creciente en badenes y mayor proliferación de mosquitos.'
                : 'Unlike other regions with major river overflows, San Juan mainly experiences short but intense storms, flash floods in dry fords, and higher mosquito activity.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {EL_NINO_IMPACTS.map((impact, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-navy-950/70 border border-white/5 space-y-1"
              >
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                  <span>{impact.title[language]}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {impact.text[language]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Guías por Amenaza (Antes / Durante / Después) */}
      <section className="pt-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-brand-gold" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-300">
              {es ? 'Protocolos de Autoprotección' : 'Self-Protection Protocols'}
            </h2>
          </div>
          <span className="text-[10px] font-bold text-slate-500">
            {es ? 'Paso a paso oficial' : 'Official step by step'}
          </span>
        </div>

        {/* Selector de amenaza */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {HAZARD_GUIDES.map((hazard) => {
            const isSelected = hazard.id === selectedHazardId;
            return (
              <button
                key={hazard.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedHazardId(hazard.id);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all shrink-0 ${
                  isSelected
                    ? 'bg-brand-cyan text-navy-950 font-black shadow-glow-cyan'
                    : 'bg-navy-900 border border-white/10 text-slate-300 hover:text-white hover:border-white/20'
                }`}
              >
                {getHazardIcon(hazard.id)}
                <span>{hazard.title[language]}</span>
              </button>
            );
          })}
        </div>

        {/* Ficha interactiva de la amenaza seleccionada */}
        <div className="p-4 sm:p-5 rounded-2xl bg-navy-900/90 border border-white/10 space-y-4">
          
          {/* Encabezado de la amenaza */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                  {selectedHazard.season[language]}
                </span>
              </div>
              <h3 className="font-black text-xl text-white tracking-tight mt-1">
                {selectedHazard.title[language]}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {selectedHazard.subtitle[language]}
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-navy-950 border border-white/10 flex items-center justify-center shrink-0">
              {getHazardIcon(selectedHazard.id)}
            </div>
          </div>

          {/* Regla de oro destacada */}
          <div className={`p-3.5 rounded-xl border ${selectedHazard.accent.border} ${selectedHazard.accent.bg} space-y-1`}>
            <span className={`text-[10px] font-black uppercase tracking-wider block ${selectedHazard.accent.text}`}>
              ⚡ {es ? 'REGLA DE ORO' : 'GOLDEN RULE'}
            </span>
            <p className="text-xs sm:text-sm font-bold text-white leading-snug">
              {selectedHazard.keyRule[language]}
            </p>
          </div>

          {/* Pestañas: Antes / Durante / Después */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-navy-950 border border-white/5 text-center">
            {(['before', 'during', 'after'] as const).map((tab) => {
              const active = activeStepTab === tab;
              const labels = {
                before: { es: '1. Antes', en: '1. Before' },
                during: { es: '2. Durante', en: '2. During' },
                after: { es: '3. Después', en: '3. After' },
              };
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveStepTab(tab);
                  }}
                  className={`py-1.5 rounded-lg text-xs font-black transition-all ${
                    active
                      ? 'bg-brand-cyan text-navy-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {labels[tab][language]}
                </button>
              );
            })}
          </div>

          {/* Lista de pautas */}
          <div className="space-y-2 pt-1 min-h-[140px]">
            {selectedHazard[activeStepTab].map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-navy-950/60 border border-white/5"
              >
                <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {step[language]}
                </p>
              </div>
            ))}
          </div>

          {/* Fuente del protocolo */}
          <div className="pt-2 text-[10px] text-slate-500 font-semibold border-t border-white/5 flex items-center justify-between">
            <span>{es ? 'Fuente de referencia:' : 'Reference source:'}</span>
            <span className="text-slate-400">{selectedHazard.sources}</span>
          </div>

        </div>
      </section>

      {/* 5. Alertas de Terremotos de Android (Google) */}
      <section className="pt-6 space-y-3">
        <div className="p-4 sm:p-5 rounded-2xl bg-navy-900/90 border border-brand-cyan/30 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-cyan block">
                {es ? 'FUNCIÓN OFICIAL DE ANDROID' : 'OFFICIAL ANDROID FEATURE'}
              </span>
              <h3 className="font-black text-sm sm:text-base text-white">
                {es ? 'Activá las Alertas de Sismos en tu celular' : 'Enable Earthquake Alerts on your phone'}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {es
              ? 'El Sistema de Alertas de Terremotos de Android está disponible en Argentina y utiliza los sensores del teléfono para detectar sismos con segundos de anticipación. Te recomendamos comprobar que esté encendido:'
              : 'The Android Earthquake Alerts System is available in Argentina and uses phone sensors to warn you seconds before shaking arrives. Check that it is turned on:'}
          </p>

          <ol className="space-y-2 pt-1">
            {ANDROID_ALERTS_STEPS.map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-xs text-slate-200 bg-navy-950/60 p-2.5 rounded-xl border border-white/5"
              >
                <span className="w-5 h-5 rounded-full bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 font-black text-[11px] flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step[language]}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. Fuentes Oficiales y Descargo de Responsabilidad (Exigencia Google Play) */}
      <section className="pt-6 space-y-3">
        <div className="p-4 rounded-2xl bg-navy-900/50 border border-white/10 space-y-3 text-left">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
            <Info className="w-4 h-4 text-brand-yellow shrink-0" />
            <span>{es ? 'Fuentes Oficiales & Transparencia' : 'Official Sources & Transparency'}</span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            {NON_AFFILIATION_NOTICE[language]}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-white/5">
            {OFFICIAL_SOURCES.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-navy-950/60 border border-white/5 hover:border-brand-cyan/40 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-all group"
              >
                <div className="min-w-0 pr-1">
                  <span className="font-bold text-[11px] block truncate">{source.name}</span>
                  <span className="text-[10px] text-slate-500 block">{source.topic[language]}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-cyan shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Botón para volver */}
      <div className="pt-6">
        <button
          onClick={() => {
            sound.playClick();
            onNavigate('home');
          }}
          className="w-full py-3.5 rounded-full bg-navy-900 border border-white/10 hover:border-brand-cyan text-slate-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 hover:text-white active:scale-98"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{es ? 'Volver al inicio' : 'Back to home'}</span>
        </button>
      </div>

    </div>
  );
};
