import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Maximize2, RotateCcw } from 'lucide-react';

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

// Center of San Juan Province
const SAN_JUAN_CENTER: [number, number] = [-31.25, -68.55];
const DEFAULT_ZOOM = 7.2;

export const SanJuanMap: React.FC<SanJuanMapProps> = ({
  markers = [],
  activeMarkerId,
  onMarkerClick,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create Leaflet map instance if not existing
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: SAN_JUAN_CENTER,
        zoom: DEFAULT_ZOOM,
        minZoom: 6,
        maxZoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Dark Matter Tiles (Clean, fast, high-contrast dark mode)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Add Zoom Controls at top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
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
          <!-- Outer Radar Pulse Rings -->
          ${isSelected ? `
            <span class="absolute -inset-3 rounded-full animate-ping opacity-75" style="background-color: ${markerColor};"></span>
            <span class="absolute -inset-6 rounded-full animate-ping opacity-40" style="background-color: ${markerColor}; animation-duration: 2.5s;"></span>
          ` : ''}

          <!-- Core Node -->
          <div class="relative flex items-center justify-center rounded-full shadow-2xl transition-transform duration-200 ${
            isSelected
              ? 'w-8 h-8 ring-4 ring-cyan-400/70 scale-110 shadow-[0_0_20px_rgba(34,211,238,0.9)]'
              : 'w-6 h-6 border-2 border-navy-950 hover:scale-110 shadow-lg'
          }" style="background-color: ${markerColor};">
            <span class="text-[10px] font-black text-navy-950">
              ${marker.type === 'fault' ? '⚡' : marker.magnitude ? `M${marker.magnitude.toFixed(1)}` : '•'}
            </span>
          </div>

          <!-- Label Pill -->
          <div class="mt-1 px-2 py-0.5 rounded-full text-[9px] font-black tracking-tight whitespace-nowrap shadow-xl border transition-all ${
            isSelected
              ? 'bg-white text-navy-950 border-cyan-400 font-extrabold shadow-glow-cyan scale-105'
              : 'bg-navy-950/90 text-slate-200 border-white/20'
          }">
            ${marker.label}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-seismic-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const leafletMarker = L.marker([marker.lat, marker.lng], { icon: customIcon });

      leafletMarker.on('click', () => {
        if (onMarkerClick) {
          onMarkerClick(marker);
        }
      });

      group.addLayer(leafletMarker);
    });

    // Fly to active marker if present
    const activeMarker = markers.find(m => m.id === activeMarkerId);
    if (activeMarker) {
      map.flyTo([activeMarker.lat, activeMarker.lng], 8.5, {
        duration: 0.8,
        easeLinearity: 0.25
      });
    }
  }, [markers, activeMarkerId, onMarkerClick]);

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(SAN_JUAN_CENTER, DEFAULT_ZOOM, { duration: 0.8 });
    }
  };

  return (
    <div className={`relative w-full h-[360px] select-none overflow-hidden rounded-3xl border-2 border-brand-cyan/40 shadow-[0_10px_35px_rgba(4,14,27,0.8)] bg-navy-950 ${className}`}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Map Controls & Overlays */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-navy-950/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-brand-cyan/30 text-[10px] font-black text-brand-cyan shadow-lg">
        <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
        <span>MAPA CARTOGRÁFICO INPRES · SAN JUAN</span>
      </div>

      {/* Reset View Button */}
      <button
        onClick={handleResetView}
        className="absolute bottom-3 right-3 z-20 w-9 h-9 rounded-xl bg-navy-950/90 backdrop-blur-md border border-brand-cyan/40 text-brand-cyan flex items-center justify-center hover:bg-navy-900 active:scale-95 transition-all shadow-lg"
        title="Centrar provincia de San Juan"
        aria-label="Centrar mapa"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};
