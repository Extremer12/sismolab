import React, { useState } from 'react';
import { ArrowLeft, Download, ExternalLink, FileText, BookOpen, Share2, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { ScreenId } from '../../types';
import { sound } from '../../lib/sound';

interface PdfReaderPageProps {
  onNavigate: (screen: ScreenId) => void;
  onFinishGame?: (earnedScore: number, correctCount: number, totalCount: number, gameId?: string) => void;
}

const HISTORICAL_CHAPTERS = [
  {
    year: '1894',
    title: 'El Gran Terremoto Argentino',
    subtitle: '27 de Octubre de 1894 · Magnitud M 8.0',
    image: '/images/history_1894.png',
    epicenter: 'Jáchal e Iglesia (Noroeste de San Juan)',
    content: `El 27 de octubre de 1894, las provincias de San Juan y La Rioja fueron sacudidas por el terremoto de mayor magnitud instrumental en toda la historia de la República Argentina (M 8.0). 
    
    Afectó principalmente construcciones de adobe en los departamentos de Iglesia y Jáchal, provocando derrumbes de casonas antiguas, templos coloniales y agrietamientos en valles cordilleranos. Fue el primer hito que impulsó los estudios sismológicos sistemáticos en Cuyo.`,
    highlights: [
      'Mayor magnitud registrada en la historia argentina (M 8.0)',
      'Sentido en casi todo el territorio argentino, Chile y Uruguay',
      'Inicio de los primeros registros de sismicidad instrumental'
    ]
  },
  {
    year: '1944',
    title: 'El Hito que Transformó a San Juan',
    subtitle: '15 de Enero de 1944 · 20:52 hs · Magnitud M 7.4',
    image: '/images/history_1944.png',
    epicenter: 'Falla La Laja / Albardón (Gran San Juan)',
    content: `A las 20:52 del 15 de enero de 1944, un terremoto superficial de magnitud 7.4 colapsó el 80% de las construcciones de adobe en la Ciudad de San Juan y departamentos vecinos.
    
    Este dramático evento marcó un antes y un después en la historia del país: se creó el Consejo de Reconstrucción de San Juan (CONCAR) y se establecieron los primeros códigos sismorresistentes obligatorios, dando origen a lo que hoy es el Instituto Nacional de Prevención Sísmica (INPRES).`,
    highlights: [
      'Nacimiento de la ingeniería sismorresistente en Argentina',
      'Refundación urbana con hormigón armado y ladrillo encadenado',
      'Creación de los códigos de edificación que salvaron miles de vidas'
    ]
  },
  {
    year: '1977',
    title: 'El Terremoto de Caucete',
    subtitle: '23 de Noviembre de 1977 · 06:23 hs · Magnitud M 7.4',
    image: '/images/history_1977.png',
    epicenter: 'Sierra de Pie de Palo / Caucete',
    content: `El 23 de noviembre de 1977, un sismo de magnitud 7.4 con epicentro en la Sierra de Pie de Palo sacudió el este sanjuanino, provocando fenómenos severos de licuación de suelos en viñedos y caminos rurales.
    
    La gran lección del terremoto de 1977 fue que las construcciones levantadas bajo las normas sismorresistentes posteriores a 1944 resistieron sin sufrir colapsos estructurales, demostrando ante el mundo la eficacia de la ingeniería argentina.`,
    highlights: [
      'Comprobación mundial de la eficacia de las normas INPRES',
      'Las escuelas y viviendas sismorresistentes no colapsaron',
      'Impulso a la modernización de redes de acelerógrafos digitales'
    ]
  },
  {
    year: '2021',
    title: 'Sismo de Pocito y la Nueva Era',
    subtitle: '18 de Enero de 2021 · 23:46 hs · Magnitud M 6.4',
    image: '/images/history_2021.png',
    epicenter: 'Pocito y Sarmiento (Sur de San Juan)',
    content: `Un sismo superficial de magnitud 6.4 ocurrido en plena noche sacudió fuertemente a San Juan, Mendoza y provincias vecinas.
    
    Gracias al estricto cumplimiento de las normas constructivas y a la rápida respuesta ciudadana, la provincia resistió con mínimos daños estructurales en construcciones formales y sin víctimas fatales, validando la cultura de prevención de la sociedad sanjuanina.`,
    highlights: [
      'Monitoreo 100% digital en tiempo real por el INPRES',
      'Cero víctimas fatales en viviendas sismorresistentes',
      'Uso de alertas móviles y digitalización de protocolos'
    ]
  },
  {
    year: 'INPRES',
    title: 'Pilares de la Prevención Sísmica',
    subtitle: 'Instituto Nacional de Prevención Sísmica',
    image: '/images/icono.png',
    epicenter: 'Sede Central: San Juan, Argentina',
    content: `El INPRES es el organismo científico del Estado Argentino dedicado a la investigación sismológica, el monitoreo permanente mediante la Red Nacional de Estaciones Sismológicas y la elaboración del Reglamento Argentino de Construcciones Sismorresistentes (INPRES-CIRSOC).
    
    Vivir en zona sísmica requiere conocer tu entorno, preparar tu Plan Familiar de Emergencia, armar tu Mochila de 72 Horas y participar activamente en simulacros escolares y comunitarios.`,
    highlights: [
      'Reglamento Nacional INPRES-CIRSOC obligatorio',
      'Red nacional de sismógrafos y acelerógrafos 24/7',
      'Educación, simulacros y cultura de autoprotección ciudadana'
    ]
  }
];

export const PdfReaderPage: React.FC<PdfReaderPageProps> = ({ onNavigate, onFinishGame }) => {
  const [viewMode, setViewMode] = useState<'reader' | 'pdf'>('reader');
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const pdfUrl = '/Historia_Sismica_San_Juan_INPRES.pdf';

  const handleDownload = () => {
    sound.playClick();
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Historia_Sismica_San_Juan_INPRES.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    sound.playClick();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Historia Sísmica de San Juan · INPRES',
          text: 'Descargá la guía histórica completa sobre sismos y prevención de San Juan.',
          url: window.location.href,
        });
      } catch (err) {
        // Fallback copy
      }
    } else {
      navigator.clipboard.writeText(window.location.origin + pdfUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="p-4 sm:p-5 space-y-4 pb-28 max-w-md mx-auto select-none font-sans text-slate-100">
      
      {/* 1. Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { sound.playClick(); onNavigate('home'); }}
          className="w-10 h-10 rounded-2xl bg-navy-900/90 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan hover:bg-navy-800 active:scale-95 transition-all"
          aria-label="Volver a Inicio"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="px-3.5 py-1 rounded-full bg-brand-cyan/15 border border-brand-cyan/40 text-brand-cyan font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
          <FileText className="w-3.5 h-3.5" />
          <span>GUÍA HISTÓRICA INPRES</span>
        </div>

        <button
          onClick={handleDownload}
          className="w-10 h-10 rounded-2xl bg-brand-cyan text-navy-950 font-black flex items-center justify-center shadow-glow-cyan hover:bg-brand-electric active:scale-95 transition-all"
          title="Descargar PDF"
        >
          <Download className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* 2. Main Title */}
      <div className="text-center space-y-0.5">
        <h1 className="font-black text-2xl text-white uppercase tracking-tight">
          DOCUMENTO <span className="text-brand-cyan">HISTÓRICO</span>
        </h1>
        <p className="text-xs text-slate-300 font-medium">
          Historia de los terremotos y la resiliencia de San Juan
        </p>
      </div>

      {/* 3. View Mode Switcher */}
      <div className="flex items-center justify-center gap-1.5 p-1 rounded-2xl bg-navy-950/80 border border-white/10 text-xs font-bold">
        <button
          onClick={() => { sound.playClick(); setViewMode('reader'); }}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            viewMode === 'reader'
              ? 'bg-brand-cyan text-navy-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Lector Ilustrado</span>
        </button>

        <button
          onClick={() => { sound.playClick(); setViewMode('pdf'); }}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            viewMode === 'pdf'
              ? 'bg-brand-purple text-white font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Visor PDF</span>
        </button>
      </div>

      {/* 4. MODE 1: Interactive Illustrated Reader */}
      {viewMode === 'reader' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          
          {/* Chapter Selector Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {HISTORICAL_CHAPTERS.map((ch, idx) => {
              const isSelected = activeChapterIdx === idx;
              return (
                <button
                  key={ch.year}
                  onClick={() => { sound.playClick(); setActiveChapterIdx(idx); }}
                  className={`px-3 py-1.5 rounded-2xl border text-xs font-black shrink-0 transition-all ${
                    isSelected
                      ? 'bg-brand-cyan text-navy-950 border-white shadow-glow-cyan scale-105'
                      : 'bg-navy-950/80 text-slate-300 border-white/10 hover:border-brand-cyan/40 hover:text-white'
                  }`}
                >
                  {ch.year}
                </button>
              );
            })}
          </div>

          {/* Active Chapter Card */}
          {(() => {
            const ch = HISTORICAL_CHAPTERS[activeChapterIdx];
            return (
              <div className="sismo-card p-4 rounded-3xl border-2 border-brand-cyan/40 bg-navy-950/95 shadow-2xl space-y-3.5">
                
                {/* Chapter Photo */}
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-navy-900">
                  <img
                    src={ch.image}
                    alt={ch.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-navy-950/90 border border-brand-cyan/50 text-brand-cyan font-black text-[10px] tracking-wider uppercase backdrop-blur-md">
                    {ch.year} · INPRES
                  </div>
                </div>

                {/* Chapter Header */}
                <div>
                  <span className="text-[10px] font-black text-brand-cyan uppercase tracking-wider block">
                    {ch.subtitle}
                  </span>
                  <h2 className="font-black text-xl text-white mt-0.5 leading-tight">
                    {ch.title}
                  </h2>
                  <span className="text-xs text-slate-400 font-medium block mt-0.5">
                    📍 {ch.epicenter}
                  </span>
                </div>

                {/* Paragraph Content */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-navy-900/90 to-blue-950/60 border border-white/10">
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                    {ch.content}
                  </p>
                </div>

                {/* Key Points Checklist */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-black text-brand-gold uppercase tracking-wider block">
                    PUNTOS CLAVE PARA RECORDAR:
                  </span>
                  {ch.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Navigation Between Chapters */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <button
                    disabled={activeChapterIdx === 0}
                    onClick={() => { sound.playClick(); setActiveChapterIdx(prev => Math.max(0, prev - 1)); }}
                    className="px-3 py-1.5 rounded-xl bg-navy-900 border border-white/10 text-xs font-bold text-slate-300 disabled:opacity-40"
                  >
                    ← Anterior
                  </button>
                  <span className="text-xs text-slate-400 font-bold">
                    {activeChapterIdx + 1} de {HISTORICAL_CHAPTERS.length}
                  </span>
                  <button
                    disabled={activeChapterIdx === HISTORICAL_CHAPTERS.length - 1}
                    onClick={() => { sound.playClick(); setActiveChapterIdx(prev => Math.min(HISTORICAL_CHAPTERS.length - 1, prev + 1)); }}
                    className="px-3 py-1.5 rounded-xl bg-navy-900 border border-white/10 text-xs font-bold text-brand-cyan disabled:opacity-40"
                  >
                    Siguiente →
                  </button>
                </div>

              </div>
            );
          })()}
        </div>
      )}

      {/* 5. MODE 2: Native PDF Embed */}
      {viewMode === 'pdf' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="w-full h-[480px] rounded-3xl overflow-hidden border-2 border-brand-purple/50 shadow-2xl bg-navy-950">
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              title="Historia Sísmica de San Juan PDF"
              className="w-full h-full"
            />
          </div>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-2xl bg-navy-900 border border-brand-purple/40 text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-navy-800 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Abrir PDF en pantalla completa</span>
          </a>
        </div>
      )}

      {/* 6. Quick Action Download & Share Banner */}
      <div className="sismo-card p-4 rounded-3xl bg-gradient-to-r from-blue-950/90 via-navy-900/95 to-navy-950/95 border-2 border-brand-cyan shadow-glow-cyan/25 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-cyan/20 border border-brand-cyan/50 flex items-center justify-center text-brand-cyan text-xl shrink-0">
              📥
            </div>
            <div>
              <h3 className="font-black text-xs text-white uppercase tracking-wider">
                Descargá el Documento en tu Dispositivo
              </h3>
              <p className="text-[11px] text-slate-300 font-medium">
                Guardá el PDF oficial para leerlo sin conexión cuando quieras.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDownload}
            className="py-3 rounded-full bg-brand-cyan hover:bg-brand-electric text-navy-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-glow-cyan transition-all active:scale-95"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Descargar</span>
          </button>

          <button
            onClick={handleShare}
            className="py-3 rounded-full bg-navy-900 hover:bg-navy-800 border border-brand-cyan/40 text-brand-cyan font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>{isCopied ? '¡Enlace Copiado!' : 'Compartir'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
