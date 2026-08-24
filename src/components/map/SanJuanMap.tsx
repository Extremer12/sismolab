import React from 'react';

export interface MapMarkerItem {
  id: string;
  label: string;
  locationName: string;
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

// Major departmental reference anchors for geographic clarity
const REFERENCE_CITIES = [
  { name: 'JÁCHAL', x: 48, y: 26 },
  { name: 'IGLESIA', x: 26, y: 34 },
  { name: 'CALINGASTA', x: 24, y: 64 },
  { name: 'SAN JUAN CAPITAL', x: 54, y: 55 },
  { name: 'CAUCETE', x: 74, y: 60 },
  { name: 'POCITO', x: 50, y: 72 },
  { name: 'VALLE FÉRTIL', x: 78, y: 32 }
];

export const SanJuanMap: React.FC<SanJuanMapProps> = ({
  markers = [],
  activeMarkerId,
  onMarkerClick,
  showWaveAnimation = true,
  className = '',
  compact = false
}) => {
  const activeMarker = markers.find(m => m.id === activeMarkerId);

  return (
    <div className={`relative w-full aspect-[4/3.8] max-h-[380px] flex items-center justify-center select-none overflow-hidden rounded-3xl bg-navy-950/95 border border-brand-cyan/30 shadow-2xl ${className}`}>
      {/* Background Radar Grid & Coordinates Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
      <div className="absolute w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* SVG Map of San Juan Province */}
      <svg
        className="w-full h-full p-3 relative z-10 filter drop-shadow-[0_0_20px_rgba(0,184,255,0.25)]"
        viewBox="0 0 400 420"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="sjMapGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B2545" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#08182B" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#040D18" stopOpacity="0.98" />
          </linearGradient>

          <filter id="sjGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Real Stylized Silhouette of San Juan Province with Departments */}
        <path
          d="M 130,25 
             L 210,38 
             L 280,60 
             L 335,130 
             L 355,210 
             L 340,290 
             L 300,350 
             L 240,385 
             L 170,395 
             L 110,355 
             L 75,285 
             L 60,195 
             L 80,105 
             Z"
          fill="url(#sjMapGrad2)"
          stroke="#22D3EE"
          strokeWidth="2.5"
          strokeLinejoin="round"
          filter="url(#sjGlow)"
        />

        {/* Cordillera de los Andes Border Line (West) */}
        <path
          d="M 80,105 
             L 115,165 
             L 100,245 
             L 110,355 
             L 75,285 
             L 60,195 
             Z"
          fill="#1E3A8A"
          fillOpacity="0.25"
          stroke="#00B8FF"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          opacity="0.8"
        />

        {/* Geological Fault Traces */}
        {/* 1. Falla La Laja (Albardón) */}
        <path
          d="M 195,190 Q 215,225 225,255"
          stroke="#22D3EE"
          strokeWidth="2.2"
          strokeDasharray="4 2"
          opacity="0.85"
        />
        {/* 2. Falla Pie de Palo (Caucete) */}
        <path
          d="M 270,220 Q 285,250 295,290"
          stroke="#EF4444"
          strokeWidth="2.2"
          strokeDasharray="5 3"
          opacity="0.85"
        />
        {/* 3. Falla Maradona / Rinconada (Pocito) */}
        <path
          d="M 180,280 Q 200,310 210,345"
          stroke="#FACC15"
          strokeWidth="2"
          strokeDasharray="4 3"
          opacity="0.8"
        />

        {/* Cordillera label */}
        <text x="85" y="210" fill="#22D3EE" fontSize="9" fontWeight="800" textAnchor="middle" opacity="0.6" transform="rotate(-75 85 210)">
          CORDILLERA DE LOS ANDES
        </text>

        {/* Reference Cities / Municipalities */}
        {!compact && REFERENCE_CITIES.map((city, idx) => (
          <g key={idx} transform={`translate(${(city.x / 100) * 400}, ${(city.y / 100) * 420})`}>
            <circle cx="0" cy="0" r="2" fill="#94A3B8" opacity="0.7" />
            <text
              x="0"
              y="-5"
              fill="#94A3B8"
              fontSize="8"
              fontWeight="800"
              textAnchor="middle"
              opacity="0.55"
              letterSpacing="1"
            >
              {city.name}
            </text>
          </g>
        ))}

        {/* Active Epicenter Seismic Radiating Waves */}
        {showWaveAnimation && activeMarker && (
          <g transform={`translate(${(activeMarker.xPercent / 100) * 400}, ${(activeMarker.yPercent / 100) * 420})`}>
            <circle cx="0" cy="0" r="16" fill="none" stroke={activeMarker.color || '#22D3EE'} strokeWidth="2.5" opacity="0.9" className="animate-ping" style={{ animationDuration: '2s' }} />
            <circle cx="0" cy="0" r="32" fill="none" stroke={activeMarker.color || '#22D3EE'} strokeWidth="1.5" opacity="0.6" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle cx="0" cy="0" r="48" fill="none" stroke={activeMarker.color || '#22D3EE'} strokeWidth="1" opacity="0.3" className="animate-ping" style={{ animationDuration: '4s' }} />
          </g>
        )}
      </svg>

      {/* Interactive Crisp Seismic Nodes Overlay */}
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
            {/* Pulsing Core Radar Node */}
            <div className="relative flex items-center justify-center">
              <span
                className={`w-6 h-6 rounded-full opacity-75 animate-ping absolute ${
                  isSelected ? 'scale-150' : ''
                }`}
                style={{ backgroundColor: markerColor }}
              />
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 transition-all ${
                  isSelected
                    ? 'border-white ring-4 ring-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.9)]'
                    : 'border-navy-950 shadow-md'
                }`}
                style={{ backgroundColor: markerColor }}
              >
                <span className="text-[10px] font-black text-navy-950">
                  {marker.type === 'fault' ? '⚡' : marker.magnitude ? `M${marker.magnitude.toFixed(1)}` : '•'}
                </span>
              </div>
            </div>

            {/* Clean Floating Badge Underneath */}
            <div
              className={`mt-1 px-2 py-0.5 rounded-full text-[9px] font-black tracking-tight whitespace-nowrap shadow-xl border transition-all ${
                isSelected
                  ? 'bg-white text-navy-950 border-cyan-400 font-extrabold shadow-glow-cyan'
                  : 'bg-navy-950/90 text-slate-200 border-white/20'
              }`}
            >
              {marker.label}
            </div>
          </button>
        );
      })}
    </div>
  );
};
