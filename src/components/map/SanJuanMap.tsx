import React, { useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

export interface MapMarkerItem {
  id: string;
  label: string;
  shortYear: string;
  icon: string;
  locationName: string;
  department: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  magnitude?: number;
  year?: number;
  color?: string;
  type?: 'quake' | 'fault';
}

interface SanJuanMapProps {
  markers?: MapMarkerItem[];
  activeMarkerId?: string;
  onMarkerClick?: (marker: MapMarkerItem) => void;
  showWaveAnimation?: boolean;
  className?: string;
}

export const SanJuanMap: React.FC<SanJuanMapProps> = ({
  markers = [],
  activeMarkerId,
  onMarkerClick,
  showWaveAnimation = true,
  className = '',
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const activeMarker = markers.find(m => m.id === activeMarkerId);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(1.7, prev + 0.2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(0.9, prev - 0.2));
  };

  const handleResetView = () => {
    setZoomLevel(1);
  };

  return (
    <div className={`relative w-full h-[360px] select-none overflow-hidden rounded-3xl border-2 border-brand-cyan/30 shadow-[0_12px_35px_rgba(2,9,20,0.85)] bg-gradient-to-b from-[#07162c] via-[#040e1f] to-[#020712] flex items-center justify-center ${className}`}>
      
      {/* 1. Subtle Clean Glow Background */}
      <div className="absolute w-56 h-56 bg-brand-cyan/15 rounded-full blur-3xl pointer-events-none" />

      {/* 2. Scalable Map Layer */}
      <div
        className="w-full h-full relative transition-transform duration-300 ease-out flex items-center justify-center"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center center'
        }}
      >
        {/* San Juan Map Silhouette */}
        <div className="relative w-[310px] h-[310px] flex items-center justify-center">
          <img
            src="/images/sanjuanforma.png"
            alt="Mapa de San Juan"
            className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(0,184,255,0.7)]"
            draggable={false}
          />

          {/* Radiating Waves for Selected Epicenter */}
          {showWaveAnimation && activeMarker && (
            <div
              style={{ left: `${activeMarker.xPercent}%`, top: `${activeMarker.yPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
            >
              <span
                className="absolute -inset-3.5 rounded-full border-2 border-brand-cyan animate-ping opacity-90"
                style={{ animationDuration: '2s' }}
              />
              <span
                className="absolute -inset-7 rounded-full border border-brand-electric animate-ping opacity-60"
                style={{ animationDuration: '3s' }}
              />
            </div>
          )}

          {/* Clean, Non-Cluttered Interactive Markers */}
          {markers.map((marker) => {
            const isSelected = activeMarkerId === marker.id;
            const markerColor = marker.color || (marker.magnitude && marker.magnitude >= 7.0 ? '#EF4444' : '#FACC15');

            return (
              <button
                key={marker.id}
                type="button"
                onClick={() => onMarkerClick && onMarkerClick(marker)}
                style={{ left: `${marker.xPercent}%`, top: `${marker.yPercent}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-200 flex flex-col items-center cursor-pointer ${
                  isSelected ? 'scale-125 z-40' : 'hover:scale-115 opacity-90 hover:opacity-100'
                }`}
              >
                {/* Clean Circular Pin with Year/Icon */}
                <div
                  className={`px-2 py-1 rounded-full flex items-center gap-1 shadow-2xl transition-all border-2 ${
                    isSelected
                      ? 'border-white bg-brand-cyan text-navy-950 shadow-[0_0_20px_rgba(34,211,238,0.9)] ring-4 ring-cyan-400/40'
                      : 'border-white/30 bg-navy-950/90 text-white hover:border-brand-cyan'
                  }`}
                >
                  <span className="text-xs">{marker.icon || '📍'}</span>
                  <span className="text-[11px] font-black tracking-tight leading-none">
                    {marker.shortYear || marker.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Clean Title Badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-navy-950/90 backdrop-blur-md px-3 py-1 rounded-full border border-brand-cyan/30 text-[10px] font-black text-brand-cyan shadow-md pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
        <span>PROVINCIA DE SAN JUAN</span>
      </div>

      {/* 4. Minimalist Zoom Controls */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-navy-950/90 backdrop-blur-md p-1 rounded-2xl border border-white/10 shadow-lg">
        <button
          onClick={handleZoomIn}
          className="w-7 h-7 rounded-xl bg-navy-900 text-brand-cyan flex items-center justify-center hover:bg-navy-800 active:scale-95 transition-all text-sm font-black"
          title="Acercar"
          aria-label="Acercar"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleZoomOut}
          className="w-7 h-7 rounded-xl bg-navy-900 text-brand-cyan flex items-center justify-center hover:bg-navy-800 active:scale-95 transition-all text-sm font-black"
          title="Alejar"
          aria-label="Alejar"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleResetView}
          className="w-7 h-7 rounded-xl bg-navy-900 text-brand-cyan flex items-center justify-center hover:bg-navy-800 active:scale-95 transition-all"
          title="Centrar"
          aria-label="Centrar"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
