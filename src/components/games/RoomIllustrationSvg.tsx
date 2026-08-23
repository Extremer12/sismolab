import React from 'react';
import { SafeHomeHazard } from '../../types';
import { ShieldCheck, Search } from 'lucide-react';

interface RoomIllustrationSvgProps {
  hazards: SafeHomeHazard[];
  selectedHazardId: string | null;
  isShaking: boolean;
  onSelectHazard: (hazard: SafeHomeHazard) => void;
}

export const RoomIllustrationSvg: React.FC<RoomIllustrationSvgProps> = ({
  hazards,
  selectedHazardId,
  isShaking,
  onSelectHazard
}) => {
  return (
    <div className={`relative w-full h-80 sm:h-84 rounded-3xl overflow-hidden border-2 border-brand-cyan/40 bg-gradient-to-b from-slate-950 via-navy-900 to-navy-950 shadow-2xl transition-transform ${
      isShaking ? 'animate-shake' : ''
    }`}>
      {/* 1. Architectural SVG Background Canvas */}
      <svg
        viewBox="0 0 500 360"
        className="w-full h-full object-cover select-none pointer-events-none"
      >
        <defs>
          {/* Room Gradients */}
          <linearGradient id="wallGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B1E38" />
            <stop offset="100%" stopColor="#061426" />
          </linearGradient>
          <linearGradient id="floorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0E2C52" />
            <stop offset="100%" stopColor="#040D1A" />
          </linearGradient>
          <linearGradient id="windowGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0D5FFF" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="woodGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2A1B10" />
            <stop offset="100%" stopColor="#3D2817" />
          </linearGradient>
        </defs>

        {/* --- ROOM WALLS & PERSPECTIVE --- */}
        {/* Back Wall */}
        <polygon points="60,40 440,40 440,260 60,260" fill="url(#wallGradient)" stroke="#1E3A5F" strokeWidth="1.5" />
        {/* Left Wall (Perspective) */}
        <polygon points="0,0 60,40 60,260 0,360" fill="#07172C" stroke="#162D4A" strokeWidth="1.5" />
        {/* Right Wall (Perspective) */}
        <polygon points="440,40 500,0 500,360 440,260" fill="#07172C" stroke="#162D4A" strokeWidth="1.5" />
        {/* Floor */}
        <polygon points="60,260 440,260 500,360 0,360" fill="url(#floorGradient)" stroke="#22D3EE" strokeOpacity="0.3" strokeWidth="1.5" />

        {/* Floor Grid Lines */}
        <line x1="60" y1="260" x2="0" y2="360" stroke="#22D3EE" strokeOpacity="0.2" strokeWidth="1" />
        <line x1="155" y1="260" x2="125" y2="360" stroke="#22D3EE" strokeOpacity="0.15" strokeWidth="1" />
        <line x1="250" y1="260" x2="250" y2="360" stroke="#22D3EE" strokeOpacity="0.2" strokeWidth="1" />
        <line x1="345" y1="260" x2="375" y2="360" stroke="#22D3EE" strokeOpacity="0.15" strokeWidth="1" />
        <line x1="440" y1="260" x2="500" y2="360" stroke="#22D3EE" strokeOpacity="0.2" strokeWidth="1" />
        <line x1="30" y1="310" x2="470" y2="310" stroke="#22D3EE" strokeOpacity="0.15" strokeWidth="1" />

        {/* --- ARCHITECTURAL FURNITURE & DETAILS --- */}
        {/* 1. Large Window (Right Wall) */}
        <g opacity="0.9">
          <polygon points="380,80 430,70 430,220 380,210" fill="url(#windowGlow)" stroke="#38BDF8" strokeWidth="2" />
          <line x1="405" y1="75" x2="405" y2="215" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="380" y1="145" x2="430" y2="145" stroke="#38BDF8" strokeWidth="1.5" />
          <polygon points="385,170 405,140 415,155 425,130 430,140 430,210 385,210" fill="#0C2548" />
        </g>

        {/* 2. Tall Bookcase (Right of Center) */}
        <g>
          <rect x="330" y="70" width="45" height="150" fill="url(#woodGradient)" stroke="#5B3E25" strokeWidth="1.5" rx="3" />
          <line x1="330" y1="110" x2="375" y2="110" stroke="#5B3E25" strokeWidth="2" />
          <line x1="330" y1="150" x2="375" y2="150" stroke="#5B3E25" strokeWidth="2" />
          <line x1="330" y1="190" x2="375" y2="190" stroke="#5B3E25" strokeWidth="2" />
          <rect x="333" y="85" width="6" height="25" fill="#EF4444" rx="1" />
          <rect x="340" y="80" width="7" height="30" fill="#3B82F6" rx="1" />
          <rect x="348" y="88" width="5" height="22" fill="#FACC15" rx="1" />
          <rect x="354" y="83" width="8" height="27" fill="#10B981" rx="1" />
          <rect x="335" y="125" width="8" height="25" fill="#A855F7" rx="1" />
          <rect x="344" y="120" width="10" height="30" fill="#EC4899" rx="1" />
        </g>

        {/* 3. Bed & Headboard (Center-Right) */}
        <g>
          <polygon points="210,210 330,210 360,290 190,290" fill="#1E293B" stroke="#334155" strokeWidth="2" />
          <polygon points="215,205 325,205 355,275 195,275" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
          <polygon points="200,240 345,240 355,275 195,275" fill="#0369A1" />
          <rect x="225" y="200" width="40" height="18" fill="#F8FAFC" rx="4" opacity="0.9" />
          <rect x="275" y="200" width="40" height="18" fill="#F8FAFC" rx="4" opacity="0.9" />
          <rect x="210" y="150" width="120" height="55" fill="url(#woodGradient)" stroke="#5B3E25" strokeWidth="2" rx="4" />
        </g>

        {/* 4. Heavy Picture / Mirror Frame (Above Headboard) */}
        <g>
          <rect x="235" y="80" width="70" height="50" fill="#0F172A" stroke="#F59E0B" strokeWidth="3" rx="2" />
          <polygon points="245,120 260,95 275,115 285,105 295,120" fill="#334155" />
          <circle cx="285" cy="95" r="4" fill="#F59E0B" />
        </g>

        {/* 5. TV & Entertainment Console (Left Wall) */}
        <g>
          <polygon points="80,180 170,180 185,240 65,240" fill="url(#woodGradient)" stroke="#5B3E25" strokeWidth="2" />
          <rect x="90" y="115" width="70" height="50" fill="#020617" stroke="#475569" strokeWidth="3" rx="4" />
          <rect x="94" y="119" width="62" height="42" fill="#0F172A" />
          <polygon points="100,150 120,130 140,145 150,135 154,155 96,155" fill="#0284C7" opacity="0.4" />
          <polygon points="115,165 135,165 140,180 110,180" fill="#334155" />
        </g>

        {/* 6. Top Shelf with Heavy Vase (Center-Left) */}
        <g>
          <rect x="190" y="55" width="70" height="8" fill="url(#woodGradient)" stroke="#5B3E25" strokeWidth="1.5" rx="2" />
          <ellipse cx="225" cy="45" rx="9" ry="12" fill="#D97706" stroke="#B45309" strokeWidth="1.5" />
          <ellipse cx="225" cy="33" rx="5" ry="2" fill="#F59E0B" />
        </g>

        {/* 7. Ceiling Chandelier / Lamp (Top Center) */}
        <g>
          <line x1="250" y1="0" x2="250" y2="32" stroke="#E2E8F0" strokeWidth="2" />
          <polygon points="235,32 265,32 275,45 225,45" fill="#FACC15" stroke="#EAB308" strokeWidth="1.5" />
          <ellipse cx="250" cy="45" rx="25" ry="6" fill="#FEF08A" opacity="0.8" />
        </g>

        {/* 8. Escape Corridor / Doorway (Far Left) */}
        <g>
          <polygon points="10,100 45,115 45,280 10,320" fill="#020617" stroke="#1E293B" strokeWidth="2" />
          <polygon points="12,105 43,118 43,275 12,315" fill="#0369A1" opacity="0.2" />
          <rect x="18" y="125" width="22" height="10" fill="#10B981" rx="2" />
          <text x="29" y="132" fill="#FFFFFF" fontSize="6" fontWeight="bold" textAnchor="middle">SALIDA</text>
        </g>

        {/* 9. Gas Valve on lower left wall */}
        <g>
          <rect x="52" y="240" width="12" height="18" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" rx="2" />
          <circle cx="58" cy="246" r="4" fill="#EF4444" />
          <line x1="58" y1="246" x2="58" y2="258" stroke="#F59E0B" strokeWidth="2" />
        </g>
      </svg>

      {/* 2. Interactive Natural Inspection Targets (No spoiler warning badges) */}
      {hazards.map((hazard) => {
        const isSelected = selectedHazardId === hazard.id;
        const isSecured = hazard.isSecured;

        return (
          <button
            key={hazard.id}
            onClick={() => onSelectHazard(hazard)}
            style={{ left: `${hazard.x}%`, top: `${hazard.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl flex items-center justify-center transition-all duration-300 group z-20 active:scale-95 ${
              isSecured
                ? 'bg-emerald-950/90 border border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                : isSelected
                ? 'bg-brand-cyan/30 border-2 border-brand-cyan text-white shadow-[0_0_20px_rgba(34,211,238,0.7)] scale-110'
                : 'bg-navy-950/70 border border-white/20 text-slate-200 hover:border-brand-cyan/60 hover:bg-navy-900/90 backdrop-blur-sm'
            }`}
            title={`Inspeccionar ${hazard.name}`}
          >
            {isSecured ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            ) : (
              <Search className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
            )}
          </button>
        );
      })}
    </div>
  );
};
