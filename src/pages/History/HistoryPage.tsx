import React, { useState } from 'react';
import { ArrowLeft, Compass, Calendar, MapPin, Activity, BookOpen, ExternalLink } from 'lucide-react';
import { ScreenId, HistoricalEvent } from '../../types';
import { HISTORICAL_EVENTS } from '../../services/gamesService';
import { sound } from '../../lib/sound';
import { Modal } from '../../components/ui/Modal';

interface HistoryPageProps {
  onNavigate: (screen: ScreenId) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);

  return (
    <div className="p-4 sm:p-5 space-y-5 pb-28 max-w-md mx-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { sound.playClick(); onNavigate('home'); }}
          className="w-10 h-10 rounded-2xl sismo-card flex items-center justify-center text-slate-300 hover:text-white"
          aria-label="Volver a Inicio"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5" />
          <span>MUSEO DIGITAL</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-1 py-1">
        <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
          HISTORIA SÍSMICA DE SAN JUAN
        </h1>
        <p className="text-xs text-slate-300 font-medium">
          Los hitos históricos que forjaron la ingeniería sismorresistente del INPRES.
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative space-y-4 pt-2">
        {/* Timeline Line */}
        <div className="absolute left-[29px] top-4 bottom-4 w-1 bg-gradient-to-b from-brand-gold via-brand-cyan to-brand-blue rounded-full opacity-40"></div>

        {HISTORICAL_EVENTS.map((item) => (
          <div key={item.id} className="relative flex items-start gap-4">
            {/* Year Badge Node */}
            <div className="relative z-10 w-14 h-14 rounded-2xl bg-navy-900 border-2 border-brand-gold text-brand-gold flex items-center justify-center font-black text-xs shrink-0 shadow-glow-gold/20">
              {item.year}
            </div>

            {/* Event Card */}
            <button
              onClick={() => { sound.playClick(); setSelectedEvent(item); }}
              className="flex-1 sismo-card p-4 text-left border-white/10 hover:border-brand-gold/50 transition-all active:scale-[0.98] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-brand-gold tracking-wider">
                  Magnitud M {item.magnitude}
                </span>
                <span className="text-[10px] font-bold text-accent-gray">
                  {item.dateStr.split('(')[0]}
                </span>
              </div>

              <h2 className="font-black text-sm text-white leading-tight">
                {item.title}
              </h2>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
                {item.description}
              </p>

              <div className="pt-1 flex items-center gap-2 text-[10px] text-brand-cyan font-bold">
                <MapPin className="w-3 h-3" />
                <span>{item.location}</span>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Event Details Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent ? `Terremoto de ${selectedEvent.year}` : ''}
      >
        {selectedEvent && (
          <div className="space-y-3.5 text-left">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-navy-950 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-bold text-accent-gray block">Magnitud</span>
                <span className="font-black text-base text-accent-error">M {selectedEvent.magnitude}</span>
              </div>
              <div className="bg-navy-950 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-bold text-accent-gray block">Intensidad</span>
                <span className="font-black text-xs text-brand-yellow truncate block">{selectedEvent.intensityMercalli}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-black text-xs text-brand-gold uppercase tracking-wider">
                Ubicación & Fecha
              </h4>
              <p className="text-xs text-slate-200 font-semibold">
                📍 {selectedEvent.location} — {selectedEvent.dateStr}
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-black text-xs text-brand-cyan uppercase tracking-wider">
                Impacto & Reconstrucción
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedEvent.description}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 text-[11px] text-accent-gray flex items-center justify-between font-medium">
              <span>Fuente: {selectedEvent.source}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
