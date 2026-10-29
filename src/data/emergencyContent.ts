// =========================================================================
// Contenido de Preparación y Emergencias (Fase 0 · v1.0.1)
// -------------------------------------------------------------------------
// Fuentes: Protección Civil San Juan / COPRE, SINAGIR, Cruz Roja Argentina,
// Ministerio de Salud de San Juan, INPRES y Servicio Meteorológico Nacional.
//
// IMPORTANTE: contenido 100% local (funciona sin internet). Ante cambios en
// los números o recomendaciones oficiales, actualizar este archivo.
// =========================================================================

export interface Bilingual {
  es: string;
  en: string;
}

export type HazardId = 'sismo' | 'tormenta' | 'aluvion' | 'zonda' | 'dengue' | 'corte-luz';

export interface HazardGuide {
  id: HazardId;
  title: Bilingual;
  subtitle: Bilingual;
  season: Bilingual;
  /** Clases de color Tailwind (texto + borde + fondo suave) */
  accent: { text: string; border: string; bg: string };
  /** Regla de oro: la recomendación más importante, destacada arriba */
  keyRule: Bilingual;
  before: Bilingual[];
  during: Bilingual[];
  after: Bilingual[];
  sources: string;
}

export interface EmergencyNumber {
  number: string;
  name: Bilingual;
  description: Bilingual;
  tone: 'red' | 'orange' | 'cyan' | 'emerald';
}

// -------------------------------------------------------------------------
// Números de emergencia · Provincia de San Juan
// -------------------------------------------------------------------------
export const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  {
    number: '911',
    name: { es: 'Emergencias (CISEM)', en: 'Emergencies (CISEM)' },
    description: {
      es: 'Policía y coordinación general de emergencias. Si dudás a quién llamar, llamá acá.',
      en: 'Police and general emergency coordination. If in doubt, call this number.',
    },
    tone: 'red',
  },
  {
    number: '107',
    name: { es: 'Emergencias médicas', en: 'Medical emergencies' },
    description: {
      es: 'Ambulancias y urgencias de salud.',
      en: 'Ambulances and health emergencies.',
    },
    tone: 'emerald',
  },
  {
    number: '100',
    name: { es: 'Bomberos', en: 'Fire department' },
    description: {
      es: 'Incendios, rescates y escapes de gas.',
      en: 'Fires, rescues and gas leaks.',
    },
    tone: 'orange',
  },
  {
    number: '103',
    name: { es: 'Protección Civil', en: 'Civil Protection' },
    description: {
      es: 'Inundaciones, aluviones, árboles o cables caídos, derrumbes.',
      en: 'Floods, flash floods, fallen trees or wires, collapses.',
    },
    tone: 'cyan',
  },
];

// -------------------------------------------------------------------------
// Temporada Súper Niño: qué significa para San Juan
// -------------------------------------------------------------------------
export const EL_NINO_IMPACTS: { icon: 'storm' | 'flood' | 'snow' | 'bug'; title: Bilingual; text: Bilingual }[] = [
  {
    icon: 'storm',
    title: { es: 'Tormentas fuertes y granizo', en: 'Severe storms and hail' },
    text: {
      es: 'Chaparrones intensos en poco tiempo, sobre todo entre diciembre y marzo.',
      en: 'Intense downpours in a short time, especially from December to March.',
    },
  },
  {
    icon: 'flood',
    title: { es: 'Crecidas y aluviones', en: 'Flash floods' },
    text: {
      es: 'El agua baja de golpe por badenes, cauces secos y zonas de precordillera.',
      en: 'Water rushes suddenly through fords, dry riverbeds and foothill areas.',
    },
  },
  {
    icon: 'snow',
    title: { es: 'Más nieve en la cordillera', en: 'More snow in the Andes' },
    text: {
      es: 'Buena noticia para los diques, pero con posibles cortes de rutas y pasos.',
      en: 'Good news for reservoirs, but roads and mountain passes may close.',
    },
  },
  {
    icon: 'bug',
    title: { es: 'Más riesgo de dengue', en: 'Higher dengue risk' },
    text: {
      es: 'Más humedad favorece al mosquito Aedes aegypti. La clave es eliminar criaderos.',
      en: 'More humidity favors the Aedes aegypti mosquito. Removing breeding sites is key.',
    },
  },
];

// -------------------------------------------------------------------------
// Guías por amenaza: Antes / Durante / Después
// -------------------------------------------------------------------------
export const HAZARD_GUIDES: HazardGuide[] = [
  {
    id: 'tormenta',
    title: { es: 'Tormentas y granizo', en: 'Storms and hail' },
    subtitle: { es: 'Lluvia intensa, rayos y piedra', en: 'Heavy rain, lightning and hail' },
    season: { es: 'Dic → Mar', en: 'Dec → Mar' },
    accent: { text: 'text-sky-300', border: 'border-sky-400/40', bg: 'bg-sky-400/10' },
    keyRule: {
      es: 'Si entra agua a tu casa, cortá la luz desde el tablero principal.',
      en: 'If water gets into your home, switch off power at the main breaker.',
    },
    before: [
      { es: 'Limpiá techos, canaletas, bajadas y desagües.', en: 'Clean roofs, gutters, downspouts and drains.' },
      { es: 'Retirá del patio o balcón objetos que el agua o el viento puedan arrastrar.', en: 'Remove objects from yards or balconies that water or wind could carry away.' },
      { es: 'No saques la basura los días de lluvia: tapa las alcantarillas.', en: 'Do not put trash out on rainy days: it blocks storm drains.' },
      { es: 'Tené lista la mochila de emergencia con linterna y radio a pilas.', en: 'Keep your emergency kit ready with a flashlight and battery radio.' },
      { es: 'Seguí las alertas del Servicio Meteorológico Nacional (amarilla, naranja, roja).', en: 'Follow National Weather Service alerts (yellow, orange, red).' },
    ],
    during: [
      { es: 'Quedate bajo techo, lejos de ventanas y vidrios.', en: 'Stay indoors, away from windows and glass.' },
      { es: 'Alejate de árboles, postes, cables y estructuras metálicas.', en: 'Stay away from trees, poles, wires and metal structures.' },
      { es: 'Desenchufá los artefactos eléctricos.', en: 'Unplug electrical appliances.' },
      { es: 'Con granizo, no salgas por ningún motivo (tampoco a cubrir el auto).', en: 'During hail, do not go outside for any reason (not even to cover your car).' },
      { es: 'Si manejás: bajá la velocidad, luces bajas y más distancia con otros vehículos.', en: 'If driving: slow down, use low beams and keep more distance.' },
    ],
    after: [
      { es: 'Revisá techos, vidrios y cañerías.', en: 'Check roofs, windows and pipes.' },
      { es: 'No toques cables caídos: avisá al 103.', en: 'Do not touch fallen wires: call 103.' },
      { es: 'Ayudá a vecinos mayores o con movilidad reducida.', en: 'Help elderly neighbors or people with reduced mobility.' },
      { es: 'Vaciá recipientes que juntaron agua (evita criaderos de mosquitos).', en: 'Empty containers that collected water (prevents mosquito breeding).' },
    ],
    sources: 'Protección Civil San Juan · SMN · Cruz Roja Argentina',
  },
  {
    id: 'aluvion',
    title: { es: 'Aluviones y crecidas', en: 'Flash floods' },
    subtitle: { es: 'Badenes, cauces secos y canales', en: 'Fords, dry riverbeds and canals' },
    season: { es: 'Con tormentas de verano', en: 'With summer storms' },
    accent: { text: 'text-amber-300', border: 'border-amber-400/40', bg: 'bg-amber-400/10' },
    keyRule: {
      es: 'NUNCA cruces un badén, vado o puente tapado por agua, ni a pie ni en auto.',
      en: 'NEVER cross a flooded ford or bridge, on foot or by car.',
    },
    before: [
      { es: 'Averiguá si tu casa, escuela o trabajo está cerca de un cauce o zona de crecida.', en: 'Find out if your home, school or work is near a riverbed or flood zone.' },
      { es: 'Definí con tu familia una ruta alternativa que no cruce badenes.', en: 'Agree with your family on an alternative route that avoids fords.' },
      { es: 'Evitá acampar o estacionar en cauces secos, aunque no llueva donde estás.', en: 'Avoid camping or parking in dry riverbeds, even if it is not raining where you are.' },
    ],
    during: [
      { es: 'Alejate de ríos, arroyos, canales de riego y acequias desbordadas.', en: 'Stay away from rivers, streams, irrigation canals and overflowing ditches.' },
      { es: 'El agua puede bajar de golpe aunque la tormenta esté lejos, en la montaña.', en: 'Water can arrive suddenly even if the storm is far away in the mountains.' },
      { es: 'Con 30 cm de agua en movimiento un auto puede ser arrastrado.', en: 'Just 30 cm of moving water can sweep a car away.' },
      { es: 'Si quedás rodeado de agua, subí a un lugar alto y pedí ayuda al 911.', en: 'If surrounded by water, move to higher ground and call 911.' },
    ],
    after: [
      { es: 'No vuelvas a la zona hasta que las autoridades lo indiquen.', en: 'Do not return to the area until authorities say it is safe.' },
      { es: 'Evitá caminar por barro o agua estancada: puede haber cables o pozos ocultos.', en: 'Avoid walking through mud or standing water: there may be hidden wires or holes.' },
      { es: 'Informá rutas cortadas o daños al 103.', en: 'Report closed roads or damage to 103.' },
    ],
    sources: 'Protección Civil San Juan / COPRE · SINAGIR',
  },
  {
    id: 'dengue',
    title: { es: 'Dengue', en: 'Dengue' },
    subtitle: { es: 'Prevención del mosquito Aedes aegypti', en: 'Aedes aegypti mosquito prevention' },
    season: { es: 'Verano y otoño', en: 'Summer and autumn' },
    accent: { text: 'text-lime-300', border: 'border-lime-400/40', bg: 'bg-lime-400/10' },
    keyRule: {
      es: 'Sin agua acumulada no hay mosquito: descacharrá tu casa una vez por semana.',
      en: 'No standing water, no mosquitoes: clear out containers once a week.',
    },
    before: [
      { es: 'Tirá latas, botellas, neumáticos y objetos que junten agua.', en: 'Throw away cans, bottles, tires and anything that collects water.' },
      { es: 'Baldes y palanganas: boca abajo o bajo techo.', en: 'Buckets and basins: upside down or under a roof.' },
      { es: 'Cambiá el agua de floreros y bebederos cada 3 a 5 días y cepillá las paredes del recipiente.', en: 'Change water in vases and pet bowls every 3–5 days and scrub the container walls.' },
      { es: 'Mantené tanques y cisternas bien tapados.', en: 'Keep water tanks and cisterns tightly covered.' },
      { es: 'Usá repelente y colocá mosquiteros en puertas y ventanas.', en: 'Use repellent and install screens on doors and windows.' },
    ],
    during: [
      { es: 'Síntomas: fiebre alta, dolor de cabeza y detrás de los ojos, dolor muscular, náuseas o manchas en la piel.', en: 'Symptoms: high fever, headache and pain behind the eyes, muscle pain, nausea or skin rash.' },
      { es: 'NO te automediques: evitá ibuprofeno, aspirina y corticoides.', en: 'Do NOT self-medicate: avoid ibuprofen, aspirin and corticosteroids.' },
      { es: 'Consultá de inmediato en el centro de salud más cercano.', en: 'Go to the nearest health center right away.' },
    ],
    after: [
      { es: 'Hidratate y hacé reposo según indicación médica.', en: 'Stay hydrated and rest as advised by your doctor.' },
      { es: 'Usá repelente para no contagiar a otros a través del mosquito.', en: 'Use repellent so mosquitoes do not spread it to others.' },
      { es: 'La fumigación sola no alcanza: lo que corta el ciclo es eliminar criaderos.', en: 'Fumigation alone is not enough: removing breeding sites breaks the cycle.' },
    ],
    sources: 'Ministerio de Salud de San Juan · Ministerio de Salud de la Nación',
  },
  {
    id: 'zonda',
    title: { es: 'Zonda y calor extremo', en: 'Zonda wind and extreme heat' },
    subtitle: { es: 'Viento seco, polvo y riesgo de incendio', en: 'Dry wind, dust and fire risk' },
    season: { es: 'Invierno, primavera y verano', en: 'Winter, spring and summer' },
    accent: { text: 'text-orange-300', border: 'border-orange-400/40', bg: 'bg-orange-400/10' },
    keyRule: {
      es: 'Con Zonda está prohibido hacer fuego: ni fogatas ni quema de poda o basura.',
      en: 'During Zonda, lighting fires is prohibited: no bonfires or burning of waste.',
    },
    before: [
      { es: 'Asegurá chapas, macetas y objetos sueltos de techos y patios.', en: 'Secure roof sheets, pots and loose objects on roofs and yards.' },
      { es: 'Cargá linternas y celulares: puede haber cortes de luz.', en: 'Charge flashlights and phones: power outages are possible.' },
      { es: 'Tené agua fresca disponible para toda la familia y mascotas.', en: 'Have fresh water available for the whole family and pets.' },
    ],
    during: [
      { es: 'Cerrá puertas y ventanas; quedate en interiores.', en: 'Close doors and windows; stay indoors.' },
      { es: 'Alejate de árboles, carteles, postes y marquesinas.', en: 'Stay away from trees, signs, poles and awnings.' },
      { es: 'Tomá agua aunque no tengas sed y evitá el sol de 10 a 16 h.', en: 'Drink water even if not thirsty and avoid the sun from 10 am to 4 pm.' },
      { es: 'Si manejás: luces bajas, menos velocidad y más distancia (poca visibilidad).', en: 'If driving: low beams, lower speed and more distance (poor visibility).' },
    ],
    after: [
      { es: 'Revisá techos y cables; no toques cables caídos (llamá al 103).', en: 'Check roofs and wires; do not touch fallen wires (call 103).' },
      { es: 'Prestá atención a mayores, niños y personas con enfermedades crónicas.', en: 'Look after older adults, children and people with chronic illness.' },
      { es: 'Si ves humo o fuego, llamá de inmediato al 100.', en: 'If you see smoke or fire, call 100 immediately.' },
    ],
    sources: 'Protección Civil San Juan · Ministerio de Salud de San Juan',
  },
  {
    id: 'sismo',
    title: { es: 'Sismo', en: 'Earthquake' },
    subtitle: { es: 'San Juan: zona de máxima peligrosidad sísmica', en: 'San Juan: highest seismic hazard zone' },
    season: { es: 'Todo el año', en: 'All year' },
    accent: { text: 'text-brand-cyan', border: 'border-brand-cyan/40', bg: 'bg-brand-cyan/10' },
    keyRule: {
      es: 'Si estás en un lugar seguro y el piso se mueve, no corras: agachate, cubrite y sujetate.',
      en: 'If you are in a safe place and the ground shakes, do not run: drop, cover and hold on.',
    },
    before: [
      { es: 'Fijá muebles altos, estantes y termotanques a la pared.', en: 'Anchor tall furniture, shelves and water heaters to the wall.' },
      { es: 'Ubicá las llaves de gas, agua y el tablero de luz, y enseñá a todos a cerrarlas.', en: 'Locate gas and water valves and the breaker panel, and teach everyone to shut them.' },
      { es: 'Acordá un punto de encuentro familiar en un espacio abierto a 2 o 3 cuadras.', en: 'Agree on a family meeting point in an open space 2–3 blocks away.' },
      { es: 'Tené la mochila de emergencia cerca de la salida.', en: 'Keep the emergency kit near the exit.' },
    ],
    during: [
      { es: 'Agachate, cubrite bajo una mesa firme y sujetate.', en: 'Drop, take cover under a sturdy table and hold on.' },
      { es: 'Alejate de ventanas, espejos y objetos que puedan caer.', en: 'Stay away from windows, mirrors and objects that may fall.' },
      { es: 'No uses ascensores ni escaleras mientras dure el movimiento.', en: 'Do not use elevators or stairs while the shaking lasts.' },
      { es: 'En la calle: alejate de fachadas, postes, cables y marquesinas.', en: 'Outdoors: move away from facades, poles, wires and awnings.' },
    ],
    after: [
      { es: 'Si hay daños, olor a gas o riesgo de incendio, evacuá con calma.', en: 'If there is damage, a gas smell or fire risk, evacuate calmly.' },
      { es: 'Cortá el gas y la luz si sospechás de averías. No enciendas fósforos.', en: 'Shut off gas and power if you suspect damage. Do not light matches.' },
      { es: 'Andá al punto de encuentro y esperá réplicas.', en: 'Go to the meeting point and expect aftershocks.' },
      { es: 'Usá el teléfono solo para emergencias; preferí mensajes de texto.', en: 'Use the phone only for emergencies; prefer text messages.' },
    ],
    sources: 'INPRES · Protección Civil San Juan',
  },
  {
    id: 'corte-luz',
    title: { es: 'Corte de luz prolongado', en: 'Extended power outage' },
    subtitle: { es: 'Después de tormentas, Zonda o sismos', en: 'After storms, Zonda or earthquakes' },
    season: { es: 'Todo el año', en: 'All year' },
    accent: { text: 'text-violet-300', border: 'border-violet-400/40', bg: 'bg-violet-400/10' },
    keyRule: {
      es: 'Nunca uses generadores, braseros ni calefactores a combustión en ambientes cerrados.',
      en: 'Never use generators, braziers or fuel heaters in enclosed spaces.',
    },
    before: [
      { es: 'Tené linternas, pilas y una batería externa cargada.', en: 'Keep flashlights, batteries and a charged power bank.' },
      { es: 'Guardá agua y alimentos que no necesiten heladera.', en: 'Store water and food that does not need refrigeration.' },
      { es: 'Si alguien en casa usa equipos médicos eléctricos, planificá una alternativa.', en: 'If someone at home uses electric medical equipment, plan an alternative.' },
    ],
    during: [
      { es: 'Desenchufá artefactos para evitar daños cuando vuelva la energía.', en: 'Unplug appliances to avoid damage when power returns.' },
      { es: 'Abrí la heladera lo menos posible.', en: 'Open the fridge as little as possible.' },
      { es: 'Usá linternas en lugar de velas.', en: 'Use flashlights instead of candles.' },
      { es: 'Ahorrá batería del celular: bajá el brillo y cerrá apps.', en: 'Save phone battery: lower brightness and close apps.' },
    ],
    after: [
      { es: 'Revisá alimentos refrigerados: ante la duda, descartalos.', en: 'Check refrigerated food: when in doubt, throw it out.' },
      { es: 'Reponé pilas y recargá todo lo que usaste.', en: 'Replace batteries and recharge everything you used.' },
    ],
    sources: 'Protección Civil San Juan · Cruz Roja Argentina',
  },
];

// -------------------------------------------------------------------------
// Alertas de Sismos de Android (sistema de Google, disponible en Argentina)
// -------------------------------------------------------------------------
export const ANDROID_ALERTS_STEPS: Bilingual[] = [
  { es: 'Abrí la Configuración (Ajustes) de tu celular.', en: 'Open your phone Settings.' },
  { es: 'Entrá a "Seguridad y emergencia" (en algunos equipos está dentro de "Ubicación").', en: 'Go to "Safety & emergency" (on some phones it is under "Location").' },
  { es: 'Tocá "Alertas de sismos" y activá el interruptor.', en: 'Tap "Earthquake alerts" and turn the switch on.' },
  { es: 'Dejá activada la ubicación y la conexión a internet.', en: 'Keep location and internet connection turned on.' },
];

// -------------------------------------------------------------------------
// Aviso de independencia y fuentes (exigido por Google Play)
// -------------------------------------------------------------------------
export const NON_AFFILIATION_NOTICE: Bilingual = {
  es: 'SISMO LAB es una app independiente desarrollada por Zion Code. No representa ni es una aplicación oficial del Gobierno de San Juan, Protección Civil, INPRES, el Servicio Meteorológico Nacional ni de ningún organismo estatal. La información proviene de fuentes públicas oficiales con fines de prevención. No es un sistema de alerta temprana: ante una emergencia, llamá al 911 y seguí siempre las indicaciones de las autoridades.',
  en: 'SISMO LAB is an independent app developed by Zion Code. It does not represent, and is not an official app of, the Government of San Juan, Civil Protection, INPRES, the National Weather Service or any government agency. Information comes from official public sources for prevention purposes. It is not an early warning system: in an emergency, call 911 and always follow official instructions.',
};

export const OFFICIAL_SOURCES: { name: string; url: string; topic: Bilingual }[] = [
  { name: 'Servicio Meteorológico Nacional', url: 'https://www.smn.gob.ar/alertas', topic: { es: 'Alertas meteorológicas', en: 'Weather alerts' } },
  { name: 'Gobierno de San Juan (SI San Juan)', url: 'https://sisanjuan.gob.ar', topic: { es: 'Comunicados provinciales', en: 'Provincial announcements' } },
  { name: 'INPRES', url: 'https://www.inpres.gob.ar', topic: { es: 'Sismos y prevención sísmica', en: 'Earthquakes and seismic prevention' } },
  { name: 'SINAGIR', url: 'https://www.argentina.gob.ar/sinagir', topic: { es: 'Gestión del riesgo · Plan familiar', en: 'Risk management · Family plan' } },
];
