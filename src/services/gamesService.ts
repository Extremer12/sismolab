import {
  Question,
  SafeHomeHazard,
  EmergencyKitItem,
  ScenarioChoice,
  MythStatement,
  HistoricalEvent,
  SeismicEvent,
  Achievement
} from '../types';

// ==========================================
// 1. MINIJUEGO: ¿QUÉ ES UN SISMO? (QUIZ)
// ==========================================
export const WHAT_IS_SEISMIC_QUESTIONS: Question[] = [
  {
    id: 'q1',
    game_id: 'what-is',
    question: '¿Qué ocurre cuando se libera de forma repentina la energía acumulada en las rocas de la Tierra?',
    option_a: 'Se produce una erupción volcánica de cenizas',
    option_b: 'Se originan ondas sísmicas que hacen vibrar el suelo (un sismo)',
    option_c: 'Comienza una tormenta eléctrica',
    option_d: 'Cambia la temperatura del aire',
    correct_option: 'b',
    explanation: 'El movimiento súbito a lo largo de una falla geológica libera ondas elásticas que viajan por la corteza terrestre provocando la sacudida.',
    points: 100,
    difficulty: 'easy',
    sort_order: 1
  },
  {
    id: 'q2',
    game_id: 'what-is',
    question: '¿Cómo se llama el punto en la superficie de la Tierra ubicado exactamente arriba del foco donde se originó el sismo?',
    option_a: 'Epicentro',
    option_b: 'Hipocentro',
    option_c: 'Falla tectónica',
    option_d: 'Cráter',
    correct_option: 'a',
    explanation: 'El Epicentro es la proyección en la superficie terrestre del Hipocentro (el foco profundo donde se rompió la roca).',
    points: 100,
    difficulty: 'easy',
    sort_order: 2
  },
  {
    id: 'q3',
    game_id: 'what-is',
    question: '¿Qué placas tectónicas interactúan frente a San Juan y la región de Cuyo?',
    option_a: 'Placa Africana y Placa del Pacífico',
    option_b: 'Placa de Nazca y Placa Sudamericana',
    option_c: 'Placa Euroasiática y Placa Antártica',
    option_d: 'Placa de Cocos y Placa Caribe',
    correct_option: 'b',
    explanation: 'La Placa oceánica de Nazca subduce (se hunde) bajo la Placa Sudamericana, elevando la Cordillera de los Andes y generando sismicidad constante.',
    points: 100,
    difficulty: 'medium',
    sort_order: 3
  },
  {
    id: 'q4',
    game_id: 'what-is',
    question: '¿Qué instrumento científico utiliza el INPRES para registrar la aceleración y las ondas del suelo?',
    option_a: 'Termómetro e higrómetro',
    option_b: 'Sismógrafo y acelerógrafo',
    option_c: 'Barómetro aneroide',
    option_d: 'Telescopio infrarrojo',
    correct_option: 'b',
    explanation: 'Los sismógrafos y acelerógrafos digitales registran con altísima precisión el desplazamiento, velocidad y aceleración del terreno.',
    points: 100,
    difficulty: 'medium',
    sort_order: 4
  }
];

// ==========================================
// 2. MINIJUEGO: CASA SEGURA (DETECCIÓN DE RIESGOS)
// ==========================================
export const SAFE_HOME_HAZARDS: SafeHomeHazard[] = [
  {
    id: 'h_tv',
    name: 'Televisor sobre mesa suelta',
    x: 25,
    y: 35,
    icon: '📺',
    hazardDescription: 'El televisor no está amurado y puede caer sobre personas durante la sacudida.',
    solution: 'Fijar el televisor a la pared con soporte resistente o correas de seguridad.',
    isSecured: false
  },
  {
    id: 'h_bookcase',
    name: 'Biblioteca alta sin fijar',
    x: 75,
    y: 28,
    icon: '📚',
    hazardDescription: 'Los muebles altos sin anclaje a la pared pueden volcarse y bloquear salidas.',
    solution: 'Anclar la biblioteca a la pared con escuadras metálicas y pernos.',
    isSecured: false
  },
  {
    id: 'h_window',
    name: 'Cama junto a ventana con vidrios grandes',
    x: 82,
    y: 65,
    icon: '🪟',
    hazardDescription: 'Los cristales pueden estallar hacia el interior y provocar cortes graves.',
    solution: 'Alejar la cama de las ventanas y colocar láminas de seguridad adhesivas en los vidrios.',
    isSecured: false
  },
  {
    id: 'h_shelf',
    name: 'Objetos pesados en estantes altos',
    x: 48,
    y: 20,
    icon: '🏺',
    hazardDescription: 'Floreros y adornos pesados caen como proyectiles al oscilar el edificio.',
    solution: 'Reubicar los objetos pesados en los estantes inferiores de los muebles.',
    isSecured: false
  },
  {
    id: 'h_mirror',
    name: 'Espejo pesado sobre el respaldo',
    x: 50,
    y: 48,
    icon: '🪞',
    hazardDescription: 'Los cuadros y espejos sobre camas pueden descolgarse y lesionar al dormir.',
    solution: 'Reubicar en paredes laterales y utilizar ganchos cerrados de seguridad.',
    isSecured: false
  },
  {
    id: 'h_doorway',
    name: 'Pasillo de evacuación con cajas',
    x: 20,
    y: 75,
    icon: '📦',
    hazardDescription: 'Los objetos en pasillos impiden evacuar a oscuras tras el corte de luz.',
    solution: 'Mantener siempre despejadas las vías de escape hacia la salida.',
    isSecured: false
  }
];

// ==========================================
// 3. MINIJUEGO: KIT DE EMERGENCIA (MOCHILA 72H)
// ==========================================
export const EMERGENCY_KIT_ITEMS: EmergencyKitItem[] = [
  { id: 'water', name: 'Agua potable en botellas', icon: '💧', isEssential: true, category: 'vital', reason: 'Indispensable para evitar deshidratación (mínimo 2L por persona por día).' },
  { id: 'flashlight', name: 'Linterna LED a pilas', icon: '🔦', isEssential: true, category: 'vital', reason: 'Permite iluminar sin peligro de explosión por fugas de gas.' },
  { id: 'radio', name: 'Radio a pilas con repuestos', icon: '📻', isEssential: true, category: 'vital', reason: 'Canal oficial para escuchar indicaciones de Defensa Civil e INPRES.' },
  { id: 'first_aid', name: 'Botiquín de primeros auxilios', icon: '🩹', isEssential: true, category: 'vital', reason: 'Contiene gasas, vendas, antiséptico y medicamentos recetados familiares.' },
  { id: 'whistle', name: 'Silbato de emergencia', icon: '🔊', isEssential: true, category: 'vital', reason: 'Permite pedir auxilio gastando mucha menos energía que gritar.' },
  { id: 'canned_food', name: 'Alimentos no perecederos', icon: '🥫', isEssential: true, category: 'vital', reason: 'Aportan calorías inmediatas sin requerir cocción ni refrigeración.' },
  { id: 'docs', name: 'Copia de DNI y documentos', icon: '📄', isEssential: true, category: 'vital', reason: 'En bolsa hermética para identificación y trámites posteriores.' },
  { id: 'blanket', name: 'Manta térmica liviana', icon: '🧥', isEssential: true, category: 'vital', reason: 'Protege contra la hipotermia nocturna al evacuar al aire libre.' },
  
  // Elementos no esenciales / distractores
  { id: 'console', name: 'Consola de videojuegos', icon: '🎮', isEssential: false, category: 'no-essential', reason: 'Es pesada, frágil e innecesaria para la supervivencia básica.' },
  { id: 'candles', name: 'Velas de cera con fósforos', icon: '🕯️', isEssential: false, category: 'no-essential', reason: '¡Peligro! La llama abierta puede encender fugas invisibles de gas.' },
  { id: 'dishes', name: 'Vajilla pesada de porcelana', icon: '🍽️', isEssential: false, category: 'no-essential', reason: 'Agrega peso excesivo que dificulta la movilidad ágil.' },
  { id: 'books', name: 'Enciclopedias y libros de texto', icon: '📚', isEssential: false, category: 'no-essential', reason: 'En la mochila solo debe portarse lo indispensable para 72 horas.' }
];

// ==========================================
// 4. MINIJUEGO: ¿QUÉ HARÍAS? (ESCENARIOS)
// ==========================================
export const SCENARIO_CHOICES: ScenarioChoice[] = [
  {
    id: 'sc_home',
    scenarioTitle: 'En Casa o en el Aula',
    context: 'casa',
    icon: '🏠',
    situation: 'Comenzó a temblar fuerte. Se caen adornos y crujen las paredes.',
    options: [
      { id: 'a', text: '🪑 Me agacho, me cubro la cabeza bajo una mesa firme y me sujeto.', isCorrect: true, feedback: '¡Excelente! La técnica universal protege tu cabeza de objetos y revoques.' },
      { id: 'b', text: '🏃 Salgo corriendo desesperado por las escaleras hacia la calle.', isCorrect: false, feedback: 'Correr durante el sismo es la principal causa de tropiezos y golpes.' },
      { id: 'c', text: '🛗 Corro a tomar el ascensor para bajar más rápido.', isCorrect: false, feedback: 'Nunca uses ascensores: los cables pueden colapsar o cortarse la luz dejándote atrapado.' },
      { id: 'd', text: '🪟 Me paro junto a las ventanas para ver qué pasa.', isCorrect: false, feedback: 'Los vidrios estallan con la torsión del edificio y causan heridas cortantes.' }
    ]
  },
  {
    id: 'sc_street',
    scenarioTitle: 'En la Vía Pública',
    context: 'calle',
    icon: '🚶',
    situation: 'Estás caminando por el centro de la ciudad y el suelo comienza a sacudirse.',
    options: [
      { id: 'a', text: '🌳 Me dirijo con calma hacia una plaza o espacio abierto despejado de cables.', isCorrect: true, feedback: '¡Muy bien! Te alejas de cornisas, marquesinas, árboles y postes de media tensión.' },
      { id: 'b', text: '🏢 Me pego a la pared de un edificio alto para resguardarme.', isCorrect: false, feedback: 'Peligro: Las fachadas y vidrios desprenden fragmentos pesados hacia la vereda.' },
      { id: 'c', text: '🚘 Me subo al techo de un auto estacionado.', isCorrect: false, feedback: 'Subirse a vehículos no ofrece protección y aumenta el riesgo de caídas.' }
    ]
  },
  {
    id: 'sc_vehicle',
    scenarioTitle: 'Conduciendo un Vehículo',
    context: 'vehiculo',
    icon: '🚗',
    situation: 'Vas en auto o colectivo y sentís la oscilación sísmica.',
    options: [
      { id: 'a', text: '🛑 Reducir la velocidad con balizas, estacionar lejos de puentes/postes y permanecer adentro.', isCorrect: true, feedback: '¡Correcto! La carrocería del vehículo te protege de caídas mientras esperás que cese el movimiento.' },
      { id: 'b', text: '⚡ Acelerar a fondo para cruzar el puente lo más rápido posible.', isCorrect: false, feedback: 'Acelerar en puentes o viaductos durante un sismo puede causar pérdida total de control.' }
    ]
  }
];

// ==========================================
// 5. MINIJUEGO: MITO O REALIDAD
// ==========================================
export const MYTH_STATEMENTS: MythStatement[] = [
  {
    id: 'm1',
    statement: 'Durante un terremoto, el marco de cualquier puerta es siempre el lugar más seguro de la casa.',
    isReality: false,
    explanation: '¡MITO! En las construcciones modernas de mampostería, los marcos no son más resistentes que el resto del muro y la puerta puede cerrarse golpeándote. Es mucho más seguro estar bajo una mesa firme.',
    category: 'Autoprotección'
  },
  {
    id: 'm2',
    statement: 'Los terremotos en San Juan son provocados por la subducción de la Placa de Nazca bajo la Sudamericana.',
    isReality: true,
    explanation: '¡REALIDAD! Es el motor geológico continuo que acumula energía elástica y da origen a nuestra geografía andina.',
    category: 'Ciencia'
  },
  {
    id: 'm3',
    statement: 'Se puede predecir con exactitud el día y la hora en que ocurrirá el próximo terremoto.',
    isReality: false,
    explanation: '¡MITO! La ciencia sismológica mundial no puede predecir fecha ni hora exacta. Por eso la única herramienta infalible es la prevención y la construcción sismorresistente.',
    category: 'Ciencia'
  },
  {
    id: 'm4',
    statement: 'Después de un terremoto fuerte, lo primero que debe hacer un adulto es cortar las llaves de gas y electricidad.',
    isReality: true,
    explanation: '¡REALIDAD! Previene incendios y explosiones por cañerías de gas natural fisuradas o cortocircuitos.',
    category: 'Prevención'
  },
  {
    id: 'm5',
    statement: 'Las construcciones de adobe con barro son tan seguras como las de hormigón armado si se pintan bien.',
    isReality: false,
    explanation: '¡MITO! El adobe es un material pesado y frágil sin resistencia a la tracción; por eso tras 1944 fue prohibido en San Juan, adoptando el hormigón armado y las normas INPRES.',
    category: 'Ingeniería'
  }
];

// ==========================================
// 6. HISTORIA SÍSMICA DE SAN JUAN
// ==========================================
export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: 'h1894',
    year: 1894,
    dateStr: '27 de octubre de 1894',
    title: 'El Gran Terremoto Argentino',
    location: 'Noroeste de San Juan / La Rioja',
    magnitude: 8.0,
    depthKm: 30,
    intensityMercalli: 'IX (Muy Destructivo)',
    description: 'Es el sismo de mayor magnitud registrado instrumentalmente en la historia de Argentina. Afectó gravemente las iglesias y edificios de adobe en Jáchal, Iglesia y la Capital.',
    source: 'Catálogo Histórico del INPRES',
    sort_order: 1,
    coordinates: { x: 42, y: 30 }
  },
  {
    id: 'h1944',
    year: 1944,
    dateStr: '15 de enero de 1944 (20:52 hs)',
    title: 'Terremoto de San Juan (El hito que refundó la provincia)',
    location: 'La Laja / Albardón',
    magnitude: 7.4,
    depthKm: 11,
    intensityMercalli: 'IX (Devastador)',
    description: 'El evento sísmico más destructivo en la historia argentina. Colapsó el 80% de las construcciones de adobe. Marcó el nacimiento de la ingeniería sismorresistente con la creación del CONCAR y posteriormente del INPRES.',
    source: 'INPRES - Publicación Técnica Histórica',
    sort_order: 2,
    coordinates: { x: 54, y: 50 }
  },
  {
    id: 'h1977',
    year: 1977,
    dateStr: '23 de noviembre de 1977 (06:23 hs)',
    title: 'Terremoto de Caucete (Prueba de Fuego)',
    location: 'Sierra de Pie de Palo / Caucete',
    magnitude: 7.4,
    depthKm: 17,
    intensityMercalli: 'IX (Destructivo)',
    description: 'Produjo licuación de suelos generalizada en viñedos y campos. Las edificaciones sismorresistentes construidas tras 1944 resistieron con éxito, confirmando la eficacia de las normas.',
    source: 'INPRES - Informe Técnico de Caucete',
    sort_order: 3,
    coordinates: { x: 65, y: 58 }
  },
  {
    id: 'h2021',
    year: 2021,
    dateStr: '18 de enero de 2021 (23:46 hs)',
    title: 'Terremoto de Pocito y Media Agua',
    location: 'Sarmiento / Pocito',
    magnitude: 6.4,
    depthKm: 8,
    intensityMercalli: 'VII (Muy Fuerte)',
    description: 'Sismo superficial que sacudió intensamente todo Cuyo. La ingeniería moderna del INPRES evitó colapsos en edificios urbanos, ratificando el liderazgo técnico sanjuanino.',
    source: 'Red Nacional de Estaciones Sismológicas INPRES',
    sort_order: 4,
    coordinates: { x: 49, y: 68 }
  }
];

// ==========================================
// 7. EVENTOS SÍSMICOS EN TIEMPO REAL (MAPA)
// ==========================================
export const SEISMIC_MAP_EVENTS: SeismicEvent[] = [
  {
    id: 'ev_1',
    event_date: '2021-01-18',
    event_time: '23:46:22',
    latitude: -31.85,
    longitude: -68.58,
    depth: 8,
    magnitude: 6.4,
    location: 'Pocito / Sarmiento',
    province: 'San Juan',
    intensity: 'VII Mercalli',
    description: 'Epicentro en el suroeste sanjuanino con aceleraciones máximas de 0.38g.',
    source: 'INPRES Oficial'
  },
  {
    id: 'ev_2',
    event_date: '1977-11-23',
    event_time: '06:23:30',
    latitude: -31.62,
    longitude: -67.78,
    depth: 17,
    magnitude: 7.4,
    location: 'Sierra de Pie de Palo',
    province: 'San Juan',
    intensity: 'IX Mercalli',
    description: 'Falla inversa profunda con deformación superficial y licuación de sedimentos.',
    source: 'INPRES Oficial'
  },
  {
    id: 'ev_3',
    event_date: '1944-01-15',
    event_time: '20:52:00',
    latitude: -31.40,
    longitude: -68.50,
    depth: 11,
    magnitude: 7.4,
    location: 'Falla La Laja / Albardón',
    province: 'San Juan',
    intensity: 'IX Mercalli',
    description: 'Escarpe de falla cosísmico de 30 cm en superficie y refundación urbana de San Juan.',
    source: 'INPRES Oficial'
  }
];

// ==========================================
// 8. LAS 6 INSIGNIAS OFICIALES
// ==========================================
export const OFFICIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_explorador',
    name: 'EXPLORADOR',
    slug: 'explorador',
    description: 'Completaste tu primer desafío y diste tus primeros pasos en SISMO LAB.',
    icon: '🧭',
    condition_type: 'games_count',
    condition_value: 1
  },
  {
    id: 'ach_preparado',
    name: 'PREPARADO',
    slug: 'preparado',
    description: 'Armaste tu Kit de Emergencia de 72 horas con todos los insumos vitales.',
    icon: '🎒',
    condition_type: 'score',
    condition_value: 400
  },
  {
    id: 'ach_casa_segura',
    name: 'CASA SEGURA',
    slug: 'casa-segura',
    description: 'Detectaste y aseguraste los riesgos en la habitación interactiva.',
    icon: '🏠',
    condition_type: 'hazards_found',
    condition_value: 5
  },
  {
    id: 'ach_experto',
    name: 'EXPERTO SÍSMICO',
    slug: 'experto-sismico',
    description: 'Superaste el desafío de ciencia sísmica con puntuación perfecta.',
    icon: '⚡',
    condition_type: 'perfect_game',
    condition_value: 1
  },
  {
    id: 'ach_historiador',
    name: 'HISTORIADOR',
    slug: 'historiador',
    description: 'Exploraste los hitos sísmicos de 1894, 1944, 1977 y 2021 en San Juan.',
    icon: '🏛️',
    condition_type: 'history_read',
    condition_value: 1
  },
  {
    id: 'ach_campeon',
    name: 'CAMPEÓN',
    slug: 'campeon',
    description: 'Alcanzaste más de 1.500 puntos en el ranking de la feria.',
    icon: '🏆',
    condition_type: 'score',
    condition_value: 1500
  }
];
