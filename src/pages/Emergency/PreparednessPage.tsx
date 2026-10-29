import React, { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight,
  Info
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

  // State: Tab de navegación principal (organizado en vistas dedicadas, sin scroll interminable)
  const [currentSection, setCurrentSection] = useState<PreparednessSection>('emergency');
  
  // State: Amenaza activa dentro de protocolos
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

  const sections = [
    { id: 'emergency' as PreparednessSection, code: '01', label: es ? 'Líneas SOS' : 'Hotlines' },
    { id: 'protocols' as PreparednessSection, code: '02', label: es ? 'Protocolos' : 'Protocols' },
    { id: 'elnino' as PreparednessSection, code: '03', label: es ? 'El Niño SJ' : 'El Niño SJ' },
    { id: 'alerts' as PreparednessSection, code: '04', label: es ? 'Alerta Móvil' : 'Mobile Alert' },
  ];

  return (
    <div className="min-h-screen bg-[#070e17] text-slate-100 flex flex-col font-sans selection:bg-white selection:text-black">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER INSTITUCIONAL Y NAVEGACIÓN SUPERIOR                         */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 bg-[#070e17]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('home');
            }}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
            aria-label={es ? 'Volver al inicio' : 'Back to home'}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{es ? 'Inicio' : 'Home'}</span>
          </button>

          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block font-mono">
              MANUAL DE AUTOPROTECCIÓN
            </span>
            <span className="text-xs font-bold text-slate-200 block">
              San Juan · Cuyo
            </span>
          </div>
        </div>

        {/* Selector de vistas principales: arquitectura limpia tipo catálogo técnico */}
        <div className="max-w-2xl mx-auto px-4 pb-2 pt-1">
          <nav className="grid grid-cols-4 gap-1 border border-white/10 p-1 rounded-xl bg-[#0b1624]">
            {sections.map((sec) => {
              const isActive = currentSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    sound.playClick();
                    setCurrentSection(sec.id);
                  }}
                  className={`py-2 px-1 text-center rounded-lg transition-all flex flex-col items-center justify-center ${
                    isActive
                      ? 'bg-white text-[#070e17] font-black shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 font-semibold'
                  }`}
                >
                  <span className={`text-[9px] font-mono tracking-widest ${isActive ? 'text-slate-600' : 'text-slate-400'}`}>
                    {sec.code}
                  </span>
                  <span className="text-[11px] uppercase tracking-tight mt-0.5 truncate w-full">
                    {sec.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. CONTENIDO PRINCIPAL POR VISTAS (NO SCROLL INTERMINABLE)                 */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 pb-24">
        
        {/* ----------------------------------------------------------------------- */}
        {/* VISTA 01: LÍNEAS DE ASISTENCIA Y DESPACHO INMEDIATO                     */}
        {/* ----------------------------------------------------------------------- */}
        {currentSection === 'emergency' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Título editorial con espacio y balance */}
            <div className="space-y-1 border-b border-white/10 pb-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 block">
                SECCIÓN 01 / LÍNEAS TELEFÓNICAS DIRECTAS
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                {es ? 'Central de Emergencias' : 'Emergency Hotlines'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-lg">
                {es
                  ? 'Líneas provinciales de llamada directa y gratuita las 24 horas. En situaciones de conmoción o sismo, mantenga la calma e indique ubicación exacta de inmediato.'
                  : 'Provincial 24/7 direct toll-free numbers. In crisis or earthquake situations, stay calm and state your exact location immediately.'}
              </p>
            </div>

            {/* Listado de Números Tácticos (Tipografía Masiva y Alta Legibilidad) */}
            <div className="space-y-3">
              {EMERGENCY_NUMBERS.map((item) => {
                const isCopied = copiedNumber === item.number;
                return (
                  <div
                    key={item.number}
                    className="p-4 sm:p-5 rounded-xl border border-white/10 bg-[#0b1624] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-white/20"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-3xl sm:text-4xl font-black tracking-tight text-white tabular-nums">
                          {item.number}
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-200 px-2 py-0.5 rounded bg-white/10 border border-white/15">
                          {item.name[language]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-md pt-1">
                        {item.description[language]}
                      </p>
                    </div>

                    {/* Acciones claras */}
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`tel:${item.number}`}
                        onClick={() => sound.playClick()}
                        className="flex-1 sm:flex-initial py-2.5 px-5 rounded-lg bg-white hover:bg-slate-200 text-[#070e17] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-95"
                      >
                        <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{es ? 'Llamar' : 'Call'}</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleCopy(item.number)}
                        className="py-2.5 px-3 rounded-lg border border-white/15 bg-transparent hover:bg-white/5 text-slate-300 hover:text-white transition-all text-xs font-mono"
                        title={es ? 'Copiar número' : 'Copy number'}
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Protocolo de comunicación en crisis */}
            <div className="p-4 rounded-xl border-l-2 border-slate-400 bg-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                {es ? 'DIRECTIVA DE COMUNICACIÓN' : 'COMMUNICATIONS DIRECTIVE'}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {es
                  ? 'Ante catástrofes o sismos mayores, las redes de voz colapsan por congestión. Priorice el envío de mensajes de texto SMS o mensajería de datos para no saturar las líneas de despacho oficial.'
                  : 'Following severe disasters or earthquakes, cellular voice lines become congested. Prioritize SMS or data text messages over calls to keep lines open for dispatch.'}
              </p>
            </div>

          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* VISTA 02: MANUAL DE PROTOCOLOS POR AMENAZA                              */}
        {/* ----------------------------------------------------------------------- */}
        {currentSection === 'protocols' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            
            {/* Cabecera */}
            <div className="space-y-1 border-b border-white/10 pb-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 block">
                SECCIÓN 02 / MANUAL DE AUTOPROTECCIÓN
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                {es ? 'Protocolos de Acción' : 'Action Protocols'}
              </h1>
            </div>

            {/* Selector de Amenaza (Lista Horizontal sobria) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-white/10">
              {HAZARD_GUIDES.map((hazard) => {
                const isSelected = hazard.id === selectedHazardId;
                return (
                  <button
                    key={hazard.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedHazardId(hazard.id);
                    }}
                    className={`py-2 px-3 text-xs uppercase font-bold whitespace-nowrap transition-colors border-b-2 -mb-[1px] ${
                      isSelected
                        ? 'border-white text-white font-black'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {hazard.title[language]}
                  </button>
                );
              })}
            </div>

            {/* Ficha Editorial de la Amenaza */}
            <div className="space-y-4 pt-1">
              
              <div className="flex items-baseline justify-between border-b border-white/5 pb-2">
                <div>
                  <h2 className="text-xl font-black uppercase text-white tracking-tight">
                    {selectedHazard.title[language]}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {selectedHazard.subtitle[language]}
                  </p>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 border border-white/10 px-2 py-0.5 rounded">
                  {selectedHazard.season[language]}
                </span>
              </div>

              {/* Directiva Crítica / Regla de Oro */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/15 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 block">
                  {es ? 'DIRECTIVA CRÍTICA' : 'CRITICAL DIRECTIVE'}
                </span>
                <p className="text-sm font-bold text-white leading-snug">
                  {selectedHazard.keyRule[language]}
                </p>
              </div>

              {/* Pestañas Cronológicas: Antes / Durante / Después */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-3 border border-white/10 rounded-lg p-1 bg-[#0b1624]">
                  {(['before', 'during', 'after'] as const).map((phase) => {
                    const isActive = activePhase === phase;
                    const labels = {
                      before: { es: '01 · ANTES', en: '01 · BEFORE' },
                      during: { es: '02 · DURANTE', en: '02 · DURING' },
                      after: { es: '03 · DESPUÉS', en: '03 · AFTER' },
                    };
                    return (
                      <button
                        key={phase}
                        onClick={() => {
                          sound.playClick();
                          setActivePhase(phase);
                        }}
                        className={`py-2 text-[11px] font-mono uppercase transition-all rounded ${
                          isActive
                            ? 'bg-white text-[#070e17] font-black'
                            : 'text-slate-400 hover:text-white font-semibold'
                        }`}
                      >
                        {labels[phase][language]}
                      </button>
                    );
                  })}
                </div>

                {/* Pasos de la fase activa */}
                <div className="space-y-2.5 pt-1 min-h-[160px]">
                  {selectedHazard[activePhase].map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-white/10 bg-[#0b1624] flex items-start gap-3"
                    >
                      <span className="font-mono text-xs font-black text-slate-400 shrink-0 mt-0.5">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {step[language]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Validación Institucional */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{es ? 'ORGANISMO EMISOR:' : 'ISSUING BODY:'}</span>
                <span className="text-slate-300 font-semibold">{selectedHazard.sources}</span>
              </div>

            </div>

          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* VISTA 03: INFORME TERRITORIAL EL NIÑO (SAN JUAN)                        */}
        {/* ----------------------------------------------------------------------- */}
        {currentSection === 'elnino' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            
            <div className="space-y-1 border-b border-white/10 pb-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 block">
                SECCIÓN 03 / ANÁLISIS CLIMÁTICO TERRITORIAL
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                {es ? 'El Niño en San Juan' : 'El Niño in San Juan'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                {es
                  ? 'A diferencia de la cuenca del Río de la Plata, donde el fenómeno genera crecidas continuas de grandes cauces, en la región de Cuyo los riesgos principales son aluvionales y convectivos.'
                  : 'Unlike the Rio de la Plata basin with massive river overflows, in Cuyo the primary risks are flash floods in dry washes and severe localized convection.'}
              </p>
            </div>

            {/* Fichas de Análisis Temático */}
            <div className="space-y-3">
              {EL_NINO_IMPACTS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-xl border border-white/10 bg-[#0b1624] space-y-2"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="font-mono text-xs font-black text-slate-400">
                      MODALIDAD {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                      SAN JUAN
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">
                    {item.title[language]}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {item.text[language]}
                  </p>
                </div>
              ))}
            </div>

            {/* Recomendación de Infraestructura y Badenes */}
            <div className="p-4 rounded-xl border border-white/15 bg-white/5 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 block">
                {es ? 'ADVERTENCIA VIAL VINCULANTE' : 'BINDING ROAD WARNING'}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                {es
                  ? 'Los badenes precordilleranos y cruces de cañadas secas se inundan en cuestión de segundos debido a precipitaciones altas en la sierra. No cruce nunca un badén tapado por corriente.'
                  : 'Foothill fords and dry creek crossings flood within seconds from mountain rainfall. Never drive through or walk across a flooded ford.'}
              </p>
            </div>

          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* VISTA 04: ALERTA TEMPRANA ANDROID (GOOGLE)                              */}
        {/* ----------------------------------------------------------------------- */}
        {currentSection === 'alerts' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            
            <div className="space-y-1 border-b border-white/10 pb-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 block">
                SECCIÓN 04 / DETECCIÓN NATIVA DE HARDWARE
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                {es ? 'Alertas de Sismos Android' : 'Android Earthquake Alerts'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                {es
                  ? 'El sistema gratuito de Google opera en Argentina como una red colaborativa de acelerómetros para advertir segundos antes del arribo de la onda sísmica destructiva.'
                  : 'Google free early warning system operates in Argentina using phone accelerometers to warn seconds before damaging seismic waves arrive.'}
              </p>
            </div>

            {/* Secuencia técnica numerada */}
            <div className="space-y-2.5">
              {ANDROID_ALERTS_STEPS.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-white/10 bg-[#0b1624] flex items-start gap-4"
                >
                  <div className="w-7 h-7 rounded-lg border border-white/20 bg-white/5 flex items-center justify-center font-mono text-xs font-black text-white shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                      {step[language]}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Requisitos técnicos del dispositivo */}
            <div className="p-4 rounded-xl border border-white/10 bg-[#0b1624] space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 block">
                {es ? 'CONDICIONES OPERATIVAS REQUERIDAS' : 'REQUIRED OPERATIONAL CONDITIONS'}
              </span>
              <ul className="text-xs text-slate-300 space-y-1.5 font-medium list-disc list-inside">
                <li>{es ? 'Android 10 o versión superior.' : 'Android 10 or higher.'}</li>
                <li>{es ? 'Servicios de ubicación (GPS) activados.' : 'Location services (GPS) turned on.'}</li>
                <li>{es ? 'Conexión a datos móviles o Wi-Fi activa.' : 'Active mobile data or Wi-Fi.'}</li>
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
            <Info className="w-3.5 h-3.5" />
            <span>{es ? 'TRANSPARENCIA & FUENTES OFICIALES' : 'TRANSPARENCY & OFFICIAL SOURCES'}</span>
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
                className="p-3 rounded-lg border border-white/10 bg-[#0b1624] hover:border-white/25 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors group"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-bold text-xs block truncate text-slate-200">{src.name}</span>
                  <span className="text-[10px] font-mono text-slate-400 block truncate">{src.topic[language]}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0" />
              </a>
            ))}
          </div>
        </section>

      </main>

    </div>
  );
};
