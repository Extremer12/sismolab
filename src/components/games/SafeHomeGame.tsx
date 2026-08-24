import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Timer, Heart, Zap, Flame, ShieldAlert, ShieldCheck, AlertTriangle, ArrowRight, Sparkles, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { ScreenId, UserMode } from '../../types';
import { Button } from '../ui/Button';
import { sound } from '../../lib/sound';
import { GameIntroCountdown } from './GameIntroCountdown';
import { GameResultScreen } from './GameResultScreen';

interface ReflexScenario {
  id: string;
  contextTag: string;
  icon: string;
  situation: string;
  optionSafe: string;
  optionDanger: string;
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
    safeExplanation: '¡Prioridad correcta! La vida y la autonomía de 72 horas son lo único indispensable.',
    dangerExplanation: '¡Pérdida de tiempo crítico! Demorarse ante posibles réplicas pone en riesgo tu vida.'
  }
];

interface SafeHomeGameProps {
  userMode?: UserMode;
  onFinishGame: (earnedScore: number, securedCount: number, totalCount: number, gameId?: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

const ROUND_TIME_SEC = 4.0;

export const SafeHomeGame: React.FC<SafeHomeGameProps> = ({
  userMode = 'kids',
  onFinishGame,
  onNavigate
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'feedback' | 'result'>('intro');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(ROUND_TIME_SEC);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);
  const [shuffledOptions, setShuffledOptions] = useState<{ isSafe: boolean; text: string }[]>([]);

  const currentScenario = REFLEX_SCENARIOS[currentIndex];

  // Shuffle button options on new round
  useEffect(() => {
    if (!currentScenario) return;
    const opts = [
      { isSafe: true, text: currentScenario.optionSafe },
      { isSafe: false, text: currentScenario.optionDanger }
    ].sort(() => Math.random() - 0.5);
    setShuffledOptions(opts);
    setTimeLeft(ROUND_TIME_SEC);
    setIsTimeOut(false);
    setLastAnswerCorrect(null);
  }, [currentIndex]);

  // Fast countdown timer
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
    setIsTimeOut(true);
    setLastAnswerCorrect(false);
    setStreak(0);
    const newLives = lives - 1;
    setLives(newLives);
    setGameState('feedback');
  };

  const handleSelectOption = (isSafe: boolean) => {
    if (gameState !== 'playing') return;

    if (isSafe) {
      sound.playPackItem();
      const speedBonus = timeLeft > 2.0 ? 50 : 20;
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const roundScore = 100 + speedBonus + (newStreak > 1 ? 25 * (newStreak - 1) : 0);
      setTotalScore(prev => prev + roundScore);
      setCorrectCount(prev => prev + 1);
      setLastAnswerCorrect(true);
      setGameState('feedback');
    } else {
      sound.playWrong();
      setStreak(0);
      const newLives = lives - 1;
      setLives(newLives);
      setLastAnswerCorrect(false);
      setGameState('feedback');
    }
  };

  const handleNextRound = () => {
    if (lives <= 0 || currentIndex + 1 >= REFLEX_SCENARIOS.length) {
      sound.playWinFanfare();
      setGameState('result');
    } else {
      setCurrentIndex(prev => prev + 1);
      setGameState('playing');
    }
  };

  const handleReplay = () => {
    setCurrentIndex(0);
    setLives(3);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setTotalScore(0);
    setGameState('intro');
  };

  const timePercent = (timeLeft / ROUND_TIME_SEC) * 100;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 flex flex-col justify-between p-4 sm:p-5 pb-24 max-w-md mx-auto overflow-x-hidden"
      style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
    >
      <div className="fixed inset-0 bg-navy-950/85 pointer-events-none z-0" />

      {/* 1. INTRO SCREEN */}
      {gameState === 'intro' && (
        <GameIntroCountdown
          title="REFLEJOS DE SUPERVIVENCIA"
          category="DECISIONES CRÍTICAS · MISIÓN 03"
          subtitle="Tenés solo 4 segundos para reaccionar ante cada sismo"
          instructions="En un terremoto real no hay tiempo para dudar. Elegí la acción segura en segundos, acumulá rachas de fuego y demostrá tus reflejos de supervivencia."
          icon="⚡"
          rewardXp={600}
          timeLimitSec={4}
          onStart={() => setGameState('playing')}
        />
      )}

      {/* 2. RESULT SCREEN */}
      {gameState === 'result' && (
        <GameResultScreen
          gameTitle="Reflejos de Supervivencia"
          earnedScore={totalScore}
          correctCount={correctCount}
          totalCount={REFLEX_SCENARIOS.length}
          maxStreak={maxStreak}
          speedBonus={lives > 0 ? lives * 50 : 0}
          onReplay={handleReplay}
          onContinue={() => onFinishGame(totalScore, correctCount, REFLEX_SCENARIOS.length, 'game-safe-home')}
        />
      )}

      {/* 3. ACTIVE PLAYING & FEEDBACK STATES */}
      {(gameState === 'playing' || gameState === 'feedback') && (
        <>
          {/* Top Status Bar */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() => { sound.playClick(); onNavigate(userMode === 'kids' ? 'kids' : 'adults'); }}
                className="w-10 h-10 rounded-full bg-navy-900/90 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan hover:bg-navy-800 active:scale-95 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Lives (Hearts) */}
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

              {/* Score & Streak */}
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

            {/* Rapid Countdown Progress Bar */}
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
                <span>Ronda {currentIndex + 1} de {REFLEX_SCENARIOS.length}</span>
                <span className={timeLeft <= 1.2 ? 'text-rose-400 font-extrabold animate-pulse' : 'text-brand-cyan'}>
                  ⏱️ {timeLeft.toFixed(1)}s
                </span>
              </div>
            </div>
          </div>

          {/* Scenario Center Card */}
          <div className="relative z-10 my-auto py-2 space-y-3">
            <div className="sismo-card p-5 rounded-3xl border-brand-cyan/40 bg-navy-950/90 backdrop-blur-xl text-center space-y-2 shadow-2xl relative overflow-hidden">
              {/* Context Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/15 border border-brand-cyan/40 text-brand-cyan font-black text-[10px] uppercase tracking-wider">
                <span>{currentScenario.contextTag}</span>
              </div>

              {/* Central Icon & Danger Tremor Visual */}
              <div className="py-2">
                <span className="text-6xl sm:text-7xl block filter drop-shadow animate-pulse">
                  {currentScenario.icon}
                </span>
              </div>

              {/* The Situation Text */}
              <h2 className="font-black text-lg sm:text-xl text-white uppercase tracking-tight leading-tight">
                {currentScenario.situation}
              </h2>
            </div>

            {/* Decision Buttons (Playing State) */}
            {gameState === 'playing' && (
              <div className="space-y-2.5 pt-1">
                {shuffledOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt.isSafe)}
                    className="w-full p-4 rounded-2xl bg-gradient-to-r from-navy-900/90 to-navy-950 border-2 border-white/20 hover:border-brand-cyan hover:bg-navy-850 active:scale-[0.98] transition-all text-left flex items-center justify-between group shadow-lg"
                  >
                    <span className="font-extrabold text-sm sm:text-base text-slate-100 group-hover:text-white leading-snug">
                      {opt.text}
                    </span>
                    <Zap className="w-5 h-5 text-brand-cyan opacity-50 group-hover:opacity-100 shrink-0 ml-2 group-hover:scale-110 transition-transform" />
                  </button>
                ))}
              </div>
            )}

            {/* Immediate Educational Feedback (Feedback State) */}
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
                          ¡REFLEJO CORRECTO! (+100 XP)
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                        <span className="font-black text-sm uppercase text-rose-300">
                          {isTimeOut ? '¡TIEMPO AGOTADO!' : '¡ACCIÓN DE ALTO RIESGO! (-1 VIDA)'}
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
                  <span>{currentIndex + 1 >= REFLEX_SCENARIOS.length || lives <= 0 ? 'Ver Resultados Finales' : 'Siguiente Situación ⚡'}</span>
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
