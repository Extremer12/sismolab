import React, { useState } from 'react';
import { ArrowLeft, Activity, Shield, ChevronRight, Sparkles } from 'lucide-react';
import { ScreenId } from '../../types';
import { SanJuanMap, MapMarkerItem } from '../../components/map/SanJuanMap';
import { sound } from '../../lib/sound';

interface SeismicMapPageProps {
  onNavigate: (screen: ScreenId) => void;
  onFinishGame?: (earnedScore: number, correctCount: number, totalCount: number, gameId?: string) => void;
}

const SEISMIC_MARKERS: (MapMarkerItem & {
  date: string;
  depth: number;
  intensity: string;
  description: string;
  simpleExplanation: string;
})[] = [
  {
    id: 'ev_1944',
    shortYear: '1944',
    icon: '🏛️',
    label: 'Terremoto 1944',
    locationName: 'Gran San Juan y Albardón',
    department: 'Gran San Juan',
    xPercent: 50,
    yPercent: 50,
    magnitude: 7.4,
    year: 1944,
    color: '#EF4444',
    type: 'quake',
    date: '15 de Enero de 1944',
    depth: 11,
    intensity: 'IX (Histórico)',
    description: 'El sismo que transformó a San Juan en la capital nacional de la construcción sismorresistente.',
    simpleExplanation: '¡El terremoto más famoso! Hizo que San Juan se reconstruyera con casas y escuelas súper fuertes que no se caen.'
  },
  {
    id: 'ev_1894',
    shortYear: '1894',
    icon: '🏔️',
    label: 'Gran Sismo 1894',
    locationName: 'Jáchal e Iglesia',
    department: 'Jáchal - Iglesia',
    xPercent: 38,
    yPercent: 24,
    magnitude: 8.0,
    year: 1894,
    color: '#EF4444',
    type: 'quake',
    date: '27 de Octubre de 1894',
    depth: 30,
    intensity: 'IX (Muy Fuerte)',
    description: 'El terremoto de mayor magnitud registrado en la historia de toda la República Argentina.',
    simpleExplanation: 'Fue el sismo más potente de la historia argentina, ocurrido en las montañas del norte sanjuanino.'
  },
  {
    id: 'ev_1977',
    shortYear: '1977',
    icon: '🍇',
    label: 'Terremoto 1977',
    locationName: 'Sierra de Pie de Palo',
    department: 'Caucete',
    xPercent: 74,
    yPercent: 58,
    magnitude: 7.4,
    year: 1977,
    color: '#EF4444',
    type: 'quake',
    date: '23 de Noviembre de 1977',
    depth: 17,
    intensity: 'IX (Destructivo)',
    description: 'Ocurrió en Caucete y confirmó ante el mundo la calidad y resistencia de las nuevas construcciones.',
    simpleExplanation: '¡La prueba de fuego! Las casas modernas construidas por ingenieros sanjuaninos resistieron impecables.'
  },
  {
    id: 'ev_2021',
    shortYear: '2021',
    icon: '📱',
    label: 'Sismo 2021',
    locationName: 'Pocito y Sarmiento',
    department: 'Pocito - Sarmiento',
    xPercent: 48,
    yPercent: 74,
    magnitude: 6.4,
    year: 2021,
    color: '#FACC15',
    type: 'quake',
    date: '18 de Enero de 2021',
    depth: 8,
    intensity: 'VII (Fuerte)',
    description: 'Sismo nocturno monitoreado con tecnología digital de última generación en el INPRES.',
    simpleExplanation: 'Ocurrió de noche en Pocito. Se sintió muy fuerte, pero la prevención evitó daños graves.'
  },
  {
    id: 'fault_laja',
    shortYear: 'Falla',
    icon: '⚡',
    label: 'Falla La Laja',
    locationName: 'Falla Geológica Activa',
    department: 'Albardón',
    xPercent: 58,
    yPercent: 38,
    magnitude: 5.5,
    color: '#22D3EE',
    type: 'fault',
    date: 'Monitoreo 24/7',
    depth: 10,
    intensity: 'Falla Activa',
    description: 'Fractura geológica activa en la corteza terrestre estudiada permanentemente por científicos.',
    simpleExplanation: 'Una grieta natural profunda en la tierra donde los científicos del INPRES miden la energía del suelo.'
  }
];

export const SeismicMapPage: React.FC<SeismicMapPageProps> = ({ onNavigate, onFinishGame }) => {
  const [selectedId, setSelectedId] = useState<string>('ev_1944');
  const [visitedIds, setVisitedIds] = useState<string[]>(['ev_1944']);

  const activeItem = SEISMIC_MARKERS.find(m => m.id === selectedId) || SEISMIC_MARKERS[0];

  const handleSelectMarker = (marker: MapMarkerItem) => {
    sound.playClick();
    setSelectedId(marker.id);
    setVisitedIds(prev => prev.includes(marker.id) ? prev : [...prev, marker.id]);
  };

  return (
    <div className="p-4 sm:p-5 space-y-4 pb-28 max-w-md mx-auto select-none font-sans text-slate-100">
      
      {/* 1. Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { sound.playClick(); onNavigate('home'); }}
          className="w-10 h-10 rounded-2xl bg-navy-900/90 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan hover:bg-navy-800 active:scale-95 transition-all"
          aria-label="Volver a Inicio"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="px-3.5 py-1 rounded-full bg-brand-cyan/15 border border-brand-cyan/40 text-brand-cyan font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>INPRES · SAN JUAN</span>
        </div>
      </div>

      {/* 2. Main Title */}
      <div className="text-center space-y-0.5">
        <h1 className="font-black text-2xl text-white uppercase tracking-tight">
          MAPA SÍSMICO <span className="text-brand-cyan">DE SAN JUAN</span>
        </h1>
        <p className="text-xs text-slate-300 font-medium">
          Tocá los puntos en el mapa para descubrir qué pasó
        </p>
      </div>

      {/* 3. Interactive Clean Map */}
      <SanJuanMap
        markers={SEISMIC_MARKERS}
        activeMarkerId={selectedId}
        onMarkerClick={handleSelectMarker}
        showWaveAnimation={true}
      />

      {/* 4. Quick Selection Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
        {SEISMIC_MARKERS.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectMarker(item)}
              className={`px-3 py-2 rounded-2xl border transition-all flex items-center gap-1.5 shrink-0 text-xs font-black ${
                isSelected
                  ? 'bg-brand-cyan text-navy-950 border-white shadow-glow-cyan scale-105'
                  : 'bg-navy-950/80 text-slate-300 border-white/10 hover:border-brand-cyan/40 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.shortYear}</span>
            </button>
          );
        })}
      </div>

      {/* 5. Clear, Kid-Friendly Information Card */}
      {activeItem && (
        <div className="p-4 rounded-3xl bg-navy-950/95 border-2 border-brand-cyan/50 shadow-2xl space-y-3 animate-in fade-in duration-200">
          
          {/* Card Header with Icon & Location */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-brand-cyan/15 border border-brand-cyan/40 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                {activeItem.icon}
              </div>
              <div>
                <span className="text-[10px] font-black text-brand-cyan uppercase tracking-wider block">
                  {activeItem.department}
                </span>
                <h2 className="font-black text-base text-white leading-tight">
                  {activeItem.label}
                </h2>
              </div>
            </div>

            {/* Magnitude Pill */}
            <div className="px-2.5 py-1 rounded-xl bg-navy-900 border border-white/15 text-right shrink-0">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Fuerza</span>
              <span className="font-black text-xs text-brand-yellow">
                {activeItem.type === 'fault' ? 'Activa' : `M ${activeItem.magnitude}`}
              </span>
            </div>
          </div>

          {/* Simple Explanation (Fun & Direct) */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/60 to-navy-900/80 border border-brand-cyan/20">
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
              {activeItem.simpleExplanation}
            </p>
          </div>

          {/* Date & Technical Summary */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
            <span>📅 {activeItem.date}</span>
            <span className="text-brand-cyan font-bold">📡 Red INPRES</span>
          </div>
        </div>
      )}

      {/* 6. Exploration Mission Completion Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-950/90 via-navy-900/95 to-navy-950/95 border-2 border-brand-cyan shadow-glow-cyan/25 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <div>
              <h3 className="font-black text-xs text-white uppercase tracking-wider">
                Misión de Exploración
              </h3>
              <p className="text-[11px] text-slate-300 font-medium">
                Descubriste {visitedIds.length} de {SEISMIC_MARKERS.length} lugares sísmicos.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-brand-cyan/20 text-brand-cyan font-black text-xs shadow-sm">
            +300 XP
          </span>
        </div>

        <button
          onClick={() => {
            sound.playWinFanfare();
            if (onFinishGame) {
              onFinishGame(300, visitedIds.length, SEISMIC_MARKERS.length, 'seismic-map');
            } else {
              onNavigate('ranking');
            }
          }}
          className="w-full py-3 rounded-full bg-brand-cyan hover:bg-brand-electric text-navy-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-cyan transition-all active:scale-95"
        >
          <span>¡Completar y Guardar Puntos!</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
