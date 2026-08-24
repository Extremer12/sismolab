import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RotateCcw, Layers, MapPin } from 'lucide-react';

export interface MapMarkerItem {
  id: string;
  label: string;
  locationName: string;
  lat: number;
  lng: number;
  xPercent?: number;
  yPercent?: number;
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

// Center of San Juan Province (geographic balance between Jáchal, Capital, Caucete and Calingasta)
const SAN_JUAN_CENTER: [number, number] = [-31.20, -68.50];
const DEFAULT_ZOOM = 7.8;

// Reliable, 100% open tile providers without rate-limits or blocked domains
const TILE_LAYERS = {
  osmDark: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: { maxZoom: 18, attribution: '&copy; Esri Earthstar Geographics' }
  }
};

export const SanJuanMap: React.FC<SanJuanMapProps> = ({
  markers = [],
  activeMarkerId,
  onMarkerClick,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const [mapType, setMapType] = useState<'dark' | 'satellite'>('dark');
  const [mapReady, setMapReady] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: SAN_JUAN_CENTER,
        zoom: DEFAULT_ZOOM,
        minZoom: 6,
        maxZoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      // Standard OSM Tile Layer with high-contrast Dark Matrix filter
      const baseLayer = L.tileLayer(TILE_LAYERS.osmDark.url, TILE_LAYERS.osmDark.options).addTo(map);
      tileLayerRef.current = baseLayer;

      // Add Zoom Control at top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = layerGroup;
      mapInstanceRef.current = map;

      // Force recalculation of container size after mounting and layout render
      const resizeTimer = setTimeout(() => {
        map.invalidateSize();
        setMapReady(true);
      }, 150);

      const handleWindowResize = () => map.invalidateSize();
      window.addEventListener('resize', handleWindowResize);

      return () => {
        clearTimeout(resizeTimer);
        window.removeEventListener('resize', handleWindowResize);
        map.remove();
        mapInstanceRef.current = null;
      };
    }
  }, []);

  // Update Markers & Active Focus
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    markers.forEach((marker) => {
      const isSelected = marker.id === activeMarkerId;
      const markerColor = marker.color || (marker.magnitude && marker.magnitude >= 7.0 ? '#EF4444' : '#FACC15');

      // Create Custom Animated HTML DivIcon
      const iconHtml = `
        <div class="relative flex flex-col items-center cursor-pointer select-none group" style="transform: translate(-50%, -50%);">
          <!-- Radar Rings for Selected Marker -->
          ${isSelected ? `
            <span class="absolute -inset-4 rounded-full animate-ping opacity-80" style="background-color: ${markerColor};"></span>
            <span class="absolute -inset-8 rounded-full animate-ping opacity-40" style="background-color: ${markerColor}; animation-duration: 2.2s;"></span>
          ` : ''}

          <!-- Core Node Circle -->
          <div class="relative flex items-center justify-center rounded-full shadow-2xl transition-all duration-200 ${
            isSelected
              ? 'w-9 h-9 ring-4 ring-cyan-400/80 scale-110 shadow-[0_0_25px_rgba(34,211,238,1)] border-2 border-white'
              : 'w-7 h-7 border-2 border-navy-950 hover:scale-110 shadow-lg'
          }" style="background-color: ${markerColor};">
            <span class="text-[10px] font-black text-navy-950">
              ${marker.type === 'fault' ? '⚡' : marker.magnitude ? `M${marker.magnitude.toFixed(1)}` : '•'}
            </span>
          </div>

          <!-- Label Pill -->
          <div class="mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-tight whitespace-nowrap shadow-xl border transition-all ${
            isSelected
              ? 'bg-white text-navy-950 border-cyan-400 font-extrabold shadow-glow-cyan scale-105'
              : 'bg-navy-950/90 text-slate-100 border-white/20'
          }">
            ${marker.label}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-seismic-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const leafletMarker = L.marker([marker.lat, marker.lng], { icon: customIcon });

      leafletMarker.on('click', () => {
        if (onMarkerClick) {
          onMarkerClick(marker);
        }
      });

      group.addLayer(leafletMarker);
    });

    // Fly to active marker smoothly if selected
    const activeMarker = markers.find(m => m.id === activeMarkerId);
    if (activeMarker && map) {
      map.flyTo([activeMarker.lat, activeMarker.lng], 9.2, {
        duration: 0.8,
        easeLinearity: 0.25
      });
    }
  }, [markers, activeMarkerId, onMarkerClick, mapReady]);

  // Handle Layer Toggle (Dark OSM vs Satellite)
  const handleToggleMapType = () => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;

    const nextType = mapType === 'dark' ? 'satellite' : 'dark';
    map.removeLayer(tileLayerRef.current);

    const config = nextType === 'dark' ? TILE_LAYERS.osmDark : TILE_LAYERS.satellite;
    const newLayer = L.tileLayer(config.url, config.options).addTo(map);
    tileLayerRef.current = newLayer;
    setMapType(nextType);
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(SAN_JUAN_CENTER, DEFAULT_ZOOM, { duration: 0.8 });
    }
  };

  return (
    <div className={`relative w-full h-[380px] select-none overflow-hidden rounded-3xl border-2 border-brand-cyan/40 shadow-[0_10px_35px_rgba(4,14,27,0.85)] bg-navy-950 ${className}`}>
      {/* Real Map Canvas with high-contrast cyber dark filter when dark mode is on */}
      <div
        ref={mapContainerRef}
        className={`w-full h-full z-10 [&_.leaflet-container]:bg-[#08182b] [&_.leaflet-control-zoom]:border-none [&_.leaflet-control-zoom-in]:bg-navy-900/95 [&_.leaflet-control-zoom-in]:text-brand-cyan [&_.leaflet-control-zoom-out]:bg-navy-900/95 [&_.leaflet-control-zoom-out]:text-brand-cyan [&_.leaflet-control-zoom]:rounded-2xl [&_.leaflet-control-zoom]:overflow-hidden [&_.leaflet-control-zoom]:shadow-lg [&_.leaflet-control-zoom]:border [&_.leaflet-control-zoom]:border-brand-cyan/30 ${
          mapType === 'dark'
            ? '[&_.leaflet-tile-pane]:invert-[0.94] [&_.leaflet-tile-pane]:hue-rotate-[195deg] [&_.leaflet-tile-pane]:brightness-[0.82] [&_.leaflet-tile-pane]:contrast-[1.25] [&_.leaflet-tile-pane]:saturate-[0.55]'
            : '[&_.leaflet-tile-pane]:contrast-[1.1] [&_.leaflet-tile-pane]:brightness-[0.95]'
        }`}
      />

      {/* Header Overlay Pill */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-navy-950/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-brand-cyan/40 text-[10px] font-black text-brand-cyan shadow-lg pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
        <span>MAPA CARTOGRÁFICO INPRES · SAN JUAN</span>
      </div>

      {/* Bottom Floating Controls (Reset + Satellite Switch) */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
        {/* Toggle Dark / Satellite */}
        <button
          onClick={handleToggleMapType}
          className="px-2.5 py-2 rounded-2xl bg-navy-950/90 backdrop-blur-md border border-brand-cyan/50 text-brand-cyan text-[10px] font-black flex items-center gap-1.5 hover:bg-navy-900 hover:scale-105 active:scale-95 transition-all shadow-xl"
          title="Alternar entre mapa oscuro y satelital"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{mapType === 'dark' ? '🛰️ SATÉLITE' : '🗺️ OSCURO'}</span>
        </button>

        {/* Reset Center Button */}
        <button
          onClick={handleResetView}
          className="w-10 h-10 rounded-2xl bg-navy-950/90 backdrop-blur-md border border-brand-cyan/50 text-brand-cyan flex items-center justify-center hover:bg-navy-900 hover:scale-105 active:scale-95 transition-all shadow-xl"
          title="Centrar provincia de San Juan"
          aria-label="Centrar mapa"
        >
          <RotateCcw className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
};
