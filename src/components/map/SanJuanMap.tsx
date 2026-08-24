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

// Reliable tile providers
const TILE_LAYERS = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    options: { subdomains: 'abcd', maxZoom: 19, attribution: '&copy; CartoDB &copy; OpenStreetMap' }
  },
  esriDark: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    options: { maxZoom: 16, attribution: '&copy; Esri' }
  },
  osm: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: { maxZoom: 19, attribution: '&copy; OpenStreetMap' }
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
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: SAN_JUAN_CENTER,
        zoom: DEFAULT_ZOOM,
        minZoom: 6,
        maxZoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      // Dark theme tiles with fallback
      const baseLayer = L.tileLayer(TILE_LAYERS.dark.url, TILE_LAYERS.dark.options);
      
      baseLayer.on('tileerror', () => {
        // Fallback to Esri dark gray if cartocdn is slow
        L.tileLayer(TILE_LAYERS.esriDark.url, TILE_LAYERS.esriDark.options).addTo(map);
      });

      baseLayer.addTo(map);

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

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(SAN_JUAN_CENTER, DEFAULT_ZOOM, { duration: 0.8 });
    }
  };

  return (
    <div className={`relative w-full h-[380px] select-none overflow-hidden rounded-3xl border-2 border-brand-cyan/40 shadow-[0_10px_35px_rgba(4,14,27,0.85)] bg-navy-950 ${className}`}>
      {/* Real Map Canvas */}
      <div
        ref={mapContainerRef}
        className="w-full h-full z-10 [&_.leaflet-container]:bg-[#08182b] [&_.leaflet-tile-pane]:opacity-90 [&_.leaflet-control-zoom]:border-none [&_.leaflet-control-zoom-in]:bg-navy-900/90 [&_.leaflet-control-zoom-in]:text-brand-cyan [&_.leaflet-control-zoom-out]:bg-navy-900/90 [&_.leaflet-control-zoom-out]:text-brand-cyan [&_.leaflet-control-zoom]:rounded-2xl [&_.leaflet-control-zoom]:overflow-hidden [&_.leaflet-control-zoom]:shadow-lg [&_.leaflet-control-zoom]:border [&_.leaflet-control-zoom]:border-brand-cyan/30"
      />

      {/* Header Overlay Pill */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-navy-950/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-brand-cyan/40 text-[10px] font-black text-brand-cyan shadow-lg pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
        <span>MAPA CARTOGRÁFICO INPRES · SAN JUAN</span>
      </div>

      {/* Reset Center Button */}
      <button
        onClick={handleResetView}
        className="absolute bottom-3 right-3 z-20 w-10 h-10 rounded-2xl bg-navy-950/90 backdrop-blur-md border border-brand-cyan/50 text-brand-cyan flex items-center justify-center hover:bg-navy-900 hover:scale-105 active:scale-95 transition-all shadow-xl"
        title="Centrar provincia de San Juan"
        aria-label="Centrar mapa"
      >
        <RotateCcw className="w-4.5 h-4.5" />
      </button>
    </div>
  );
};
