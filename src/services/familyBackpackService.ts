// =========================================================================
// Servicio de Mochila Inteligente & Plan Familiar (Offline-First)
// -------------------------------------------------------------------------
// Normativas: SINAGIR, Cruz Roja Argentina y Protección Civil San Juan.
// =========================================================================

import {
  FamilyPlan,
  FamilyMember,
  BackpackItem,
  BackpackCategory,
  EmergencyRole,
  MemberStatus,
  PreparednessIndex
} from '../types';
import { supabase } from './supabase';

const FAMILY_STORAGE_KEY = 'sismolab_family_plan_v1';
const BACKPACK_STORAGE_KEY = 'sismolab_backpack_inventory_v1';

// Catálogo base de insumos de 72 horas por persona
const DEFAULT_CATALOG: Omit<BackpackItem, 'quantity' | 'required_quantity' | 'is_packed'>[] = [
  {
    id: 'agua-potable',
    category: 'agua',
    name: 'Agua potable embotellada',
    description: 'Cálculo oficial: 2 litros diarios por integrante durante 72 horas.',
    unit: 'L',
    is_perishable: true,
    image: '/images/kit/agua.webp',
  },
  {
    id: 'alimentos-conservas',
    category: 'alimentos',
    name: 'Alimentos no perecederos',
    description: 'Enlatados listos para consumo (atún, legumbres), barras de cereal y frutos secos.',
    unit: 'raciones',
    is_perishable: true,
    image: '/images/kit/alimentos.webp',
  },
  {
    id: 'botiquin-auxilio',
    category: 'botiquin',
    name: 'Botiquín de primeros auxilios',
    description: 'Gasas estériles, apósitos, vendas, antiséptico, tijera y guantes descartables.',
    unit: 'kit',
    is_perishable: true,
    image: '/images/kit/botiquin.webp',
  },
  {
    id: 'linterna-led',
    category: 'iluminacion',
    name: 'Linterna LED de alta potencia',
    description: 'Preferentemente a pilas o dinamo manual. No use velas ante posible fuga de gas.',
    unit: 'u.',
    is_perishable: false,
    image: '/images/kit/linterna.webp',
  },
  {
    id: 'pilas-repuesto',
    category: 'iluminacion',
    name: 'Pilas de repuesto (AA/AAA)',
    description: 'Juegos nuevos precintados para linterna y radio portátil.',
    unit: 'paq.',
    is_perishable: true,
    image: '/images/kit/powerbank.webp',
  },
  {
    id: 'radio-pilas',
    category: 'comunicacion',
    name: 'Radio portátil AM/FM a pilas',
    description: 'Para sintonizar los comunicados oficiales si colapsa la telefonía celular.',
    unit: 'u.',
    is_perishable: false,
    image: '/images/kit/radio.webp',
  },
  {
    id: 'silbato-socorro',
    category: 'comunicacion',
    name: 'Silbato de socorro sin bolilla',
    description: 'Permite emitir señales acústicas sin agotar la voz en caso de quedar atrapado.',
    unit: 'u.',
    is_perishable: false,
    image: '/images/kit/silbato.webp',
  },
  {
    id: 'documentos-hermeticos',
    category: 'documentos',
    name: 'Documentación en bolsa hermética',
    description: 'Copias de DNI, partidas de nacimiento, recetas médicas y títulos en sobre ziploc.',
    unit: 'juego',
    is_perishable: false,
    image: '/images/kit/mochila.webp',
  },
  {
    id: 'dinero-efectivo',
    category: 'documentos',
    name: 'Dinero en efectivo (billetes chicos)',
    description: 'Los cajeros automáticos y terminales de pago no funcionan sin suministro eléctrico.',
    unit: 'reserva',
    is_perishable: false,
    image: '/images/kit/mochila.webp',
  },
  {
    id: 'copia-llaves',
    category: 'documentos',
    name: 'Juego duplicado de llaves',
    description: 'Copias de acceso a la vivienda y vehículos para evacuación inmediata.',
    unit: 'juego',
    is_perishable: false,
    image: '/images/kit/multiherramienta.webp',
  },
  {
    id: 'manta-termica',
    category: 'abrigo',
    name: 'Manta térmica aluminizada / abrigo',
    description: 'Protege contra la hipotermia nocturna durante evacuaciones en intemperie.',
    unit: 'u.',
    is_perishable: false,
    image: '/images/kit/manta.webp',
  },
  {
    id: 'repelente-mosquitos',
    category: 'especiales',
    name: 'Repelente de mosquitos (DEET)',
    description: 'Prevención crítica contra el vector del dengue (Aedes aegypti) en época estival.',
    unit: 'u.',
    is_perishable: true,
    image: '/images/kit/botiquin.webp',
  },
  {
    id: 'higiene-personal',
    category: 'higiene',
    name: 'Kit de higiene básica',
    description: 'Papel higiénico, toallitas húmedas, jabón blanco y alcohol en gel.',
    unit: 'kit',
    is_perishable: false,
    image: '/images/kit/botiquin.webp',
  },
  {
    id: 'herramienta-multiuso',
    category: 'herramientas',
    name: 'Navaja o pinza multiuso',
    description: 'Herramienta de corte y apertura de latas sin requerir abrelatas externo.',
    unit: 'u.',
    is_perishable: false,
    image: '/images/kit/multiherramienta.webp',
  },
  {
    id: 'cinta-adhesiva',
    category: 'herramientas',
    name: 'Cinta multipropósito (duct tape)',
    description: 'Útil para sellado de vidrios rajados, reparaciones provisorias y sujeciones.',
    unit: 'rollo',
    is_perishable: false,
    image: '/images/kit/multiherramienta.webp',
  },
];

export interface CategoryVisualMeta {
  id: BackpackCategory;
  name: string;
  image: string;
  description: string;
}

export const BACKPACK_CATEGORIES_META: CategoryVisualMeta[] = [
  { id: 'agua', name: 'Agua Vital', image: '/images/kit/agua.webp', description: '2L diarios por integrante para 72h' },
  { id: 'alimentos', name: 'Alimentación', image: '/images/kit/alimentos.webp', description: 'Raciones listas sin cocción' },
  { id: 'botiquin', name: 'Primeros Auxilios', image: '/images/kit/botiquin.webp', description: 'Curaciones, gasas y antiséptico' },
  { id: 'iluminacion', name: 'Iluminación', image: '/images/kit/linterna.webp', description: 'Linternas y baterías auxiliares' },
  { id: 'comunicacion', name: 'Comunicación', image: '/images/kit/radio.webp', description: 'Radio AM/FM y silbato de alerta' },
  { id: 'documentos', name: 'Documentación', image: '/images/kit/mochila.webp', description: 'Identificación y dinero en efectivo' },
  { id: 'abrigo', name: 'Abrigo Térmico', image: '/images/kit/manta.webp', description: 'Mantas aluminizadas y protección' },
  { id: 'herramientas', name: 'Herramientas', image: '/images/kit/multiherramienta.webp', description: 'Navaja multiuso y fijaciones' },
  { id: 'higiene', name: 'Higiene', image: '/images/kit/botiquin.webp', description: 'Elementos sanitarios esenciales' },
  { id: 'especiales', name: 'Especiales', image: '/images/kit/silbato.webp', description: 'Repelente, niños o medicación' },
];

export function getItemFallbackImage(category: BackpackCategory): string {
  const meta = BACKPACK_CATEGORIES_META.find(c => c.id === category);
  return meta?.image || '/images/kit/mochila.webp';
}

// Generador de código familiar (ej: SJ-4892)
function generateInviteCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = 'SJ-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// -------------------------------------------------------------------------
// GESTIÓN DEL PLAN FAMILIAR
// -------------------------------------------------------------------------

export function loadFamilyPlan(defaultUserName = 'Titular'): FamilyPlan {
  try {
    const raw = localStorage.getItem(FAMILY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.members) && parsed.members.length > 0) {
        let needsSave = false;
        if (!parsed.meeting_point_primary_coords) {
          parsed.meeting_point_primary_coords = [-31.5375, -68.5364]; // Plaza 25 de Mayo
          needsSave = true;
        }
        if (!parsed.meeting_point_secondary_coords) {
          parsed.meeting_point_secondary_coords = [-31.5303, -68.5418]; // Parque de Mayo
          needsSave = true;
        }
        if (!parsed.home_coords) {
          parsed.home_coords = [-31.5350, -68.5320]; // Casa centro
          needsSave = true;
        }
        parsed.members = parsed.members.map((m: FamilyMember, idx: number) => {
          if (!m.avatar) {
            needsSave = true;
            return { ...m, avatar: `/images/avatar/avatar_${(idx % 12) + 1}.webp` };
          }
          return m;
        });
        if (needsSave) {
          saveFamilyPlan(parsed);
        }
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[familyService] Error leyendo plan familiar:', err);
  }

  // Plan inicial por defecto con coordenadas de San Juan
  const initialPlan: FamilyPlan = {
    id: 'family-' + Date.now(),
    family_name: 'Mi Familia',
    invite_code: generateInviteCode(),
    meeting_point_primary: 'Plaza 25 de Mayo (Centro San Juan)',
    meeting_point_secondary: 'Parque de Mayo (Zona Monumento al Deporte)',
    meeting_point_primary_coords: [-31.5375, -68.5364],
    meeting_point_secondary_coords: [-31.5303, -68.5418],
    home_coords: [-31.5350, -68.5320],
    out_of_province_contact: {
      name: 'Familiar de referencia',
      phone: '',
      city: 'Mendoza / Córdoba / Bs.As.',
    },
    members: [
      {
        id: 'member-1',
        name: defaultUserName,
        relation: 'Titular',
        is_dependent: false,
        role: 'cortar_suministros',
        status: 'safe',
        status_updated_at: new Date().toISOString(),
        avatar: '/images/avatar/avatar_1.webp',
      },
      {
        id: 'member-2',
        name: 'Segundo Integrante',
        relation: 'Pareja / Familiar',
        is_dependent: false,
        role: 'llevar_mochila',
        status: 'safe',
        status_updated_at: new Date().toISOString(),
        avatar: '/images/avatar/avatar_2.webp',
      },
    ],
    updated_at: new Date().toISOString(),
  };

  saveFamilyPlan(initialPlan);
  return initialPlan;
}

export function saveFamilyPlan(plan: FamilyPlan): void {
  try {
    const updated = { ...plan, updated_at: new Date().toISOString() };
    localStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(updated));
    // Sincronización asíncrona a Supabase en segundo plano
    syncFamilyPlanToSupabase(updated).catch(() => {});
  } catch (err) {
    console.error('[familyService] Error guardando plan familiar:', err);
  }
}

// Sincronizar plan familiar a Supabase
export async function syncFamilyPlanToSupabase(plan: FamilyPlan): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('family_plans')
      .upsert({
        id: plan.id,
        invite_code: plan.invite_code,
        family_name: plan.family_name,
        created_by: plan.created_by || null,
        home_name: plan.home_name || 'Vivienda Familiar',
        home_address: plan.home_address || '',
        home_coords: plan.home_coords || [-31.5350, -68.5320],
        meeting_point_primary: plan.meeting_point_primary,
        meeting_point_primary_coords: plan.meeting_point_primary_coords || [-31.5375, -68.5364],
        meeting_point_primary_notes: plan.meeting_point_primary_notes || '',
        meeting_point_secondary: plan.meeting_point_secondary,
        meeting_point_secondary_coords: plan.meeting_point_secondary_coords || [-31.5303, -68.5418],
        meeting_point_secondary_notes: plan.meeting_point_secondary_notes || '',
        out_of_province_contact: plan.out_of_province_contact,
        members: plan.members,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.warn('[familyBackpackService] Supabase sync warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[familyBackpackService] Offline or Supabase unavailable:', err);
    return false;
  }
}

// Descargar o unirse a un plan familiar por código de invitación o ID
export async function fetchFamilyPlanFromSupabase(inviteCodeOrId: string): Promise<FamilyPlan | null> {
  try {
    const code = inviteCodeOrId.trim().toUpperCase();
    const { data, error } = await supabase
      .from('family_plans')
      .select('*')
      .or(`invite_code.eq.${code},id.eq.${inviteCodeOrId}`)
      .single();

    if (error || !data) return null;

    const plan: FamilyPlan = {
      id: data.id,
      family_name: data.family_name || 'Mi Familia',
      invite_code: data.invite_code,
      created_by: data.created_by,
      home_name: data.home_name || 'Vivienda Familiar',
      home_address: data.home_address || '',
      home_coords: Array.isArray(data.home_coords) ? (data.home_coords as [number, number]) : [-31.5350, -68.5320],
      meeting_point_primary: data.meeting_point_primary,
      meeting_point_primary_coords: Array.isArray(data.meeting_point_primary_coords) ? (data.meeting_point_primary_coords as [number, number]) : [-31.5375, -68.5364],
      meeting_point_primary_notes: data.meeting_point_primary_notes || '',
      meeting_point_secondary: data.meeting_point_secondary,
      meeting_point_secondary_coords: Array.isArray(data.meeting_point_secondary_coords) ? (data.meeting_point_secondary_coords as [number, number]) : [-31.5303, -68.5418],
      meeting_point_secondary_notes: data.meeting_point_secondary_notes || '',
      out_of_province_contact: data.out_of_province_contact || { name: '', phone: '', city: '' },
      members: Array.isArray(data.members) ? data.members : [],
      updated_at: data.updated_at || new Date().toISOString()
    };

    // Guardar en caché local
    try {
      localStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(plan));
    } catch {}

    return plan;
  } catch (err) {
    console.warn('[familyBackpackService] Error fetching plan:', err);
    return null;
  }
}

// -------------------------------------------------------------------------
// GESTIÓN DEL INVENTARIO DE MOCHILA 72H
// -------------------------------------------------------------------------

export function loadBackpackInventory(membersCount = 2): BackpackItem[] {
  try {
    const raw = localStorage.getItem(BACKPACK_STORAGE_KEY);
    if (raw) {
      let items = JSON.parse(raw) as BackpackItem[];
      if (Array.isArray(items) && items.length > 0) {
        // Enriquecer con imágenes si no las tuvieran
        let modified = false;
        items = items.map((it) => {
          if (!it.image) {
            modified = true;
            return { ...it, image: getItemFallbackImage(it.category) };
          }
          return it;
        });
        const recalculated = recalculateRequiredQuantities(items, membersCount);
        if (modified) saveBackpackInventory(recalculated);
        return recalculated;
      }
    }
  } catch (err) {
    console.warn('[familyService] Error leyendo inventario:', err);
  }

  // Generar inventario inicial calculado
  const initialItems: BackpackItem[] = DEFAULT_CATALOG.map((catItem) => {
    let req = 1;
    if (catItem.id === 'agua-potable') req = membersCount * 6; // 2L x 3 días
    if (catItem.id === 'alimentos-conservas') req = membersCount * 3; // 3 raciones
    if (catItem.id === 'manta-termica') req = membersCount;
    if (catItem.id === 'silbato-socorro') req = Math.min(membersCount, 3);

    return {
      ...catItem,
      required_quantity: req,
      quantity: 0,
      is_packed: false,
      expiry_date: catItem.is_perishable ? getSuggestedExpiryDate() : undefined,
      image: catItem.image || getItemFallbackImage(catItem.category),
    };
  });

  saveBackpackInventory(initialItems);
  return initialItems;
}

export function saveBackpackInventory(items: BackpackItem[], familyId?: string): void {
  try {
    localStorage.setItem(BACKPACK_STORAGE_KEY, JSON.stringify(items));
    if (familyId) {
      syncBackpackToSupabase(familyId, items).catch(() => {});
    }
  } catch (err) {
    console.error('[familyService] Error guardando inventario:', err);
  }
}

// Sincronizar mochila a Supabase
export async function syncBackpackToSupabase(familyId: string, items: BackpackItem[]): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('family_backpacks')
      .upsert({
        id: `bp-${familyId}`,
        family_id: familyId,
        items: items,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.warn('[familyBackpackService] Backpack sync warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[familyBackpackService] Offline or Supabase unavailable:', err);
    return false;
  }
}

// Descargar inventario de mochila desde Supabase
export async function fetchBackpackFromSupabase(familyId: string): Promise<BackpackItem[] | null> {
  try {
    const { data, error } = await supabase
      .from('family_backpacks')
      .select('items')
      .eq('family_id', familyId)
      .single();

    if (error || !data || !Array.isArray(data.items)) return null;
    saveBackpackInventory(data.items, familyId);
    return data.items;
  } catch (err) {
    console.warn('[familyBackpackService] Error fetching backpack:', err);
    return null;
  }
}

function recalculateRequiredQuantities(items: BackpackItem[], membersCount: number): BackpackItem[] {
  return items.map((item) => {
    let req = item.required_quantity;
    if (item.id === 'agua-potable') req = membersCount * 6;
    if (item.id === 'alimentos-conservas') req = membersCount * 3;
    if (item.id === 'manta-termica') req = membersCount;
    return { ...item, required_quantity: Math.max(1, req) };
  });
}

function getSuggestedExpiryDate(): string {
  // Fecha sugerida: 6 meses a partir de hoy
  const d = new Date();
  d.setMonth(d.getMonth() + 6);
  return d.toISOString().slice(0, 10);
}

// -------------------------------------------------------------------------
// CÁLCULO DEL ÍNDICE DE PREPARACIÓN FAMILIAR (0 - 100%)
// -------------------------------------------------------------------------

export function calculatePreparednessIndex(plan: FamilyPlan, items: BackpackItem[]): PreparednessIndex {
  // 1. Mochila (máx. 40 pts)
  const totalItems = items.length;
  const packedItems = items.filter((i) => i.is_packed).length;
  const backpackRatio = totalItems > 0 ? packedItems / totalItems : 0;
  const backpackScore = Math.round(backpackRatio * 40);

  // 2. Roles familiares asignados (máx. 25 pts)
  // Al menos 'cortar_suministros' y 'llevar_mochila' deben estar asignados
  const roles = plan.members.map((m) => m.role);
  const hasGasElectricRole = roles.includes('cortar_suministros');
  const hasBackpackRole = roles.includes('llevar_mochila');
  let familyRolesScore = 0;
  if (hasGasElectricRole) familyRolesScore += 12;
  if (hasBackpackRole) familyRolesScore += 13;

  // 3. Puntos de encuentro fijados (máx. 20 pts)
  let meetingPointsScore = 0;
  if (plan.meeting_point_primary && plan.meeting_point_primary.trim().length > 5) {
    meetingPointsScore += 10;
  }
  if (plan.meeting_point_secondary && plan.meeting_point_secondary.trim().length > 5) {
    meetingPointsScore += 10;
  }

  // 4. Vencimientos al día (máx. 15 pts)
  const now = new Date().getTime();
  let expiringItemsCount = 0;
  let expiredItemsCount = 0;

  items.forEach((item) => {
    if (item.expiry_date && item.is_packed) {
      const expTime = new Date(item.expiry_date).getTime();
      const daysUntil = (expTime - now) / (1000 * 60 * 60 * 24);
      if (daysUntil < 0) {
        expiredItemsCount++;
      } else if (daysUntil <= 30) {
        expiringItemsCount++;
      }
    }
  });

  let expiryHealthScore = 15;
  if (expiredItemsCount > 0) {
    expiryHealthScore = 0;
  } else if (expiringItemsCount > 0) {
    expiryHealthScore = 8;
  }

  const totalScore = Math.min(100, backpackScore + familyRolesScore + meetingPointsScore + expiryHealthScore);

  return {
    totalScore,
    backpackScore,
    familyRolesScore,
    meetingPointsScore,
    expiryHealthScore,
    missingItemsCount: totalItems - packedItems,
    expiringItemsCount: expiringItemsCount + expiredItemsCount,
  };
}

// -------------------------------------------------------------------------
// EXPORTACIÓN A WHATSAPP (COMPARTIR FALTANTES DE LA MOCHILA)
// -------------------------------------------------------------------------

export function generateWhatsAppShoppingList(plan: FamilyPlan, items: BackpackItem[]): string {
  const missing = items.filter((i) => !i.is_packed);

  let message = `🎒 *MOCHILA DE EMERGENCIA 72H · ${plan.family_name.toUpperCase()}*\n`;
  message += `_Generado desde SISMO LAB (San Juan)_\n\n`;

  if (missing.length === 0) {
    message += `✅ *¡La mochila está al 100%!* Tenemos todos los insumos necesarios para ${plan.members.length} integrantes.\n`;
  } else {
    message += `📋 *Faltan ${missing.length} insumos por completar:*\n\n`;
    missing.forEach((item) => {
      message += `▫️ *${item.name}*: ${item.required_quantity} ${item.unit} (${item.description})\n`;
    });
    message += `\n📍 *Punto de encuentro familiar:* ${plan.meeting_point_primary}\n`;
  }

  return message;
}

// -------------------------------------------------------------------------
// TEXTO PARA ROLES EN ESPAÑOL / INGLÉS
// -------------------------------------------------------------------------

export const ROLE_LABELS: Record<EmergencyRole, { title: string; desc: string }> = {
  cortar_suministros: {
    title: 'Cortar suministros',
    desc: 'Cerrar la llave de gas y bajar el disyuntor principal de luz antes de evacuar.',
  },
  llevar_mochila: {
    title: 'Tomar la mochila 72h',
    desc: 'Retirar la mochila de emergencia ubicada junto a la salida y llevarla al punto seguro.',
  },
  asistir_vulnerables: {
    title: 'Asistir vulnerables',
    desc: 'Acompañar a niños, adultos mayores, personas con discapacidad o mascotas.',
  },
  coordinador: {
    title: 'Líder de evacuación',
    desc: 'Verificar la ruta de escape y realizar el recuento de integrantes en el punto de encuentro.',
  },
  comunicacion: {
    title: 'Comunicación externa',
    desc: 'Reportar por SMS el estado de la familia al contacto de referencia fuera de la provincia.',
  },
};
