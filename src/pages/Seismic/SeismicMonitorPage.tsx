import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ArrowLeft,
  RefreshCw,
  Activity,
  Info,
  X,
  ExternalLink,
  WifiOff,
  Lightbulb,
  Layers,
  Mountain,
  Globe2,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { ScreenId } from '../../types';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  MAP_STYLES,
  MapStyle,
  PLATE_NAMES,
  Quake,
  QuakeFeed,
  QuakeRegion,
  REGION_BOUNDS,
  authorityLabel,
  fetchRecentQuakes,
  fetchWorldQuakes,
  filterByRegion,
  getCachedQuakes,
  getCachedWorldQuakes,
  getQuakeInsight,
  magnitudeColor,
  magnitudeRadius,
} from '../../services/seismicService';

interface SeismicMonitorPageProps {
  onNavigate: (screen: ScreenId) => void;
}

const REFRESH_MS = 2 * 60 * 1000;

// Ajusta el encuadre del mapa al cambiar de región
const FitRegion: React.FC<{ region: QuakeRegion }> = ({ region }) => {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(REGION_BOUNDS[region], { padding: [16, 16] });
  }, [map, region]);
  return null;
};

// Centra el mapa en el sismo seleccionado
const FocusQuake: React.FC<{ quake: Quake | null }> = ({ quake }) => {
  const map = useMap();
  useEffect(() => {
    if (quake) map.panTo([quake.lat, quake.lon], { animate: true });
  }, [map, quake]);
  return null;
};

// Reajusta el tamaño del canvas al alternar pantalla completa
const MapResizeHandler: React.FC<{ isFullscreen: boolean }> = ({ isFullscreen }) => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map, isFullscreen]);
  return null;
};

export const SeismicMonitorPage: React.FC<SeismicMonitorPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const es = language === 'es';

  // Feeds
  const [regionalFeed, setRegionalFeed] = useState<QuakeFeed | null>(() => getCachedQuakes());
  const [worldFeed, setWorldFeed] = useState<QuakeFeed | null>(() => getCachedWorldQuakes());
  const [region, setRegion] = useState<QuakeRegion>('sanjuan');

  // Map settings
  const [mapStyle, setMapStyle] = useState<MapStyle>('dark');
  const [showPlates, setShowPlates] = useState<boolean>(true);
  const [platesData, setPlatesData] = useState<any | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showLayersMenu, setShowLayersMenu] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Quake | null>(null);
  const [now, setNow] = useState(Date.now());

  // Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Lock scroll in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  // Carga de placas tectónicas (GeoJSON local)
  useEffect(() => {
    if (showPlates && !platesData) {
      fetch('/data/tectonicplates.json')
        .then(r => r.json())
        .then(d => setPlatesData(d))
        .catch(e => console.warn('No se pudo cargar placas tectónicas:', e));
    }
  }, [showPlates, platesData]);

  // Carga feed regional (San Juan / Argentina / Chile)
  const loadRegional = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchRecentQuakes();
      setRegionalFeed(data);
      setError(null);
    } catch {
      setError(es ? 'No pudimos conectar con los servicios sismológicos regionales.' : 'Could not reach regional seismic services.');
    } finally {
      setIsLoading(false);
      setNow(Date.now());
    }
  }, [es]);

  // Carga feed mundial (USGS M4.5+)
  const loadWorld = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchWorldQuakes();
      setWorldFeed(data);
      setError(null);
    } catch {
      setError(es ? 'No pudimos conectar con el feed sismológico mundial.' : 'Could not reach global seismic feed.');
    } finally {
      setIsLoading(false);
      setNow(Date.now());
    }
  }, [es]);

  // Auto-refresco inicial y periódico
  useEffect(() => {
    loadRegional();
    const id = setInterval(() => {
      if (region === 'world') {
        loadWorld();
      } else {
        loadRegional();
      }
    }, REFRESH_MS);
    const tick = setInterval(() => setNow(Date.now()), 30000);
    return () => {
      clearInterval(id);
      clearInterval(tick);
    };
  }, [loadRegional, loadWorld, region]);

  // Si cambia a 'world' y no hay datos, cargar
  useEffect(() => {
    if (region === 'world' && !worldFeed) {
      loadWorld();
    }
  }, [region, worldFeed, loadWorld]);

  const activeFeed = region === 'world' ? worldFeed : regionalFeed;

  const quakes = useMemo(() => {
    if (!activeFeed) return [];
    return filterByRegion(activeFeed.quakes, region);
  }, [activeFeed, region]);

  const strongest = useMemo(
    () => quakes.reduce<Quake | null>((max, q) => (!max || q.mag > max.mag ? q : max), null),
    [quakes]
  );

  const relativeTime = (t: number) => {
    const min = Math.max(0, Math.round((now - t) / 60000));
    if (min < 1) return es ? 'recién' : 'just now';
    if (min < 60) return es ? `hace ${min} min` : `${min} min ago`;
    const h = Math.round(min / 60);
    if (h < 24) return es ? `hace ${h} h` : `${h} h ago`;
    const d = Math.round(h / 24);
    return es ? `hace ${d} ${d === 1 ? 'día' : 'días'}` : `${d} ${d === 1 ? 'day' : 'days'} ago`;
  };

  const localTime = (t: number) =>
    new Date(t).toLocaleString(es ? 'es-AR' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  const regionLabels: Record<QuakeRegion, string> = {
    sanjuan: 'San Juan',
    argentina: 'Argentina',
    chile: 'Chile',
    world: es ? 'Mundo 🌍' : 'World 🌍',
  };

  const insight = selected ? getQuakeInsight(selected, es ? 'es' : 'en') : null;
  const currentTileConfig = MAP_STYLES[mapStyle];

  const onEachPlateFeature = (feature: any, layer: any) => {
    const p = feature?.properties || {};
    const nameA = PLATE_NAMES[p.plateA] || p.plateA || 'Placa';
    const nameB = PLATE_NAMES[p.plateB] || p.plateB || 'Placa';
    layer.bindPopup(
      `<div style="font-family: system-ui, sans-serif; font-size: 11px; color: #061321; font-weight: 700; padding: 2px;">
        <div style="font-size: 9px; color: #0284c7; text-transform: uppercase; font-weight: 900; letter-spacing: 0.5px; margin-bottom: 2px;">
          ${es ? 'Límite de Placas Tectónicas' : 'Tectonic Plate Boundary'}
        </div>
        <div>${nameA} ↔ ${nameB}</div>
      </div>`
    );
  };

  // Detalle del sismo seleccionado
  const renderQuakeDetail = (isFloating: boolean = false) => {
    if (!selected || !insight) return null;
    return (
      <div
        className={`${
          isFloating
            ? 'fixed bottom-4 left-4 right-4 max-w-md mx-auto z-[1000] shadow-[0_10px_40px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-4 duration-200'
            : 'sismo-card-featured relative'
        } p-4 space-y-3 bg-navy-950/95 backdrop-blur-2xl border border-brand-cyan/40 rounded-2xl`}
      >
        <button
          onClick={() => setSelected(null)}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          aria-label={es ? 'Cerrar' : 'Close'}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 pr-8">
          <div
            className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-navy-950 shrink-0 shadow-lg"
            style={{ background: magnitudeColor(selected.mag) }}
          >
            <span className="font-black text-xl leading-none tabular-nums">{selected.mag.toFixed(1)}</span>
            <span className="text-[9px] font-black">{selected.magType}</span>
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-sm text-white leading-snug">{selected.place}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {localTime(selected.time)} · {relativeTime(selected.time)}
            </p>
            <p className="text-xs text-slate-400">
              {es ? 'Profundidad' : 'Depth'}: <span className="text-slate-200 font-bold">{Math.round(selected.depthKm)} km</span>
              {authorityLabel(selected.authority) && <> · {es ? 'Reporte' : 'Report'}: {authorityLabel(selected.authority)}</>}
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-navy-900/90 border border-brand-purple/30 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-purple-300">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{es ? '¿Qué significa?' : 'What does it mean?'}</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">{insight.depth}</p>
          <p className="text-xs text-slate-300 leading-relaxed">{insight.feel}</p>
        </div>

        {selected.url && (
          <a
            href={selected.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-cyan hover:text-white"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {es ? `Ver ficha oficial en ${selected.source}` : `View on ${selected.source}`}
          </a>
        )}
      </div>
    );
  };

  // Contenido del Mapa y sus Controles Flotantes
  const renderMapBlock = () => (
    <div
      className={`relative isolate overflow-hidden bg-navy-950 transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen'
          : 'rounded-2xl border border-white/10 h-80 sm:h-96'
      }`}
    >
      <MapContainer
        bounds={REGION_BOUNDS[region]}
        className="w-full h-full"
        style={{ background: '#061321' }}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          key={mapStyle + '-base'}
          url={currentTileConfig.base}
          attribution={currentTileConfig.attribution}
          maxZoom={currentTileConfig.maxZoom}
        />
        {currentTileConfig.reference && (
          <TileLayer
            key={mapStyle + '-ref'}
            url={currentTileConfig.reference}
            maxZoom={currentTileConfig.maxZoom}
          />
        )}

        {/* Capa de Placas Tectónicas */}
        {showPlates && platesData && (
          <GeoJSON
            key={'plates-' + mapStyle}
            data={platesData}
            style={{
              color: mapStyle === 'terrain' ? '#EA580C' : '#22D3EE',
              weight: 2,
              opacity: 0.85,
              dashArray: '5, 5',
            }}
            onEachFeature={onEachPlateFeature}
          />
        )}

        <FitRegion region={region} />
        <FocusQuake quake={selected} />
        <MapResizeHandler isFullscreen={isFullscreen} />

        {[...quakes].reverse().map(q => {
          const isSel = selected?.id === q.id;
          const color = magnitudeColor(q.mag);
          return (
            <CircleMarker
              key={q.id}
              center={[q.lat, q.lon]}
              radius={magnitudeRadius(q.mag)}
              pathOptions={{
                color: isSel ? '#FFFFFF' : color,
                weight: isSel ? 3 : 1.5,
                fillColor: color,
                fillOpacity: isSel ? 0.9 : 0.45,
              }}
              eventHandlers={{ click: () => { sound.playClick(); setSelected(q); } }}
            />
          );
        })}
      </MapContainer>

      {/* ========================================================================= */}
      {/* 1. MODO NORMAL (EMBEBIDO): ÚNICAMENTE BOTÓN LIMPIO DE PANTALLA GRANDE     */}
      {/* ========================================================================= */}
      {!isFullscreen && (
        <div className="absolute top-3 right-3 z-[500] pointer-events-auto">
          <button
            onClick={() => { sound.playClick(); setIsFullscreen(true); }}
            className="h-9 px-3 rounded-xl bg-navy-950/85 backdrop-blur-md border border-white/15 hover:border-brand-cyan/60 text-brand-cyan hover:text-white flex items-center gap-1.5 shadow-xl active:scale-95 transition-all text-xs font-bold"
            title={es ? 'Ver mapa a pantalla grande' : 'Fullscreen map'}
            aria-label={es ? 'Pantalla grande' : 'Fullscreen'}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="text-[10.5px] font-black uppercase tracking-wider">{es ? 'Pantalla grande' : 'Fullscreen'}</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODO PANTALLA GRANDE: CONTROLES SIMÉTRICOS, ORDENADOS Y ESTÉTICOS      */}
      {/* ========================================================================= */}
      {isFullscreen && (
        <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col gap-2.5 pointer-events-none">
          {/* Fila Principal Superior: Salir (Izq) | Herramientas (Der) */}
          <div className="flex items-center justify-between gap-2">
            {/* Lado Izquierdo: Botón Salir + Estado En Vivo */}
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                onClick={() => { sound.playClick(); setIsFullscreen(false); }}
                className="h-10 px-3.5 rounded-2xl bg-navy-950/90 backdrop-blur-xl border border-white/15 text-white hover:border-brand-cyan/60 text-xs font-bold flex items-center gap-2 shadow-2xl active:scale-95 transition-all"
                aria-label={es ? 'Salir de pantalla grande' : 'Exit fullscreen'}
              >
                <Minimize2 className="w-4 h-4 text-brand-cyan" />
                <span className="font-black text-xs uppercase tracking-wider">{es ? 'Salir' : 'Exit'}</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 h-10 px-3 rounded-2xl bg-navy-950/90 backdrop-blur-xl border border-white/15 text-xs shadow-2xl">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-black text-white tabular-nums">{quakes.length}</span>
                <span className="text-slate-400 text-[11px] uppercase tracking-wider">{es ? 'sismos' : 'quakes'}</span>
              </div>
            </div>

            {/* Lado Derecho: Capas de mapa + Placas + Refresco */}
            <div className="pointer-events-auto flex items-center gap-1.5">
              {/* Selector de Capa de Mapa */}
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-navy-950/90 backdrop-blur-xl border border-white/15 shadow-2xl">
                <button
                  onClick={() => { sound.playClick(); setMapStyle('dark'); }}
                  className={`h-8 px-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                    mapStyle === 'dark' ? 'bg-brand-cyan text-navy-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  title={es ? 'Mapa oscuro' : 'Dark map'}
                >
                  <span>🌑</span>
                  <span className="hidden md:inline">{es ? 'Oscuro' : 'Dark'}</span>
                </button>
                <button
                  onClick={() => { sound.playClick(); setMapStyle('satellite'); }}
                  className={`h-8 px-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                    mapStyle === 'satellite' ? 'bg-brand-cyan text-navy-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  title={es ? 'Mapa satelital' : 'Satellite map'}
                >
                  <span>🛰️</span>
                  <span className="hidden md:inline">{es ? 'Satélite' : 'Satellite'}</span>
                </button>
                <button
                  onClick={() => { sound.playClick(); setMapStyle('terrain'); }}
                  className={`h-8 px-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                    mapStyle === 'terrain' ? 'bg-brand-cyan text-navy-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  title={es ? 'Mapa de relieve' : 'Terrain map'}
                >
                  <Mountain className="w-3 h-3" />
                  <span className="hidden md:inline">{es ? 'Relieve' : 'Terrain'}</span>
                </button>
              </div>

              {/* Botón Placas */}
              <button
                onClick={() => { sound.playClick(); setShowPlates(prev => !prev); }}
                className={`h-10 px-3 rounded-2xl backdrop-blur-xl border text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xl transition-all active:scale-95 ${
                  showPlates
                    ? 'bg-navy-950/90 border-brand-purple/60 text-purple-300 shadow-glow-purple'
                    : 'bg-navy-950/90 border-white/15 text-slate-400 hover:text-white'
                }`}
                title={es ? 'Límites de placas tectónicas' : 'Tectonic plates'}
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{es ? 'Placas' : 'Plates'}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${showPlates ? 'bg-purple-400 animate-pulse' : 'bg-slate-600'}`} />
              </button>

              {/* Botón Refresco */}
              <button
                onClick={() => {
                  sound.playClick();
                  if (region === 'world') loadWorld();
                  else loadRegional();
                }}
                disabled={isLoading}
                className="w-10 h-10 rounded-2xl bg-navy-950/90 backdrop-blur-xl border border-white/15 text-brand-cyan hover:text-white flex items-center justify-center shadow-2xl active:scale-95 transition-all disabled:opacity-60"
                title={es ? 'Actualizar' : 'Refresh'}
                aria-label={es ? 'Actualizar' : 'Refresh'}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Fila Secundaria: Selector de Región Centrado */}
          <div className="flex justify-center pointer-events-auto">
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-navy-950/90 backdrop-blur-xl border border-white/15 shadow-2xl max-w-full overflow-x-auto">
              {(Object.keys(regionLabels) as QuakeRegion[]).map(r => {
                const active = region === r;
                return (
                  <button
                    key={r}
                    onClick={() => { sound.playClick(); setRegion(r); setSelected(null); }}
                    className={`h-8 px-3 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                      active
                        ? 'bg-brand-cyan text-navy-950 shadow-glow-cyan'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {regionLabels[r]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Legend & Attribution Flotante */}
      <div className="absolute bottom-3 left-3 z-[500] flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-navy-950/85 backdrop-blur-md border border-white/15 text-[10px] font-bold text-slate-300 shadow-xl pointer-events-auto">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#F6C453]" />&lt;3.5</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />3.5–5</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />5+</span>
        {showPlates && (
          <span className="flex items-center gap-1 pl-1.5 border-l border-white/20 text-brand-cyan">
            <span className="w-2.5 h-0.5 border-t-2 border-dashed border-brand-cyan" />
            <span className="text-[9px] uppercase tracking-wider">{es ? 'Placas' : 'Plates'}</span>
          </span>
        )}
      </div>

      {isLoading && !activeFeed && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center bg-navy-950/75 backdrop-blur-sm text-xs font-bold text-slate-300">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 border border-white/10 shadow-2xl">
            <RefreshCw className="w-4 h-4 animate-spin text-brand-cyan" />
            <span>{es ? 'Cargando sismos…' : 'Loading earthquakes…'}</span>
          </div>
        </div>
      )}

      {/* Detalle flotante en pantalla grande */}
      {isFullscreen && renderQuakeDetail(true)}
    </div>
  );

  return (
    <div className="p-4 sm:p-5 space-y-4 pb-28 max-w-md mx-auto select-none font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { sound.playClick(); onNavigate('home'); }}
          className="w-10 h-10 rounded-2xl sismo-card flex items-center justify-center text-slate-300 hover:text-white"
          aria-label={es ? 'Volver' : 'Back'}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="px-3.5 py-1.5 rounded-full bg-navy-900/90 border border-brand-cyan/30 text-brand-cyan font-black text-xs uppercase tracking-wider flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${error && !activeFeed ? 'bg-slate-500' : 'bg-emerald-400 animate-pulse'}`} />
          <Activity className="w-3.5 h-3.5" />
          <span>{es ? 'Monitor sísmico' : 'Seismic monitor'}</span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            if (region === 'world') loadWorld();
            else loadRegional();
          }}
          disabled={isLoading}
          className="w-10 h-10 rounded-2xl sismo-card flex items-center justify-center text-brand-cyan hover:text-white disabled:opacity-60"
          aria-label={es ? 'Actualizar' : 'Refresh'}
        >
          <RefreshCw className={`w-4.5 h-4.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Title */}
      <div className="text-center space-y-1">
        <h1 className="font-black text-2xl text-white tracking-tight uppercase leading-none">
          {es ? 'Sismos' : 'Recent'} <span className="text-brand-cyan">{es ? 'recientes' : 'earthquakes'}</span>
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          {region === 'world' ? (es ? 'Últimos 7 días · Global M4.5+' : 'Last 7 days · Global M4.5+') : (es ? 'Últimos 7 días' : 'Last 7 days')}
          {activeFeed && ` · ${es ? 'Actualizado' : 'Updated'} ${relativeTime(activeFeed.fetchedAt)}`}
        </p>
      </div>

      {/* Region filter (Pill horizontal limpio) */}
      <div className="grid grid-cols-4 gap-1.5">
        {(Object.keys(regionLabels) as QuakeRegion[]).map(r => {
          const active = region === r;
          return (
            <button
              key={r}
              onClick={() => { sound.playClick(); setRegion(r); setSelected(null); }}
              className={`min-h-[42px] px-1 rounded-xl text-[11px] font-black uppercase tracking-tight transition-all truncate ${
                active
                  ? 'bg-brand-cyan text-navy-950 shadow-glow-cyan'
                  : 'bg-navy-900/90 text-slate-300 border border-white/10 hover:border-brand-cyan/40'
              }`}
              aria-pressed={active}
            >
              {regionLabels[r]}
            </button>
          );
        })}
      </div>

      {/* Offline / error notice */}
      {(error || activeFeed?.fromCache) && (
        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
          <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {activeFeed
              ? (es
                  ? `Sin conexión: mostrando los datos guardados (${relativeTime(activeFeed.fetchedAt)}).`
                  : `Offline: showing saved data (${relativeTime(activeFeed.fetchedAt)}).`)
              : error}
          </span>
        </div>
      )}

      {/* Map Control Toolbar in Embedded View */}
      {!isFullscreen && (
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-navy-900/90 border border-white/10 text-xs">
          {/* Style Selector */}
          <div className="flex items-center gap-1 bg-navy-950/70 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => { sound.playClick(); setMapStyle('dark'); }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                mapStyle === 'dark'
                  ? 'bg-brand-cyan text-navy-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🌑</span>
              <span>{es ? 'Oscuro' : 'Dark'}</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setMapStyle('satellite'); }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                mapStyle === 'satellite'
                  ? 'bg-brand-cyan text-navy-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🛰️</span>
              <span>{es ? 'Satélite' : 'Satellite'}</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setMapStyle('terrain'); }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                mapStyle === 'terrain'
                  ? 'bg-brand-cyan text-navy-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mountain className="w-3 h-3" />
              <span>{es ? 'Relieve' : 'Terrain'}</span>
            </button>
          </div>

          {/* Tectonic Plates Toggle */}
          <button
            onClick={() => { sound.playClick(); setShowPlates(prev => !prev); }}
            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
              showPlates
                ? 'bg-brand-purple/20 border-brand-purple text-purple-300 shadow-glow-purple'
                : 'bg-navy-950/70 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={es ? 'Activar o desactivar fallas y límites de placas tectónicas' : 'Toggle tectonic plate boundaries'}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>{es ? 'Placas' : 'Plates'}</span>
            <span className={`w-1.5 h-1.5 rounded-full ${showPlates ? 'bg-purple-400 animate-pulse' : 'bg-slate-600'}`} />
          </button>
        </div>
      )}

      {/* Map Block with Fullscreen Support and Clean Visuals */}
      {renderMapBlock()}

      {/* Selected quake detail in standard embedded view */}
      {!isFullscreen && renderQuakeDetail(false)}

      {/* Summary */}
      {activeFeed && (
        <div className="grid grid-cols-2 gap-2.5">
          <div className="sismo-card p-3 text-center">
            <span className="text-xl font-black text-brand-cyan tabular-nums block">{quakes.length}</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {es ? 'Sismos (7 días)' : 'Quakes (7 days)'}
            </span>
          </div>
          <div className="sismo-card p-3 text-center">
            <span className="text-xl font-black tabular-nums block" style={{ color: strongest ? magnitudeColor(strongest.mag) : '#94A3B8' }}>
              {strongest ? strongest.mag.toFixed(1) : '—'}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {es ? 'Mayor magnitud' : 'Strongest'}
            </span>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        <h2 className="px-1 text-xs font-black uppercase tracking-wider text-slate-400">
          {es ? 'Últimos registros' : 'Latest events'}
        </h2>

        {activeFeed && quakes.length === 0 && (
          <div className="sismo-card p-4 text-center text-sm text-slate-400">
            {es ? 'No hay sismos registrados en esta zona en los últimos 7 días.' : 'No earthquakes recorded in this area in the last 7 days.'}
          </div>
        )}

        {quakes.slice(0, 60).map(q => {
          const isSel = selected?.id === q.id;
          return (
            <button
              key={q.id}
              onClick={() => { sound.playClick(); setSelected(q); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`w-full sismo-card min-h-[60px] p-3 flex items-center gap-3 text-left transition-all ${
                isSel ? 'border-brand-cyan' : ''
              }`}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm tabular-nums text-navy-950 shrink-0"
                style={{ background: magnitudeColor(q.mag) }}
              >
                {q.mag.toFixed(1)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-white truncate">{q.place}</h3>
                <p className="text-[11px] text-slate-400">
                  {relativeTime(q.time)} · {localTime(q.time)} · {Math.round(q.depthKm)} km
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-navy-900/80 border border-white/10 text-[11px] text-slate-400 leading-relaxed">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
        <span>
          {es
            ? 'Sismos ya ocurridos, publicados con algunos minutos de demora. SISMO LAB no es un sistema de alerta temprana. Datos: EMSC (incluye reportes de INPRES y CSN Chile) y USGS. Ante una emergencia, seguí las indicaciones oficiales de Protección Civil.'
            : 'Earthquakes that already happened, published with a few minutes of delay. SISMO LAB is not an early warning system. Data: EMSC (includes INPRES and CSN Chile reports) and USGS. In an emergency, follow official Civil Protection guidance.'}
        </span>
      </div>
    </div>
  );
};
