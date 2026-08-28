import {
  Question,
  SafeHomeHazard,
  EmergencyKitItem,
  ScenarioChoice,
  MythStatement,
  HistoricalEvent,
  SeismicEvent,
  Achievement,
  UserMode
} from '../types';
import {
  WHAT_IS_SEISMIC_QUESTIONS_EN,
  KIDS_SEISMIC_QUESTIONS_EN,
  MYTH_STATEMENTS_EN,
  KIDS_MYTH_STATEMENTS_EN,
  SCENARIO_CHOICES_EN,
  KIDS_SCENARIO_CHOICES_EN
} from './gamesContentEn';

function getCurrentLanguage(): 'es' | 'en' {
  if (typeof window !== 'undefined') {
    const lang = localStorage.getItem('sismolab_app_lang_v1');
    if (lang === 'en') return 'en';
  }
  return 'es';
}

// ==========================================
// 1. MINIJUEGO: ¿QUÉ ES UN SISMO? (QUIZ POOL EXPANDIDO)
// ==========================================
export const WHAT_IS_SEISMIC_QUESTIONS: Question[] = [
  {
    id: 'q1',
    game_id: 'what-is',
    question: '¿Qué ocurre cuando se libera de forma repentina la energía acumulada en las rocas de la corteza?',
    image_url: '/images/quiz/adults/q1.png',
    option_a: 'Se produce una erupción volcánica de cenizas',
    option_b: 'Cambia bruscamente la temperatura ambiental',
    option_c: 'Se originan ondas sísmicas que hacen vibrar el suelo (un sismo)',
    option_d: 'Comienza una tormenta eléctrica',
    correct_option: 'c',
    explanation: 'El movimiento súbito a lo largo de una falla geológica libera ondas elásticas que viajan por la corteza terrestre provocando la sacudida.',
    points: 100,
    difficulty: 'easy',
    sort_order: 1
  },
  {
    id: 'q2',
    game_id: 'what-is',
    question: '¿Cómo se llama el punto en la superficie de la Tierra ubicado exactamente arriba del foco donde se originó el sismo?',
    image_url: '/images/quiz/adults/q2.png',
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
    image_url: '/images/quiz/adults/q3.jpg',
    option_a: 'Placa Africana y Placa del Pacífico',
    option_b: 'Placa Euroasiática y Placa Antártica',
    option_c: 'Placa de Cocos y Placa Caribe',
    option_d: 'Placa de Nazca y Placa Sudamericana',
    correct_option: 'd',
    explanation: 'La Placa oceánica de Nazca subduce (se hunde) bajo la Placa Sudamericana, elevando la Cordillera de los Andes y generando sismicidad constante.',
    points: 100,
    difficulty: 'medium',
    sort_order: 3
  },
  {
    id: 'q4',
    game_id: 'what-is',
    question: '¿Qué instrumento científico utiliza el INPRES para registrar la aceleración y las ondas del suelo?',
    image_url: '/images/quiz/adults/q4.jpg',
    option_a: 'Termómetro e higrómetro',
    option_b: 'Sismógrafo y acelerógrafo',
    option_c: 'Barómetro aneroide',
    option_d: 'Telescopio infrarrojo',
    correct_option: 'b',
    explanation: 'Los sismógrafos y acelerógrafos digitales registran con altísima precisión el desplazamiento, velocidad y aceleración del terreno.',
    points: 100,
    difficulty: 'medium',
    sort_order: 4
  },
  {
    id: 'q5',
    game_id: 'what-is',
    question: '¿Cuál es la diferencia fundamental entre Magnitud e Intensidad sísmica?',
    image_url: '/images/quiz/adults/q5.png',
    option_a: 'Son exactamente lo mismo con dos nombres distintos',
    option_b: 'La Magnitud mide los heridos y la Intensidad la profundidad',
    option_c: 'La Magnitud mide la energía liberada (única) y la Intensidad mide los efectos y daños en cada lugar',
    option_d: 'La Magnitud se mide en Mercalli y la Intensidad en Richter',
    correct_option: 'c',
    explanation: 'Un sismo tiene una sola Magnitud (energía en el foco), pero múltiples Intensidades (escala Mercalli) según la distancia y el tipo de suelo.',
    points: 120,
    difficulty: 'medium',
    sort_order: 5
  },
  {
    id: 'q6',
    game_id: 'what-is',
    question: '¿Qué tipo de onda sísmica es la más rápida y la primera en llegar a los sensores sismológicos?',
    image_url: '/images/quiz/adults/q6.png',
    option_a: 'Ondas Primarias o Longitudinales (Ondas P)',
    option_b: 'Ondas Superficiales Rayleigh',
    option_c: 'Ondas Secundarias o de Corte (Ondas S)',
    option_d: 'Ondas Sonoras audibles',
    correct_option: 'a',
    explanation: 'Las Ondas P viajan más rápido comprimiendo y dilatando la roca en la dirección de propagación; son las primeras registradas.',
    points: 120,
    difficulty: 'hard',
    sort_order: 6
  },
  {
    id: 'q7',
    game_id: 'what-is',
    question: '¿Por qué la provincia de San Juan se encuentra en la Zona Sísmica 4 (de muy alta peligrosidad)?',
    image_url: '/images/quiz/adults/q7.png',
    option_a: 'Porque tiene muchos volcanes activos en la ciudad',
    option_b: 'Por el clima seco y las altas temperaturas de verano',
    option_c: 'Por la altitud sobre el nivel del mar',
    option_d: 'Por la cercanía a fallas activas y el contacto con la placa de Nazca subducida',
    correct_option: 'd',
    explanation: 'San Juan y Mendoza están en la Zona 4 del reglamento INPRES debido a la subducción horizontal de Nazca y numerosas fallas activas superficiales.',
    points: 100,
    difficulty: 'easy',
    sort_order: 7
  },
  {
    id: 'q8',
    game_id: 'what-is',
    question: '¿Qué fenómeno ocurre cuando un suelo arenoso saturado de agua pierde resistencia y se comporta como líquido durante el sismo?',
    image_url: '/images/quiz/adults/q8.png',
    option_a: 'Erosión eólica',
    option_b: 'Licuación de suelos (como en Caucete 1977)',
    option_c: 'Fisuración volcánica',
    option_d: 'Sedimentación kárstica',
    correct_option: 'b',
    explanation: 'La licuación ocurre cuando la sacudida incrementa la presión del agua en los poros de arenas finas, haciendo que el suelo pierda sustentación.',
    points: 130,
    difficulty: 'hard',
    sort_order: 8
  },
  {
    id: 'q9',
    game_id: 'what-is',
    question: '¿Qué significa la sigla INPRES?',
    image_url: '/images/quiz/adults/q9.png',
    option_a: 'Instituto Nacional de Prevención Sísmica',
    option_b: 'Investigación Nacional de Placas y Rocas en San Juan',
    option_c: 'Inspección Nacional de Protección y Rescate en Emergencias',
    option_d: 'Instituto Provincial de Resistencia Sísmica',
    correct_option: 'a',
    explanation: 'El INPRES tiene sede central en San Juan y es el organismo científico federal responsable del monitoreo y normativas sismorresistentes del país.',
    points: 100,
    difficulty: 'easy',
    sort_order: 9
  },
  {
    id: 'q10',
    game_id: 'what-is',
    question: '¿Cuál es la función principal de las columnas y vigas de hormigón encadenado en una vivienda sismorresistente?',
    image_url: '/images/quiz/adults/q10.png',
    option_a: 'Hacer la casa más abrigada en invierno',
    option_b: 'Sostener únicamente el peso vertical del techo',
    option_c: 'Confinar las paredes de ladrillo para que trabajen como un bloque monolítico ante fuerzas laterales',
    option_d: 'Evitar que entre agua de lluvia',
    correct_option: 'c',
    explanation: 'El encadenado de hormigón armado ata los muros permitiendo disipar la energía del sismo sin que los muros se desmoronen.',
    points: 120,
    difficulty: 'medium',
    sort_order: 10
  },
  {
    id: 'q11',
    game_id: 'what-is',
    question: '¿Por qué los animales a veces parecen alterarse segundos antes de que las personas sientan la sacudida principal?',
    image_url: '/images/quiz/adults/q11.png',
    option_a: 'Porque tienen poderes mágicos de predicción futura',
    option_b: 'Porque huelen los gases del centro de la Tierra',
    option_c: 'Es una leyenda urbana sin explicación física',
    option_d: 'Porque pueden percibir las ondas P de baja amplitud que viajan más rápido que las ondas destructivas S',
    correct_option: 'd',
    explanation: 'Los animales con audición y sensibilidad táctil elevada perciben las ondas primarias (P) que preceden por unos segundos a las ondas más lentas y destructivas (S y superficiales).',
    points: 110,
    difficulty: 'medium',
    sort_order: 11
  },
  {
    id: 'q12',
    game_id: 'what-is',
    question: '¿Qué es una réplica sísmica?',
    image_url: '/images/quiz/adults/q12.png',
    option_a: 'Un sismo más débil que ocurre en la misma zona de ruptura después del sismo principal',
    option_b: 'Una copia digital del sismograma guardada en servidores',
    option_c: 'Un sismo generado artificialmente en un laboratorio',
    option_d: 'Un temblor que ocurre exactamente un año después',
    correct_option: 'a',
    explanation: 'Las réplicas son reajustes de esfuerzos en la corteza alrededor de la falla después de la ruptura principal, y pueden prolongarse semanas o meses.',
    points: 100,
    difficulty: 'easy',
    sort_order: 12
  }
];

export const KIDS_SEISMIC_QUESTIONS: Question[] = [
  {
    id: 'kq1',
    game_id: 'what-is',
    question: '¿Qué es un sismo o temblor?',
    image_url: '/images/quiz/kids/k1.png',
    option_a: 'Un viento muy frío de invierno',
    option_b: 'Una lluvia de estrellas fugaces',
    option_c: 'Cuando la Tierra se sacude porque se acomodan capas de roca debajo del suelo',
    option_d: 'Un trueno que suena fuerte en el cielo',
    correct_option: 'c',
    explanation: '¡Muy bien! Debajo del suelo hay capas de roca gigantes que a veces se mueven y hacen que sintamos la vibración.',
    points: 100,
    difficulty: 'easy',
    sort_order: 1
  },
  {
    id: 'kq2',
    game_id: 'what-is',
    question: 'Si empieza a temblar en la escuela o en casa, ¿qué debemos hacer primero?',
    image_url: '/images/quiz/kids/k2.png',
    option_a: 'Salir corriendo a los gritos por el pasillo',
    option_b: '¡Agacharnos, cubrirnos la cabeza bajo una mesa firme y sujetarnos!',
    option_c: 'Subirnos a una silla para mirar',
    option_d: 'Asomarnos a la ventana',
    correct_option: 'b',
    explanation: '¡Excelente! Meterte debajo de una mesa fuerte protege tu cabeza de cosas que se puedan caer.',
    points: 100,
    difficulty: 'easy',
    sort_order: 2
  },
  {
    id: 'kq3',
    game_id: 'what-is',
    question: '¿Cómo se llama el equipo de científicos de San Juan que cuida y estudia los sismos?',
    image_url: '/images/quiz/kids/k3.png',
    option_a: 'INPRES (Instituto Nacional de Prevención Sísmica)',
    option_b: 'El Club de los Astronautas',
    option_c: 'La patrulla de bomberos del espacio',
    option_d: 'Los exploradores del bosque',
    correct_option: 'a',
    explanation: '¡Genial! El INPRES tiene su sede central en San Juan y cuenta con equipos especiales que registran cada movimiento.',
    points: 100,
    difficulty: 'easy',
    sort_order: 3
  },
  {
    id: 'kq4',
    game_id: 'what-is',
    question: '¿Qué aparato usan los científicos para medir y dibujar las ondas de un temblor?',
    image_url: '/images/quiz/kids/k4.png',
    option_a: 'Un microscopio para ver bichos',
    option_b: 'Un telescopio espacial',
    option_c: 'Un sismógrafo',
    option_d: 'Un reloj despertador',
    correct_option: 'c',
    explanation: '¡Exacto! El sismógrafo dibuja líneas con onditas que muestran qué tan fuerte se movió la Tierra.',
    points: 100,
    difficulty: 'easy',
    sort_order: 4
  },
  {
    id: 'kq5',
    game_id: 'what-is',
    question: '¿Por qué la superficie de la Tierra se parece a un rompecabezas gigante?',
    image_url: '/images/quiz/kids/k5.png',
    option_a: 'Porque está formada por grandes piezas llamadas "placas tectónicas" que se mueven muy despacito',
    option_b: 'Porque alguien la cortó con una tijera mágica',
    option_c: 'Porque está hecha de bloques de hielo flotante',
    option_d: 'No es un rompecabezas, es una sola piedra lisa',
    correct_option: 'a',
    explanation: '¡Muy bien! Las placas tectónicas flotan y se mueven apenas unos centímetros por año, ¡al ritmo que crecen tus uñas!',
    points: 100,
    difficulty: 'easy',
    sort_order: 5
  },
  {
    id: 'kq6',
    game_id: 'what-is',
    question: 'En San Juan, ¿por qué es tan importante construir casas sismorresistentes?',
    image_url: '/images/quiz/kids/k6.png',
    option_a: 'Para que no entre el calor en verano',
    option_b: 'Para que las columnas de hormigón y hierro resistan el movimiento sin caerse',
    option_c: 'Para pintar las paredes de colores brillantes',
    option_d: 'Para que sean más altas que las montañas',
    correct_option: 'b',
    explanation: '¡Correcto! En San Juan todas las casas se construyen con columnas y vigas de hormigón armado para proteger a todas las familias.',
    points: 100,
    difficulty: 'easy',
    sort_order: 6
  },
  {
    id: 'kq7',
    game_id: 'what-is',
    question: '¿Qué debemos hacer cuando termina de temblar para salir con seguridad?',
    image_url: '/images/quiz/kids/k7.png',
    option_a: 'Prender fósforos para iluminar la pieza',
    option_b: 'Correr descalzo por toda la casa',
    option_c: 'Ponerse zapatillas firmes y salir con calma hacia un lugar abierto con la mochila de emergencia',
    option_d: 'Prender la tele para jugar videojuegos',
    correct_option: 'c',
    explanation: '¡Perfecto! Siempre salimos tranquilos, con calzado puesto para no lastimarnos y llevando la mochila de emergencia.',
    points: 100,
    difficulty: 'easy',
    sort_order: 7
  },
  {
    id: 'kq8',
    game_id: 'what-is',
    question: '¿Por qué los perritos y gatitos a veces se despiertan antes de que empiece a sacudirse todo?',
    image_url: '/images/quiz/adults/q11.png',
    option_a: 'Porque tienen poderes de magia pura',
    option_b: 'Porque escuchan y sienten las primeras vibraciones suaves que los humanos no notamos',
    option_c: 'Porque tienen hambre a toda hora',
    option_d: 'Es solo una casualidad',
    correct_option: 'b',
    explanation: '¡Genial! Los animales tienen un oído y patitas muy sensibles que perciben las ondas rápidas del sismo antes que nosotros.',
    points: 100,
    difficulty: 'easy',
    sort_order: 8
  }
];

export function getRandomQuestions(count: number = 5, userMode: UserMode = 'kids', lang?: 'es' | 'en'): Question[] {
  const currentLang = lang || getCurrentLanguage();
  let pool: Question[];
  if (currentLang === 'en') {
    pool = userMode === 'kids' ? KIDS_SEISMIC_QUESTIONS_EN : WHAT_IS_SEISMIC_QUESTIONS_EN;
  } else {
    pool = userMode === 'kids' ? KIDS_SEISMIC_QUESTIONS : WHAT_IS_SEISMIC_QUESTIONS;
  }
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// ==========================================
// 2. MINIJUEGO: CASA SEGURA (8 PELIGROS DETALLADOS)
// ==========================================
export const SAFE_HOME_HAZARDS: SafeHomeHazard[] = [
  {
    id: 'h_tv',
    name: 'Televisor sobre mesa suelta',
    x: 24,
    y: 42,
    icon: '📺',
    hazardDescription: 'El televisor no está fijado y saldrá despedido hacia adelante durante la oscilación.',
    solution: 'Fijar el televisor a la pared con soporte VESA reforzado o correas de seguridad.',
    isSecured: false
  },
  {
    id: 'h_bookcase',
    name: 'Biblioteca alta sin amurar',
    x: 74,
    y: 32,
    icon: '📚',
    hazardDescription: 'Los muebles altos sin anclaje vuelcan bloqueando vías de escape y aplastando lo que encuentren.',
    solution: 'Anclar la estructura del mueble a la pared con escuadras metálicas y tacos Fisher.',
    isSecured: false
  },
  {
    id: 'h_window',
    name: 'Cama junto a ventanal de vidrio común',
    x: 84,
    y: 68,
    icon: '🪟',
    hazardDescription: 'Los cristales sin laminar estallan hacia el interior por la torsión de la estructura.',
    solution: 'Alejar la cama del vidrio o instalar láminas autoadhesivas de seguridad anti-astillamiento.',
    isSecured: false
  },
  {
    id: 'h_shelf',
    name: 'Objetos pesados en estante superior',
    x: 48,
    y: 18,
    icon: '🏺',
    hazardDescription: 'Floreros y adornos pesados caen como proyectiles peligrosos al sacudirse el muro.',
    solution: 'Bajar los objetos pesados a los estantes inferiores y colocar rebordes de retención.',
    isSecured: false
  },
  {
    id: 'h_mirror',
    name: 'Espejo pesado sobre el respaldo',
    x: 48,
    y: 44,
    icon: '🪞',
    hazardDescription: 'Los cuadros con vidrio sobre camas pueden descolgarse y lesionar a las personas dormidas.',
    solution: 'Reubicar en paredes laterales libres y usar ganchos cerrados de seguridad tipo pitón.',
    isSecured: false
  },
  {
    id: 'h_doorway',
    name: 'Pasillo con cajas y obstáculos',
    x: 18,
    y: 78,
    icon: '📦',
    hazardDescription: 'Cajas y juguetes en el pasillo impiden la evacuación rápida y a oscuras tras corte de luz.',
    solution: 'Mantener las vías de evacuación y puertas 100% despejadas en todo momento.',
    isSecured: false
  },
  {
    id: 'h_lamp',
    name: 'Lámpara colgante sin cadena de seguridad',
    x: 48,
    y: 8,
    icon: '💡',
    hazardDescription: 'Lámparas colgantes pesadas oscilan violentamente hasta golpear el techo o descolgarse.',
    solution: 'Fijar con cable o cadena de acero de seguridad adicional al techo estructural.',
    isSecured: false
  },
  {
    id: 'h_gas',
    name: 'Llave de paso de gas inaccesible',
    x: 12,
    y: 58,
    icon: '🔥',
    hazardDescription: 'Si se rompe una conexión flexible de gas, una fuga no cortada a tiempo genera incendios.',
    solution: 'Verificar que la llave de corte general de gas esté identificada y libre de obstáculos.',
    isSecured: false
  }
];

// ==========================================
// 3. MINIJUEGO: KIT DE EMERGENCIA (18 ÍTEMS)
// ==========================================
export const EMERGENCY_KIT_ITEMS: EmergencyKitItem[] = [
  // Esenciales vitales
  { id: 'water', name: 'Agua potable embotellada', icon: '💧', image: '/images/kit/agua.png', isEssential: true, category: 'vital', reason: 'Mínimo 2 litros por persona por día para 72 horas de supervivencia.' },
  { id: 'flashlight', name: 'Linterna LED a pilas', icon: '🔦', image: '/images/kit/linterna.png', isEssential: true, category: 'vital', reason: 'Permite iluminar sin peligro de explosión ante posibles fugas de gas.' },
  { id: 'radio', name: 'Radio a pilas con repuesto', icon: '📻', image: '/images/kit/radio.png', isEssential: true, category: 'vital', reason: 'Único canal de comunicación oficial si colapsan las redes celulares e internet.' },
  { id: 'first_aid', name: 'Botiquín de primeros auxilios', icon: '🩹', image: '/images/kit/botiquin.png', isEssential: true, category: 'vital', reason: 'Gasas, vendas, antiséptico y medicamentos recetados indispensables.' },
  { id: 'whistle', name: 'Silbato de emergencia', icon: '🔊', image: '/images/kit/silbato.png', isEssential: true, category: 'vital', reason: 'Permite pedir auxilio gastando mucha menos energía que gritar bajo escombros.' },
  { id: 'canned_food', name: 'Alimentos no perecederos', icon: '🥫', image: '/images/kit/alimentos.png', isEssential: true, category: 'vital', reason: 'Aportan calorías inmediatas sin requerir cocción ni heladera.' },
  { id: 'docs', name: 'Copia de DNI y escrituras', icon: '📄', isEssential: true, category: 'vital', reason: 'En bolsa hermética plástica impermeable para trámites post-emergencia.' },
  { id: 'blanket', name: 'Manta térmica liviana', icon: '🧥', image: '/images/kit/manta.png', isEssential: true, category: 'vital', reason: 'Evita la hipotermia nocturna al evacuar a cielo abierto.' },
  { id: 'powerbank', name: 'Batería externa cargada', icon: '🔋', image: '/images/kit/powerbank.png', isEssential: true, category: 'vital', reason: 'Mantener un celular con carga para llamados puntuales de rescate.' },
  { id: 'multitool', name: 'Navaja o multiherramienta', icon: '🔧', image: '/images/kit/multiherramienta.png', isEssential: true, category: 'vital', reason: 'Útil para cortar cuerdas, abrir latas y reparar fijaciones provisorias.' },
  { id: 'matches_waterproof', name: 'Fósforos en estuche sellado', icon: '🔥', image: '/images/kit/fosforos.png', isEssential: true, category: 'vital', reason: 'Para encender fuego controlado en zonas abiertas de campamento seguro.' },
  { id: 'hygiene', name: 'Kit de higiene (alcohol/jabón)', icon: '🧼', isEssential: true, category: 'vital', reason: 'Previene infecciones y epidemias en situaciones de corte de agua.' },

  // Distractores / No esenciales
  { id: 'console', name: 'Consola portátil de juegos', icon: '🎮', image: '/images/kit/consola.png', isEssential: false, category: 'no-essential', reason: 'Es pesada, frágil e innecesaria para la supervivencia básica.' },
  { id: 'candles', name: 'Velas de cera abiertas', icon: '🕯️', isEssential: false, category: 'no-essential', reason: '¡Peligro crítico! La llama abierta enciende fugas invisibles de gas.' },
  { id: 'dishes', name: 'Platos pesados de cerámica', icon: '🍽️', isEssential: false, category: 'no-essential', reason: 'Agregan peso inútil y pueden romperse cortando la mochila.' },
  { id: 'books', name: 'Enciclopedias y libros gruesos', icon: '📚', isEssential: false, category: 'no-essential', reason: 'En la mochila de 72 horas solo debe portarse lo indispensable.' },
  { id: 'hairdryer', name: 'Secador de pelo eléctrico', icon: '💨', isEssential: false, category: 'no-essential', reason: 'Inútil sin red eléctrica y ocupa espacio vital.' },
  { id: 'heavy_jewelry', name: 'Joyero grande con alhajas', icon: '💎', isEssential: false, category: 'no-essential', reason: 'Priorizá la vida y los documentos esenciales sobre objetos de lujo.' }
];

// ==========================================
// 4. MINIJUEGO: ¿QUÉ HARÍAS? (ESCENARIOS EXPANDIDOS)
// ==========================================
export const SCENARIO_CHOICES: ScenarioChoice[] = [
  {
    id: 'sc_home',
    scenarioTitle: 'En Casa o en el Aula',
    context: 'casa',
    icon: '🏠',
    situation: 'Comenzó a temblar fuerte. Se caen adornos y crujen las paredes.',
    options: [
      { id: 'a', text: '🪑 Me agacho, me cubro la cabeza bajo una mesa firme y me sujeto.', isCorrect: true, feedback: '¡Excelente! La técnica universal "Agacharse, Cubrirse y Sujetarse" protege de caídas de revoques y objetos.' },
      { id: 'b', text: '🏃 Salgo corriendo desesperado por las escaleras hacia la calle.', isCorrect: false, feedback: 'Correr durante el sismo es la causa #1 de caídas y traumatismos graves.' },
      { id: 'c', text: '🛗 Corro a tomar el ascensor para bajar más rápido.', isCorrect: false, feedback: '¡Nunca uses ascensores! El corte de energía o descalce de guías te dejará atrapado.' },
      { id: 'd', text: '🪟 Me asomo a la ventana para ver qué está pasando.', isCorrect: false, feedback: 'Los vidrios estallan con la torsión de la estructura y causan cortes profundos.' }
    ]
  },
  {
    id: 'sc_street',
    scenarioTitle: 'En la Vía Pública / Centro',
    context: 'calle',
    icon: '🚶',
    situation: 'Estás caminando por la Peatonal y el suelo se sacude violentamente.',
    options: [
      { id: 'a', text: '🌳 Me dirijo con calma hacia una plaza o espacio abierto despejado de cables.', isCorrect: true, feedback: '¡Muy bien! Te alejás de marquesinas, mampostería de fachadas y cables de media tensión.' },
      { id: 'b', text: '🏢 Me pego a la pared de un edificio alto para resguardarme.', isCorrect: false, feedback: 'Peligro mortal: Las cornisas, vidrios y mampostería caen directamente sobre la vereda.' },
      { id: 'c', text: '🚘 Me subo al techo de un auto estacionado.', isCorrect: false, feedback: 'Subirse a vehículos no ofrece protección y aumenta el riesgo de caídas.' }
    ]
  },
  {
    id: 'sc_vehicle',
    scenarioTitle: 'Conduciendo un Vehículo',
    context: 'vehiculo',
    icon: '🚗',
    situation: 'Vas en auto por la Avenida Circunvalación y sentís la oscilación sísmica.',
    options: [
      { id: 'a', text: '🛑 Encender balizas, reducir suavemente la velocidad, estacionar lejos de puentes/postes y permanecer dentro.', isCorrect: true, feedback: '¡Correcto! La carrocería protege de caídas de cables mientras esperás que cese el movimiento.' },
      { id: 'b', text: '⚡ Acelerar a fondo para cruzar el puente lo más rápido posible.', isCorrect: false, feedback: 'Acelerar en puentes durante un sismo provoca pérdida total de control y riesgo de colapso.' }
    ]
  },
  {
    id: 'sc_shopping',
    scenarioTitle: 'En un Centro Comercial o Supermercado',
    context: 'lugar_publico',
    icon: '🛒',
    situation: 'Estás en los pasillos de un híper cuando los estantes comienzan a tambalearse.',
    options: [
      { id: 'a', text: '🛡️ Me alejo de las góndolas altas con mercadería pesada y me protejo junto a una columna estructural.', isCorrect: true, feedback: '¡Correcto! Las botellas y latas de los estantes caen en avalancha; las columnas son zonas firmes.' },
      { id: 'b', text: '🏃 Empujo a la gente para llegar primero a la puerta giratoria.', isCorrect: false, feedback: 'Las estampidas humanas en puertas causan asfixia y aplastamiento masivo.' }
    ]
  },
  {
    id: 'sc_bed_night',
    scenarioTitle: 'Terremoto de Noche en la Cama',
    context: 'casa',
    icon: '🛏️',
    situation: 'Un sismo fuerte te despierta en mitad de la noche a oscuras.',
    options: [
      { id: 'a', text: '🛌 Me quedo en la cama, me coloco boca abajo y me cubro la cabeza con la almohada.', isCorrect: true, feedback: '¡Perfecto! Caminar a oscuras con el suelo sacudiéndose sobre vidrios rotos causa heridas graves.' },
      { id: 'b', text: '🕯️ Prendo una vela con fósforos para iluminar la habitación.', isCorrect: false, feedback: '¡Peligro de explosión! Las fugas invisibles de gas pueden estallar con una llama abierta.' }
    ]
  },
  {
    id: 'sc_after_quake',
    scenarioTitle: 'Inmediatamente Después de la Sacudida',
    context: 'casa',
    icon: '🔌',
    situation: 'El temblor principal se detuvo. No hay luz y se siente olor a gas.',
    options: [
      { id: 'a', text: '🔧 Cerrar la llave de gas, bajar el disyuntor eléctrico, colocarse calzado firme y evacuar con la mochila de 72h.', isCorrect: true, feedback: '¡Conducta impecable! Neutralizás el riesgo de incendio y evacuás protegido hacia el punto de encuentro.' },
      { id: 'b', text: '💡 Encender las llaves de luz para ver dónde están las grietas.', isCorrect: false, feedback: 'La chispa del interruptor eléctrico puede detonar una fuga acumulada de gas.' }
    ]
  }
];

export const KIDS_SCENARIO_CHOICES: ScenarioChoice[] = [
  {
    id: 'ksc_school',
    scenarioTitle: 'En la Escuela o el Aula',
    context: 'escuela',
    icon: '🏫',
    situation: '¡La seño avisa que está temblando y el piso se mueve!',
    options: [
      { id: 'a', text: '🪑 Me meto rápido debajo de mi banco, me cubro la cabeza y me sujeto con las dos manos.', isCorrect: true, feedback: '¡Excelente! Tu banco te protege como un escudo de cualquier cosa que caiga del techo.' },
      { id: 'b', text: '🏃 Salgo corriendo solo por el pasillo empujando la puerta.', isCorrect: false, feedback: 'Correr y empujar es muy peligroso porque podés tropezar y lastimarte.' },
      { id: 'c', text: '🪟 Corro a la ventana para ver los árboles.', isCorrect: false, feedback: '¡Cuidado! Los vidrios pueden romperse si la pared se sacude.' }
    ]
  },
  {
    id: 'ksc_park',
    scenarioTitle: 'Jugando en la Plaza o el Patio',
    context: 'calle',
    icon: '🌳',
    situation: 'Estás jugando a la pelota al aire libre y empieza a vibrar el suelo.',
    options: [
      { id: 'a', text: '🌳 Me quedo en el centro despejado de la plaza, lejos de postes y cables.', isCorrect: true, feedback: '¡Genial! Al aire libre en el pasto estás en el lugar más seguro del mundo.' },
      { id: 'b', text: '🏢 Me meto debajo del techo de chapa de un quiosco.', isCorrect: false, feedback: 'Los techos sueltos y carteles pueden soltarse; mejor quedarse a cielo abierto.' }
    ]
  },
  {
    id: 'ksc_home_bed',
    scenarioTitle: 'De Noche en tu Cama',
    context: 'casa',
    icon: '🛏️',
    situation: 'Un temblor te despierta en mitad de la noche y está todo oscuro.',
    options: [
      { id: 'a', text: '🛌 Me quedo en la cama boca abajo y me tapo bien la cabeza con la almohada.', isCorrect: true, feedback: '¡Perfecto! La almohada y el colchón te cuidan de cualquier revoque o adorno.' },
      { id: 'b', text: '🏃 Me levanto corriendo descalzo en la oscuridad.', isCorrect: false, feedback: 'Caminar a oscuras con el suelo moviéndose puede hacer que pises adornos rotos.' }
    ]
  },
  {
    id: 'ksc_supermarket',
    scenarioTitle: 'De Compras con tu Familia',
    context: 'lugar_publico',
    icon: '🛒',
    situation: 'Estás en el supermercado y empiezan a sonar y tambalearse las latas en los estantes.',
    options: [
      { id: 'a', text: '🛡️ Me alejo de los estantes altos con frascos de vidrio y me quedo junto a mi familia.', isCorrect: true, feedback: '¡Muy bien! Las botellas pueden caerse; alejarse de los estantes es lo más inteligente.' },
      { id: 'b', text: '🏃 Salgo corriendo solo hacia la calle.', isCorrect: false, feedback: 'Nunca te separes de tu familia y nunca corras en lugares llenos de gente.' }
    ]
  }
];

export function getRandomScenarios(count: number = 4, userMode: UserMode = 'kids', lang?: 'es' | 'en'): ScenarioChoice[] {
  const currentLang = lang || getCurrentLanguage();
  let pool: ScenarioChoice[];
  if (currentLang === 'en') {
    pool = userMode === 'kids' ? KIDS_SCENARIO_CHOICES_EN : SCENARIO_CHOICES_EN;
  } else {
    pool = userMode === 'kids' ? KIDS_SCENARIO_CHOICES : SCENARIO_CHOICES;
  }
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// ==========================================
// 5. MINIJUEGO: MITO O REALIDAD (12 AFIRMACIONES EXPANDIDAS)
// ==========================================
export const MYTH_STATEMENTS: MythStatement[] = [
  {
    id: 'm1',
    statement: 'Durante un terremoto, el marco de cualquier puerta es siempre el lugar más seguro de la casa.',
    isReality: false,
    explanation: '¡MITO! En construcciones modernas, los marcos no son más resistentes y la puerta puede batir violentamente lesionándote. Es mucho más seguro estar bajo una mesa firme.',
    category: 'Autoprotección'
  },
  {
    id: 'm2',
    statement: 'Los terremotos en San Juan son provocados por la subducción de la Placa de Nazca bajo la Sudamericana.',
    isReality: true,
    explanation: '¡REALIDAD! Es el motor geológico continuo que acumula energía elástica y da origen a nuestra cordillera y valles andinos.',
    category: 'Ciencia'
  },
  {
    id: 'm3',
    statement: 'La ciencia actual puede predecir con exactitud el día y la hora del próximo terremoto.',
    isReality: false,
    explanation: '¡MITO! La sismología mundial no puede predecir fecha ni hora exacta. Por eso la única defensa real es la construcción sismorresistente y la preparación.',
    category: 'Ciencia'
  },
  {
    id: 'm4',
    statement: 'Después de un terremoto fuerte, lo primero que debe hacer un adulto es cortar las llaves de gas y electricidad.',
    isReality: true,
    explanation: '¡REALIDAD! Previene incendios y explosiones por cañerías fisuradas o cortocircuitos tras el colapso de cables.',
    category: 'Prevención'
  },
  {
    id: 'm5',
    statement: 'Las construcciones de adobe con barro son tan seguras como las de hormigón armado si se pintan bien.',
    isReality: false,
    explanation: '¡MITO! El adobe es un material pesado y frágil sin resistencia a la tracción; por eso tras 1944 fue prohibido en San Juan, adoptando las normas INPRES.',
    category: 'Ingeniería'
  },
  {
    id: 'm6',
    statement: 'El calor sofocante del verano o el "viento zonda" provocan terremotos porque calientan las fallas.',
    isReality: false,
    explanation: '¡MITO POPULAR! Los sismos se originan a kilómetros de profundidad en la corteza terrestre, donde las condiciones climáticas del aire superficial no tienen ninguna influencia.',
    category: 'Mitos Sanjuaninos'
  },
  {
    id: 'm7',
    statement: 'El "Triángulo de la Vida" es la técnica recomendada oficialmente por el INPRES y Defensa Civil.',
    isReality: false,
    explanation: '¡MITO! En edificios con normas sismorresistentes, la técnica universal recomendada es "Agacharse, Cubrirse y Sujetarse" bajo un mueble resistente.',
    category: 'Autoprotección'
  },
  {
    id: 'm8',
    statement: 'En San Juan tiembla todos los días, aunque la mayoría de los eventos son imperceptibles para las personas.',
    isReality: true,
    explanation: '¡REALIDAD! La Red Sismológica del INPRES registra diariamente entre 15 y 30 microsismos en la región de Cuyo que solo los acelerógrafos detectan.',
    category: 'Ciencia'
  },
  {
    id: 'm9',
    statement: 'Si estás dentro de un edificio sismorresistente moderno, lo mejor durante el temblor es no salir corriendo.',
    isReality: true,
    explanation: '¡REALIDAD! Los edificios construidos bajo normas INPRES están calculados para no colapsar. La mayoría de los heridos ocurren al intentar correr por escaleras durante la sacudida.',
    category: 'Autoprotección'
  },
  {
    id: 'm10',
    statement: 'La escala de Richter tiene un límite máximo de 10 puntos y no puede superar ese valor.',
    isReality: false,
    explanation: '¡MITO! La escala de magnitud de momento (Mw) es logarítmica y abierta, sin límite teórico fijado, aunque el mayor sismo registrado en la Tierra fue de 9.5 en Chile (1960).',
    category: 'Ciencia'
  },
  {
    id: 'm11',
    statement: 'El agua potable y una linterna a pilas son los dos elementos más críticos de la mochila de 72 horas.',
    isReality: true,
    explanation: '¡REALIDAD! La deshidratación y la falta de iluminación segura sin riesgo de gas son las dos primeras emergencias tras un terremoto destructor.',
    category: 'Prevención'
  },
  {
    id: 'm12',
    statement: 'Un sismo de magnitud 7 libera aproximadamente 32 veces más energía que uno de magnitud 6.',
    isReality: true,
    explanation: '¡REALIDAD! Cada salto de 1 punto en la escala de magnitud representa unas 31.6 veces más energía elástica liberada en el foco.',
    category: 'Ciencia'
  }
];

export const KIDS_MYTH_STATEMENTS: MythStatement[] = [
  {
    id: 'km1',
    statement: 'El viento zonda o los días de mucho calor provocan terremotos.',
    isReality: false,
    explanation: '¡MITO! Los sismos se originan a muchos kilómetros de profundidad en la roca, donde el clima o el aire de afuera no tienen nada que ver.',
    category: 'Mitos Populares'
  },
  {
    id: 'km2',
    statement: 'El mejor lugar durante un temblor es meterse abajo de una mesa firme y agarrarse.',
    isReality: true,
    explanation: '¡REALIDAD! La mesa te protege como un techo protector de cualquier objeto que se caiga.',
    category: 'Autoprotección'
  },
  {
    id: 'km3',
    statement: 'Los científicos ya pueden saber el día y la hora exacta del próximo terremoto.',
    isReality: false,
    explanation: '¡MITO! Nadie en el mundo puede predecir el día exacto. Por eso lo más importante es estar siempre preparados.',
    category: 'Ciencia'
  },
  {
    id: 'km4',
    statement: 'Los animales sienten las primeras vibraciones suaves antes que las personas.',
    isReality: true,
    explanation: '¡REALIDAD! Tienen sentidos muy sensibles y perciben las ondas rápidas del sismo antes de la sacudida fuerte.',
    category: 'Naturaleza'
  },
  {
    id: 'km5',
    statement: 'En un temblor hay que salir corriendo a los gritos por las escaleras.',
    isReality: false,
    explanation: '¡MITO PELIGROSO! Correr por escaleras mientras se mueve el piso causa caídas y golpes. Hay que quedarse en un lugar seguro.',
    category: 'Seguridad'
  },
  {
    id: 'km6',
    statement: 'En San Juan la Tierra tiembla todos los días, aunque casi siempre son temblores tan chiquitos que no se sienten.',
    isReality: true,
    explanation: '¡REALIDAD! La Tierra libera energía despacito todo el tiempo, y los sismógrafos del INPRES registran cada uno.',
    category: 'San Juan'
  },
  {
    id: 'km7',
    statement: 'Pararse abajo del marco de cualquier puerta es lo más seguro de la casa.',
    isReality: false,
    explanation: '¡MITO! Las puertas se pueden cerrar de golpe y lastimarte los dedos. Es mucho más seguro estar debajo de una mesa.',
    category: 'Autoprotección'
  },
  {
    id: 'km8',
    statement: 'Una linterna a pilas y agua potable son cosas indispensables en la mochila de emergencia.',
    isReality: true,
    explanation: '¡REALIDAD! La linterna nos da luz segura sin prender fuego, y el agua nos mantiene hidratados.',
    category: 'Prevención'
  }
];

export function getRandomMyths(count: number = 5, userMode: UserMode = 'kids', lang?: 'es' | 'en'): MythStatement[] {
  const currentLang = lang || getCurrentLanguage();
  let pool: MythStatement[];
  if (currentLang === 'en') {
    pool = userMode === 'kids' ? KIDS_MYTH_STATEMENTS_EN : MYTH_STATEMENTS_EN;
  } else {
    pool = userMode === 'kids' ? KIDS_MYTH_STATEMENTS : MYTH_STATEMENTS;
  }
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

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
    name: 'REFLEJOS ACTIVOS',
    slug: 'casa-segura',
    description: 'Demostraste reflejos de supervivencia impecables ante un sismo inminente.',
    icon: '🏢',
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
