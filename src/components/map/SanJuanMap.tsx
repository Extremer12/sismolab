import React, { useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Compass, MapPin } from 'lucide-react';

export interface MapMarkerItem {
  id: string;
  label: string;
  locationName: string;
  lat?: number;
  lng?: number;
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
  compact?: boolean;
}

// Major Departmental Centers of San Juan Province
const DEPARTMENT_ZONES = [
  { name: 'IGLESIA', x: 28, y: 26, color: '#0ea5e9' },
  { name: 'JÁCHAL', x: 50, y: 20, color: '#38bdf8' },
  { name: 'VALLE FÉRTIL', x: 80, y: 30, color: '#06b6d4' },
  { name: 'CALINGASTA', x: 24, y: 60, color: '#0284c7' },
  { name: 'ALBARDÓN', x: 54, y: 44, color: '#22d3ee' },
  { name: 'GRAN SAN JUAN', x: 50, y: 52, color: '#38bdf8' },
  { name: 'CAUCETE', x: 74, y: 58, color: '#f97316' },
  { name: 'POCITO', x: 48, y: 68, color: '#eab308' },
  { name: 'SARMIENTO', x: 46, y: 80, color: '#eab308' },
  { name: '25 DE MAYO', x: 70, y: 76, color: '#f59e0b' },
];

export const SanJuanMap: React.FC<SanJuanMapProps> = ({
  markers = [],
  activeMarkerId,
  onMarkerClick,
  showWaveAnimation = true,
  className = '',
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const activeMarker = markers.find(m => m.id === activeMarkerId);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(2.0, prev + 0.25));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(0.9, prev - 0.25));
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className={`relative w-full h-[390px] select-none overflow-hidden rounded-3xl border-2 border-brand-cyan/40 shadow-[0_12px_40px_rgba(4,14,27,0.9)] bg-gradient-to-b from-[#06152b] via-[#040e1d] to-[#02070f] ${className}`}>
      
      {/* 1. Background Coordinates Grid & Radar Scan Line */}
      <div className="absolute inset-0 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/60 pointer-events-none" />

      {/* Latitude & Longitude Reference Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 text-[8px] font-mono text-cyan-400">
        <div className="absolute top-[20%] left-2 border-t border-cyan-400/40 w-full flex justify-between pr-4">
          <span>30°S (Jáchal)</span>
          <span>68°W</span>
        </div>
        <div className="absolute top-[50%] left-2 border-t border-cyan-400/40 w-full flex justify-between pr-4">
          <span>31°S (Capital)</span>
          <span>68.5°W</span>
        </div>
        <div className="absolute top-[75%] left-2 border-t border-cyan-400/40 w-full flex justify-between pr-4">
          <span>32°S (Sarmiento)</span>
          <span>69°W</span>
        </div>
      </div>

      {/* 2. Interactive Scalable GIS Map Canvas */}
      <div
        className="w-full h-full relative transition-transform duration-300 ease-out flex items-center justify-center"
        style={{
          transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          transformOrigin: 'center center'
        }}
      >
        {/* Real Geographic Map Image of San Juan */}
        <div className="relative w-[340px] h-[340px] flex items-center justify-center">
          <img
            src="/images/sanjuanforma.png"
            alt="Provincia de San Juan"
            className="w-full h-full object-contain filter drop-shadow-[0_0_24px_rgba(0,184,255,0.65)] opacity-90"
            draggable={false}
          />

          {/* Geological Fault Traces Overlaid on Geography */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
            {/* Falla La Laja (Albardón) */}
            <path
              d="M 52,40 Q 55,44 57,48"
              stroke="#22D3EE"
              strokeWidth="1.2"
              strokeDasharray="2 1"
              fill="none"
              className="drop-shadow-[0_0_6px_rgba(34,211,238,0.9)]"
            />
            {/* Falla Pie de Palo (Caucete) */}
            <path
              d="M 68,52 Q 73,58 76,64"
              stroke="#EF4444"
              strokeWidth="1.4"
              strokeDasharray="2.5 1.5"
              fill="none"
              className="drop-shadow-[0_0_6px_rgba(239,68,68,0.9)]"
            />
            {/* Falla Maradona / Rinconada (Zonda - Pocito) */}
            <path
              d="M 44,62 Q 47,68 49,76"
              stroke="#FACC15"
              strokeWidth="1.2"
              strokeDasharray="2 1"
              fill="none"
              className="drop-shadow-[0_0_6px_rgba(250,204,21,0.9)]"
            />
            {/* Falla Tulum */}
            <path
              d="M 48,51 Q 51,55 52,60"
              stroke="#38BDF8"
              strokeWidth="1.2"
              strokeDasharray="2 1"
              fill="none"
              className="drop-shadow-[0_0_6px_rgba(56,189,248,0.9)]"
            />
          </svg>

          {/* Department Geographic Anchors */}
          {DEPARTMENT_ZONES.map((dept, idx) => (
            <div
              key={idx}
              style={{ left: `${dept.x}%`, top: `${dept.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center opacity-60"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_4px_#22d3ee]" />
              <span className="text-[7.5px] font-black text-slate-300 tracking-wider whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] mt-0.5">
                {dept.name}
              </span>
            </div>
          ))}

          {/* Radiating Waves for Active Selected Epicenter */}
          {showWaveAnimation && activeMarker && (
            <div
              style={{ left: `${activeMarker.xPercent}%`, top: `${activeMarker.yPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
            >
              <span
                className="absolute -inset-4 rounded-full border-2 border-brand-cyan animate-ping opacity-85"
                style={{ animationDuration: '2.0s' }}
              />
              <span
                className="absolute -inset-8 rounded-full border border-brand-electric animate-ping opacity-55"
                style={{ animationDuration: '3.0s' }}
              />
              <span
                className="absolute -inset-14 rounded-full border border-brand-cyan/40 animate-ping opacity-30"
                style={{ animationDuration: '4.0s' }}
              />
            </div>
          )}

          {/* Interactive Seismic Markers */}
          {markers.map((marker) => {
            const isSelected = activeMarkerId === marker.id;
            const markerColor = marker.color || (marker.magnitude && marker.magnitude >= 7.0 ? '#EF4444' : '#FACC15');

            return (
              <button
                key={marker.id}
                type="button"
                onClick={() => onMarkerClick && onMarkerClick(marker)}
                style={{ left: `${marker.xPercent}%`, top: `${marker.yPercent}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-300 flex flex-col items-center group cursor-pointer ${
                  isSelected ? 'scale-125 z-40' : 'hover:scale-115'
                }`}
              >
                {/* Core Seismic Node */}
                <div className="relative flex items-center justify-center">
                  {isSelected && (
                    <span
                      className="absolute -inset-2 rounded-full animate-ping opacity-80"
                      style={{ backgroundColor: markerColor }}
                    />
                  )}

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shadow-xl transition-all ${
                      isSelected
                        ? 'border-2 border-white ring-4 ring-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,1)]'
                        : 'border-2 border-navy-950 shadow-md'
                    }`}
                    style={{ backgroundColor: markerColor }}
                  >
                    <span className="text-[10px] font-black text-navy-950 leading-none">
                      {marker.type === 'fault' ? '⚡' : marker.magnitude ? `M${marker.magnitude.toFixed(1)}` : '•'}
                    </span>
                  </div>
                </div>

                {/* Floating Title Pill Under Node */}
                <div
                  className={`mt-1 px-2 py-0.5 rounded-full text-[9px] font-black tracking-tight whitespace-nowrap shadow-xl border transition-all ${
                    isSelected
                      ? 'bg-white text-navy-950 border-cyan-400 font-black shadow-glow-cyan scale-105'
                      : 'bg-navy-950/95 text-slate-100 border-white/20'
                  }`}
                >
                  {marker.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Floating UI Overlays & Title */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-navy-950/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-brand-cyan/40 text-[10px] font-black text-brand-cyan shadow-lg pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
        <span>MAPA CARTOGRÁFICO INPRES · SAN JUAN</span>
      </div>

      {/* Compass / Orientation */}
      <div className="absolute top-3 right-3 z-20 flex items-center justify-center w-8 h-8 rounded-xl bg-navy-950/90 backdrop-blur-md border border-white/10 text-slate-400 text-xs font-bold shadow-md pointer-events-none">
        <Compass className="w-4 h-4 text-cyan-400" />
      </div>

      {/* Zoom and Reset Controls (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-navy-950/90 backdrop-blur-md p-1 rounded-2xl border border-brand-cyan/40 shadow-xl">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-xl bg-navy-900 border border-white/10 text-brand-cyan flex items-center justify-center hover:bg-navy-800 active:scale-95 transition-all"
          title="Acercar"
          aria-label="Acercar"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-xl bg-navy-900 border border-white/10 text-brand-cyan flex items-center justify-center hover:bg-navy-800 active:scale-95 transition-all"
          title="Alejar"
          aria-label="Alejar"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetView}
          className="w-8 h-8 rounded-xl bg-navy-900 border border-white/10 text-brand-cyan flex items-center justify-center hover:bg-navy-800 active:scale-95 transition-all"
          title="Centrar provincia"
          aria-label="Centrar provincia"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
