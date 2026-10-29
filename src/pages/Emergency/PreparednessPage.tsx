import React, { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  CloudLightning,
  Waves,
  Activity,
  Wind,
  Bug,
  ZapOff,
  Smartphone,
  Info,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileCheck
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

type PreparednessSection = 'emergency' | 'protocols' | 'elnino' | 'alerts';

export const PreparednessPage: React.FC<PreparednessPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const es = language === 'es';

  // State: Tab de navegación principal
  const [currentSection, setCurrentSection] = useState<PreparednessSection>('emergency');
  
  // State: Amenaza activa
  const [selectedHazardId, setSelectedHazardId] = useState<HazardId>('tormenta');
  
  // State: Fase de acción (Antes / Durante / Después)
  const [activePhase, setActivePhase] = useState<'before' | 'during' | 'after'>('during');

  // State: Feedback visual al copiar número
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
          num: 'text-red-400',
          badge: 'bg-red-500/15 text-red-300 border-red-500/30',
          btn: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.35)]',
          border: 'border-red-500/25 hover:border-red-500/60 bg-gradient-to-b from-navy-900/95 to-red-950/20',
          indicator: 'bg-red-500',
        };
      case 'orange':
        return {
          num: 'text-orange-400',
          badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
          btn: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.35)]',
          border: 'border-orange-500/25 hover:border-orange-500/60 bg-gradient-to-b from-navy-900/95 to-orange-950/20',
          indicator: 'bg-orange-500',
        };
      case 'cyan':
        return {
          num: 'text-brand-cyan',
          badge: 'bg-brand-cyan/15 text-cyan-200 border-brand-cyan/30',
          btn: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(32,217,245,0.35)]',
          border: 'border-brand-cyan/25 hover:border-brand-cyan/60 bg-gradient-to-b from-navy-900/95 to-cyan-950/20',
          indicator: 'bg-brand-cyan',
        };
      case 'emerald':
        return {
          num: 'text-emerald-400',
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          btn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)]',
          border: 'border-emerald-500/25 hover:border-emerald-500/60 bg-gradient-to-b from-navy-900/95 to-emerald-950/20',
          indicator: 'bg-emerald-500',
        };
    }
  };

  const sections = [
    { id: 'emergency' as PreparednessSection, code: '01', label: es ? 'Líneas SOS' : 'Hotlines', color: 'text-red-400' },
    { id: 'protocols' as PreparednessSection, code: '02', label: es ? 'Protocolos' : 'Protocols', color: 'text-brand-cyan' },
    { id: 'elnino' as PreparednessSection, code: '03', label: es ? 'El Niño' : 'El Niño', color: 'text-sky-400' },
    { id: 'alerts' as PreparednessSection, code: '04', label: es ? 'Alerta Móvil' : 'Mobile Alert', color: 'text-brand-yellow' },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-brand-cyan selection:text-navy-950 relative overflow-x-hidden">
      
      {/* Luces ambientales de fondo con sutil desenfoque */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* ========================================================================= */}
      {/* 1. TOP HEADER INSTITUCIONAL CON ESTILO EDITORIAL                          */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 bg-navy-950/90 backdrop-blur-xl border-b border-brand-cyan/15">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('home');
            }}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors group"
            aria-label={es ? 'Volver al inicio' : 'Back to home'}
          >
            <div className="w-8 h-8 rounded-xl bg-navy-900 border border-white/10 group-hover:border-brand-cyan/40 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:text-white" />
            </div>
            <span>{es ? 'Inicio' : 'Home'}</span>
          </button>

          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-cyan font-mono">
                SISTEMA ACTIVO
              </span>
            </div>
            <span className="text-xs font-black text-white tracking-tight block">
              San Juan · Protección Civil
            </span>
          </div>
        </div>

        {/* Selector de vistas con color y dinamismo */}
        <div className="max-w-2xl mx-auto px-4 pb-2.5 pt-1">
          <nav className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-navy-900/90 border border-brand-cyan/20 shadow-card-navy">
            {sections.map((sec) => {
              const isActive = currentSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    sound.playClick();
                    setCurrentSection(sec.id);
                  }}
                  className={`py-2 px-1 text-center rounded-xl transition-all duration-200 flex flex-col items-center justify-center relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-b from-navy-800 to-navy-950 text-white font-black border border-brand-cyan/40 shadow-glow-cyan/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 font-semibold'
                  }`}
                >
                  <span className={`text-[9px] font-mono tracking-widest ${isActive ? sec.color : 'text-slate-500'}`}>
                    {sec.code}
                  </span>
                  <span className="text-[11px] uppercase tracking-tight mt-0.5 truncate w-full">
                    {sec.label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-brand-cyan shadow-glow-cyan" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. CONTENIDO PRINCIPAL POR VISTAS (NO SCROLL INTERMINABLE)                 */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 pb-24 z-10">
        
        {/* ----------------------------------------------------------------------- */}
        {/* VISTA 01: LÍNEAS DE ASISTENCIA Y DESPACHO INMEDIATO                     */}
        {/* ----------------------------------------------------------------------- */}
        {currentSection === 'emergency' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* Título de impacto visual */}
            <div className="space-y-1.5 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-red-400 font-black">
                  SECCIÓN 01 / DESPACHO DE URGENCIAS
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                {es ? 'Central de Emergencias San Juan' : 'San Juan Emergency Dispatch'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-lg">
                {es
                  ? 'Líneas oficiales gratuitas de atención las 24 horas. Toque el botón de llamada para comunicarse directamente con la guardia de guardia activa.'
                  : 'Official 24/7 free toll numbers. Tap the call button to connect directly with the active dispatch unit.'}
              </p>
            </div>

            {/* Listado de Números Tácticos (Diseño con Identidad y Color) */}
            <div className="space-y-3.5">
              {EMERGENCY_NUMBERS.map((item) => {
                const isCopied = copiedNumber === item.number;
                const styles = getNumberColorClass(item.tone);

                return (
                  <div
                    key={item.number}
                    className={`p-4 sm:p-5 rounded-2xl border ${styles.border} flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:shadow-lg`}
                  >
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-3xl sm:text-4xl font-black tracking-tight tabular-nums ${styles.num}`}>
                          {item.number}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${styles.badge}`}>
                          {item.name[language]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-md">
                        {item.description[language]}
                      </p>
                    </div>

                    {/* Botones de acción táctiles */}
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`tel:${item.number}`}
                        onClick={() => sound.playClick()}
                        className={`flex-1 sm:flex-initial py-2.5 px-6 rounded-xl ${styles.btn} font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95`}
                      >
                        <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{es ? 'Llamar' : 'Call'}</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleCopy(item.number)}
                        className="py-2.5 px-3 rounded-xl border border-white/15 bg-navy-950/70 hover:border-brand-cyan/40 text-slate-300 hover:text-white transition-all text-xs font-mono active:scale-95"
                        title={es ? 'Copiar número' : 'Copy number'}
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Protocolo de comunicación en crisis con acento ámbar */}
            <div className="p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-navy-900/90 to-navy-900/90 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300">
                <Radio className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase tracking-widest font-black">
                  {es ? 'DIRECTIVA OFICIAL DE COMUNICACIÓN' : 'OFFICIAL COMMUNICATIONS DIRECTIVE'}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {es
                  ? 'Ante eventos sísmicos severos o tormentas mayores, las redes telefónicas de voz colapsan rápidamente. Priorice mensajes de texto SMS o aplicaciones de mensajería para dejar libres las líneas satelitales de bomberos y policía.'
                  : 'During major seismic events or severe storms, voice cellular lines quickly saturate. Prioritize SMS or data text messages to keep emergency radio and telephone lines open.'}
              </p>
            </div>

          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* VISTA 02: MANUAL DE PROTOCOLOS POR AMENAZA                              */}
        {/* ----------------------------------------------------------------------- */}
        {currentSection === 'protocols' && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* Cabecera */}
            <div className="space-y-1.5 border-b border-white/10 pb-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-cyan font-black block">
                SECCIÓN 02 / MANUAL DE AUTOPROTECCIÓN
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                {es ? 'Protocolos de Acción Inmediata' : 'Emergency Action Protocols'}
              </h1>
            </div>

            {/* Selector de Amenaza (Píldoras coloridas y elegantes) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {HAZARD_GUIDES.map((hazard) => {
                const isSelected = hazard.id === selectedHazardId;
                return (
                  <button
                    key={hazard.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedHazardId(hazard.id);
                    }}
                    className={`py-2 px-3.5 rounded-xl text-xs uppercase font-black whitespace-nowrap flex items-center gap-2 transition-all duration-200 shrink-0 ${
                      isSelected
                        ? 'bg-brand-cyan text-navy-950 shadow-glow-cyan'
                        : 'bg-navy-900/90 border border-white/10 text-slate-300 hover:text-white hover:border-brand-cyan/40'
                    }`}
                  >
                    {getHazardIcon(hazard.id)}
                    <span>{hazard.title[language]}</span>
                  </button>
                );
              })}
            </div>

            {/* Ficha Editorial de la Amenaza con paleta adaptada */}
            <div className="space-y-4 pt-1">
              
              <div className="p-4 sm:p-5 rounded-2xl bg-navy-900/80 border border-white/10 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className={`text-[10px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${selectedHazard.accent.border} ${selectedHazard.accent.bg} ${selectedHazard.accent.text}`}>
                    {selectedHazard.season[language]}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight mt-2">
                    {selectedHazard.title[language]}
                  </h2>
                  <p className="text-xs text-slate-300 font-medium">
                    {selectedHazard.subtitle[language]}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-navy-950 border border-white/15 flex items-center justify-center shrink-0 shadow-inner">
                  {getHazardIcon(selectedHazard.id)}
                </div>
              </div>

              {/* Directiva Crítica / Regla de Oro con Acento Luminoso */}
              <div className={`p-4 rounded-2xl border ${selectedHazard.accent.border} ${selectedHazard.accent.bg} space-y-1`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${selectedHazard.accent.text}`} />
                  <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-black ${selectedHazard.accent.text}`}>
                    {es ? 'DIRECTIVA CRÍTICA VINCULANTE' : 'CRITICAL BINDING DIRECTIVE'}
                  </span>
                </div>
                <p className="text-sm font-black text-white leading-snug pt-0.5">
                  {selectedHazard.keyRule[language]}
                </p>
              </div>

              {/* Pestañas Cronológicas: Antes / Durante / Después */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-navy-900/90 border border-brand-cyan/20">
                  {(['before', 'during', 'after'] as const).map((phase) => {
                    const isActive = activePhase === phase;
                    const labels = {
                      before: { es: '1. ANTES', en: '1. BEFORE' },
                      during: { es: '2. DURANTE', en: '2. DURING' },
                      after: { es: '3. DESPUÉS', en: '3. AFTER' },
                    };
                    return (
                      <button
                        key={phase}
                        onClick={() => {
                          sound.playClick();
                          setActivePhase(phase);
                        }}
                        className={`py-2 text-[11px] font-mono uppercase rounded-lg transition-all ${
                          isActive
                            ? 'bg-brand-cyan text-navy-950 font-black shadow-glow-cyan/30'
                            : 'text-slate-400 hover:text-white font-semibold'
                        }`}
                      >
                        {labels[phase][language]}
                      </button>
                    );
                  })}
                </div>

                {/* Pasos de la fase activa con viñeta ordenada */}
                <div className="space-y-2.5 pt-1 min-h-[160px]">
                  {selectedHazard[activePhase].map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-white/10 bg-navy-900/70 hover:border-brand-cyan/30 transition-colors flex items-start gap-3"
                    >
                      <span className="font-mono text-xs font-black text-brand-cyan shrink-0 mt-0.5 px-1.5 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/20">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {step[language]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Validación Institucional */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{es ? 'ORGANISMO EMISOR:' : 'ISSUING BODY:'}</span>
                <span className="text-brand-cyan font-bold">{selectedHazard.sources}</span>
              </div>

            </div>

          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* VISTA 03: INFORME TERRITORIAL EL NIÑO (SAN JUAN)                        */}
        {/* ----------------------------------------------------------------------- */}
        {currentSection === 'elnino' && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            <div className="space-y-1.5 border-b border-white/10 pb-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-sky-400 font-black block">
                SECCIÓN 03 / CONTINGENCIA CLIMÁTICA REGIONAL
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                {es ? 'El Niño en San Juan · Análisis' : 'El Niño in San Juan · Report'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                {es
                  ? 'A diferencia de las provincias del Litoral con crecidas continuas de grandes ríos, en el oasis de Cuyo el fenómeno impacta en crecidas de badenes y tormentas de granizo violentas pero localizadas.'
                  : 'Unlike the coastal provinces with slow river floods, in Cuyo the phenomenon triggers violent localized hail storms and flash floods in dry washes.'}
              </p>
            </div>

            {/* Fichas de Análisis Temático con Colores Identitarios */}
            <div className="space-y-3">
              {EL_NINO_IMPACTS.map((item, idx) => {
                const colors = [
                  { border: 'border-sky-500/30', tag: 'text-sky-300 bg-sky-500/10' },
                  { border: 'border-amber-500/30', tag: 'text-amber-300 bg-amber-500/10' },
                  { border: 'border-cyan-500/30', tag: 'text-cyan-300 bg-cyan-500/10' },
                  { border: 'border-lime-500/30', tag: 'text-lime-300 bg-lime-500/10' },
                ];
                const c = colors[idx % colors.length];

                return (
                  <div
                    key={idx}
                    className={`p-4 sm:p-5 rounded-2xl border ${c.border} bg-navy-900/80 space-y-2`}
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className={`font-mono text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${c.tag}`}>
                        VINCULANTE {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                        SAN JUAN · CUYO
                      </span>
                    </div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight">
                      {item.title[language]}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {item.text[language]}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Advertencia vial de badenes con tono ámbar */}
            <div className="p-4 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-navy-900/90 to-navy-900/90 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-300 font-black block">
                {es ? 'ADVERTENCIA VIAL DEFINITIVA' : 'DEFINITIVE ROAD WARNING'}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                {es
                  ? 'Los badenes de Pocito, Caucete, Sarmiento y Ullum se llenan de agua y barro en minutos por tormentas en alta montaña, aun cuando en la ciudad no llueva. NUNCA intente cruzar un badén con agua en movimiento.'
                  : 'Fords in Pocito, Caucete, Sarmiento and Ullum flood within minutes from mountain rain, even with clear skies in town. NEVER attempt to cross a flowing ford.'}
              </p>
            </div>

          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* VISTA 04: ALERTA TEMPRANA ANDROID (GOOGLE)                              */}
        {/* ----------------------------------------------------------------------- */}
        {currentSection === 'alerts' && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            <div className="space-y-1.5 border-b border-white/10 pb-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-yellow font-black block">
                SECCIÓN 04 / DETECCIÓN SÍSMICA INTEGRADA
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                {es ? 'Alertas de Sismos Android' : 'Android Earthquake Alerts'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                {es
                  ? 'El sistema oficial de Google utiliza los sensores de tu celular como una red colaborativa de sismógrafos en miniatura para advertir segundos antes del temblor.'
                  : 'Google official alert system turns your phone sensors into a mini-seismograph network to warn you seconds before ground shaking arrives.'}
              </p>
            </div>

            {/* Secuencia técnica con estilo nítido */}
            <div className="space-y-2.5">
              {ANDROID_ALERTS_STEPS.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-white/10 bg-navy-900/80 flex items-start gap-3.5 hover:border-brand-yellow/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow flex items-center justify-center font-mono text-xs font-black shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed">
                      {step[language]}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Condiciones operativas */}
            <div className="p-4 rounded-2xl border border-brand-cyan/30 bg-navy-900/80 space-y-2">
              <div className="flex items-center gap-2 text-brand-cyan">
                <Smartphone className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-black">
                  {es ? 'CONDICIONES DEL DISPOSITIVO' : 'DEVICE PREREQUISITES'}
                </span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 font-medium list-disc list-inside">
                <li>{es ? 'Android versión 10 o posterior.' : 'Android 10 or later.'}</li>
                <li>{es ? 'Servicios de ubicación (GPS) activados.' : 'Location services (GPS) turned on.'}</li>
                <li>{es ? 'Conexión a internet por datos o Wi-Fi.' : 'Active mobile data or Wi-Fi.'}</li>
                <li>{es ? 'Servicios de Google Play actualizados.' : 'Updated Google Play Services.'}</li>
              </ul>
            </div>

          </div>
        )}

        {/* ======================================================================= */}
        {/* 3. MARCO INSTITUCIONAL & FUENTES ABIERTAS (POLÍTICA GOOGLE PLAY)        */}
        {/* ======================================================================= */}
        <section className="mt-12 pt-6 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-400">
            <Info className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="font-bold">{es ? 'TRANSPARENCIA & FUENTES OFICIALES' : 'TRANSPARENCY & OFFICIAL SOURCES'}</span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl">
            {NON_AFFILIATION_NOTICE[language]}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {OFFICIAL_SOURCES.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-white/10 bg-navy-900/60 hover:border-brand-cyan/40 hover:bg-navy-900 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-all group"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-bold text-xs block truncate text-slate-200">{src.name}</span>
                  <span className="text-[10px] font-mono text-brand-cyan block truncate">{src.topic[language]}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-cyan shrink-0" />
              </a>
            ))}
          </div>
        </section>

      </main>

    </div>
  );
};
