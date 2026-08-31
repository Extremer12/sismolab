import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb, Sparkles, Flame, ArrowRight, Timer, Zap } from 'lucide-react';
import { ScreenId, UserMode, Question } from '../../types';
import { getRandomQuestions } from '../../services/gamesService';
import { Button } from '../ui/Button';
import { sound } from '../../lib/sound';
import { GameIntroCountdown } from './GameIntroCountdown';
import { GameResultScreen } from './GameResultScreen';

interface WhatIsSeismicGameProps {
  userMode: UserMode;
  onFinishGame: (earnedScore: number, correctCount: number, totalCount: number, gameId?: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const WhatIsSeismicGame: React.FC<WhatIsSeismicGameProps> = ({
  userMode,
  onFinishGame,
  onNavigate
}) => {
  const timerLimit = userMode === 'kids' ? 20 : 15;

  // Game States: 'intro' | 'playing' | 'result'
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(() => getRandomQuestions(5, userMode));

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [earnedScore, setEarnedScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalSpeedBonus, setTotalSpeedBonus] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(timerLimit);
  const [speedBonusAwarded, setSpeedBonusAwarded] = useState(0);

  const question = activeQuestions[currentIdx] || activeQuestions[0];
  const progressPercent = ((currentIdx + 1) / activeQuestions.length) * 100;

  // Countdown timer per question
  useEffect(() => {
    if (gameState !== 'playing' || isAnswered) return;

    if (questionTimer <= 0) {
      handleSelectOption('timeout' as any);
      return;
    }

    const timer = setInterval(() => {
      setQuestionTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [questionTimer, isAnswered, gameState]);

  const handleSelectOption = (key: 'a' | 'b' | 'c' | 'd' | 'timeout') => {
    if (isAnswered) return;
    setSelectedOption(key);
    setIsAnswered(true);

    const isCorrect = key === question.correct_option;

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const baseScore = question.points || 100;
      const speedBonus = questionTimer > (timerLimit / 2) ? Math.round(questionTimer * (userMode === 'kids' ? 3 : 5)) : 0;
      const streakBonus = newStreak > 1 ? 25 * (newStreak - 1) : 0;
      const roundScore = baseScore + speedBonus + streakBonus;

      setSpeedBonusAwarded(speedBonus);
      setTotalSpeedBonus(prev => prev + speedBonus);
      setEarnedScore(prev => prev + roundScore);
      setCorrectCount(prev => prev + 1);

      if (newStreak >= 2) {
        sound.playComboStreak(newStreak);
      } else {
        sound.playCorrect();
      }
    } else {
      setStreak(0);
      setSpeedBonusAwarded(0);
      sound.playWrong();
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIdx + 1 < activeQuestions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setQuestionTimer(timerLimit);
      setSpeedBonusAwarded(0);
    } else {
      setGameState('result');
    }
  };

  const handleReplay = () => {
    setActiveQuestions(getRandomQuestions(5, userMode));
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setEarnedScore(0);
    setCorrectCount(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalSpeedBonus(0);
    setQuestionTimer(timerLimit);
    setGameState('intro');
  };

  const handleContinue = () => {
    onFinishGame(earnedScore, correctCount, activeQuestions.length, 'game-what-is');
  };

  const options = [
    { key: 'a' as const, text: question.option_a },
    { key: 'b' as const, text: question.option_b },
    ...(question.option_c ? [{ key: 'c' as const, text: question.option_c }] : []),
    ...(question.option_d ? [{ key: 'd' as const, text: question.option_d }] : [])
  ];

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 flex flex-col justify-between p-4 sm:p-5 pb-24 max-w-md mx-auto overflow-x-hidden"
      style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
    >
      <div className="fixed inset-0 bg-navy-950/85 pointer-events-none z-0" />

      {/* 1. INTRO COUNTDOWN SCREEN */}
      {gameState === 'intro' && (
        <GameIntroCountdown
          title="¿QUÉ ES UN SISMO?"
          category="CIENCIA SÍSMICA · MISIÓN 01"
          subtitle="Física de placas tectónicas y registro instrumental INPRES"
          instructions="Respondé 5 preguntas rápidas. Cuanto más rápido y preciso seas, mayores bonificaciones de velocidad y racha obtendrás."
          icon="🌍"
          rewardXp={500}
          timeLimitSec={15}
          onStart={() => setGameState('playing')}
        />
      )}

      {/* 2. GAME OVER / RESULT SCREEN */}
      {gameState === 'result' && (
        <GameResultScreen
          gameTitle="¿Qué es un Sismo?"
          earnedScore={earnedScore}
          correctCount={correctCount}
          totalCount={activeQuestions.length}
          maxStreak={maxStreak}
          speedBonus={totalSpeedBonus}
          onReplay={handleReplay}
          onContinue={handleContinue}
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
                className="w-10 h-10 rounded-full bg-navy-900/90 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan hover:bg-navy-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Streak Flame Badge */}
              {streak >= 2 && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-950/90 border border-orange-500 text-orange-400 font-black text-xs animate-bounce shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                  <Flame className="w-4 h-4 fill-orange-500" />
                  <span>RACHA x{streak} (+{(streak - 1) * 30} XP)</span>
                </div>
              )}

              {/* Quick Score */}
              <div className="flex items-center gap-1.5 bg-navy-900/90 px-3 py-1 rounded-2xl border border-brand-gold/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span className="font-black text-xs text-brand-yellow tabular-nums">+{earnedScore} pts</span>
              </div>
            </div>

            {/* Progress & Speed Timer Bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-400">
                <span>PREGUNTA {currentIdx + 1} DE {activeQuestions.length}</span>
                <span className={`flex items-center gap-1 font-black text-xs ${questionTimer <= 5 ? 'text-rose-400 animate-pulse' : 'text-brand-cyan'}`}>
                  <Timer className="w-3.5 h-3.5" />
                  <span>{questionTimer}s</span>
                </span>
              </div>

              <div className="w-full h-2.5 bg-navy-900 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    questionTimer <= 5 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'bg-gradient-to-r from-brand-electric to-brand-cyan'
                  }`}
                  style={{ width: `${(questionTimer / timerLimit) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Center Question & Options */}
          <div className="relative z-10 my-auto space-y-3.5 py-2">
            {/* Question Card */}
            <div className="sismo-card p-4 sm:p-5 space-y-2 border-2 border-brand-cyan/40 bg-navy-950/90 backdrop-blur-xl shadow-glow-cyan/20">
              {/* Question Image (if present) */}
              {question.image_url && (
                <div className="relative w-full aspect-[16/8.5] sm:aspect-[16/8] rounded-2xl overflow-hidden border border-brand-cyan/30 shadow-md bg-navy-900 flex items-center justify-center">
                  <img
                    src={question.image_url}
                    alt={question.question}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-navy-950/80 border border-brand-cyan/40 text-brand-cyan font-black text-[9px] uppercase tracking-wider backdrop-blur-md">
                    {userMode === 'kids' ? 'MODO NIÑOS' : 'INPRES'}
                  </div>
                </div>
              )}

              <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest block pt-0.5">
                {userMode === 'kids' ? 'DESAFÍO SÍSMICO' : 'CIENCIA SÍSMICA'} · NIVEL {question.difficulty.toUpperCase()}
              </span>
              <h2 className="font-black text-base sm:text-lg text-white leading-snug">
                {question.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {options.map((opt) => {
                const isSelected = selectedOption === opt.key;
                const isCorrect = opt.key === question.correct_option;

                let btnStyle = 'border border-white/15 bg-navy-950/80 hover:border-brand-cyan/50 text-slate-200';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/90 border-2 border-emerald-400 text-emerald-100 font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)]';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-950/90 border-2 border-rose-500 text-rose-100 font-bold animate-shake';
                  } else {
                    btnStyle = 'opacity-40 border-white/5 bg-navy-950/60';
                  }
                }

                return (
                  <button
                    key={opt.key}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.98] ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-navy-900 border border-white/10 flex items-center justify-center font-black text-xs text-brand-cyan shrink-0 uppercase">
                        {opt.key}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold leading-snug">
                        {opt.text}
                      </span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Dynamic In-place Feedback Sheet */}
            {isAnswered && (
              <div className="sismo-card p-4 space-y-2.5 border-brand-cyan/50 bg-navy-900/90 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-brand-yellow shrink-0" />
                    <h3 className="font-black text-xs sm:text-sm text-white">
                      {selectedOption === question.correct_option ? '¡EXCELENTE RESPUESTA!' : 'EXPLICACIÓN INPRES:'}
                    </h3>
                  </div>

                  {speedBonusAwarded > 0 && (
                    <span className="text-[10px] font-black text-brand-yellow uppercase flex items-center gap-1 bg-amber-950/80 px-2 py-0.5 rounded-md border border-brand-gold/40">
                      <Zap className="w-3 h-3 text-brand-gold" /> +{speedBonusAwarded} VELOZ
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {question.explanation}
                </p>

                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleNext}
                  className="mt-1"
                >
                  <span>{currentIdx + 1 < activeQuestions.length ? 'Siguiente Pregunta' : 'Ver Resultados (+XP)'}</span>
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
