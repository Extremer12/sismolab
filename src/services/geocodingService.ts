// =========================================================================
// Servicio de Geocodificación & Evacuación Segura para San Juan (SismoLab)
// -------------------------------------------------------------------------
// Búsqueda inteligente de direcciones (Nominatim OSM) + Puntos seguros de San Juan
// =========================================================================

export interface GeocodingResult {
  id: string;
  name: string;
  displayName: string;
  coords: [number, number]; // [lat, lng]
  type: 'preset' | 'osm' | 'gps';
  category?: string;
  distanceFromHomeMeters?: number;
}

// Puntos seguros y plazas emblemáticas con espacios abiertos de San Juan
export const SAN_JUAN_EVACUATION_PRESETS: GeocodingResult[] = [
  {
    id: 'preset-plaza-25',
    name: 'Plaza 25 de Mayo (Centro)',
    displayName: 'Plaza 25 de Mayo, Centro, San Juan Capital',
    coords: [-31.5375, -68.5364],
    type: 'preset',
    category: 'Plaza Principal · Espacio Abierto',
  },
  {
    id: 'preset-parque-mayo',
    name: 'Parque de Mayo (Monumento al Deporte)',
    displayName: 'Parque de Mayo, Av. Libertador y Las Heras, Capital',
    coords: [-31.5303, -68.5418],
    type: 'preset',
    category: 'Parque Provincial · Gran Despeje',
  },
  {
    id: 'preset-plaza-desamparados',
    name: 'Plaza Desamparados',
    displayName: 'Plaza Desamparados, Av. Libertador 2800 Oeste, Capital',
    coords: [-31.5322, -68.5574],
    type: 'preset',
    category: 'Plaza Barrial',
  },
  {
    id: 'preset-plaza-concepcion',
    name: 'Plaza de Concepción',
    displayName: 'Plaza de Concepción, Tucumán y Juan Jufré, Capital',
    coords: [-31.5195, -68.5350],
    type: 'preset',
    category: 'Plaza Histórica · Zona Norte',
  },
  {
    id: 'preset-plaza-trinidad',
    name: 'Plaza de Trinidad',
    displayName: 'Plaza de Trinidad, Mendoza y Pedro de Valdivia',
    coords: [-31.5542, -68.5283],
    type: 'preset',
    category: 'Plaza Barrial · Zona Sur',
  },
  {
    id: 'preset-plaza-villa-krause',
    name: 'Plaza Centenario (Villa Krause)',
    displayName: 'Plaza Centenario, Villa Krause, Rawson',
    coords: [-31.5794, -68.5247],
    type: 'preset',
    category: 'Plaza Departamental Rawson',
  },
  {
    id: 'preset-parque-chimbas',
    name: 'Parque Departamental de Chimbas',
    displayName: 'Parque de Chimbas, Tucumán y Benavidez, Chimbas',
    coords: [-31.4988, -68.5435],
    type: 'preset',
    category: 'Parque Departamental Chimbas',
  },
  {
    id: 'preset-plaza-santa-lucia',
    name: 'Plaza Departamental de Santa Lucía',
    displayName: 'Plaza de Santa Lucía, Gral. Paz y Aberastain',
    coords: [-31.5398, -68.4947],
    type: 'preset',
    category: 'Plaza Departamental Santa Lucía',
  },
  {
    id: 'preset-plaza-rivadavia',
    name: 'Plaza Departamental de Rivadavia',
    displayName: 'Plaza de Rivadavia, Av. Libertador y Rastreador Calívar',
    coords: [-31.5310, -68.5830],
    type: 'preset',
    category: 'Plaza Departamental Rivadavia',
  },
  {
    id: 'preset-estadio-cantoni',
    name: 'Explanada Estadio Aldo Cantoni',
    displayName: 'Estadio Aldo Cantoni, Urquiza y San Luis, Capital',
    coords: [-31.5288, -68.5401],
    type: 'preset',
    category: 'Punto de Encuentro Regional',
  },
];

// Cálculo de distancia en metros usando la fórmula de Haversine
export function calculateDistanceMeters(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Formateo legible de distancia y tiempo estimado de evacuación
export function formatEvacuationRoute(
  fromCoords: [number, number],
  toCoords: [number, number]
): {
  distanceMeters: number;
  distanceFormatted: string;
  walkingMinutes: number;
  timeFormatted: string;
  blocksEstimate: number;
  googleMapsUrl: string;
} {
  const distanceMeters = calculateDistanceMeters(fromCoords, toCoords);

  // Estimación de cuadras (promedio San Juan: 100m - 120m por cuadra)
  const blocksEstimate = Math.max(1, Math.round(distanceMeters / 110));

  // Velocidad de caminata segura post-sismo: ~75 metros por minuto (4.5 km/h con precaución)
  const walkingMinutes = Math.max(1, Math.round(distanceMeters / 75));

  const distanceFormatted =
    distanceMeters >= 1000
      ? `${(distanceMeters / 1000).toFixed(1)} km`
      : `${distanceMeters} m`;

  const timeFormatted =
    walkingMinutes === 1 ? '~1 min a pie' : `~${walkingMinutes} min a pie`;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${fromCoords[0]},${fromCoords[1]}&destination=${toCoords[0]},${toCoords[1]}&travelmode=walking`;

  return {
    distanceMeters,
    distanceFormatted,
    walkingMinutes,
    timeFormatted,
    blocksEstimate,
    googleMapsUrl,
  };
}

// Búsqueda de dirección con soporte para texto libre + Nominatim + fallback offline
export async function searchAddress(query: string): Promise<GeocodingResult[]> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const matchedPresets = SAN_JUAN_EVACUATION_PRESETS.filter(
    (p) =>
      p.name.toLowerCase().includes(cleanQuery) ||
      p.displayName.toLowerCase().includes(cleanQuery) ||
      cleanQuery.split(' ').some((word) => p.displayName.toLowerCase().includes(word) && word.length > 3)
  );

  // Intento de búsqueda en línea con Nominatim (OpenStreetMap)
  try {
    const searchQuery = cleanQuery.includes('san juan')
      ? cleanQuery
      : `${cleanQuery}, San Juan, Argentina`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchQuery
      )}&addressdetails=1&limit=5&countrycodes=ar`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'es',
        },
      }
    );
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const osmResults: GeocodingResult[] = data.map((item: any, idx: number) => {
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);

          // Nombre simplificado
          const shortName = item.name || item.display_name.split(',')[0];

          return {
            id: `osm-${item.place_id || idx}-${Date.now()}`,
            name: shortName,
            displayName: item.display_name,
            coords: [lat, lon],
            type: 'osm',
            category: item.type ? `Lugar: ${item.type}` : 'Ubicación Geocodificada',
          };
        });

        // Combinar presets encontrados primero, luego resultados de OSM sin duplicar coordenadas idénticas
        const combined = [...matchedPresets];
        for (const osm of osmResults) {
          const alreadyExists = combined.some(
            (c) =>
              Math.abs(c.coords[0] - osm.coords[0]) < 0.001 &&
              Math.abs(c.coords[1] - osm.coords[1]) < 0.001
          );
          if (!alreadyExists) {
            combined.push(osm);
          }
        }
        return combined.slice(0, 6);
      }
    }
  } catch (err) {
    console.warn('[geocodingService] Búsqueda OSM offline o lenta, usando presets locales:', err);
  }

  // Si no hay internet o falló OSM, retornar los presets locales de San Juan que coincidan
  return matchedPresets.length > 0 ? matchedPresets : SAN_JUAN_EVACUATION_PRESETS.slice(0, 4);
}

// Geocodificación inversa: obtener nombre de calle a partir de coordenadas
export async function reverseGeocode(coords: [number, number]): Promise<string> {
  const [lat, lon] = coords;

  // Revisar primero si está muy cerca de algún preset conocido
  for (const preset of SAN_JUAN_EVACUATION_PRESETS) {
    if (calculateDistanceMeters(coords, preset.coords) < 80) {
      return preset.name;
    }
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      {
        signal: controller.signal,
        headers: { 'Accept-Language': 'es' },
      }
    );
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      if (data && data.display_name) {
        // Acortar para una visualización limpia
        const parts = data.display_name.split(', ');
        if (parts.length >= 3) {
          return `${parts[0]}, ${parts[1]} (${parts[2]})`;
        }
        return data.display_name;
      }
    }
  } catch (err) {
    console.warn('[geocodingService] Reverse geocode error:', err);
  }

  return `Punto en ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}

// Obtener ubicación GPS actual del dispositivo
export function getCurrentGPSLocation(): Promise<{ coords: [number, number]; accuracy: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('La geolocalización no está soportada en este dispositivo'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coords: [position.coords.latitude, position.coords.longitude],
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  });
}
