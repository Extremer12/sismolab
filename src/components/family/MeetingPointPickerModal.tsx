import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Search,
  Navigation,
  Check,
  X,
  AlertCircle,
  Loader2,
  Sparkles,
  ChevronRight,
  Route,
  Trash2,
  Plus,
  RotateCcw,
  Building2,
  GraduationCap,
  Briefcase,
  HeartPulse,
  ShieldAlert,
  Users
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { FamilyPlan, CustomMeetingPoint, CustomPointType } from '../../types';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../theme/ThemeContext';
import {
  searchAddress,
  reverseGeocode,
  getCurrentGPSLocation,
  formatEvacuationRoute,
  SAN_JUAN_EVACUATION_PRESETS,
  GeocodingResult
} from '../../services/geocodingService';

interface MeetingPointPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: FamilyPlan;
  initialTarget?: string; // 'home' | 'primary' | 'secondary' | customId
  onSavePlan: (updatedPlan: FamilyPlan) => void;
}

// Controller to smoothly fly/pan map to target coordinates
const MapViewController: React.FC<{ targetCoords: [number, number] | null; zoom?: number }> = ({
  targetCoords,
  zoom = 16
}) => {
  const map = useMap();
  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, zoom, {
        duration: 1.0,
        easeLinearity: 0.25
      });
    }
  }, [targetCoords, zoom, map]);
  return null;
};

// Map click listener component
const MapClickHandler: React.FC<{ onMapClick: (coords: [number, number]) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
};

// Category config for custom points
export const CUSTOM_POINT_CATEGORIES: { type: CustomPointType; labelEs: string; labelEn: string; icon: string; color: string }[] = [
  { type: 'escuela', labelEs: 'Escuela / Colegio', labelEn: 'School', icon: '🎒', color: '#F59E0B' },
  { type: 'trabajo', labelEs: 'Trabajo / Oficina', labelEn: 'Work', icon: '💼', color: '#0EA5E9' },
  { type: 'salud', labelEs: 'Hospital / Centro de Salud', labelEn: 'Hospital', icon: '🏥', color: '#EF4444' },
  { type: 'seguro', labelEs: 'Plaza / Zona Segura', labelEn: 'Safe Area', icon: '🛡️', color: '#10B981' },
  { type: 'familiar', labelEs: 'Casa de Familiar', labelEn: 'Relatives Home', icon: '👨‍👩‍👧', color: '#EC4899' },
  { type: 'otro', labelEs: 'Punto Personalizado', labelEn: 'Custom Point', icon: '📍', color: '#8B5CF6' },
];

export const MeetingPointPickerModal: React.FC<MeetingPointPickerModalProps> = ({
  isOpen,
  onClose,
  plan,
  initialTarget = 'primary',
  onSavePlan
}) => {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const es = language === 'es';

  // Target point being edited: 'home' | 'primary' | 'secondary' | customId
  const [activeTarget, setActiveTarget] = useState<string>(initialTarget);

  // Home State
  const [homeName, setHomeName] = useState(plan.home_name || (es ? 'Vivienda Familiar' : 'Home Base'));
  const [homeAddress, setHomeAddress] = useState(plan.home_address || '');
  const [homeCoords, setHomeCoords] = useState<[number, number]>(plan.home_coords || [-31.5350, -68.5320]);

  // Primary Meeting Point State
  const [primaryName, setPrimaryName] = useState(plan.meeting_point_primary || 'Plaza 25 de Mayo (Centro San Juan)');
  const [primaryCoords, setPrimaryCoords] = useState<[number, number] | null>(plan.meeting_point_primary_coords || [-31.5375, -68.5364]);
  const [primaryNotes, setPrimaryNotes] = useState(
    plan.meeting_point_primary_notes ||
      (es
        ? 'Zona abierta y despejada. Punto de reunión inmediata en los primeros 15 min.'
        : 'Open clearing. Immediate rendezvous within 15 min.')
  );

  // Secondary Meeting Point State (Can be null / deleted!)
  const [secondaryName, setSecondaryName] = useState(plan.meeting_point_secondary || '');
  const [secondaryCoords, setSecondaryCoords] = useState<[number, number] | null>(
    plan.meeting_point_secondary_coords !== undefined ? plan.meeting_point_secondary_coords : [-31.5303, -68.5418]
  );
  const [secondaryNotes, setSecondaryNotes] = useState(
    plan.meeting_point_secondary_notes ||
      (es
        ? 'Punto de repliegue si el barrio o accesos principales quedan bloqueados.'
        : 'Secondary assembly area if the neighborhood is inaccessible.')
  );

  // Custom Points State
  const [customPoints, setCustomPoints] = useState<CustomMeetingPoint[]>(plan.custom_points || []);

  // Search & GPS states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Synchronize state when modal opens
  useEffect(() => {
    if (isOpen) {
      setHomeName(plan.home_name || (es ? 'Vivienda Familiar' : 'Home Base'));
      setHomeAddress(plan.home_address || '');
      setHomeCoords(plan.home_coords || [-31.5350, -68.5320]);

      setPrimaryName(plan.meeting_point_primary || 'Plaza 25 de Mayo (Centro San Juan)');
      setPrimaryCoords(plan.meeting_point_primary_coords !== undefined ? plan.meeting_point_primary_coords : [-31.5375, -68.5364]);
      setPrimaryNotes(plan.meeting_point_primary_notes || '');

      setSecondaryName(plan.meeting_point_secondary || '');
      setSecondaryCoords(plan.meeting_point_secondary_coords !== undefined ? plan.meeting_point_secondary_coords : null);
      setSecondaryNotes(plan.meeting_point_secondary_notes || '');

      setCustomPoints(Array.isArray(plan.custom_points) ? [...plan.custom_points] : []);

      setActiveTarget(initialTarget || 'primary');
      setSearchQuery('');
      setSearchResults([]);
      setGpsError(null);
    }
  }, [isOpen, plan, initialTarget, es]);

  // Selected Custom Point (if activeTarget matches one)
  const activeCustomPoint = useMemo(() => {
    return customPoints.find((p) => p.id === activeTarget) || null;
  }, [customPoints, activeTarget]);

  // Current active coordinates for map centering
  const currentCoords = useMemo<[number, number] | null>(() => {
    if (activeTarget === 'home') return homeCoords;
    if (activeTarget === 'secondary') return secondaryCoords || homeCoords;
    if (activeCustomPoint) return activeCustomPoint.coords;
    return primaryCoords || homeCoords;
  }, [activeTarget, homeCoords, primaryCoords, secondaryCoords, activeCustomPoint]);

  // Evacuation route metric from Home to currently active point (if not home)
  const routeMetric = useMemo(() => {
    if (activeTarget === 'home' || !homeCoords || !currentCoords) return null;
    return formatEvacuationRoute(homeCoords, currentCoords);
  }, [activeTarget, homeCoords, currentCoords]);

  // Pin Generator
  const createPinIcon = (label: string, bgHex: string, subLabel: string, isSelected: boolean) => {
    return L.divIcon({
      className: 'custom-pin-marker',
      html: `
        <div style="position:relative;display:flex;flex-direction:column;align-items:center;cursor:grab;">
          <div style="
            display:flex;align-items:center;justify-content:center;
            width:${isSelected ? '44px' : '38px'};height:${isSelected ? '44px' : '38px'};
            background:${bgHex};border:${isSelected ? '3.5px solid #20D9F5' : '3px solid #FFFFFF'};
            border-radius:50%;
            box-shadow:${isSelected ? '0 0 20px rgba(32,217,245,0.8), 0 6px 18px rgba(0,0,0,0.5)' : '0 6px 18px rgba(0,0,0,0.45)'};
            color:white;font-weight:900;font-size:${isSelected ? '16px' : '14px'};font-family:sans-serif;
            transition:all 0.2s ease;
          ">
            ${label}
          </div>
          <div style="
            background:#061426;color:${isSelected ? '#20D9F5' : '#FFFFFF'};
            font-size:9px;font-weight:800;letter-spacing:0.5px;
            padding:2px 6px;border-radius:6px;margin-top:2px;
            white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.5);
            border:1px solid ${isSelected ? 'rgba(32,217,245,0.6)' : 'rgba(255,255,255,0.2)'};
          ">
            ${subLabel}
          </div>
        </div>
      `,
      iconSize: [80, 60],
      iconAnchor: [40, 22],
    });
  };

  const homePin = useMemo(
    () => createPinIcon('🏠', '#0EA5E9', es ? 'HOGAR' : 'HOME', activeTarget === 'home'),
    [es, activeTarget]
  );
  const primaryPin = useMemo(
    () => createPinIcon('1', '#10B981', es ? 'PRINCIPAL' : 'POINT 1', activeTarget === 'primary'),
    [es, activeTarget]
  );
  const secondaryPin = useMemo(
    () => createPinIcon('2', '#6366F1', es ? 'ALTERNO' : 'POINT 2', activeTarget === 'secondary'),
    [es, activeTarget]
  );

  // Address search handler
  const handleExecuteSearch = async (queryText: string) => {
    if (!queryText.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setGpsError(null);
    try {
      const results = await searchAddress(queryText);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Helper to update coords for active target
  const updateActiveCoords = async (coords: [number, number], autoResolveAddress = true) => {
    if (activeTarget === 'home') {
      setHomeCoords(coords);
    } else if (activeTarget === 'primary') {
      setPrimaryCoords(coords);
    } else if (activeTarget === 'secondary') {
      setSecondaryCoords(coords);
    } else if (activeCustomPoint) {
      setCustomPoints((prev) =>
        prev.map((pt) => (pt.id === activeTarget ? { ...pt, coords } : pt))
      );
    }

    if (autoResolveAddress) {
      try {
        const resolved = await reverseGeocode(coords);
        if (activeTarget === 'home') {
          if (!homeAddress) setHomeAddress(resolved);
        } else if (activeTarget === 'primary') {
          if (!primaryName || primaryName.includes('Plaza')) {
            setPrimaryName(resolved);
          }
        } else if (activeTarget === 'secondary') {
          if (!secondaryName || secondaryName.includes('Parque')) {
            setSecondaryName(resolved);
          }
        } else if (activeCustomPoint) {
          setCustomPoints((prev) =>
            prev.map((pt) =>
              pt.id === activeTarget && !pt.address ? { ...pt, address: resolved } : pt
            )
          );
        }
      } catch {}
    }
  };

  // Select location from search or preset
  const handleSelectLocation = (result: GeocodingResult) => {
    sound.playClick();
    if (activeTarget === 'home') {
      setHomeCoords(result.coords);
      setHomeName(result.name);
      setHomeAddress(result.displayName);
    } else if (activeTarget === 'primary') {
      setPrimaryCoords(result.coords);
      setPrimaryName(result.name);
    } else if (activeTarget === 'secondary') {
      setSecondaryCoords(result.coords);
      setSecondaryName(result.name);
    } else if (activeCustomPoint) {
      setCustomPoints((prev) =>
        prev.map((pt) => (pt.id === activeTarget ? { ...pt, coords: result.coords, name: result.name } : pt))
      );
    }
    setSearchResults([]);
    setSearchQuery('');
  };

  // Direct map click to place/adjust pin
  const handleMapClick = (coords: [number, number]) => {
    sound.playClick();
    updateActiveCoords(coords, true);
  };

  // Use GPS location for active point
  const handleUseGPS = async () => {
    sound.playClick();
    setIsLocatingGPS(true);
    setGpsError(null);
    try {
      const { coords } = await getCurrentGPSLocation();
      updateActiveCoords(coords, true);
    } catch {
      setGpsError(es ? 'No pudimos acceder a tu GPS. Verificá los permisos del navegador.' : 'Unable to access GPS.');
    } finally {
      setIsLocatingGPS(false);
    }
  };

  // Delete secondary meeting point
  const handleDeleteSecondary = () => {
    sound.playClick();
    setSecondaryCoords(null);
    setSecondaryName('');
    setSecondaryNotes('');
    setActiveTarget('primary');
  };

  // Activate secondary meeting point
  const handleActivateSecondary = () => {
    sound.playClick();
    // Position it slightly offset from home or center of San Juan
    const defaultCoords: [number, number] = homeCoords
      ? [homeCoords[0] + 0.005, homeCoords[1] - 0.005]
      : [-31.5303, -68.5418];
    setSecondaryCoords(defaultCoords);
    setSecondaryName(es ? 'Punto 02 Alternativo (Parque de Mayo)' : 'Point 02 Alternative');
    setActiveTarget('secondary');
  };

  // Add a new custom meeting point
  const handleAddCustomPoint = () => {
    sound.playClick();
    const newId = 'point-' + Date.now();
    const defaultCoords: [number, number] = homeCoords
      ? [homeCoords[0] - 0.004, homeCoords[1] + 0.004]
      : [-31.5350, -68.5320];

    const newPt: CustomMeetingPoint = {
      id: newId,
      name: es ? 'Nuevo Punto Seguro' : 'New Safe Point',
      coords: defaultCoords,
      type: 'seguro',
      notes: es ? 'Lugar despejado de reunión' : 'Safe open area'
    };

    setCustomPoints((prev) => [...prev, newPt]);
    setActiveTarget(newId);
  };

  // Delete a custom point
  const handleDeleteCustomPoint = (id: string) => {
    sound.playClick();
    setCustomPoints((prev) => prev.filter((p) => p.id !== id));
    if (activeTarget === id) {
      setActiveTarget('primary');
    }
  };

  // Reset Primary Point to preset
  const handleResetPrimary = () => {
    sound.playClick();
    setPrimaryCoords([-31.5375, -68.5364]);
    setPrimaryName('Plaza 25 de Mayo (Centro San Juan)');
    setPrimaryNotes(es ? 'Zona abierta y despejada. Punto de reunión inmediata en los primeros 15 min.' : 'Open clearing.');
  };

  // Save all configured points to family plan
  const handleSave = () => {
    sound.playCorrect();
    const updatedPlan: FamilyPlan = {
      ...plan,
      home_name: homeName.trim() || (es ? 'Vivienda Familiar' : 'Home Base'),
      home_address: homeAddress.trim(),
      home_coords: homeCoords,
      meeting_point_primary: primaryName.trim() || (es ? 'Punto 01 Principal' : 'Point 01 Primary'),
      meeting_point_primary_coords: primaryCoords,
      meeting_point_primary_notes: primaryNotes.trim(),
      meeting_point_secondary: secondaryCoords ? (secondaryName.trim() || (es ? 'Punto 02 Alternativo' : 'Point 02 Secondary')) : null,
      meeting_point_secondary_coords: secondaryCoords,
      meeting_point_secondary_notes: secondaryCoords ? secondaryNotes.trim() : undefined,
      custom_points: customPoints,
      updated_at: new Date().toISOString()
    };

    onSavePlan(updatedPlan);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none font-sans overflow-y-auto">
      <div
        className={`rounded-3xl max-w-xl w-full p-4 sm:p-5 space-y-3.5 shadow-2xl border my-auto transition-colors duration-200 animate-in zoom-in-95 max-h-[96vh] flex flex-col ${
          isDark ? 'bg-navy-950 border-brand-cyan/30 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center ${
              isDark ? 'bg-brand-cyan/20 border-brand-cyan/50 text-brand-cyan' : 'bg-cyan-100 border-cyan-300 text-cyan-800'
            }`}>
              <MapPin className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className={`font-black text-base sm:text-lg leading-tight uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {es ? 'Configurar y Modificar Puntos Seguros' : 'Configure Safe Meeting Points'}
              </h2>
              <p className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {es ? 'Podés arrastrar marcadores en el mapa, modificarlos o eliminarlos' : 'Drag markers, modify or delete points'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
              isDark ? 'border-white/10 text-slate-400 hover:text-white bg-navy-900' : 'border-slate-200 text-slate-500 hover:text-slate-900 bg-slate-100'
            }`}
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pestañas de selección de puntos */}
        <div className="space-y-1.5 shrink-0">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {es ? 'Puntos activos en el mapa:' : 'Active map points:'}
            </span>
            <button
              type="button"
              onClick={handleAddCustomPoint}
              className="text-[11px] font-bold text-brand-cyan hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{es ? 'Sumar punto seguro (Escuela, Trabajo...)' : 'Add safe point'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-thin">
            {/* Tab Hogar */}
            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveTarget('home'); }}
              className={`py-1.5 px-3 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 border ${
                activeTarget === 'home'
                  ? 'bg-sky-600 text-white border-sky-400 shadow-md ring-2 ring-sky-400/30'
                  : isDark
                  ? 'bg-navy-900/90 text-slate-300 border-white/10 hover:text-white'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900'
              }`}
            >
              <span>🏠</span>
              <span>{homeName || (es ? 'Hogar' : 'Home')}</span>
            </button>

            {/* Tab Punto 01 */}
            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveTarget('primary'); }}
              className={`py-1.5 px-3 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 border ${
                activeTarget === 'primary'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-400/30'
                  : isDark
                  ? 'bg-navy-900/90 text-slate-300 border-white/10 hover:text-white'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300" />
              <span className="truncate max-w-[140px]">{primaryName || (es ? 'Punto 01' : 'Point 01')}</span>
            </button>

            {/* Tab Punto 02 (si existe o botón para activar) */}
            {secondaryCoords ? (
              <button
                type="button"
                onClick={() => { sound.playClick(); setActiveTarget('secondary'); }}
                className={`py-1.5 px-3 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 border ${
                  activeTarget === 'secondary'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-400/30'
                    : isDark
                    ? 'bg-navy-900/90 text-slate-300 border-white/10 hover:text-white'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-indigo-300" />
                <span className="truncate max-w-[140px]">{secondaryName || (es ? 'Punto 02' : 'Point 02')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleActivateSecondary}
                className="py-1.5 px-2.5 rounded-xl border border-dashed border-indigo-400/50 text-indigo-400 hover:bg-indigo-500/10 transition-all flex items-center gap-1 whitespace-nowrap shrink-0 text-[11px]"
              >
                <Plus className="w-3 h-3" />
                <span>{es ? 'Activar Punto 02' : 'Add Point 02'}</span>
              </button>
            )}

            {/* Tabs para Puntos Personalizados */}
            {customPoints.map((pt) => {
              const cat = CUSTOM_POINT_CATEGORIES.find((c) => c.type === pt.type) || CUSTOM_POINT_CATEGORIES[5];
              const isSelected = activeTarget === pt.id;
              return (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => { sound.playClick(); setActiveTarget(pt.id); }}
                  className={`py-1.5 px-3 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 border ${
                    isSelected
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md ring-2 ring-purple-400/30'
                      : isDark
                      ? 'bg-navy-900/90 text-slate-300 border-white/10 hover:text-white'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="truncate max-w-[130px]">{pt.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Barra de Búsqueda y GPS */}
        <div className="space-y-2 shrink-0">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length >= 3) {
                    handleExecuteSearch(e.target.value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleExecuteSearch(searchQuery);
                  }
                }}
                placeholder={
                  activeTarget === 'home'
                    ? es ? 'Dirección de tu casa (ej: Mendoza 450 Sur, San Juan)...' : 'Type home street address...'
                    : activeTarget === 'primary'
                    ? es ? 'Buscá una plaza cercana para Punto 01...' : 'Search nearby plaza for Point 01...'
                    : activeTarget === 'secondary'
                    ? es ? 'Buscá parque o polideportivo para Punto 02...' : 'Search secondary gathering point...'
                    : es ? `Buscá dirección para ${activeCustomPoint?.name || 'punto seguro'}...` : 'Search address...'
                }
                className={`w-full h-10 pl-9 pr-20 rounded-2xl border text-xs font-semibold focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-navy-900 border-white/15 text-white placeholder-slate-400 focus:border-brand-cyan'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-cyan-600'
                }`}
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />

              <button
                type="button"
                onClick={() => handleExecuteSearch(searchQuery)}
                className={`absolute right-1 top-1 h-8 px-2.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all active:scale-95 ${
                  isDark ? 'bg-brand-cyan text-navy-950 font-black' : 'bg-slate-900 text-white'
                }`}
              >
                {isSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : <span>{es ? 'Buscar' : 'Search'}</span>}
              </button>
            </div>

            {/* GPS Locate Button */}
            <button
              type="button"
              onClick={handleUseGPS}
              disabled={isLocatingGPS}
              title={es ? 'Ubicar mi posición actual por GPS' : 'Use GPS location'}
              className={`h-10 px-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 active:scale-95 ${
                isDark
                  ? 'bg-navy-900 border-brand-cyan/40 text-brand-cyan hover:bg-navy-800'
                  : 'bg-white border-slate-300 text-cyan-800 hover:bg-slate-50 shadow-sm'
              }`}
            >
              {isLocatingGPS ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-500" />
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5 text-cyan-500" />
                  <span className="hidden sm:inline">{es ? 'Mi GPS' : 'GPS'}</span>
                </>
              )}
            </button>
          </div>

          {gpsError && (
            <div className="flex items-center gap-1.5 text-xs text-rose-500 font-bold bg-rose-500/10 p-2 rounded-xl border border-rose-500/30">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{gpsError}</span>
            </div>
          )}

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className={`p-2 rounded-2xl border space-y-1 max-h-40 overflow-y-auto shadow-xl ${
              isDark ? 'bg-navy-900/95 border-brand-cyan/40' : 'bg-white border-slate-300'
            }`}>
              <div className="text-[10px] font-black uppercase text-slate-400 px-2 pt-1">
                {es ? 'Resultados (tocá para ubicar el punto seleccionado):' : 'Found locations:'}
              </div>
              {searchResults.map((res) => (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => handleSelectLocation(res)}
                  className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-colors ${
                    isDark ? 'hover:bg-navy-800 text-slate-100' : 'hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="pr-2 min-w-0">
                    <span className="font-bold text-xs block truncate">{res.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{res.displayName}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Presets Sugeridos de San Juan */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px] font-bold scrollbar-thin">
            <span className="text-slate-400 uppercase text-[10px] shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{es ? 'Sugeridos SJ:' : 'SJ Presets:'}</span>
            </span>
            {SAN_JUAN_EVACUATION_PRESETS.slice(0, 6).map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectLocation(preset)}
                className={`px-2.5 py-0.5 rounded-full whitespace-nowrap border shrink-0 transition-all active:scale-95 text-[10px] ${
                  isDark
                    ? 'bg-navy-900/90 border-white/10 text-slate-300 hover:text-white hover:border-brand-cyan/50'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:border-cyan-500'
                }`}
              >
                {preset.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* MAPA INTERACTIVO CON PINS ARRASTRABLES */}
        <div className="relative rounded-2xl overflow-hidden border shadow-inner flex-1 min-h-[220px] sm:min-h-[250px]">
          <MapContainer
            center={currentCoords || [-31.5350, -68.5320]}
            zoom={15}
            className="w-full h-full"
            style={{ background: isDark ? '#061426' : '#E2E8F0', height: '100%', minHeight: '220px' }}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer
              url={
                isDark
                  ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
                  : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
              }
              maxZoom={17}
            />
            {isDark && (
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
                maxZoom={17}
              />
            )}

            <MapViewController targetCoords={currentCoords} zoom={16} />
            <MapClickHandler onMapClick={handleMapClick} />

            {/* Polylines de rutas de evacuación desde el hogar */}
            {homeCoords && primaryCoords && (
              <Polyline
                positions={[homeCoords, primaryCoords]}
                pathOptions={{
                  color: '#10B981',
                  weight: 3.5,
                  dashArray: '6, 6',
                  opacity: 0.8
                }}
              />
            )}
            {homeCoords && secondaryCoords && (
              <Polyline
                positions={[homeCoords, secondaryCoords]}
                pathOptions={{
                  color: '#6366F1',
                  weight: 3.5,
                  dashArray: '6, 6',
                  opacity: 0.8
                }}
              />
            )}

            {/* MARCADOR HOGAR (Arrastrable) */}
            {homeCoords && (
              <Marker
                position={homeCoords}
                icon={homePin}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const latlng = e.target.getLatLng();
                    updateActiveCoords([latlng.lat, latlng.lng], true);
                  },
                  click: () => {
                    sound.playClick();
                    setActiveTarget('home');
                  }
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="text-xs p-1">
                    <strong>🏠 {homeName}</strong>
                    <p className="text-[10px] text-slate-500">{es ? 'Arrastrá para reubicar tu casa' : 'Drag to reposition home'}</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* MARCADOR PUNTO 01 PRINCIPAL (Arrastrable) */}
            {primaryCoords && (
              <Marker
                position={primaryCoords}
                icon={primaryPin}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const latlng = e.target.getLatLng();
                    updateActiveCoords([latlng.lat, latlng.lng], true);
                  },
                  click: () => {
                    sound.playClick();
                    setActiveTarget('primary');
                  }
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="text-xs p-1">
                    <strong>🟢 {primaryName}</strong>
                    <p className="text-[10px] text-slate-500">{es ? 'Arrastrá para mover el Punto 01' : 'Drag to reposition'}</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* MARCADOR PUNTO 02 ALTERNATIVO (Arrastrable, si está activo) */}
            {secondaryCoords && (
              <Marker
                position={secondaryCoords}
                icon={secondaryPin}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const latlng = e.target.getLatLng();
                    updateActiveCoords([latlng.lat, latlng.lng], true);
                  },
                  click: () => {
                    sound.playClick();
                    setActiveTarget('secondary');
                  }
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="text-xs p-1">
                    <strong>🔵 {secondaryName}</strong>
                    <p className="text-[10px] text-slate-500">{es ? 'Arrastrá para mover el Punto 02' : 'Drag to reposition'}</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* MARCADORES PUNTOS PERSONALIZADOS (Arrastrables) */}
            {customPoints.map((pt) => {
              const cat = CUSTOM_POINT_CATEGORIES.find((c) => c.type === pt.type) || CUSTOM_POINT_CATEGORIES[5];
              const isSelected = activeTarget === pt.id;
              const customPin = createPinIcon(cat.icon, cat.color, pt.name, isSelected);

              return (
                <Marker
                  key={pt.id}
                  position={pt.coords}
                  icon={customPin}
                  draggable={true}
                  eventHandlers={{
                    dragend: (e) => {
                      const latlng = e.target.getLatLng();
                      setCustomPoints((prev) =>
                        prev.map((p) => (p.id === pt.id ? { ...p, coords: [latlng.lat, latlng.lng] } : p))
                      );
                    },
                    click: () => {
                      sound.playClick();
                      setActiveTarget(pt.id);
                    }
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="text-xs p-1">
                      <strong>{cat.icon} {pt.name}</strong>
                      <p className="text-[10px] text-slate-500">{cat.labelEs}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Banner de ayuda interactiva */}
          <div className="absolute bottom-2 left-2 right-2 z-[400] bg-navy-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-[10px] font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
              <span>
                {activeTarget === 'home'
                  ? es ? 'Modificando Hogar: arrastrá el pin 🏠 o tocá el mapa' : 'Editing Home: drag pin or tap map'
                  : activeTarget === 'primary'
                  ? es ? 'Modificando Punto 01: arrastrá el pin 1️⃣ o tocá el mapa' : 'Editing Point 01: drag pin or tap map'
                  : activeTarget === 'secondary'
                  ? es ? 'Modificando Punto 02: arrastrá el pin 2️⃣ o tocá el mapa' : 'Editing Point 02: drag pin or tap map'
                  : es ? `Modificando ${activeCustomPoint?.name}: arrastrá el pin o tocá el mapa` : 'Editing point'}
              </span>
            </span>
          </div>
        </div>

        {/* FICHA DE DETALLES Y ACCIONES DEL PUNTO SELECCIONADO */}
        <div className={`p-3 rounded-2xl border space-y-2.5 shrink-0 ${
          isDark ? 'bg-navy-900 border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          {/* CASO: HOGAR FAMILIAR */}
          {activeTarget === 'home' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400 bg-sky-500/15 px-2 py-0.5 rounded border border-sky-500/30">
                  🏠 {es ? 'Vivienda Familiar · Punto de Partida' : 'Home Base'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  [{homeCoords[0].toFixed(4)}, {homeCoords[1].toFixed(4)}]
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className={`text-[10px] font-black uppercase block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {es ? 'Nombre del Hogar:' : 'Home Label:'}
                  </label>
                  <input
                    type="text"
                    value={homeName}
                    onChange={(e) => setHomeName(e.target.value)}
                    placeholder="Ej: Casa Familiar, Depto..."
                    className={`w-full p-2 rounded-xl border text-xs font-bold focus:outline-none ${
                      isDark ? 'bg-navy-950 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-[10px] font-black uppercase block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {es ? 'Calle / Dirección o Barrio:' : 'Address:'}
                  </label>
                  <input
                    type="text"
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                    placeholder="Ej: Mendoza 450 Sur..."
                    className={`w-full p-2 rounded-xl border text-xs font-bold focus:outline-none ${
                      isDark ? 'bg-navy-950 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* CASO: PUNTO 01 PRINCIPAL */}
          {activeTarget === 'primary' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                  🟢 {es ? 'Punto 01 · Reunión Inmediata (15 min)' : 'Point 01 · Primary'}
                </span>
                <div className="flex items-center gap-2">
                  {routeMetric && (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {routeMetric.distanceFormatted} (~{routeMetric.timeFormatted})
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleResetPrimary}
                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-bold"
                    title={es ? 'Restablecer a Plaza 25 de Mayo' : 'Reset to default'}
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{es ? 'Restablecer' : 'Reset'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className={`text-[10px] font-black uppercase block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {es ? 'Nombre del Punto 01:' : 'Point 01 Name:'}
                </label>
                <input
                  type="text"
                  value={primaryName}
                  onChange={(e) => setPrimaryName(e.target.value)}
                  placeholder="Ej: Plaza 25 de Mayo, Plaza del Barrio..."
                  className={`w-full p-2 rounded-xl border text-xs font-bold focus:outline-none ${
                    isDark ? 'bg-navy-950 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`text-[10px] font-black uppercase block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {es ? 'Instrucciones / Referencias tácticas:' : 'Notes:'}
                </label>
                <input
                  type="text"
                  value={primaryNotes}
                  onChange={(e) => setPrimaryNotes(e.target.value)}
                  placeholder={es ? 'Ej: Esperar junto al mástil, sector sin vidrios...' : 'Notes...'}
                  className={`w-full p-2 rounded-xl border text-[11px] font-medium focus:outline-none ${
                    isDark ? 'bg-navy-950 border-white/15 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                  }`}
                />
              </div>
            </div>
          )}

          {/* CASO: PUNTO 02 ALTERNATIVO */}
          {activeTarget === 'secondary' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded border border-indigo-500/30">
                  🔵 {es ? 'Punto 02 · Alternativo Exterior' : 'Point 02 · Alternative'}
                </span>
                <div className="flex items-center gap-2">
                  {routeMetric && (
                    <span className="text-[10px] font-mono text-indigo-400 font-bold">
                      {routeMetric.distanceFormatted} (~{routeMetric.timeFormatted})
                    </span>
                  )}
                  {secondaryCoords && (
                    <button
                      type="button"
                      onClick={handleDeleteSecondary}
                      className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20 active:scale-95 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{es ? 'Eliminar Punto 02' : 'Delete Point'}</span>
                    </button>
                  )}
                </div>
              </div>

              {secondaryCoords ? (
                <>
                  <div>
                    <label className={`text-[10px] font-black uppercase block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {es ? 'Nombre del Punto 02 (Alternativo):' : 'Point 02 Name:'}
                    </label>
                    <input
                      type="text"
                      value={secondaryName}
                      onChange={(e) => setSecondaryName(e.target.value)}
                      placeholder="Ej: Parque de Mayo (Monumento al Deporte)..."
                      className={`w-full p-2 rounded-xl border text-xs font-bold focus:outline-none ${
                        isDark ? 'bg-navy-950 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`text-[10px] font-black uppercase block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {es ? 'Instrucciones si el barrio queda inaccesible:' : 'Instructions:'}
                    </label>
                    <input
                      type="text"
                      value={secondaryNotes}
                      onChange={(e) => setSecondaryNotes(e.target.value)}
                      placeholder={es ? 'Ej: Repliegue si hay corte de accesos...' : 'Notes...'}
                      className={`w-full p-2 rounded-xl border text-[11px] font-medium focus:outline-none ${
                        isDark ? 'bg-navy-950 border-white/15 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                      }`}
                    />
                  </div>
                </>
              ) : (
                <div className="p-3 text-center space-y-2">
                  <p className="text-xs text-slate-400">
                    {es ? 'Punto 02 actualmente eliminado del mapa.' : 'Point 02 currently removed from map.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleActivateSecondary}
                    className="py-1.5 px-3 rounded-xl bg-indigo-600 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{es ? 'Volver a Activar Punto 02' : 'Reactivate Point 02'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* CASO: PUNTO PERSONALIZADO (ESCUELA, TRABAJO, ETC.) */}
          {activeCustomPoint && (
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded border border-purple-500/30 flex items-center gap-1">
                  <span>✨</span>
                  <span>{es ? 'Punto Seguro Personalizado' : 'Custom Safe Point'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteCustomPoint(activeCustomPoint.id)}
                  className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20 active:scale-95 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{es ? 'Eliminar este Punto' : 'Delete Point'}</span>
                </button>
              </div>

              {/* Selector de categoría */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-bold scrollbar-thin">
                <span className="text-[10px] text-slate-400 uppercase shrink-0 mr-1">{es ? 'Tipo:' : 'Type:'}</span>
                {CUSTOM_POINT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.type}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setCustomPoints((prev) =>
                        prev.map((pt) => (pt.id === activeCustomPoint.id ? { ...pt, type: cat.type } : pt))
                      );
                    }}
                    className={`px-2 py-0.5 rounded-lg border text-[10px] flex items-center gap-1 shrink-0 transition-all ${
                      activeCustomPoint.type === cat.type
                        ? 'bg-purple-600 text-white border-purple-400 font-black'
                        : isDark
                        ? 'bg-navy-950 border-white/10 text-slate-300'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.labelEs}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className={`text-[10px] font-black uppercase block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {es ? 'Nombre del Lugar:' : 'Place Name:'}
                  </label>
                  <input
                    type="text"
                    value={activeCustomPoint.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomPoints((prev) =>
                        prev.map((pt) => (pt.id === activeCustomPoint.id ? { ...pt, name: val } : pt))
                      );
                    }}
                    placeholder="Ej: Escuela Normal Sarmiento, Trabajo..."
                    className={`w-full p-2 rounded-xl border text-xs font-bold focus:outline-none ${
                      isDark ? 'bg-navy-950 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`text-[10px] font-black uppercase block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {es ? 'Dirección o Referencia:' : 'Address / Notes:'}
                  </label>
                  <input
                    type="text"
                    value={activeCustomPoint.notes || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomPoints((prev) =>
                        prev.map((pt) => (pt.id === activeCustomPoint.id ? { ...pt, notes: val } : pt))
                      );
                    }}
                    placeholder={es ? 'Ej: Puerta principal, patio abierto...' : 'Notes...'}
                    className={`w-full p-2 rounded-xl border text-[11px] font-medium focus:outline-none ${
                      isDark ? 'bg-navy-950 border-white/15 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className={`py-2 px-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {es ? 'Cancelar' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-brand-electric via-brand-cyan to-cyan-300 text-navy-950 font-black text-xs uppercase tracking-wider shadow-glow-cyan/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{es ? 'Guardar Cambios en el Mapa' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
