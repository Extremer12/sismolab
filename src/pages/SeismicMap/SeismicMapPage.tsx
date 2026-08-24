import React, { useState } from 'react';
import { ArrowLeft, Activity, MapPin, Radio, Shield, Info, Flame, ChevronRight } from 'lucide-react';
import { ScreenId, SeismicEvent } from '../../types';
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
  department: string;
  description: string;
  historicalImpact: string;
})[] = [
  {
    id: 'ev_1894',
    label: '1894 · M8.0',
    locationName: 'Noroeste / Jáchal e Iglesia',
    department: 'Jáchal - Iglesia',
    lat: -30.50,
    lng: -68.90,
    magnitude: 8.0,
    year: 1894,
    color: '#EF4444',
    type: 'quake',
    date: '27 de Octubre de 1894',
    depth: 30,
    intensity: 'IX (Muy Destructivo)',
    description: 'El terremoto de mayor magnitud instrumental en la historia argentina. Afectó templos de adobe y valles cordilleranos.',
    historicalImpact: 'Primer registro sismológico instrumental documentado en Cuyo.'
  },
  {
    id: 'ev_1944',
    label: '1944 · M7.4',
    locationName: 'Albardón / La Laja',
    department: 'Albardón - Gran San Juan',
    lat: -31.41,
    lng: -68.52,
    magnitude: 7.4,
    year: 1944,
    color: '#EF4444',
    type: 'quake',
    date: '15 de Enero de 1944 (20:52 hs)',
    depth: 11,
    intensity: 'IX (Devastador)',
    description: 'Colapsó el 80% del adobe en la capital provincial. Es el hito histórico que originó la ingeniería sismorresistente argentina.',
    historicalImpact: 'Creó el CONCAR y sentó las bases fundacionales del INPRES.'
  },
  {
    id: 'ev_1977',
    label: '1977 · M7.4',
    locationName: 'Sierra de Pie de Palo',
    department: 'Caucete',
    lat: -31.65,
    lng: -67.75,
    magnitude: 7.4,
    year: 1977,
    color: '#EF4444',
    type: 'quake',
    date: '23 de Noviembre de 1977 (06:23 hs)',
    depth: 17,
    intensity: 'IX (Destructivo)',
    description: 'Generó licuación generalizada en viñedos. Las estructuras modernas construidas tras 1944 no colapsaron, validando las normas.',
    historicalImpact: 'Confirmó ante el mundo la eficacia del código sismorresistente sanjuanino.'
  },
  {
    id: 'ev_2021',
    label: '2021 · M6.4',
    locationName: 'Sarmiento / Pocito',
    department: 'Pocito - Sarmiento',
    lat: -31.85,
    lng: -68.55,
    magnitude: 6.4,
    year: 2021,
    color: '#FACC15',
    type: 'quake',
    date: '18 de Enero de 2021 (23:46 hs)',
    depth: 8,
    intensity: 'VII (Muy Fuerte)',
    description: 'Sismo superficial que sacudió intensamente todo Cuyo. La edificación moderna impidió pérdidas fatales.',
    historicalImpact: 'Monitoreo 100% digital en tiempo real con acelerógrafos de última generación.'
  },
  {
    id: 'fault_laja',
    label: 'Falla La Laja',
    locationName: 'Falla Geológica Activa',
    department: 'Albardón',
    lat: -31.35,
    lng: -68.48,
    magnitude: 5.5,
    color: '#22D3EE',
    type: 'fault',
    date: 'Monitoreo Continuo',
    depth: 10,
    intensity: 'Falla Neotectónica',
    description: 'Escarpe de falla inversa cuaternaria activa. Fuente sismogénica de sismos superficiales en el Gran San Juan.',
    historicalImpact: 'Monitoreada con sensores GPS y estaciones sismológicas permanentes del INPRES.'
  },
  {
    id: 'fault_tulum',
    label: 'Falla Tulum',
    locationName: 'Valle de Tulum',
    department: 'Capital - Rawson',
    lat: -31.55,
    lng: -68.51,
    magnitude: 5.2,
    color: '#22D3EE',
    type: 'fault',
    date: 'Red Urbana INPRES',
    depth: 12,
    intensity: 'Monitoreo Urbano',
    description: 'Sistema sismogénico bajo la cuenca sedimentaria del Gran San Juan, vigilado continuamente por la red de acelerógrafos.',
    historicalImpact: 'Permite optimizar los mapas de microzonificación sísmica del INPRES.'
  }
];

export const SeismicMapPage: React.FC<SeismicMapPageProps> = ({ onNavigate, onFinishGame }) => {
  const [selectedId, setSelectedId] = useState<string>('ev_1944');
  const [filterType, setFilterType] = useState<'all' | 'major' | 'faults'>('all');
  const [visitedIds, setVisitedIds] = useState<string[]>(['ev_1944']);

  const filteredMarkers = SEISMIC_MARKERS.filter(m => {
    if (filterType === 'major') return m.type === 'quake' && (m.magnitude || 0) >= 7.0;
    if (filterType === 'faults') return m.type === 'fault';
    return true;
  });

  const activeItem = SEISMIC_MARKERS.find(m => m.id === selectedId) || SEISMIC_MARKERS[0];

  const handleSelectMarker = (marker: MapMarkerItem) => {
    sound.playClick();
    setSelectedId(marker.id);
    setVisitedIds(prev => prev.includes(marker.id) ? prev : [...prev, marker.id]);
  };

  return (
    <div className="p-4 sm:p-5 space-y-4 pb-28 max-w-md mx-auto select-none font-sans text-slate-100">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { sound.playClick(); onNavigate('home'); }}
          className="w-10 h-10 rounded-2xl bg-navy-900/90 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan hover:bg-navy-800 active:scale-95 transition-all"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="px-3.5 py-1 rounded-full bg-brand-cyan/15 border border-brand-cyan/40 text-brand-cyan font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>RED NACIONAL INPRES</span>
        </div>
      </div>

      {/* Header Info */}
      <div className="text-center space-y-0.5">
        <h1 className="font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
          MAPA SÍSMICO DE SAN JUAN
        </h1>
        <p className="text-xs text-slate-300">
          Tocá un epicentro en el mapa para ver sus datos técnicos
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-1.5 p-1 rounded-2xl bg-navy-950/80 border border-white/10 text-[11px] font-bold">
        <button
          onClick={() => setFilterType('all')}
          className={`flex-1 py-1.5 rounded-xl transition-all ${
            filterType === 'all'
              ? 'bg-brand-cyan text-navy-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Todos ({SEISMIC_MARKERS.length})
        </button>
        <button
          onClick={() => setFilterType('major')}
          className={`flex-1 py-1.5 rounded-xl transition-all ${
            filterType === 'major'
              ? 'bg-rose-500 text-white font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          M &ge; 7.0 (Mayores)
        </button>
        <button
          onClick={() => setFilterType('faults')}
          className={`flex-1 py-1.5 rounded-xl transition-all ${
            filterType === 'faults'
              ? 'bg-cyan-500 text-navy-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Fallas Activas
        </button>
      </div>

      {/* Interactive San Juan Map */}
      <div className="relative">
        <SanJuanMap
          markers={filteredMarkers}
          activeMarkerId={selectedId}
          onMarkerClick={handleSelectMarker}
          showWaveAnimation={true}
        />
      </div>

      {/* Map Legend */}
      <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold p-2.5 rounded-2xl bg-navy-950/80 border border-white/10">
        <div className="flex items-center justify-center gap-1 text-rose-400">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
          <span>M &ge; 7.0 (Mayor)</span>
        </div>
        <div className="flex items-center justify-center gap-1 text-amber-400">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
          <span>M 6.0 - 6.9</span>
        </div>
        <div className="flex items-center justify-center gap-1 text-cyan-400">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm" />
          <span>Falla Activa</span>
        </div>
      </div>

      {/* Active Seismic Event Telemetry Card */}
      {activeItem && (
        <div className="p-4 rounded-3xl bg-navy-950/95 border border-brand-cyan/50 shadow-2xl space-y-3 animate-in fade-in duration-200">
          {/* Card Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-2.5">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider" style={{ backgroundColor: activeItem.color, color: '#030A16' }}>
                  {activeItem.type === 'fault' ? 'FALLA ACTIVA' : `MAGNITUD M ${activeItem.magnitude}`}
                </span>
                <span className="text-[10px] font-bold text-slate-400">{activeItem.date}</span>
              </div>
              <h2 className="font-black text-lg text-white mt-1">
                📍 {activeItem.locationName}
              </h2>
              <span className="text-[11px] text-brand-cyan font-bold block">
                Departamento: {activeItem.department}
              </span>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-navy-900 border border-brand-cyan/30 flex items-center justify-center text-xl shrink-0">
              {activeItem.type === 'fault' ? '⚡' : '🌋'}
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-navy-900/90 border border-white/10">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Profundidad</span>
              <span className="font-black text-xs text-brand-cyan">{activeItem.depth} km</span>
            </div>
            <div className="p-2 rounded-xl bg-navy-900/90 border border-white/10">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Intensidad</span>
              <span className="font-black text-xs text-amber-300 truncate block">{activeItem.intensity.split(' ')[0]}</span>
            </div>
            <div className="p-2 rounded-xl bg-navy-900/90 border border-white/10">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Red</span>
              <span className="font-black text-xs text-emerald-400">INPRES</span>
            </div>
          </div>

          {/* Technical Description */}
          <div className="space-y-1 bg-navy-900/60 p-2.5 rounded-2xl border border-white/5">
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeItem.description}
            </p>
            <div className="pt-1.5 border-t border-white/10 text-[10px] text-brand-cyan font-semibold flex items-center gap-1">
              <Shield className="w-3 h-3 text-brand-cyan shrink-0" />
              <span>{activeItem.historicalImpact}</span>
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Carousel of Epicenters */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1 block">
          HITOS SÍSMICOS DE SAN JUAN:
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SEISMIC_MARKERS.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedId(item.id);
                  setVisitedIds(prev => prev.includes(item.id) ? prev : [...prev, item.id]);
                }}
                className={`flex-shrink-0 p-2.5 rounded-2xl border transition-all text-left w-36 ${
                  isSelected
                    ? 'bg-navy-900 border-brand-cyan shadow-glow-cyan/30 scale-102'
                    : 'bg-navy-950/80 border-white/10 hover:border-brand-cyan/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black" style={{ color: item.color }}>
                    {item.label.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white">
                    {item.type === 'fault' ? 'Falla' : `M${item.magnitude}`}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-300 block truncate mt-1">
                  {item.department}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Exploration Mission Completion Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-950/90 via-navy-900/95 to-navy-950/95 border-2 border-brand-cyan shadow-glow-cyan/25 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📡</span>
            <div>
              <h3 className="font-black text-xs text-white uppercase tracking-wider">
                Misión de Monitoreo INPRES
              </h3>
              <p className="text-[11px] text-slate-300 font-medium">
                Has inspeccionado {visitedIds.length} de {SEISMIC_MARKERS.length} eventos sísmicos.
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-brand-cyan/20 text-brand-cyan font-black text-[10px]">
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
          <span>¡Finalizar Exploración y Reclamar Puntos!</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
