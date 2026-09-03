import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Timer, Heart, Zap, Flame, ShieldAlert, ShieldCheck, AlertTriangle, ArrowRight, Sparkles, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { ScreenId, UserMode } from '../../types';
import { Button } from '../ui/Button';
import { sound } from '../../lib/sound';
import { GameIntroCountdown } from './GameIntroCountdown';
import { GameResultScreen } from './GameResultScreen';
import { useLanguage } from '../../i18n/LanguageContext';
import { REFLEX_SCENARIOS_EN } from '../../services/gamesContentEn';

interface ReflexScenario {
  id: string;
  contextTag: string;
  icon: string;
  situation: string;
  optionSafe: string;
  optionDanger: string;
  imageSafe?: string;
  imageDanger?: string;
  safeExplanation: string;
  dangerExplanation: string;
}

const REFLEX_SCENARIOS: ReflexScenario[] = [
  {
    id: 'r1',
    contextTag: 'ESCUELA / OFICINA',
    icon: '🏫',
    situation: 'Comienza a temblar fuerte el piso y crujen las paredes.',
    optionSafe: '🛡️ Agacharse, cubrirse bajo el pupitre y sujetarse',
    optionDanger: '🏃 Correr desesperado hacia las escaleras',
    imageSafe: '/images/reflexes/adults/r1_safe.webp',
    imageDanger: '/images/reflexes/adults/r1_danger.webp',
    safeExplanation: '¡Reflejo vital! Proteger cabeza y cuerpo bajo un mueble firme evita traumatismos por caída de revoques y lámparas.',
    dangerExplanation: '¡Peligro mortal! Correr por escaleras durante la sacudida es la causa #1 de caídas y fracturas graves.'
  },
  {
    id: 'r2',
    contextTag: 'POST-SISMO EN EL HOGAR',
    icon: '🔌',
    situation: 'Cesó el temblor, no hay luz eléctrica y se siente olor a gas.',
    optionSafe: '🔧 Cerrar llave de gas, no tocar interruptores y evacuar',
    optionDanger: '🕯️ Encender una vela o linterna rota para buscar daños',
    imageSafe: '/images/reflexes/adults/r2_safe.webp',
    imageDanger: '/images/reflexes/adults/r2_danger.webp',
    safeExplanation: '¡Conducta impecable! Neutralizás el riesgo de incendio y evacuás sin generar chispas.',
    dangerExplanation: '¡Riesgo de explosión! Una llama abierta detona acumulaciones de gas fugado en segundos.'
  },
  {
    id: 'r3',
    contextTag: 'EDIFICIO EN PISO ALTO',
    icon: '🏢',
    situation: 'Estás en un 4to piso y el edificio oscila con fuerza.',
    optionSafe: '🛡️ Resguardarse junto a una columna o bajo mesa firme',
    optionDanger: '🛗 Tomar el ascensor para bajar rápido a la calle',
    imageSafe: '/images/reflexes/adults/r3_safe.webp',
    imageDanger: '/images/reflexes/adults/r3_danger.webp',
    safeExplanation: '¡Correcto! Los edificios modernos con norma INPRES no colapsan. Mantenete a resguardo en el lugar.',
    dangerExplanation: '¡Trampa mortal! El corte de energía o descalce de guías te deja atrapado dentro del ascensor.'
  },
  {
    id: 'r4',
    contextTag: 'CONDUCIENDO VEHÍCULO',
    icon: '🚗',
    situation: 'Manejando por la avenida sentís vibración y pérdida de control.',
    optionSafe: '🛑 Balizas, frenar suave lejos de postes y quedarse dentro',
    optionDanger: '⚡ Acelerar a fondo para cruzar el puente a toda velocidad',
    imageSafe: '/images/reflexes/adults/r4_safe.webp',
    imageDanger: '/images/reflexes/adults/r4_danger.webp',
    safeExplanation: '¡Perfecto! La carrocería del auto protege contra caídas de cables mientras esperás que cese el sismo.',
    dangerExplanation: '¡Peligro crítico! Acelerar en puentes durante un sismo provoca vuelcos y colisiones fatales.'
  },
  {
    id: 'r5',
    contextTag: 'VÍA PÚBLICA / PEATONAL',
    icon: '🚶',
    situation: 'Caminás por el centro y empiezan a caer vidrios de edificios.',
    optionSafe: '🌳 Dirigirse con calma hacia el centro despejado de la plaza',
    optionDanger: '🏢 Pegarse a la pared bajo las marquesinas comerciales',
    imageSafe: '/images/reflexes/adults/r5_safe.webp',
    imageDanger: '/images/reflexes/adults/r5_danger.webp',
    safeExplanation: '¡Muy bien! Te alejás de vidrios, mampostería de cornisas y cables de media tensión.',
    dangerExplanation: '¡Zona de impacto! Los vidrios y revoques caen en cascada directamente sobre la línea de vereda.'
  },
  {
    id: 'r6',
    contextTag: 'DE NOCHE EN LA CAMA',
    icon: '🛌',
    situation: 'Te despierta un violento terremoto a oscuras en la noche.',
    optionSafe: '🛌 Quedarse en la cama, proteger cabeza con la almohada boca abajo',
    optionDanger: '🏃 Levantarse de golpe y correr descalzo en la oscuridad',
    imageSafe: '/images/reflexes/adults/r6_safe.webp',
    imageDanger: '/images/reflexes/adults/r6_danger.webp',
    safeExplanation: '¡Excelente decisión! Evitás cortes severos por vidrios rotos en el suelo y caídas a oscuras.',
    dangerExplanation: '¡Riesgo de corte severo! Desplazarse a oscuras con el suelo sacudiéndose sobre vidrios causa heridas graves.'
  },
  {
    id: 'r7',
    contextTag: 'SUPERMERCADO / CENTRO COMERCIAL',
    icon: '🛒',
    situation: 'Comienza el sismo y tambalean góndolas con botellas y mercadería.',
    optionSafe: '🛡️ Alejarse de góndolas altas y protegerse en pasillo central',
    optionDanger: '🏃 Empujar en estampida hacia la puerta giratoria',
    imageSafe: '/images/reflexes/adults/r7_safe.webp',
    imageDanger: '/images/reflexes/adults/r7_danger.webp',
    safeExplanation: '¡Correcto! Evitás la caída de botellas y latas pesadas sin quedar atrapado en avalanchas humanas.',
    dangerExplanation: '¡Estampida humana! Empujar en salidas angostas provoca aplastamiento y asfixia masiva.'
  },
  {
    id: 'r8',
    contextTag: 'EVACUACIÓN POST-TERREMOTO',
    icon: '🚪',
    situation: 'Vas a salir de la vivienda hacia el punto de encuentro seguro.',
    optionSafe: '🎒 Calzado firme, llave en mano y la Mochila de 72 Horas',
    optionDanger: '💎 Demorarse rescatando televisores y joyas de valor',
    imageSafe: '/images/reflexes/adults/r8_safe.webp',
    imageDanger: '/images/reflexes/adults/r8_danger.webp',
    safeExplanation: '¡Prioridad correcta! La vida y la autonomía de 72 horas son lo único indispensable.',
    dangerExplanation: '¡Pérdida de tiempo crítico! Demorarse ante posibles réplicas pone en riesgo tu vida.'
  }
];

export const KIDS_REFLEX_SCENARIOS: ReflexScenario[] = [
  {
    id: 'kr1',
    contextTag: 'EN LA ESCUELA',
    icon: '🏫',
    situation: '¡Empieza a temblar el piso del aula!',
    optionSafe: '🛡️ ¡Me meto abajo del banco y me agarro!',
    optionDanger: '🏃 ¡Salgo corriendo empujando a todos!',
    imageSafe: '/images/reflexes/kids/kr1_safe.webp',
    imageDanger: '/images/reflexes/kids/kr1_danger.webp',
    safeExplanation: '¡Genial! Tu banco te protege como un escudo de cualquier cosa.',
    dangerExplanation: '¡Peligro! Correr y empujar causa caídas y golpes feos.'
  },
  {
    id: 'kr2',
    contextTag: 'EN CASA A OSCURAS',
    icon: '🔦',
    situation: 'Terminó el temblor y se cortó la luz.',
    optionSafe: '🔦 ¡Prendo una linterna a pilas con cuidado!',
    optionDanger: '🕯️ ¡Prendo fuego una vela con fósforos!',
    imageSafe: '/images/reflexes/kids/kr2_safe.webp',
    imageDanger: '/images/reflexes/kids/kr2_danger.webp',
    safeExplanation: '¡Muy bien! Las linternas dan luz segura sin peligro.',
    dangerExplanation: '¡Peligro! El fuego de la vela puede encender fugas de gas.'
  },
  {
    id: 'kr3',
    contextTag: 'EN LA PLAZA O EL PATIO',
    icon: '🌳',
    situation: 'Estás jugando afuera y se sacude el suelo.',
    optionSafe: '🌳 ¡Me quedo en el pasto, lejos de postes y cables!',
    optionDanger: '🏢 ¡Me pego a la pared abajo de un cartel gigante!',
    imageSafe: '/images/reflexes/kids/kr3_safe.webp',
    imageDanger: '/images/reflexes/kids/kr3_danger.webp',
    safeExplanation: '¡Perfecto! Al aire libre en el pasto estás súper seguro.',
    dangerExplanation: '¡Cuidado! Los carteles y vidrios pueden caer de las paredes.'
  },
  {
    id: 'kr4',
    contextTag: 'DE NOCHE EN TU PIEZA',
    icon: '🛌',
    situation: '¡Un temblor fuerte te despierta en tu cama!',
    optionSafe: '🛌 ¡Me tapo bien la cabeza con la almohada en la cama!',
    optionDanger: '🏃 ¡Salgo corriendo descalzo en la oscuridad!',
    imageSafe: '/images/reflexes/kids/kr4_safe.webp',
    imageDanger: '/images/reflexes/kids/kr4_danger.webp',
    safeExplanation: '¡Excelente reflejo! La almohada cuida tu cabeza.',
    dangerExplanation: '¡Cuidado! Correr a oscuras puede hacer que pises cosas rotas.'
  },
  {
    id: 'kr5',
    contextTag: 'SALIR DE CASA',
    icon: '🎒',
    situation: 'Vamos a salir con la familia al punto seguro.',
    optionSafe: '🎒 ¡Zapatillas puestas y la mochila de emergencia!',
    optionDanger: '🎮 ¡Quedarme a guardar la Play y los juguetes!',
    imageSafe: '/images/reflexes/kids/kr5_safe.webp',
    imageDanger: '/images/reflexes/kids/kr5_danger.webp',
    safeExplanation: '¡Prioridad correcta! La mochila tiene agua y cosas vitales.',
    dangerExplanation: '¡No! Lo más valioso sos vos, los juguetes se quedan.'
  },
  {
    id: 'kr6',
    contextTag: 'EN EL AUTO',
    icon: '🚗',
    situation: 'Vamos en el auto y sentimos que tiembla el camino.',
    optionSafe: '🛑 ¡Frenar despacito y esperar adentro del auto!',
    optionDanger: '⚡ ¡Acelerar a fondo para ir a toda velocidad!',
    imageSafe: '/images/reflexes/kids/kr6_safe.webp',
    imageDanger: '/images/reflexes/kids/kr6_danger.webp',
    safeExplanation: '¡Muy bien! Adentro del auto estamos protegidos.',
    dangerExplanation: '¡Peligro! Acelerar en un sismo hace perder el control.'
  }
];

interface SafeHomeGameProps {
  userMode?: UserMode;
  onFinishGame: (earnedScore: number, securedCount: number, totalCount: number, gameId?: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const SafeHomeGame: React.FC<SafeHomeGameProps> = ({
  userMode = 'kids',
  onFinishGame,
  onNavigate
}) => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  const roundTimeSec = userMode === 'kids' ? 6.5 : 4.0;
  const scenarios = isEs
    ? (userMode === 'kids' ? KIDS_REFLEX_SCENARIOS : REFLEX_SCENARIOS)
    : (userMode === 'kids' ? REFLEX_SCENARIOS_EN : REFLEX_SCENARIOS_EN);

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'feedback' | 'result'>('intro');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(roundTimeSec);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);
  const [shuffledOptions, setShuffledOptions] = useState<{ isSafe: boolean; text: string; image?: string }[]>([]);

  const currentScenario = scenarios[currentIndex] || scenarios[0];

  useEffect(() => {
    if (!currentScenario) return;
    const opts = [
      { isSafe: true, text: currentScenario.optionSafe, image: currentScenario.imageSafe },
      { isSafe: false, text: currentScenario.optionDanger, image: currentScenario.imageDanger }
    ].sort(() => 0.5 - Math.random());
    setShuffledOptions(opts);
  }, [currentIndex, currentScenario]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, parseFloat((prev - 0.1).toFixed(1))));
    }, 100);

    return () => clearInterval(interval);
  }, [timeLeft, gameState]);

  const handleTimeOut = () => {
    sound.playWrong();
    setLives(prev => Math.max(0, prev - 1));
    setStreak(0);
    setLastAnswerCorrect(false);
    setIsTimeOut(true);
    setGameState('feedback');
  };

  const handleSelectOption = (isSafe: boolean) => {
    if (gameState !== 'playing') return;

    setIsTimeOut(false);
    if (isSafe) {
      sound.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const speedBonus = timeLeft >= (roundTimeSec * 0.5) ? 50 : 0;
      const streakBonus = newStreak > 1 ? (newStreak - 1) * 30 : 0;
      const roundScore = 100 + speedBonus + streakBonus;

      setTotalScore(prev => prev + roundScore);
      setCorrectCount(prev => prev + 1);
      setLastAnswerCorrect(true);

      if (newStreak >= 2) {
        sound.playComboStreak(newStreak);
      }
    } else {
      sound.playWrong();
      setLives(prev => Math.max(0, prev - 1));
      setStreak(0);
      setLastAnswerCorrect(false);
    }

    setGameState('feedback');
  };

  const handleNextRound = () => {
    sound.playClick();
    if (lives <= 0 || currentIndex + 1 >= scenarios.length) {
      sound.playWinFanfare();
      setGameState('result');
      return;
    }

    setCurrentIndex(prev => prev + 1);
    setTimeLeft(roundTimeSec);
    setLastAnswerCorrect(null);
    setIsTimeOut(false);
    setGameState('playing');
  };

  const handleReplay = () => {
    setCurrentIndex(0);
    setTimeLeft(roundTimeSec);
    setLives(3);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setTotalScore(0);
    setGameState('intro');
  };

  const timePercent = (timeLeft / roundTimeSec) * 100;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 flex flex-col justify-between p-4 sm:p-5 pb-24 max-w-md mx-auto overflow-x-hidden"
      style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
    >
      <div className="fixed inset-0 bg-navy-950/85 pointer-events-none z-0" />

      {gameState === 'intro' && (
        <GameIntroCountdown
          title={isEs ? 'REFLEJOS DE SUPERVIVENCIA' : 'SURVIVAL REFLEXES'}
          category={isEs ? 'DECISIONES CRÍTICAS · MISIÓN 03' : 'CRITICAL DECISIONS · MISSION 03'}
          subtitle={isEs ? 'Tenés solo 4 segundos para reaccionar ante cada sismo' : 'You have only 4 seconds to react to each earthquake'}
          instructions={isEs
            ? 'En un terremoto real no hay tiempo para dudar. Elegí la acción segura en segundos, acumulá rachas de fuego y demostrá tus reflejos de supervivencia.'
            : 'In a real earthquake there is no time to hesitate. Choose the safe action in seconds, build fire streaks, and prove your survival reflexes.'}
          icon="⚡"
          rewardXp={600}
          timeLimitSec={userMode === 'kids' ? 6.5 : 4}
          onStart={() => setGameState('playing')}
        />
      )}

      {gameState === 'result' && (
        <GameResultScreen
          gameTitle={isEs ? 'Reflejos de Supervivencia' : 'Survival Reflexes'}
          earnedScore={totalScore}
          correctCount={correctCount}
          totalCount={scenarios.length}
          maxStreak={maxStreak}
          speedBonus={lives > 0 ? lives * 50 : 0}
          onReplay={handleReplay}
          onContinue={() => onFinishGame(totalScore, correctCount, scenarios.length, 'game-safe-home')}
        />
      )}

      {(gameState === 'playing' || gameState === 'feedback') && (
        <>
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() => { sound.playClick(); onNavigate(userMode === 'kids' ? 'kids' : 'adults'); }}
                className="w-10 h-10 rounded-full bg-navy-900/90 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan hover:bg-navy-800 active:scale-95 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-navy-900/90 border border-rose-500/40 shadow-sm">
                {[1, 2, 3].map((heartIdx) => (
                  <Heart
                    key={heartIdx}
                    className={`w-4 h-4 transition-all ${
                      heartIdx <= lives
                        ? 'text-rose-500 fill-rose-500 animate-pulse'
                        : 'text-slate-600 fill-slate-700 opacity-40'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {streak >= 2 && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-950 border border-orange-500 text-orange-400 font-black text-xs shadow-md animate-bounce">
                    <Flame className="w-3.5 h-3.5 fill-orange-500" /> x{streak}
                  </div>
                )}
                <div className="bg-navy-900/90 px-3 py-1 rounded-2xl border border-brand-gold/40 flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                  <span className="font-black text-xs text-brand-yellow tabular-nums">+{totalScore}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <div className="w-full h-2.5 rounded-full bg-navy-950 border border-white/10 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-100 ${
                    timeLeft > 2.0
                      ? 'bg-gradient-to-r from-brand-electric to-brand-cyan'
                      : timeLeft > 1.0
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                      : 'bg-rose-500 animate-pulse'
                  }`}
                  style={{ width: `${gameState === 'feedback' ? 100 : timePercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                <span>{isEs ? `Ronda ${currentIndex + 1} de ${scenarios.length}` : `Round ${currentIndex + 1} of ${scenarios.length}`}</span>
                <span className={timeLeft <= 1.2 ? 'text-rose-400 font-extrabold animate-pulse' : 'text-brand-cyan'}>
                  ⏱️ {timeLeft.toFixed(1)}s
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 my-auto py-2 space-y-3">
            <div className="sismo-card p-5 rounded-3xl border-brand-cyan/40 bg-navy-950/90 backdrop-blur-xl text-center space-y-2 shadow-2xl relative overflow-hidden">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/15 border border-brand-cyan/40 text-brand-cyan font-black text-[10px] uppercase tracking-wider">
                <span>{currentScenario.contextTag}</span>
              </div>

              <div className="py-2">
                <span className="text-6xl sm:text-7xl block filter drop-shadow animate-pulse">
                  {currentScenario.icon}
                </span>
              </div>

              <h2 className="font-black text-lg sm:text-xl text-white uppercase tracking-tight leading-tight">
                {currentScenario.situation}
              </h2>
            </div>

            {gameState === 'playing' && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                {shuffledOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt.isSafe)}
                    className="relative flex flex-col justify-between rounded-2xl overflow-hidden bg-gradient-to-b from-navy-900/95 to-navy-950/95 border-2 border-white/20 hover:border-brand-cyan hover:scale-[1.03] active:scale-[0.97] transition-all text-center p-2.5 shadow-xl group"
                  >
                    <div className="flex items-center justify-between w-full pb-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan font-black text-[9px] uppercase tracking-wider">
                        {idx === 0 ? (isEs ? 'OPCIÓN A' : 'OPTION A') : (isEs ? 'OPCIÓN B' : 'OPTION B')}
                      </span>
                      <Zap className="w-3.5 h-3.5 text-brand-cyan opacity-40 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-navy-900 border border-white/10 flex items-center justify-center mb-2 shadow-inner">
                      {opt.image ? (
                        <img
                          src={opt.image}
                          alt={opt.text}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : null}
                      <span className="text-3xl filter drop-shadow">
                        {opt.isSafe ? '🛡️' : '⚠️'}
                      </span>
                    </div>

                    <span className="font-extrabold text-[11px] sm:text-xs text-slate-100 group-hover:text-white leading-tight line-clamp-3">
                      {opt.text}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {gameState === 'feedback' && (
              <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className={`sismo-card p-4 rounded-2xl border-2 text-left space-y-2 ${
                  lastAnswerCorrect
                    ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                    : 'bg-rose-950/90 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                }`}>
                  <div className="flex items-center gap-2">
                    {lastAnswerCorrect ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                        <span className="font-black text-sm uppercase text-emerald-300">
                          {isEs ? '¡REFLEJO CORRECTO! (+100 XP)' : '¡CORRECT REFLEX! (+100 XP)'}
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                        <span className="font-black text-sm uppercase text-rose-300">
                          {isTimeOut
                            ? (isEs ? '¡TIEMPO AGOTADO!' : '¡TIME EXPIRED!')
                            : (isEs ? '¡ACCIÓN DE ALTO RIESGO! (-1 VIDA)' : '¡HIGH RISK ACTION! (-1 LIFE)')}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-xs font-medium leading-relaxed text-slate-200">
                    {lastAnswerCorrect ? currentScenario.safeExplanation : currentScenario.dangerExplanation}
                  </p>
                </div>

                <Button
                  variant={lastAnswerCorrect ? 'primary' : 'danger'}
                  size="md"
                  fullWidth
                  onClick={handleNextRound}
                >
                  <span>
                    {currentIndex + 1 >= scenarios.length || lives <= 0
                      ? (isEs ? 'Ver Resultados Finales' : 'View Final Results')
                      : (isEs ? 'Siguiente Situación ⚡' : 'Next Situation ⚡')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div />
        </>
      )}
    </div>
  );
};
