import React, { useState } from 'react';
import { ArrowLeft, MapPin, Activity, ShieldAlert, Layers } from 'lucide-react';
import { ScreenId, SeismicEvent } from '../../types';
import { SanJuanMap, MapMarkerItem } from '../../components/map/SanJuanMap';
import { SEISMIC_MAP_EVENTS } from '../../services/gamesService';
import { BottomSheet } from '../../components/ui/Modal';
import { sound } from '../../lib/sound';

interface SeismicMapPageProps {
  onNavigate: (screen: ScreenId) => void;
}

export const SeismicMapPage: React.FC<SeismicMapPageProps> = ({ onNavigate }) => {
  const [selectedEvent, setSelectedEvent] = useState<SeismicEvent | null>(null);

  const markers: MapMarkerItem[] = [
    { id: 'ev_3', label: '1944 · M7.4', xPercent: 54, yPercent: 50, magnitude: 7.4, color: '#EF4444' },
    { id: 'ev_2', label: '1977 · M7.4', xPercent: 65, yPercent: 58, magnitude: 7.4, color: '#EF4444' },
    { id: 'ev_1', label: '2021 · M6.4', xPercent: 49, yPercent: 68, magnitude: 6.4, color: '#FACC15' },
    { id: 'fault_1', label: 'Falla La Laja', xPercent: 46, yPercent: 45, magnitude: 5.2, color: '#22D3EE' },
  ];

  const handleMarkerClick = (marker: MapMarkerItem) => {
    sound.playClick();
    const found = SEISMIC_MAP_EVENTS.find(e => e.id === marker.id) || {
      id: marker.id,
      event_date: 'Monitoreo Permanente',
      event_time: 'Registro INPRES',
      latitude: -31.42,
      longitude: -68.53,
      depth: 12,
      magnitude: marker.magnitude || 5.0,
      location: marker.label,
      province: 'San Juan',
      intensity: 'Actividad Falla Activa',
      description: 'Estructura geológica sismogénica monitoreada por la Red Sismológica Nacional del INPRES.',
      source: 'INPRES Oficial'
    };
    setSelectedEvent(found);
  };

  return (
    <div className="p-4 sm:p-5 space-y-4 pb-28 max-w-md mx-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { sound.playClick(); onNavigate('home'); }}
          className="w-10 h-10 rounded-2xl sismo-card flex items-center justify-center text-slate-300 hover:text-white"
          aria-label="Volver a Inicio"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="px-3 py-1 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" />
          <span>RED INPRES</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-0.5">
        <h1 className="font-black text-2xl text-white uppercase tracking-tight">
          MAPA SÍSMICO DE SAN JUAN
        </h1>
        <p className="text-xs text-slate-300 font-medium">
          Tocá los epicentros y fallas geológicas para consultar su ficha técnica.
        </p>
      </div>

      {/* Reusable Interactive San Juan Map */}
      <div className="sismo-card p-3 border-brand-cyan/30 shadow-2xl">
        <SanJuanMap
          markers={markers}
          activeMarkerId={selectedEvent?.id}
          onMarkerClick={handleMarkerClick}
          showWaveAnimation={true}
        />
      </div>

      {/* Map Legend */}
      <div className="sismo-card p-3.5 grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
        <div className="flex items-center justify-center gap-1.5 text-accent-error">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-error"></span>
          <span>M &ge; 7.0 (Mayor)</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-brand-yellow">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow"></span>
          <span>M 6.0 - 6.9 (Fuerte)</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-brand-cyan">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan"></span>
          <span>Falla Activa</span>
        </div>
      </div>

      {/* Bottom Sheet for Seismic Event Details */}
      <BottomSheet
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="SISMO REGISTRADO (INPRES)"
      >
        {selectedEvent && (
          <div className="space-y-3.5 text-left">
            <div className="flex items-center justify-between bg-navy-950 p-3 rounded-2xl border border-white/10">
              <div>
                <span className="text-[10px] font-black text-brand-cyan uppercase tracking-wider block">
                  EPICENTRO / ZONA
                </span>
                <h3 className="font-extrabold text-base text-white">
                  📍 {selectedEvent.location}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-accent-gray block">MAGNITUD</span>
                <span className="font-black text-lg text-accent-error">M {selectedEvent.magnitude}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-navy-950 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-bold text-accent-gray block">Fecha</span>
                <span className="font-bold text-xs text-white truncate block">{selectedEvent.event_date}</span>
              </div>
              <div className="bg-navy-950 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-bold text-accent-gray block">Profundidad</span>
                <span className="font-bold text-xs text-brand-yellow">{selectedEvent.depth} km</span>
              </div>
              <div className="bg-navy-950 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-bold text-accent-gray block">Intensidad</span>
                <span className="font-bold text-xs text-brand-cyan truncate block">{selectedEvent.intensity}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                DESCRIPCIÓN TÉCNICA
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {selectedEvent.description}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 text-[11px] text-accent-gray flex items-center justify-between font-bold">
              <span>Fuente Oficial: {selectedEvent.source}</span>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
