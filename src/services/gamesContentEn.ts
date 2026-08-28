import {
  Question,
  SafeHomeHazard,
  EmergencyKitItem,
  ScenarioChoice,
  MythStatement,
  HistoricalEvent,
  Achievement
} from '../types';

// ==========================================
// 1. ENGLISH QUESTIONS - ADULTS
// ==========================================
export const WHAT_IS_SEISMIC_QUESTIONS_EN: Question[] = [
  {
    id: 'q1',
    game_id: 'what-is',
    question: 'What happens when energy accumulated in crustal rocks is suddenly released?',
    image_url: '/images/quiz/adults/q1.png',
    option_a: 'A volcanic ash eruption occurs',
    option_b: 'Ambient temperature drops abruptly',
    option_c: 'Seismic waves originate making the ground shake (an earthquake)',
    option_d: 'A thunderstorm begins',
    correct_option: 'c',
    explanation: 'Sudden fault slip releases elastic waves that propagate through the Earth’s crust causing ground shaking.',
    points: 100,
    difficulty: 'easy',
    sort_order: 1
  },
  {
    id: 'q2',
    game_id: 'what-is',
    question: 'What is the point on Earth’s surface directly above the underground earthquake rupture called?',
    image_url: '/images/quiz/adults/q2.png',
    option_a: 'Epicenter',
    option_b: 'Hypocenter',
    option_c: 'Tectonic Fault',
    option_d: 'Crater',
    correct_option: 'a',
    explanation: 'The Epicenter is the surface projection of the Hypocenter (the deep underground point where the rock ruptured).',
    points: 100,
    difficulty: 'easy',
    sort_order: 2
  },
  {
    id: 'q3',
    game_id: 'what-is',
    question: 'Which tectonic plates interact along the Cuyo region and western Argentina?',
    image_url: '/images/quiz/adults/q3.jpg',
    option_a: 'African Plate and Pacific Plate',
    option_b: 'Eurasian Plate and Antarctic Plate',
    option_c: 'Cocos Plate and Caribbean Plate',
    option_d: 'Nazca Plate and South American Plate',
    correct_option: 'd',
    explanation: 'The oceanic Nazca Plate subducts under the South American Plate, uplifting the Andes Mountains and generating ongoing seismic activity.',
    points: 100,
    difficulty: 'medium',
    sort_order: 3
  },
  {
    id: 'q4',
    game_id: 'what-is',
    question: 'Which scientific instruments does INPRES use to record ground waves and acceleration?',
    image_url: '/images/quiz/adults/q4.jpg',
    option_a: 'Thermometer and hygrometer',
    option_b: 'Seismograph and accelerograph',
    option_c: 'Aneroid barometer',
    option_d: 'Infrared telescope',
    correct_option: 'b',
    explanation: 'Digital seismographs and accelerographs record ground displacement, velocity and acceleration with high precision.',
    points: 100,
    difficulty: 'medium',
    sort_order: 4
  },
  {
    id: 'q5',
    game_id: 'what-is',
    question: 'What is the fundamental difference between Magnitude and Seismic Intensity?',
    image_url: '/images/quiz/adults/q5.png',
    option_a: 'They are identical concepts with different names',
    option_b: 'Magnitude measures injuries and Intensity measures focal depth',
    option_c: 'Magnitude measures released energy (single value); Intensity measures observed effects/damage at each location',
    option_d: 'Magnitude is measured in Mercalli; Intensity in Richter',
    correct_option: 'c',
    explanation: 'An earthquake has only one Magnitude (energy at focus), but multiple Intensities (Mercalli scale) depending on distance and soil type.',
    points: 120,
    difficulty: 'medium',
    sort_order: 5
  },
  {
    id: 'q6',
    game_id: 'what-is',
    question: 'Which seismic wave type travels fastest and arrives first at monitoring stations?',
    image_url: '/images/quiz/adults/q6.png',
    option_a: 'Primary or Compressional Waves (P-waves)',
    option_b: 'Rayleigh Surface Waves',
    option_c: 'Secondary or Shear Waves (S-waves)',
    option_d: 'Audible Sound Waves',
    correct_option: 'a',
    explanation: 'P-waves travel fastest by compressing and dilating rock along their path; they are the first recorded on seismograms.',
    points: 120,
    difficulty: 'hard',
    sort_order: 6
  },
  {
    id: 'q7',
    game_id: 'what-is',
    question: 'Why is San Juan province classified in Seismic Zone 4 (very high seismic hazard)?',
    image_url: '/images/quiz/adults/q7.png',
    option_a: 'Because active city volcanoes exist nearby',
    option_b: 'Due to dry climate and summer heat',
    option_c: 'Because of high altitude above sea level',
    option_d: 'Due to active crustal faults and shallow subduction of the Nazca Plate',
    correct_option: 'd',
    explanation: 'San Juan is in INPRES Zone 4 due to horizontal subduction geometry and numerous active crustal faults.',
    points: 100,
    difficulty: 'easy',
    sort_order: 7
  },
  {
    id: 'q8',
    game_id: 'what-is',
    question: 'What phenomenon occurs when saturated sandy soil loses shear strength and behaves like liquid during shaking?',
    image_url: '/images/quiz/adults/q8.png',
    option_a: 'Wind erosion',
    option_b: 'Soil liquefaction (as occurred in Caucete 1977)',
    option_c: 'Volcanic fissuring',
    option_d: 'Karst sedimentation',
    correct_option: 'b',
    explanation: 'Liquefaction happens when ground shaking increases pore water pressure in fine sands, making soil lose bearing capacity.',
    points: 130,
    difficulty: 'hard',
    sort_order: 8
  },
  {
    id: 'q9',
    game_id: 'what-is',
    question: 'What does the acronym INPRES stand for?',
    image_url: '/images/quiz/adults/q9.png',
    option_a: 'National Institute for Seismic Prevention (Instituto Nacional de Prevención Sísmica)',
    option_b: 'National Plate Research Institute',
    option_c: 'National Rescue & Protection Service',
    option_d: 'Provincial Seismic Resistance Department',
    correct_option: 'a',
    explanation: 'INPRES is headquartered in San Juan and is the federal scientific body regulating earthquake-resistant construction in Argentina.',
    points: 100,
    difficulty: 'easy',
    sort_order: 9
  },
  {
    id: 'q10',
    game_id: 'what-is',
    question: 'What is the primary role of reinforced concrete tie-columns and beams in a seismic-resistant house?',
    image_url: '/images/quiz/adults/q10.png',
    option_a: 'To keep the house warm in winter',
    option_b: 'To solely support roof vertical weight',
    option_c: 'To confine masonry walls so they act monolithically against lateral seismic forces',
    option_d: 'To prevent rainwater infiltration',
    correct_option: 'c',
    explanation: 'Confined masonry ties walls together, allowing energy dissipation without wall collapse during strong shaking.',
    points: 120,
    difficulty: 'medium',
    sort_order: 10
  }
];

// ==========================================
// 2. ENGLISH QUESTIONS - KIDS
// ==========================================
export const KIDS_SEISMIC_QUESTIONS_EN: Question[] = [
  {
    id: 'kq1',
    game_id: 'what-is',
    question: 'What is an earthquake or tremor?',
    image_url: '/images/quiz/kids/k1.png',
    option_a: 'A very cold winter wind',
    option_b: 'A shooting star shower',
    option_c: 'When the ground shakes because giant underground rock layers shift',
    option_d: 'A loud thunder sound in the sky',
    correct_option: 'c',
    explanation: 'Great job! Deep underground, huge rock layers move and cause the ground vibrations we feel.',
    points: 100,
    difficulty: 'easy',
    sort_order: 1
  },
  {
    id: 'kq2',
    game_id: 'what-is',
    question: 'If an earthquake starts at home or school, what is the first thing you should do?',
    image_url: '/images/quiz/kids/k2.png',
    option_a: 'Run screaming through the hallway',
    option_b: 'Drop, Cover your head under a sturdy table and Hold On!',
    option_c: 'Climb onto a chair to look outside',
    option_d: 'Lean out the window',
    correct_option: 'b',
    explanation: 'Awesome! Getting under a strong desk protects your head from anything that might fall.',
    points: 100,
    difficulty: 'easy',
    sort_order: 2
  },
  {
    id: 'kq3',
    game_id: 'what-is',
    question: 'What is the name of the scientific team in San Juan that monitors earthquakes?',
    image_url: '/images/quiz/kids/k3.png',
    option_a: 'INPRES (National Institute for Seismic Prevention)',
    option_b: 'The Astronaut Club',
    option_c: 'Space Firefighter Patrol',
    option_d: 'Forest Rangers',
    correct_option: 'a',
    explanation: 'Spot on! INPRES is headquartered in San Juan with high-tech sensors monitoring ground motion 24/7.',
    points: 100,
    difficulty: 'easy',
    sort_order: 3
  },
  {
    id: 'kq4',
    game_id: 'what-is',
    question: 'What instrument do scientists use to measure and draw earthquake waves?',
    image_url: '/images/quiz/kids/k4.png',
    option_a: 'A microscope',
    option_b: 'A space telescope',
    option_c: 'A seismograph',
    option_d: 'An alarm clock',
    correct_option: 'c',
    explanation: 'Exactly! Seismographs draw lines showing how strongly the Earth vibrated.',
    points: 100,
    difficulty: 'easy',
    sort_order: 4
  },
  {
    id: 'kq5',
    game_id: 'what-is',
    question: 'Why is Earth’s crust like a giant jigsaw puzzle?',
    image_url: '/images/quiz/kids/k5.png',
    option_a: 'Because it is made of giant puzzle pieces called "tectonic plates" moving very slowly',
    option_b: 'Because someone cut it with magic scissors',
    option_c: 'Because it is made of floating ice blocks',
    option_d: 'It is not a puzzle, it is a single smooth stone',
    correct_option: 'a',
    explanation: 'Well done! Tectonic plates float and shift just a few centimeters every year—about as fast as your fingernails grow!',
    points: 100,
    difficulty: 'easy',
    sort_order: 5
  },
  {
    id: 'kq6',
    game_id: 'what-is',
    question: 'Why is it crucial in San Juan to build earthquake-resistant houses?',
    image_url: '/images/quiz/kids/k6.png',
    option_a: 'To block summer heat',
    option_b: 'So reinforced concrete columns withstand shaking without collapsing',
    option_c: 'To paint walls in bright neon colors',
    option_d: 'To make them taller than mountains',
    correct_option: 'b',
    explanation: 'Correct! In San Juan, buildings have reinforced concrete frames to protect all families.',
    points: 100,
    difficulty: 'easy',
    sort_order: 6
  }
];

// ==========================================
// 3. ENGLISH MYTHS
// ==========================================
export const MYTH_STATEMENTS_EN: MythStatement[] = [
  {
    id: 'm1',
    statement: 'During an earthquake, any doorway frame is always the safest spot in the house.',
    isReality: false,
    explanation: 'MYTH! In modern buildings, doorways are not reinforced and doors can swing violently injuring you. It is much safer under a sturdy table.',
    category: 'Self-Protection'
  },
  {
    id: 'm2',
    statement: 'Earthquakes in San Juan are caused by the Nazca Plate subducting beneath the South American Plate.',
    isReality: true,
    explanation: 'REALITY! This ongoing geological engine accumulates elastic strain and creates the Andes mountain range.',
    category: 'Science'
  },
  {
    id: 'm3',
    statement: 'Modern science can predict the exact day and hour of the next earthquake.',
    isReality: false,
    explanation: 'MYTH! Global seismology cannot predict exact dates or times. Our true defense is earthquake-resistant construction and preparedness.',
    category: 'Science'
  },
  {
    id: 'm4',
    statement: 'After a severe earthquake, the first thing an adult should do is shut off main gas and electric valves.',
    isReality: true,
    explanation: 'REALITY! This prevents fires and explosions from cracked gas pipes or downed electrical wires.',
    category: 'Prevention'
  },
  {
    id: 'm5',
    statement: 'Adobe mud-brick buildings are just as safe as reinforced concrete if painted well.',
    isReality: false,
    explanation: 'MYTH! Unreinforced adobe lacks tensile strength and easily collapses, which is why it was banned in San Juan after 1944 in favor of INPRES standards.',
    category: 'Engineering'
  },
  {
    id: 'm6',
    statement: 'Hot summer weather or the "Zonda wind" causes earthquakes by heating underground faults.',
    isReality: false,
    explanation: 'POPULAR MYTH! Earthquakes originate miles deep in the Earth’s crust where surface weather has zero effect.',
    category: 'Folklore'
  },
  {
    id: 'm7',
    statement: 'The "Triangle of Life" is the official technique recommended by INPRES and Civil Defense.',
    isReality: false,
    explanation: 'MYTH! In earthquake-resistant buildings, the universal standard is "Drop, Cover, and Hold On" beneath a sturdy desk.',
    category: 'Self-Protection'
  },
  {
    id: 'm8',
    statement: 'In San Juan the ground shakes every day, though most events are too small to be felt by people.',
    isReality: true,
    explanation: 'REALITY! The INPRES seismic network detects 15 to 30 micro-earthquakes daily in Cuyo that only sensitive accelerographs record.',
    category: 'Science'
  }
];

export const KIDS_MYTH_STATEMENTS_EN: MythStatement[] = [
  {
    id: 'km1',
    statement: 'Hot winds or very hot summer days cause earthquakes.',
    isReality: false,
    explanation: 'MYTH! Earthquakes start miles underground in deep rock; outside weather has nothing to do with it.',
    category: 'Folklore'
  },
  {
    id: 'km2',
    statement: 'The best place during shaking is to drop under a sturdy table and hold on.',
    isReality: true,
    explanation: 'REALITY! The table acts like a protective shield against falling objects.',
    category: 'Safety'
  },
  {
    id: 'km3',
    statement: 'Scientists already know the exact day and time of the next big tremor.',
    isReality: false,
    explanation: 'MYTH! Nobody in the world can predict exact dates. That is why staying prepared is what matters most.',
    category: 'Science'
  },
  {
    id: 'km4',
    statement: 'Animals often perceive the first gentle vibrations before people notice them.',
    isReality: true,
    explanation: 'REALITY! Animals have sharp senses that feel fast P-waves right before the heavy shaking arrives.',
    category: 'Nature'
  },
  {
    id: 'km5',
    statement: 'During an earthquake, you should run screaming down the stairs.',
    isReality: false,
    explanation: 'DANGEROUS MYTH! Running on stairs during ground motion causes severe falls. Always stay in a safe spot until shaking stops.',
    category: 'Safety'
  }
];

// ==========================================
// 4. ENGLISH SCENARIOS
// ==========================================
export const SCENARIO_CHOICES_EN: ScenarioChoice[] = [
  {
    id: 'sc_home',
    scenarioTitle: 'At Home or in the Classroom',
    context: 'casa',
    icon: '🏠',
    situation: 'Strong shaking begins. Items fall off shelves and walls creak.',
    options: [
      { id: 'a', text: '🪑 Drop, cover my head under a sturdy desk and hold on.', isCorrect: true, feedback: 'Excellent! The universal "Drop, Cover, and Hold On" technique protects from falling plaster and objects.' },
      { id: 'b', text: '🏃 Run panicking down the stairs toward the street.', isCorrect: false, feedback: 'Running during strong shaking is the #1 cause of falls and fractures.' },
      { id: 'c', text: '🛗 Run into the elevator to go down faster.', isCorrect: false, feedback: 'Never use elevators! Power cuts or misaligned rails will trap you inside.' },
      { id: 'd', text: '🪟 Lean against window glass to see what is happening.', isCorrect: false, feedback: 'Glass panes shatter under structural twist and cause deep cuts.' }
    ]
  },
  {
    id: 'sc_street',
    scenarioTitle: 'On the Street / Downtown',
    context: 'calle',
    icon: '🚶',
    situation: 'You are walking outdoors and the ground shakes violently.',
    options: [
      { id: 'a', text: '🌳 Move calmly toward an open plaza away from power lines and building facades.', isCorrect: true, feedback: 'Great decision! You avoid falling masonry, signboards and high-voltage cables.' },
      { id: 'b', text: '🏢 Hug the wall of a tall glass building for shelter.', isCorrect: false, feedback: 'Severe hazard: Window shards and cornices fall directly along sidewalks.' },
      { id: 'c', text: '🚘 Climb on top of a parked car.', isCorrect: false, feedback: 'Climbing vehicles offers no protection and increases fall injuries.' }
    ]
  },
  {
    id: 'sc_vehicle',
    scenarioTitle: 'Driving a Vehicle',
    context: 'vehiculo',
    icon: '🚗',
    situation: 'You are driving along the highway and feel strong vehicle swaying.',
    options: [
      { id: 'a', text: '🛑 Turn on hazard lights, slow down gently, park away from overpasses and poles, stay inside.', isCorrect: true, feedback: 'Correct! The car body protects you from fallen cables while you wait for shaking to cease.' },
      { id: 'b', text: '⚡ Floor the accelerator to cross overpasses as fast as possible.', isCorrect: false, feedback: 'Speeding on bridges during shaking leads to total loss of control.' }
    ]
  },
  {
    id: 'sc_after_quake',
    scenarioTitle: 'Immediately After Shaking Stops',
    context: 'casa',
    icon: '🔌',
    situation: 'The main tremor ended. Power is out and there is a smell of gas.',
    options: [
      { id: 'a', text: '🔧 Close gas valve, switch off breaker, put on sturdy shoes, evacuate with 72h go-bag.', isCorrect: true, feedback: 'Flawless safety response! You eliminate fire risks and evacuate safely to the meeting point.' },
      { id: 'b', text: '💡 Flip light switches to inspect wall cracks.', isCorrect: false, feedback: 'Electrical switch sparks can ignite trapped gas leaks.' }
    ]
  }
];

export const KIDS_SCENARIO_CHOICES_EN: ScenarioChoice[] = [
  {
    id: 'ksc_school',
    scenarioTitle: 'At School or in the Classroom',
    context: 'escuela',
    icon: '🏫',
    situation: 'The teacher announces an earthquake and the floor begins to shake!',
    options: [
      { id: 'a', text: '🪑 Quickly get under my desk, cover my head and hold tight with both hands.', isCorrect: true, feedback: 'Awesome! Your desk acts like a shield from anything falling from the ceiling.' },
      { id: 'b', text: '🏃 Run alone down the hallway pushing doors.', isCorrect: false, feedback: 'Running and pushing is dangerous because you might trip and get hurt.' },
      { id: 'c', text: '🪟 Run to the window to look outside.', isCorrect: false, feedback: 'Watch out! Windows can shatter when walls shake.' }
    ]
  },
  {
    id: 'ksc_park',
    scenarioTitle: 'Playing in the Park or Yard',
    context: 'calle',
    icon: '🌳',
    situation: 'You are playing ball outdoors and the ground begins to vibrate.',
    options: [
      { id: 'a', text: '🌳 Stay in the clear open area of the park, away from poles and cables.', isCorrect: true, feedback: 'Great! Out in the open grass is the safest place to be.' },
      { id: 'b', text: '🏢 Run under a metal shed roof.', isCorrect: false, feedback: 'Loose roofing and signs can drop; staying out in the open is best.' }
    ]
  }
];
