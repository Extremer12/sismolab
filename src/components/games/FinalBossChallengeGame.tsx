import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Sparkles, ArrowRight, Flame, Trophy, Zap, Timer, Crown, AlertTriangle } from 'lucide-react';
import { ScreenId, UserMode } from '../../types';
import { getRandomQuestions, getRandomMyths, getRandomScenarios } from '../../services/gamesService';
import { Button } from '../ui/Button';
import { sound } from '../../lib/sound';
import { GameIntroCountdown } from './GameIntroCountdown';
import { GameResultScreen } from './GameResultScreen';
import { useLanguage } from '../../i18n/LanguageContext';

interface FinalBossChallengeGameProps {
  userMode: UserMode;
  onFinishGame: (earnedScore: number, correctCount: number, totalCount: number, gameId?: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

type ChallengeStep = 
  | { type: 'quiz'; data: ReturnType<typeof getRandomQuestions>[0] }
  | { type: 'myth'; data: ReturnType<typeof getRandomMyths>[0] }
  | { type: 'scenario'; data: ReturnType<typeof getRandomScenarios>[0] };

export const FinalBossChallengeGame: React.FC<FinalBossChallengeGameProps> = ({
  userMode,
  onFinishGame,
  onNavigate
}) => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  const bossTimeLimit = userMode === 'kids' ? 16 : 12;
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');

  const generateSteps = (): ChallengeStep[] => {
    const q = getRandomQuestions(2, userMode, language);
    const m = getRandomMyths(2, userMode, language);
    const s = getRandomScenarios(2, userMode, language);
    return [
      { type: 'quiz', data: q[0] },
      { type: 'myth', data: m[0] },
      { type: 'quiz', data: q[1] },
      { type: 'myth', data: m[1] },
      { type: 'scenario', data: s[0] },
      { type: 'scenario', data: s[1] }
    ];
  };

  // Build a 6-step final gauntlet: 2 Science + 2 Myths + 2 Crisis Scenarios
  const [steps, setSteps] = useState<ChallengeStep[]>(generateSteps);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<any>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [earnedScore, setEarnedScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timer, setTimer] = useState(bossTimeLimit);

  const step = steps[currentIdx] || steps[0];

  // Boss countdown timer per step
  useEffect(() => {
    if (gameState !== 'playing' || isAnswered) return;

    if (timer <= 0) {
      handleSelectAnswer('timeout');
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isAnswered, gameState]);

  const handleSelectAnswer = (choice: any) => {
    if (isAnswered) return;
    setSelectedChoice(choice);
    setIsAnswered(true);

    let isCorrect = false;
    if (step.type === 'quiz') {
      isCorrect = choice === step.data.correct_option;
    } else if (step.type === 'myth') {
      isCorrect = choice === step.data.isReality;
    } else if (step.type === 'scenario') {
      const chosen = step.data.options.find(o => o.id === choice);
      isCorrect = !!chosen?.isCorrect;
    }

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const speedBonus = timer >= 8 ? 50 : 0;
      const points = 150 + speedBonus + (newStreak > 1 ? 40 * (newStreak - 1) : 0);
      setEarnedScore(prev => prev + points);
      setCorrectCount(prev => prev + 1);

      if (newStreak >= 2) {
        sound.playComboStreak(newStreak);
      } else {
        sound.playCorrect();
      }
    } else {
      setStreak(0);
      sound.playWrong();
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIdx + 1 < steps.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedChoice(null);
      setIsAnswered(false);
      setTimer(bossTimeLimit);
    } else {
      sound.playWinFanfare();
      setGameState('result');
    }
  };

  const handleReplay = () => {
    setSteps(generateSteps());
    setCurrentIdx(0);
    setSelectedChoice(null);
    setIsAnswered(false);
    setEarnedScore(0);
    setCorrectCount(0);
    setStreak(0);
    setMaxStreak(0);
    setTimer(bossTimeLimit);
    setGameState('intro');
  };

  const getStepTitle = () => {
    if (step.type === 'quiz') return isEs ? 'Fase de Sismología' : 'Seismology Phase';
    if (step.type === 'myth') return isEs ? 'Fase de Mitos y Verdades' : 'Myths & Facts Phase';
    return isEs ? 'Fase de Decisión en Crisis' : 'Crisis Decision Phase';
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 flex flex-col justify-between p-4 sm:p-5 pb-24 max-w-md mx-auto overflow-x-hidden"
      style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
    >
      <div className="fixed inset-0 bg-navy-950/85 pointer-events-none z-0" />

      {/* 1. INTRO COUNTDOWN */}
      {gameState === 'intro' && (
        <GameIntroCountdown
          title={isEs ? 'GRAN DESAFÍO FINAL' : 'GRAND FINAL CHALLENGE'}
          category={isEs ? 'MISIÓN 06 · PRUEBA SUPREMA' : 'MISSION 06 · SUPREME TEST'}
          subtitle={isEs ? 'La prueba definitiva para graduarte como Experto Sísmico' : 'The ultimate test to graduate as a Seismic Expert'}
          instructions={isEs
            ? '6 rondas extremas combinando Ciencia, Mitos y Decisiones de Emergencia contra el reloj. ¡Conseguí la máxima puntuación del stand!'
            : '6 extreme rounds combining Science, Myths, and Emergency Decisions against the clock. Achieve the top booth score!'}
          icon="🏆"
          rewardXp={1000}
          timeLimitSec={12}
          onStart={() => setGameState('playing')}
        />
      )}

      {/* 2. RESULT SCREEN */}
      {gameState === 'result' && (
        <GameResultScreen
          gameTitle={isEs ? 'Gran Desafío Final' : 'Grand Final Challenge'}
          earnedScore={earnedScore + (correctCount === steps.length ? 300 : 0)}
          correctCount={correctCount}
          totalCount={steps.length}
          maxStreak={maxStreak}
          speedBonus={correctCount === steps.length ? 300 : 0}
          onReplay={handleReplay}
          onContinue={() => onFinishGame(earnedScore + (correctCount === steps.length ? 300 : 0), correctCount, steps.length, 'game-final-challenge')}
        />
      )}

      {/* 3. ACTIVE GAME PLAYING */}
      {gameState === 'playing' && (
        <>
          {/* Header */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => { sound.playClick(); onNavigate(userMode === 'kids' ? 'kids' : 'adults'); }}
                className="w-10 h-10 rounded-full bg-navy-900/90 border border-brand-gold/50 flex items-center justify-center text-brand-gold hover:bg-navy-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Streak Badge */}
              {streak >= 2 && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-950/90 border border-orange-500 text-orange-400 font-black text-xs animate-bounce shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                  <Flame className="w-4 h-4 fill-orange-500" />
                  <span>{isEs ? `RACHA x${streak}` : `STREAK x${streak}`}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 bg-navy-900/90 px-3 py-1 rounded-2xl border border-brand-gold/50 shadow-glow-gold/30">
                <Crown className="w-4 h-4 text-brand-yellow" />
                <span className="font-black text-xs text-brand-yellow tabular-nums">+{earnedScore} pts</span>
              </div>
            </div>

            {/* Boss Timer & Progress */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-400">
                <span className="text-brand-gold">{getStepTitle()} ({currentIdx + 1}/{steps.length})</span>
                <span className={`flex items-center gap-1 font-black text-xs ${timer <= 4 ? 'text-rose-400 animate-pulse' : 'text-brand-yellow'}`}>
                  <Timer className="w-3.5 h-3.5" />
                  <span>{timer}s</span>
                </span>
              </div>

              <div className="w-full h-2.5 bg-navy-900 rounded-full overflow-hidden p-0.5 border border-brand-gold/30">
                <div
                  className="h-full bg-gradient-to-r from-brand-yellow via-amber-500 to-yellow-400 rounded-full transition-all duration-1000"
                  style={{ width: `${(timer / 12) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Dynamic Content based on step type */}
          <div className="relative z-10 my-auto space-y-3.5 py-2">
            {/* Step Card */}
            <div className="sismo-card p-4 sm:p-5 space-y-2 border-2 border-brand-gold/60 bg-navy-950/90 backdrop-blur-xl shadow-glow-gold/20">
              {step.type === 'quiz' && step.data.image_url && (
                <div className="relative w-full aspect-[16/8.5] sm:aspect-[16/8] rounded-2xl overflow-hidden border border-brand-gold/30 shadow-md bg-navy-900 flex items-center justify-center">
                  <img
                    src={step.data.image_url}
                    alt={step.data.question}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-navy-950/80 border border-brand-gold/40 text-brand-yellow font-black text-[9px] uppercase tracking-wider backdrop-blur-md">
                    {isEs ? 'DESAFÍO FINAL' : 'FINAL CHALLENGE'}
                  </div>
                </div>
              )}

              <span className="text-[10px] font-black text-brand-yellow uppercase tracking-widest block pt-0.5">
                {getStepTitle()}
              </span>
              <h2 className="font-black text-base sm:text-lg text-white leading-snug">
                {step.type === 'quiz' && step.data.question}
                {step.type === 'myth' && `"${step.data.statement}"`}
                {step.type === 'scenario' && step.data.situation}
              </h2>
            </div>

            {/* Step Options */}
            {step.type === 'quiz' && (
              <div className="space-y-2.5">
                {[
                  { key: 'a', text: step.data.option_a },
                  { key: 'b', text: step.data.option_b },
                  ...(step.data.option_c ? [{ key: 'c', text: step.data.option_c }] : []),
                  ...(step.data.option_d ? [{ key: 'd', text: step.data.option_d }] : [])
                ].map(opt => {
                  const isSelected = selectedChoice === opt.key;
                  const isCorrect = opt.key === step.data.correct_option;
                  let style = 'border-white/15 bg-navy-950/80 hover:border-brand-gold/60 text-slate-200';
                  if (isAnswered) {
                    if (isCorrect) style = 'bg-emerald-950/95 border-2 border-emerald-400 text-emerald-100 font-bold';
                    else if (isSelected && !isCorrect) style = 'bg-rose-950/95 border-2 border-rose-500 text-rose-100 animate-shake';
                    else style = 'opacity-40 border-white/5 bg-navy-950/60';
                  }

                  return (
                    <button
                      key={opt.key}
                      disabled={isAnswered}
                      onClick={() => handleSelectAnswer(opt.key)}
                      className={`w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all border ${style}`}
                    >
                      <span className="text-xs sm:text-sm font-semibold">{opt.text}</span>
                      {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />}
                      {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            )}

            {step.type === 'myth' && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  disabled={isAnswered}
                  onClick={() => handleSelectAnswer(false)}
                  className={`h-16 rounded-2xl border-2 font-black text-base uppercase flex items-center justify-center gap-2 transition-all ${
                    isAnswered
                      ? !step.data.isReality
                        ? 'bg-emerald-950/95 border-emerald-400 text-emerald-200'
                        : 'opacity-40 border-white/10'
                      : 'bg-rose-950/90 border-rose-500 text-rose-100 hover:scale-105 active:scale-95'
                  }`}
                >
                  <span>{isEs ? '❌ MITO' : '❌ MYTH'}</span>
                </button>

                <button
                  disabled={isAnswered}
                  onClick={() => handleSelectAnswer(true)}
                  className={`h-16 rounded-2xl border-2 font-black text-base uppercase flex items-center justify-center gap-2 transition-all ${
                    isAnswered
                      ? step.data.isReality
                        ? 'bg-emerald-950/95 border-emerald-400 text-emerald-200'
                        : 'opacity-40 border-white/10'
                      : 'bg-emerald-950/90 border-emerald-400 text-emerald-100 hover:scale-105 active:scale-95'
                  }`}
                >
                  <span>{isEs ? '✅ REALIDAD' : '✅ REALITY'}</span>
                </button>
              </div>
            )}

            {step.type === 'scenario' && (
              <div className="space-y-2.5">
                {step.data.options.map(opt => {
                  const isSelected = selectedChoice === opt.id;
                  let style = 'border-white/15 bg-navy-950/80 hover:border-brand-gold/60 text-slate-200';
                  if (isAnswered) {
                    if (opt.isCorrect) style = 'bg-emerald-950/95 border-2 border-emerald-400 text-emerald-100 font-bold';
                    else if (isSelected && !opt.isCorrect) style = 'bg-rose-950/95 border-2 border-rose-500 text-rose-100 animate-shake';
                    else style = 'opacity-40 border-white/5 bg-navy-950/60';
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={isAnswered}
                      onClick={() => handleSelectAnswer(opt.id)}
                      className={`w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all border ${style}`}
                    >
                      <span className="text-xs sm:text-sm font-semibold">{opt.text}</span>
                      {isAnswered && opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />}
                      {isAnswered && isSelected && !opt.isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Answer Feedback Button */}
            {isAnswered && (
              <div className="pt-2">
                <Button
                  variant="gold"
                  size="md"
                  fullWidth
                  onClick={handleNext}
                >
                  <span>{currentIdx + 1 < steps.length ? (isEs ? 'Siguiente Desafío Boss' : 'Next Boss Challenge') : (isEs ? '¡Ver Coronación Final!' : 'View Final Coronation!')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="h-2"></div>
        </>
      )}
    </div>
  );
};
