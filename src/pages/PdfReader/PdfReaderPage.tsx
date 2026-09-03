import React, { useState } from 'react';
import { ArrowLeft, Download, ExternalLink, FileText, BookOpen, Share2, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { ScreenId } from '../../types';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';

interface PdfReaderPageProps {
  onNavigate: (screen: ScreenId) => void;
  onFinishGame?: (earnedScore: number, correctCount: number, totalCount: number, gameId?: string) => void;
}

const HISTORICAL_CHAPTERS_ES = [
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

const HISTORICAL_CHAPTERS_EN = [
  {
    year: '1894',
    title: 'The Great Argentine Earthquake',
    subtitle: 'October 27, 1894 · Magnitude M 8.0',
    image: '/images/history_1894.png',
    epicenter: 'Jáchal and Iglesia (Northwest San Juan)',
    content: `On October 27, 1894, the provinces of San Juan and La Rioja were shaken by the largest magnitude earthquake ever instrumentally recorded in Argentina (M 8.0).
    
It mainly devastated adobe buildings across Iglesia and Jáchal, causing collapses of colonial mansions, historic churches, and ground fractures along mountain valleys. It was the historical catalyst for systematic seismic research in Cuyo.`,
    highlights: [
      'Highest magnitude recorded in Argentine history (M 8.0)',
      'Felt across almost all of Argentina, Chile, and Uruguay',
      'Beginning of instrumental seismological records in Argentina'
    ]
  },
  {
    year: '1944',
    title: 'The Turning Point That Transformed San Juan',
    subtitle: 'January 15, 1944 · 20:52 hs · Magnitude M 7.4',
    image: '/images/history_1944.png',
    epicenter: 'La Laja Fault / Albardón (Greater San Juan)',
    content: `At 8:52 PM on January 15, 1944, a shallow magnitude 7.4 earthquake collapsed 80% of adobe structures in San Juan City and surrounding districts.
    
This dramatic milestone changed the country forever: the San Juan Reconstruction Council was founded and the first mandatory seismic-resistant building codes were established, giving birth to what is today the National Institute for Seismic Prevention (INPRES).`,
    highlights: [
      'Birth of earthquake-resistant engineering in Argentina',
      'Urban rebirth with reinforced concrete and bonded masonry',
      'Creation of life-saving national building codes'
    ]
  },
  {
    year: '1977',
    title: 'The Caucete Earthquake',
    subtitle: 'November 23, 1977 · 06:23 hs · Magnitude M 7.4',
    image: '/images/history_1977.png',
    epicenter: 'Pie de Palo Range / Caucete',
    content: `On November 23, 1977, a magnitude 7.4 earthquake centered in the Pie de Palo Range shook eastern San Juan, causing severe soil liquefaction in vineyards and rural roads.
    
The great lesson of the 1977 disaster was that buildings constructed according to post-1944 earthquake codes stood strong without structural collapses, proving Argentine engineering to the world.`,
    highlights: [
      'Global confirmation of INPRES engineering standards',
      'Earthquake-resistant schools and houses withstood shaking',
      'Modernization of digital accelerograph sensor networks'
    ]
  },
  {
    year: '2021',
    title: 'Pocito Earthquake and the Modern Era',
    subtitle: 'January 18, 2021 · 23:46 hs · Magnitude M 6.4',
    image: '/images/history_2021.png',
    epicenter: 'Pocito and Sarmiento (South of San Juan)',
    content: `A shallow magnitude 6.4 earthquake occurred at midnight, violently shaking San Juan, Mendoza, and neighboring provinces.
    
Thanks to strict adherence to modern building codes and prompt citizen response, the province endured with minimal structural damage to formal constructions and zero casualties, validating the region's strong culture of prevention.`,
    highlights: [
      '100% digital real-time monitoring by INPRES',
      'Zero fatalities in earthquake-resistant structures',
      'Mobile early notifications and digitized safety protocols'
    ]
  },
  {
    year: 'INPRES',
    title: 'Pillars of Seismic Prevention',
    subtitle: 'National Institute for Seismic Prevention',
    image: '/images/icono.png',
    epicenter: 'Headquarters: San Juan, Argentina',
    content: `INPRES is the scientific agency of the Argentine Federal Government dedicated to seismological research, continuous real-time monitoring via the National Seismological Network, and creating the Argentine Earthquake Engineering Regulations (INPRES-CIRSOC).
    
Living in a seismic zone requires understanding your environment, preparing a Family Emergency Plan, assembling a 72-Hour Survival Kit, and participating in school and community drills.`,
    highlights: [
      'Mandatory nationwide INPRES-CIRSOC building codes',
      '24/7 national seismograph and accelerograph network',
      'Education, regular drills, and civic self-protection culture'
    ]
  }
];

export const PdfReaderPage: React.FC<PdfReaderPageProps> = ({ onNavigate, onFinishGame }) => {
  const { language } = useLanguage();
  const isEs = language === 'es';
  const chapters = isEs ? HISTORICAL_CHAPTERS_ES : HISTORICAL_CHAPTERS_EN;

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
          title: isEs ? 'Historia Sísmica de San Juan · INPRES' : 'Seismic History of San Juan · INPRES',
          text: isEs ? 'Descargá la guía histórica completa sobre sismos y prevención de San Juan.' : 'Download the complete historical guide on earthquakes and prevention in San Juan.',
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
          aria-label={isEs ? 'Volver a Inicio' : 'Back to Home'}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="px-3.5 py-1 rounded-full bg-brand-cyan/15 border border-brand-cyan/40 text-brand-cyan font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
          <FileText className="w-3.5 h-3.5" />
          <span>{isEs ? 'GUÍA HISTÓRICA INPRES' : 'INPRES HISTORICAL GUIDE'}</span>
        </div>

        <button
          onClick={handleDownload}
          className="w-10 h-10 rounded-2xl bg-brand-cyan text-navy-950 font-black flex items-center justify-center shadow-glow-cyan hover:bg-brand-electric active:scale-95 transition-all"
          title={isEs ? 'Descargar PDF' : 'Download PDF'}
        >
          <Download className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* 2. Main Title */}
      <div className="text-center space-y-0.5">
        <h1 className="font-black text-2xl text-white uppercase tracking-tight">
          {isEs ? (
            <>
              DOCUMENTO <span className="text-brand-cyan">HISTÓRICO</span>
            </>
          ) : (
            <>
              HISTORICAL <span className="text-brand-cyan">DOCUMENT</span>
            </>
          )}
        </h1>
        <p className="text-xs text-slate-300 font-medium">
          {isEs ? 'Historia de los terremotos y la resiliencia de San Juan' : 'History of earthquakes and resilience in San Juan'}
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
          <span>{isEs ? 'Lector Ilustrado' : 'Illustrated Reader'}</span>
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
          <span>{isEs ? 'Visor PDF' : 'PDF Viewer'}</span>
        </button>
      </div>

      {/* 4. MODE 1: Interactive Illustrated Reader */}
      {viewMode === 'reader' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          
          {/* Chapter Selector Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {chapters.map((ch, idx) => {
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
            const ch = chapters[activeChapterIdx];
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
                    {isEs ? 'PUNTOS CLAVE PARA RECORDAR:' : 'KEY TAKEAWAYS TO REMEMBER:'}
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
                    {isEs ? '← Anterior' : '← Previous'}
                  </button>
                  <span className="text-xs text-slate-400 font-bold">
                    {isEs ? `${activeChapterIdx + 1} de ${chapters.length}` : `${activeChapterIdx + 1} of ${chapters.length}`}
                  </span>
                  <button
                    disabled={activeChapterIdx === chapters.length - 1}
                    onClick={() => { sound.playClick(); setActiveChapterIdx(prev => Math.min(chapters.length - 1, prev + 1)); }}
                    className="px-3 py-1.5 rounded-xl bg-navy-900 border border-white/10 text-xs font-bold text-brand-cyan disabled:opacity-40"
                  >
                    {isEs ? 'Siguiente →' : 'Next →'}
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
            <span>{isEs ? 'Abrir PDF en pantalla completa' : 'Open PDF full screen'}</span>
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
                {isEs ? 'Descargá el Documento en tu Dispositivo' : 'Download Document to Device'}
              </h3>
              <p className="text-[11px] text-slate-300 font-medium">
                {isEs ? 'Guardá el PDF oficial para leerlo sin conexión cuando quieras.' : 'Save the official PDF to read offline anytime.'}
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
            <span>{isEs ? 'Descargar' : 'Download'}</span>
          </button>

          <button
            onClick={handleShare}
            className="py-3 rounded-full bg-navy-900 hover:bg-navy-800 border border-brand-cyan/40 text-brand-cyan font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>{isCopied ? (isEs ? '¡Enlace Copiado!' : 'Link Copied!') : (isEs ? 'Compartir' : 'Share')}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
