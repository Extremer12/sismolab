// =========================================================================
// Servicio de Sismicidad Reciente (datos públicos, sin API key)
// -------------------------------------------------------------------------
// Fuente principal: EMSC (European-Mediterranean Seismological Centre).
//   Agrega reportes de agencias nacionales, incluyendo INPRES (Argentina,
//   código "NSNA") y CSN (Chile), por lo que trae sismos chicos de San Juan.
// Respaldo: USGS (Servicio Geológico de EE.UU.), cobertura global M2.5+.
//
// IMPORTANTE: son sismos YA OCURRIDOS, publicados con varios minutos de
// demora. Esto NO es un sistema de alerta temprana.
// =========================================================================

export type QuakeRegion = 'sanjuan' | 'argentina' | 'chile';
export type QuakeSource = 'EMSC' | 'USGS';

export interface Quake {
  id: string;
  time: number;          // epoch ms (UTC)
  mag: number;
  magType: string;
  depthKm: number;
  lat: number;
  lon: number;
  place: string;
  country: 'AR' | 'CL' | 'OTHER';
  source: QuakeSource;
  authority?: string;    // agencia que reportó (ej. NSNA = INPRES, CSN)
  url?: string;
}

export interface QuakeFeed {
  quakes: Quake[];
  source: QuakeSource;
  fetchedAt: number;
  fromCache: boolean;
}

// Cono Sur: cubre Argentina y Chile completos (incluye costa del Pacífico)
const AREA = { minLat: -56, maxLat: -17, minLon: -80, maxLon: -52 };
const DAYS_BACK = 7;
const TIMEOUT_MS = 10000;
const CACHE_KEY = 'sismolab_quakes_cache_v1';

// Límites aproximados de la provincia de San Juan (con un pequeño margen)
const SAN_JUAN_BOX = { minLat: -32.7, maxLat: -28.2, minLon: -70.7, maxLon: -66.5 };

export const REGION_BOUNDS: Record<QuakeRegion, [[number, number], [number, number]]> = {
  sanjuan: [[-32.7, -70.7], [-28.2, -66.5]],
  argentina: [[-55, -73.6], [-21.8, -53.6]],
  chile: [[-56, -76], [-17.5, -66.4]],
};

const AUTHORITY_LABELS: Record<string, string> = {
  NSNA: 'INPRES',
  CSN: 'CSN Chile',
  GUC: 'CSN Chile',
  EMSC: 'EMSC',
  USGS: 'USGS',
  NEIC: 'USGS',
};

export function authorityLabel(auth?: string): string | undefined {
  if (!auth) return undefined;
  return AUTHORITY_LABELS[auth.toUpperCase()] || auth;
}

function detectCountry(place: string): Quake['country'] {
  const p = place.toUpperCase();
  if (p.includes('ARGENTINA')) return 'AR';
  if (p.includes('CHILE')) return 'CL';
  return 'OTHER';
}

function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^|[\s,(-])([a-záéíóúñ])/g, (_m, sep: string, ch: string) => sep + ch.toUpperCase());
}

async function fetchJson(url: string): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function startTimeIso(): string {
  return new Date(Date.now() - DAYS_BACK * 24 * 60 * 60 * 1000).toISOString().slice(0, 19);
}

async function fetchFromEmsc(): Promise<Quake[]> {
  const url =
    'https://www.seismicportal.eu/fdsnws/event/1/query?format=json&orderby=time&limit=500&minmag=2' +
    `&minlat=${AREA.minLat}&maxlat=${AREA.maxLat}&minlon=${AREA.minLon}&maxlon=${AREA.maxLon}` +
    `&starttime=${startTimeIso()}`;
  const data = await fetchJson(url);
  const features: any[] = Array.isArray(data?.features) ? data.features : [];

  return features
    .filter(f => f?.properties && typeof f.properties.mag === 'number')
    .map(f => {
      const p = f.properties;
      const region = String(p.flynn_region || '');
      return {
        id: `emsc-${p.unid || f.id}`,
        time: Date.parse(p.time),
        mag: p.mag,
        magType: String(p.magtype || 'M').toUpperCase(),
        depthKm: Math.abs(Number(p.depth) || 0),
        lat: Number(p.lat),
        lon: Number(p.lon),
        place: toTitleCase(region),
        country: detectCountry(region),
        source: 'EMSC' as const,
        authority: p.auth,
        url: p.unid ? `https://www.seismicportal.eu/eventdetails.html?unid=${p.unid}` : undefined,
      };
    })
    .filter(q => Number.isFinite(q.time) && Number.isFinite(q.lat) && Number.isFinite(q.lon));
}

async function fetchFromUsgs(): Promise<Quake[]> {
  const url =
    'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=time&limit=500&minmagnitude=2.5' +
    `&minlatitude=${AREA.minLat}&maxlatitude=${AREA.maxLat}&minlongitude=${AREA.minLon}&maxlongitude=${AREA.maxLon}` +
    `&starttime=${startTimeIso()}`;
  const data = await fetchJson(url);
  const features: any[] = Array.isArray(data?.features) ? data.features : [];

  return features
    .filter(f => f?.properties && typeof f.properties.mag === 'number' && f.geometry?.coordinates)
    .map(f => {
      const p = f.properties;
      const [lon, lat, depth] = f.geometry.coordinates;
      const place = String(p.place || '');
      return {
        id: `usgs-${f.id}`,
        time: Number(p.time),
        mag: p.mag,
        magType: String(p.magType || 'M').toUpperCase(),
        depthKm: Math.abs(Number(depth) || 0),
        lat: Number(lat),
        lon: Number(lon),
        place,
        country: detectCountry(place),
        source: 'USGS' as const,
        authority: String(p.net || 'us').toUpperCase() === 'US' ? 'USGS' : String(p.net).toUpperCase(),
        url: p.url,
      };
    });
}

function readCache(): QuakeFeed | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as QuakeFeed;
    return Array.isArray(parsed?.quakes) ? { ...parsed, fromCache: true } : null;
  } catch {
    return null;
  }
}

function writeCache(feed: QuakeFeed) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(feed));
  } catch {
    // Almacenamiento lleno o bloqueado: no es crítico
  }
}

/**
 * Obtiene los sismos recientes del Cono Sur.
 * Intenta EMSC → USGS → último resultado guardado (modo sin conexión).
 */
export async function fetchRecentQuakes(): Promise<QuakeFeed> {
  const attempts: Array<[QuakeSource, () => Promise<Quake[]>]> = [
    ['EMSC', fetchFromEmsc],
    ['USGS', fetchFromUsgs],
  ];

  for (const [source, fn] of attempts) {
    try {
      const quakes = (await fn()).sort((a, b) => b.time - a.time);
      const feed: QuakeFeed = { quakes, source, fetchedAt: Date.now(), fromCache: false };
      writeCache(feed);
      return feed;
    } catch (err) {
      console.warn(`[seismicService] ${source} no disponible:`, err);
    }
  }

  const cached = readCache();
  if (cached) return cached;
  throw new Error('No se pudo obtener la sismicidad reciente');
}

export function getCachedQuakes(): QuakeFeed | null {
  return readCache();
}

export function filterByRegion(quakes: Quake[], region: QuakeRegion): Quake[] {
  if (region === 'argentina') return quakes.filter(q => q.country === 'AR');
  if (region === 'chile') return quakes.filter(q => q.country === 'CL');
  return quakes.filter(
    q =>
      q.lat >= SAN_JUAN_BOX.minLat && q.lat <= SAN_JUAN_BOX.maxLat &&
      q.lon >= SAN_JUAN_BOX.minLon && q.lon <= SAN_JUAN_BOX.maxLon
  );
}

// ---------- Escala visual ----------
export function magnitudeColor(mag: number): string {
  if (mag >= 5) return '#EF4444';   // rojo
  if (mag >= 3.5) return '#F97316'; // naranja
  return '#F6C453';                 // dorado/amarillo
}

export function magnitudeRadius(mag: number): number {
  return Math.max(4, Math.min(22, 3 + mag * 2.6));
}

// ---------- Píldora educativa ----------
export function getQuakeInsight(q: Quake, lang: 'es' | 'en'): { depth: string; feel: string } {
  const es = lang === 'es';
  let depth: string;
  if (q.depthKm >= 70) {
    depth = es
      ? `Sismo de profundidad intermedia (${Math.round(q.depthKm)} km). Es muy común bajo San Juan: la placa de Nazca se hunde bajo la Sudamericana. Al originarse lejos de la superficie, suele percibirse en un área amplia pero con un movimiento más suave que un sismo superficial de igual magnitud.`
      : `Intermediate-depth quake (${Math.round(q.depthKm)} km). Very common beneath San Juan, where the Nazca plate sinks under South America. Because it starts far below the surface, it is usually felt over a wide area but more gently than a shallow quake of the same magnitude.`;
  } else {
    depth = es
      ? `Sismo superficial (${Math.round(q.depthKm)} km). La energía llega con más fuerza a la zona cercana al epicentro. Los terremotos más destructivos de San Juan (1944 y 1977) fueron de este tipo.`
      : `Shallow quake (${Math.round(q.depthKm)} km). Energy reaches the area near the epicenter more strongly. San Juan's most destructive earthquakes (1944 and 1977) were of this type.`;
  }

  let feel: string;
  if (q.mag < 3) {
    feel = es ? 'Por su magnitud, en general solo lo registran los sismógrafos.' : 'At this magnitude it is usually recorded only by seismographs.';
  } else if (q.mag < 4) {
    feel = es ? 'Puede sentirse levemente cerca del epicentro.' : 'It may be lightly felt near the epicenter.';
  } else if (q.mag < 5) {
    feel = es ? 'Suele sentirse con claridad; los daños son poco frecuentes.' : 'Usually clearly felt; damage is uncommon.';
  } else if (q.mag < 6) {
    feel = es ? 'Puede causar daños leves en construcciones vulnerables.' : 'It can cause minor damage to vulnerable buildings.';
  } else {
    feel = es ? 'Magnitud con potencial de daños. Seguí siempre la información oficial de Protección Civil.' : 'Potentially damaging magnitude. Always follow official Civil Protection guidance.';
  }

  return { depth, feel };
}
