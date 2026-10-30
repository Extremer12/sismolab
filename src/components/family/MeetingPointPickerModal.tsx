import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  MapPin,
  Search,
  Navigation,
  Check,
  X,
  Compass,
  AlertCircle,
  ExternalLink,
  Loader2,
  Sparkles,
  Info,
  ChevronRight,
  Route
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { FamilyPlan } from '../../types';
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
  onSavePlan: (updatedPlan: FamilyPlan) => void;
}

// Controller to smoothly fly/pan map to target coordinates
const MapViewController: React.FC<{ targetCoords: [number, number]; zoom?: number }> = ({
  targetCoords,
  zoom = 16
}) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(targetCoords, zoom, {
      duration: 1.2,
      easeLinearity: 0.25
    });
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

export const MeetingPointPickerModal: React.FC<MeetingPointPickerModalProps> = ({
  isOpen,
  onClose,
  plan,
  onSavePlan
}) => {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const es = language === 'es';

  // Target point being edited: 'home' | 'primary' | 'secondary'
  const [activeTarget, setActiveTarget] = useState<'home' | 'primary' | 'secondary'>('primary');

  // Working copy of coordinates and names
  const [homeName, setHomeName] = useState(plan.home_name || (es ? 'Vivienda Familiar' : 'Home Base'));
  const [homeCoords, setHomeCoords] = useState<[number, number]>(plan.home_coords || [-31.5350, -68.5320]);

  const [primaryName, setPrimaryName] = useState(plan.meeting_point_primary || 'Plaza 25 de Mayo (Centro San Juan)');
  const [primaryCoords, setPrimaryCoords] = useState<[number, number]>(plan.meeting_point_primary_coords || [-31.5375, -68.5364]);
  const [primaryNotes, setPrimaryNotes] = useState(
    plan.meeting_point_primary_notes ||
      (es
        ? 'Zona abierta y despejada. Punto de reunión inmediata en los primeros 15 min.'
        : 'Open clearing. Immediate rendezvous within 15 min.')
  );

  const [secondaryName, setSecondaryName] = useState(plan.meeting_point_secondary || 'Parque de Mayo (Monumento al Deporte)');
  const [secondaryCoords, setSecondaryCoords] = useState<[number, number]>(plan.meeting_point_secondary_coords || [-31.5303, -68.5418]);
  const [secondaryNotes, setSecondaryNotes] = useState(
    plan.meeting_point_secondary_notes ||
      (es
        ? 'Punto de repliegue si el barrio o accesos principales quedan bloqueados.'
        : 'Secondary assembly area if the neighborhood is inaccessible.')
  );

  // Address search query and results
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Synchronize state when modal opens
  useEffect(() => {
    if (isOpen) {
      setHomeName(plan.home_name || (es ? 'Vivienda Familiar' : 'Home Base'));
      setHomeCoords(plan.home_coords || [-31.5350, -68.5320]);
      setPrimaryName(plan.meeting_point_primary || 'Plaza 25 de Mayo (Centro San Juan)');
      setPrimaryCoords(plan.meeting_point_primary_coords || [-31.5375, -68.5364]);
      setPrimaryNotes(plan.meeting_point_primary_notes || '');
      setSecondaryName(plan.meeting_point_secondary || 'Parque de Mayo (Monumento al Deporte)');
      setSecondaryCoords(plan.meeting_point_secondary_coords || [-31.5303, -68.5418]);
      setSecondaryNotes(plan.meeting_point_secondary_notes || '');
      setSearchQuery('');
      setSearchResults([]);
      setGpsError(null);
    }
  }, [isOpen, plan, es]);

  // Current active coordinates
  const currentCoords = useMemo<[number, number]>(() => {
    if (activeTarget === 'home') return homeCoords;
    if (activeTarget === 'secondary') return secondaryCoords;
    return primaryCoords;
  }, [activeTarget, homeCoords, primaryCoords, secondaryCoords]);

  // Evacuation route metric from Home to currently active point (if not home)
  const routeMetric = useMemo(() => {
    if (activeTarget === 'home') return null;
    return formatEvacuationRoute(homeCoords, currentCoords);
  }, [activeTarget, homeCoords, currentCoords]);

  // Custom marker pin generator
  const createPinIcon = (numberLabel: string, bgHex: string, subLabel: string) => {
    return L.divIcon({
      className: 'custom-pin-marker',
      html: `
        <div style="position:relative;display:flex;flex-direction:column;align-items:center;">
          <div style="display:flex;align-items:center;justify-content:center;width:38px;height:38px;background:${bgHex};border:3px solid #FFFFFF;border-radius:50%;box-shadow:0 6px 18px rgba(0,0,0,0.45);color:white;font-weight:900;font-size:14px;font-family:sans-serif;">
            ${numberLabel}
          </div>
          <div style="background:#061426;color:#FFFFFF;font-size:9px;font-weight:800;letter-spacing:0.5px;padding:2px 6px;border-radius:6px;margin-top:2px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.2);">
            ${subLabel}
          </div>
        </div>
      `,
      iconSize: [80, 56],
      iconAnchor: [40, 19],
    });
  };

  const homePin = useMemo(() => createPinIcon('🏠', '#0EA5E9', es ? 'HOGAR' : 'HOME'), [es]);
  const primaryPin = useMemo(() => createPinIcon('1', '#10B981', es ? 'PRINCIPAL' : 'POINT 1'), [es]);
  const secondaryPin = useMemo(() => createPinIcon('2', '#6366F1', es ? 'ALTERNO' : 'POINT 2'), [es]);

  // Search address handler with debounce or direct trigger
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

  // Select location from search or preset
  const handleSelectLocation = (result: GeocodingResult) => {
    sound.playClick();
    if (activeTarget === 'home') {
      setHomeCoords(result.coords);
      setHomeName(result.name);
    } else if (activeTarget === 'primary') {
      setPrimaryCoords(result.coords);
      setPrimaryName(result.name);
    } else {
      setSecondaryCoords(result.coords);
      setSecondaryName(result.name);
    }
    setSearchResults([]);
    setSearchQuery('');
  };

  // Direct map click to place/adjust pin
  const handleMapClick = async (coords: [number, number]) => {
    sound.playClick();
    if (activeTarget === 'home') {
      setHomeCoords(coords);
    } else if (activeTarget === 'primary') {
      setPrimaryCoords(coords);
    } else {
      setSecondaryCoords(coords);
    }

    // Try to auto-resolve street name via reverse geocoding
    try {
      const resolvedName = await reverseGeocode(coords);
      if (activeTarget === 'home') setHomeName(resolvedName);
      else if (activeTarget === 'primary') setPrimaryName(resolvedName);
      else setSecondaryName(resolvedName);
    } catch {}
  };

  // Use GPS location for active point
  const handleUseGPS = async () => {
    sound.playClick();
    setIsLocatingGPS(true);
    setGpsError(null);
    try {
      const { coords } = await getCurrentGPSLocation();
      if (activeTarget === 'home') {
        setHomeCoords(coords);
      } else if (activeTarget === 'primary') {
        setPrimaryCoords(coords);
      } else {
        setSecondaryCoords(coords);
      }
      const street = await reverseGeocode(coords);
      if (activeTarget === 'home') setHomeName(street);
      else if (activeTarget === 'primary') setPrimaryName(street);
      else setSecondaryName(street);
    } catch (err: any) {
      setGpsError(es ? 'No pudimos acceder a tu GPS. Verificá los permisos del navegador.' : 'Unable to access GPS.');
    } finally {
      setIsLocatingGPS(false);
    }
  };

  // Save all configured points to family plan
  const handleSave = () => {
    sound.playCorrect();
    const updatedPlan: FamilyPlan = {
      ...plan,
      home_name: homeName.trim() || 'Vivienda Familiar',
      home_coords: homeCoords,
      meeting_point_primary: primaryName.trim() || 'Punto 01 Principal',
      meeting_point_primary_coords: primaryCoords,
      meeting_point_primary_notes: primaryNotes.trim(),
      meeting_point_secondary: secondaryName.trim() || 'Punto 02 Alternativo',
      meeting_point_secondary_coords: secondaryCoords,
      meeting_point_secondary_notes: secondaryNotes.trim(),
      updated_at: new Date().toISOString()
    };

    onSavePlan(updatedPlan);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none font-sans overflow-y-auto">
      <div
        className={`rounded-3xl max-w-lg w-full p-4 sm:p-5 space-y-4 shadow-2xl border my-auto transition-colors duration-200 animate-in zoom-in-95 duration-200 max-h-[95vh] flex flex-col ${
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
                {es ? 'Configurá tus Puntos Seguros' : 'Configure Safe Meeting Points'}
              </h2>
              <p className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {es ? 'San Juan · Evacuación post-sismo planificada' : 'San Juan · Planned seismic evacuation'}
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

        {/* Target Tabs (Hogar / Punto 01 / Punto 02) */}
        <div className={`grid grid-cols-3 gap-1.5 p-1 rounded-2xl border text-xs font-black shrink-0 ${
          isDark ? 'bg-navy-900 border-white/10' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveTarget('home'); }}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTarget === 'home'
                ? 'bg-sky-600 text-white shadow-md'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🏠</span>
            <span className="truncate">{es ? 'Vivienda' : 'Home'}</span>
          </button>

          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveTarget('primary'); }}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTarget === 'primary'
                ? 'bg-emerald-600 text-white shadow-md'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300" />
            <span className="truncate">{es ? 'Punto 01' : 'Point 01'}</span>
          </button>

          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveTarget('secondary'); }}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTarget === 'secondary'
                ? 'bg-indigo-600 text-white shadow-md'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-300" />
            <span className="truncate">{es ? 'Punto 02' : 'Point 02'}</span>
          </button>
        </div>

        {/* Address Search & Quick Action Bar */}
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
                    ? es ? 'Cargá tu dirección de casa (ej: Mendoza 450 Sur)...' : 'Type your home street address...'
                    : activeTarget === 'primary'
                    ? es ? 'Buscá una plaza cercana (ej: Plaza de Concepción)...' : 'Search nearby plaza or open park...'
                    : es ? 'Buscá parque o punto regional (ej: Parque de Mayo)...' : 'Search regional gathering park...'
                }
                className={`w-full h-11 pl-10 pr-24 rounded-2xl border text-xs font-semibold focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-navy-900 border-white/15 text-white placeholder-slate-400 focus:border-brand-cyan'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-cyan-600'
                }`}
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />

              <button
                type="button"
                onClick={() => handleExecuteSearch(searchQuery)}
                className={`absolute right-1.5 top-1.5 h-8 px-3 rounded-xl font-bold text-xs flex items-center gap-1 transition-all active:scale-95 ${
                  isDark ? 'bg-brand-cyan text-navy-950 font-black' : 'bg-slate-900 text-white'
                }`}
              >
                {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>{es ? 'Buscar' : 'Search'}</span>}
              </button>
            </div>

            {/* GPS Locate Button */}
            <button
              type="button"
              onClick={handleUseGPS}
              disabled={isLocatingGPS}
              title={es ? 'Detectar mi ubicación actual con GPS' : 'Use current GPS location'}
              className={`h-11 px-3.5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 active:scale-95 ${
                isDark
                  ? 'bg-navy-900 border-brand-cyan/40 text-brand-cyan hover:bg-navy-800'
                  : 'bg-white border-slate-300 text-cyan-800 hover:bg-slate-50 shadow-sm'
              }`}
            >
              {isLocatingGPS ? (
                <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
              ) : (
                <>
                  <Navigation className="w-4 h-4 text-cyan-500" />
                  <span className="hidden sm:inline">{es ? 'Mi GPS' : 'GPS'}</span>
                </>
              )}
            </button>
          </div>

          {gpsError && (
            <div className="flex items-center gap-1.5 text-xs text-rose-500 font-bold bg-rose-500/10 p-2 rounded-xl border border-rose-500/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{gpsError}</span>
            </div>
          )}

          {/* Autocomplete Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className={`p-2 rounded-2xl border space-y-1 max-h-44 overflow-y-auto shadow-xl ${
              isDark ? 'bg-navy-900/95 border-brand-cyan/40' : 'bg-white border-slate-300'
            }`}>
              <div className="text-[10px] font-black uppercase text-slate-400 px-2 pt-1">
                {es ? 'Resultados encontrados (tocá para fijar):' : 'Found locations (tap to set):'}
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
                  <ChevronRight className="w-4 h-4 text-brand-cyan shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Safe Presets in San Juan (1-Tap Recommendations) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold">
            <span className="text-slate-400 uppercase text-[10px] shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {es ? 'Sugeridos San Juan:' : 'Suggestions:'}
            </span>
            {SAN_JUAN_EVACUATION_PRESETS.slice(0, 5).map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectLocation(preset)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap border shrink-0 transition-all active:scale-95 ${
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

        {/* Interactive Map & Direct Click to Place Pin */}
        <div className="relative rounded-2xl overflow-hidden border shadow-inner flex-1 min-h-[220px] sm:min-h-[260px]">
          <MapContainer
            center={currentCoords}
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

            {/* Evacuation Line between Home and Point 01 / Point 02 */}
            <Polyline
              positions={[homeCoords, activeTarget === 'secondary' ? secondaryCoords : primaryCoords]}
              pathOptions={{
                color: activeTarget === 'secondary' ? '#6366F1' : '#10B981',
                weight: 4,
                dashArray: '8, 8',
                opacity: 0.85
              }}
            />

            {/* Home Marker */}
            <Marker position={homeCoords} icon={homePin}>
              <Popup className="custom-leaflet-popup">
                <div className="text-xs p-1">
                  <strong>🏠 {homeName}</strong>
                  <p>{es ? 'Punto de partida de la evacuación' : 'Evacuation start point'}</p>
                </div>
              </Popup>
            </Marker>

            {/* Primary Marker */}
            <Marker position={primaryCoords} icon={primaryPin}>
              <Popup className="custom-leaflet-popup">
                <div className="text-xs p-1">
                  <strong>🟢 Punto 01: {primaryName}</strong>
                </div>
              </Popup>
            </Marker>

            {/* Secondary Marker */}
            <Marker position={secondaryCoords} icon={secondaryPin}>
              <Popup className="custom-leaflet-popup">
                <div className="text-xs p-1">
                  <strong>🔵 Punto 02: {secondaryName}</strong>
                </div>
              </Popup>
            </Marker>
          </MapContainer>

          {/* Map Tip Overlay */}
          <div className="absolute bottom-2 left-2 right-2 z-[400] bg-navy-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-[11px] font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{es ? 'Podés tocar cualquier punto del mapa para mover este marcador' : 'Tap anywhere on the map to place pin'}</span>
            </span>
          </div>
        </div>

        {/* Selected Point Details Card & Custom Notes */}
        <div className={`p-3.5 rounded-2xl border space-y-2.5 shrink-0 ${
          isDark ? 'bg-navy-900 border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <label className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {activeTarget === 'home'
                ? es ? 'Nombre o Dirección de la Vivienda:' : 'Home Address / Label:'
                : activeTarget === 'primary'
                ? es ? 'Nombre del Punto 01 (Reunión Inmediata):' : 'Point 01 Name:'
                : es ? 'Nombre del Punto 02 (Alternativo / Fuera del Barrio):' : 'Point 02 Name:'}
            </label>
            <input
              type="text"
              value={activeTarget === 'home' ? homeName : activeTarget === 'primary' ? primaryName : secondaryName}
              onChange={(e) => {
                if (activeTarget === 'home') setHomeName(e.target.value);
                else if (activeTarget === 'primary') setPrimaryName(e.target.value);
                else setSecondaryName(e.target.value);
              }}
              className={`w-full p-2.5 rounded-xl border text-xs font-bold focus:outline-none ${
                isDark ? 'bg-navy-950 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          {activeTarget !== 'home' && (
            <>
              {/* Distance and Walking Time Metric */}
              {routeMetric && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-600 dark:text-cyan-400">
                    <Route className="w-4 h-4" />
                    <span>{es ? `Distancia desde casa: ${routeMetric.distanceFormatted} (${routeMetric.blocksEstimate} cuadras)` : `Distance: ${routeMetric.distanceFormatted}`}</span>
                  </div>
                  <span className="font-black text-amber-500">{routeMetric.timeFormatted}</span>
                </div>
              )}

              {/* Tactical Notes Input */}
              <div>
                <label className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {es ? 'Instrucciones / Referencias para la Familia:' : 'Notes / Meeting instructions:'}
                </label>
                <input
                  type="text"
                  value={activeTarget === 'primary' ? primaryNotes : secondaryNotes}
                  onChange={(e) => {
                    if (activeTarget === 'primary') setPrimaryNotes(e.target.value);
                    else setSecondaryNotes(e.target.value);
                  }}
                  placeholder={es ? 'Ej: Esperar junto al monumento central, frente al kiosco...' : 'E.g. Meet beside the central monument...'}
                  className={`w-full p-2 rounded-xl border text-[11px] font-medium focus:outline-none ${
                    isDark ? 'bg-navy-950 border-white/15 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                  }`}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className={`py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {es ? 'Cancelar' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-brand-electric via-brand-cyan to-cyan-300 text-navy-950 font-black text-xs uppercase tracking-wider shadow-glow-cyan/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{es ? 'Guardar Puntos en la Familia' : 'Save Meeting Points'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
