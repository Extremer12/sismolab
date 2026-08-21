import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb, Sparkles, Flame, ArrowRight, Timer, Zap } from 'lucide-react';
import { ScreenId, UserMode } from '../../types';
import { WHAT_IS_SEISMIC_QUESTIONS } from '../../services/gamesService';
import { Button } from '../ui/Button';
import { sound } from '../../lib/sound';

interface WhatIsSeismicGameProps {
  userMode: UserMode;
  onFinishGame: (earnedScore: number, correctCount: number, totalCount: number) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const WhatIsSeismicGame: React.FC<WhatIsSeismicGameProps> = ({
  userMode,
  onFinishGame,
  onNavigate
}) => {
  // Use first 3 questions for a fast ~45s round
  const activeQuestions = WHAT_IS_SEISMIC_QUESTIONS.slice(0, 3);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [earnedScore, setEarnedScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(15);
  const [speedBonusAwarded, setSpeedBonusAwarded] = useState(0);

  const question = activeQuestions[currentIdx];
  const progressPercent = ((currentIdx + 1) / activeQuestions.length) * 100;

  // Countdown timer per question
  useEffect(() => {
    if (isAnswered) return;

    if (questionTimer <= 0) {
      // Time expired
      handleSelectOption('timeout' as any);
      return;
    }

    const timer = setInterval(() => {
      setQuestionTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [questionTimer, isAnswered]);

  const handleSelectOption = (key: 'a' | 'b' | 'c' | 'd' | 'timeout') => {
    if (isAnswered) return;
    setSelectedOption(key);
    setIsAnswered(true);

    const isCorrect = key === question.correct_option;

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);

      // Speed bonus if answered in <= 5 seconds
      const speedBonus = questionTimer >= 10 ? 50 : 0;
      setSpeedBonusAwarded(speedBonus);

      // Streak multiplier bonus
      const streakBonus = (newStreak - 1) * 25;
      const totalQuestionPoints = question.points + speedBonus + streakBonus;

      setEarnedScore(prev => prev + totalQuestionPoints);
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
      setQuestionTimer(15);
      setSpeedBonusAwarded(0);
    } else {
      onFinishGame(earnedScore, correctCount, activeQuestions.length);
    }
  };

  const options = [
    { key: 'a' as const, text: question.option_a },
    { key: 'b' as const, text: question.option_b },
    ...(question.option_c ? [{ key: 'c' as const, text: question.option_c }] : []),
    ...(question.option_d ? [{ key: 'd' as const, text: question.option_d }] : [])
  ];

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 flex flex-col justify-between p-4 sm:p-5 pb-24 max-w-md mx-auto"
      style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
    >
      <div className="fixed inset-0 bg-navy-950/80 pointer-events-none z-0" />

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
              <span>RACHA x{streak} (+{ (streak - 1) * 25 } XP)</span>
            </div>
          )}

          {/* Quick Score */}
          <div className="flex items-center gap-1.5 bg-navy-900/90 px-3 py-1 rounded-2xl border border-brand-gold/40">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span className="font-black text-xs text-brand-yellow tabular-nums">+{earnedScore} pts</span>
          </div>
        </div>

        {/* Progress & Speed Timer Bar */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] font-black text-slate-400">
            <span>PREGUNTA {currentIdx + 1} DE {activeQuestions.length}</span>
            <span className={`flex items-center gap-1 ${questionTimer <= 5 ? 'text-rose-400 animate-pulse' : 'text-brand-cyan'}`}>
              <Timer className="w-3 h-3" />
              <span>{questionTimer}s</span>
            </span>
          </div>

          <div className="w-full h-2 bg-navy-900 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                questionTimer <= 5 ? 'bg-rose-500' : 'bg-gradient-to-r from-brand-electric to-brand-cyan'
              }`}
              style={{ width: `${(questionTimer / 15) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Center Question & Options */}
      <div className="relative z-10 my-auto space-y-3.5 py-2">
        {/* Question Card */}
        <div className="sismo-card p-5 space-y-1.5 border-2 border-brand-cyan/40 bg-navy-950/85 backdrop-blur-xl shadow-glow-cyan/20">
          <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest block">
            CIENCIA SÍSMICA · RONDA RÁPIDA
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
                  <span className="w-7 h-7 rounded-xl bg-navy-900 border border-white/10 flex items-center justify-center font-black text-xs text-brand-cyan shrink-0 uppercase">
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
          <div className="sismo-card p-4 space-y-2 border-brand-cyan/50 bg-navy-900/90 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
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
              <span>{currentIdx + 1 < activeQuestions.length ? 'Siguiente Pregunta' : 'Finalizar Ronda (+XP)'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="h-2"></div>
    </div>
  );
};
