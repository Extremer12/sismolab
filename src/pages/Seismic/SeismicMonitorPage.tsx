import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, RefreshCw, Activity, Info, X, ExternalLink, WifiOff, Lightbulb } from 'lucide-react';
import { ScreenId } from '../../types';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Quake,
  QuakeFeed,
  QuakeRegion,
  REGION_BOUNDS,
  authorityLabel,
  fetchRecentQuakes,
  filterByRegion,
  getCachedQuakes,
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
    map.fitBounds(REGION_BOUNDS[region], { padding: [12, 12] });
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

export const SeismicMonitorPage: React.FC<SeismicMonitorPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const es = language === 'es';

  const [feed, setFeed] = useState<QuakeFeed | null>(() => getCachedQuakes());
  const [region, setRegion] = useState<QuakeRegion>('sanjuan');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Quake | null>(null);
  const [now, setNow] = useState(Date.now());

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchRecentQuakes();
      setFeed(data);
      setError(null);
    } catch {
      setError(es ? 'No pudimos conectar con los servicios sismológicos.' : 'Could not reach seismic services.');
    } finally {
      setIsLoading(false);
      setNow(Date.now());
    }
  }, [es]);

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    const tick = setInterval(() => setNow(Date.now()), 30000);
    return () => {
      clearInterval(id);
      clearInterval(tick);
    };
  }, [load]);

  const quakes = useMemo(() => (feed ? filterByRegion(feed.quakes, region) : []), [feed, region]);
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
  };

  const insight = selected ? getQuakeInsight(selected, es ? 'es' : 'en') : null;

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
          <span className={`w-2 h-2 rounded-full ${error && !feed ? 'bg-slate-500' : 'bg-emerald-400 animate-pulse'}`} />
          <Activity className="w-3.5 h-3.5" />
          <span>{es ? 'Monitor sísmico' : 'Seismic monitor'}</span>
        </div>

        <button
          onClick={() => { sound.playClick(); load(); }}
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
          {es ? 'Últimos 7 días' : 'Last 7 days'}
          {feed && ` · ${es ? 'Actualizado' : 'Updated'} ${relativeTime(feed.fetchedAt)}`}
        </p>
      </div>

      {/* Region filter */}
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(regionLabels) as QuakeRegion[]).map(r => {
          const active = region === r;
          return (
            <button
              key={r}
              onClick={() => { sound.playClick(); setRegion(r); setSelected(null); }}
              className={`min-h-[42px] rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                active
                  ? 'bg-brand-cyan text-navy-950'
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
      {(error || feed?.fromCache) && (
        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
          <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {feed
              ? (es
                  ? `Sin conexión: mostrando los datos guardados (${relativeTime(feed.fetchedAt)}).`
                  : `Offline: showing saved data (${relativeTime(feed.fetchedAt)}).`)
              : error}
          </span>
        </div>
      )}

      {/* Map */}
      <div className="relative z-0 isolate rounded-2xl overflow-hidden border border-white/10 h-72 bg-navy-950">
        <MapContainer
          bounds={REGION_BOUNDS.sanjuan}
          className="w-full h-full"
          style={{ background: '#061321' }}
          zoomControl={false}
          attributionControl
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/" target="_blank" rel="noreferrer">Esri</a> &copy; OpenStreetMap'
            maxZoom={16}
          />
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
            maxZoom={16}
          />
          <FitRegion region={region} />
          <FocusQuake quake={selected} />

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
                  fillOpacity: isSel ? 0.85 : 0.45,
                }}
                eventHandlers={{ click: () => { sound.playClick(); setSelected(q); } }}
              />
            );
          })}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-2 left-2 z-[500] flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-navy-950/85 border border-white/10 text-[10px] font-bold text-slate-300">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#F6C453]" />&lt;3.5</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />3.5–5</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />5+</span>
        </div>

        {isLoading && !feed && (
          <div className="absolute inset-0 z-[500] flex items-center justify-center bg-navy-950/70 text-xs font-bold text-slate-300">
            {es ? 'Cargando sismos…' : 'Loading earthquakes…'}
          </div>
        )}
      </div>

      {/* Selected quake detail + educational pill */}
      {selected && insight && (
        <div className="sismo-card-featured p-4 space-y-3 relative">
          <button
            onClick={() => setSelected(null)}
            className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white"
            aria-label={es ? 'Cerrar' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 pr-8">
            <div
              className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-navy-950 shrink-0"
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

          <div className="p-3 rounded-xl bg-navy-950/80 border border-brand-purple/30 space-y-1.5">
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
              {es ? `Ver ficha en ${selected.source}` : `View on ${selected.source}`}
            </a>
          )}
        </div>
      )}

      {/* Summary */}
      {feed && (
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

        {feed && quakes.length === 0 && (
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
