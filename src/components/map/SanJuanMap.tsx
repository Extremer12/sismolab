import React from 'react';

export interface MapMarkerItem {
  id: string;
  label: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  magnitude?: number;
  year?: number;
  color?: string;
  isActive?: boolean;
}

interface SanJuanMapProps {
  markers?: MapMarkerItem[];
  activeMarkerId?: string;
  onMarkerClick?: (marker: MapMarkerItem) => void;
  showWaveAnimation?: boolean;
  epicenterCoord?: { x: number; y: number };
  className?: string;
  compact?: boolean;
}

export const SanJuanMap: React.FC<SanJuanMapProps> = ({
  markers = [],
  activeMarkerId,
  onMarkerClick,
  showWaveAnimation = true,
  epicenterCoord = { x: 52, y: 56 },
  className = '',
  compact = false
}) => {
  return (
    <div className={`relative w-full aspect-[4/3] max-h-[360px] flex items-center justify-center select-none overflow-hidden rounded-2xl ${className}`}>
      {/* Background Radar Grid & Subtle Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-900 to-navy-950 pointer-events-none"></div>
      <div className="absolute w-48 h-48 bg-brand-cyan/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* SVG Map of San Juan Province */}
      <svg
        className="w-full h-full p-2 relative z-10 filter drop-shadow-[0_0_15px_rgba(0,184,255,0.2)]"
        viewBox="0 0 320 340"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="sjMapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0E2D52" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#081C33" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#061426" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="cordilleraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#081C33" stopOpacity="0" />
          </linearGradient>
          <filter id="mapGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Real Silhouette of San Juan Province */}
        <path
          d="M 105,18 
             L 165,30 
             L 215,48 
             L 255,100 
             L 272,165 
             L 262,230 
             L 235,278 
             L 190,305 
             L 135,315 
             L 85,282 
             L 58,225 
             L 48,155 
             L 65,85 
             Z"
          fill="url(#sjMapGrad)"
          stroke="#22D3EE"
          strokeWidth="2.2"
          strokeLinejoin="round"
          filter="url(#mapGlow)"
        />

        {/* Western Andes High Cordillera Strip */}
        <path
          d="M 65,85 
             L 90,135 
             L 80,200 
             L 85,282 
             L 58,225 
             L 48,155 
             Z"
          fill="url(#cordilleraGrad)"
          stroke="#00B8FF"
          strokeWidth="1"
          strokeDasharray="4 2"
          opacity="0.7"
        />

        {/* Geological Fault Lines (La Laja & Pie de Palo approximate fault traces) */}
        <path
          d="M 145,150 Q 165,190 175,230"
          stroke="#EF4444"
          strokeWidth="1.8"
          strokeDasharray="4 3"
          opacity="0.75"
        />
        <path
          d="M 185,175 Q 195,210 205,245"
          stroke="#FACC15"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          opacity="0.65"
        />

        {/* Geographic Labels */}
        {!compact && (
          <>
            <text x="160" y="85" fill="#94A3B8" fontSize="10" fontWeight="800" textAnchor="middle" letterSpacing="2" opacity="0.6">
              SAN JUAN
            </text>
            <text x="68" y="170" fill="#22D3EE" fontSize="8" fontWeight="600" textAnchor="middle" opacity="0.5">
              Cordillera
            </text>
            <text x="220" y="150" fill="#94A3B8" fontSize="8" fontWeight="600" textAnchor="middle" opacity="0.4">
              Valles
            </text>
          </>
        )}

        {/* Wave Pulse rings at epicenter if requested */}
        {showWaveAnimation && (
          <g transform={`translate(${(epicenterCoord.x / 100) * 320}, ${(epicenterCoord.y / 100) * 340})`}>
            <circle cx="0" cy="0" r="14" fill="none" stroke="#22D3EE" strokeWidth="2" opacity="0.8" className="animate-ping" style={{ animationDuration: '2.5s' }} />
            <circle cx="0" cy="0" r="28" fill="none" stroke="#00B8FF" strokeWidth="1.5" opacity="0.6" className="animate-ping" style={{ animationDuration: '3.5s' }} />
          </g>
        )}
      </svg>

      {/* Interactive Markers Overlay */}
      {markers.map((marker) => {
        const isSelected = activeMarkerId === marker.id;
        const markerColor = marker.color || (marker.magnitude && marker.magnitude >= 7.0 ? '#EF4444' : '#22D3EE');

        return (
          <button
            key={marker.id}
            onClick={() => onMarkerClick && onMarkerClick(marker)}
            style={{ left: `${marker.xPercent}%`, top: `${marker.yPercent}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-200 ${
              isSelected ? 'scale-125 z-30' : 'hover:scale-110'
            }`}
          >
            <div
              className={`px-2.5 py-1 rounded-full text-navy-950 font-extrabold text-[11px] flex items-center gap-1 shadow-lg border-2 ${
                isSelected ? 'border-white shadow-glow-cyan' : 'border-navy-900'
              }`}
              style={{ backgroundColor: markerColor }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-navy-950"></span>
              <span>{marker.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
