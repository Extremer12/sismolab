import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Sparkles, ArrowRight, Flame, ShieldAlert } from 'lucide-react';
import { ScreenId } from '../../types';
import { SCENARIO_CHOICES } from '../../services/gamesService';
import { Button } from '../ui/Button';
import { sound } from '../../lib/sound';

interface WhatWouldYouDoGameProps {
  onFinishGame: (earnedScore: number, correctCount: number, totalCount: number) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const WhatWouldYouDoGame: React.FC<WhatWouldYouDoGameProps> = ({
  onFinishGame,
  onNavigate
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [earnedScore, setEarnedScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);

  const scenario = SCENARIO_CHOICES[currentIdx];
  const progressPercent = ((currentIdx + 1) / SCENARIO_CHOICES.length) * 100;

  const handleSelectOption = (optId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optId);
    setIsAnswered(true);

    const chosen = scenario.options.find(o => o.id === optId);
    if (chosen?.isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setEarnedScore(prev => prev + 120 + (newStreak > 1 ? 30 * (newStreak - 1) : 0));
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
    if (currentIdx + 1 < SCENARIO_CHOICES.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      onFinishGame(earnedScore, correctCount, SCENARIO_CHOICES.length);
    }
  };

  const chosenOpt = scenario.options.find(o => o.id === selectedOptionId);

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
            onClick={() => { sound.playClick(); onNavigate('home'); }}
            className="w-10 h-10 rounded-full bg-navy-900/90 border border-brand-purple/50 flex items-center justify-center text-purple-300 hover:bg-navy-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Streak Badge */}
          {streak >= 2 && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-950/90 border border-orange-500 text-orange-400 font-black text-xs animate-bounce shadow-[0_0_15px_rgba(249,115,22,0.4)]">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span>RACHA x{streak}</span>
            </div>
          )}

          <div className="flex items-center gap-1 bg-navy-900/90 px-3 py-1 rounded-2xl border border-brand-gold/40">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span className="font-black text-xs text-brand-yellow tabular-nums">+{earnedScore} pts</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-navy-900 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-brand-purple to-brand-cyan rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Center Scenario Content */}
      <div className="relative z-10 my-auto space-y-3.5 py-2">
        <div className="sismo-card p-5 space-y-2 border-2 border-brand-purple/50 bg-navy-950/85 backdrop-blur-xl shadow-glow-purple/20">
          <div className="flex items-center gap-3">
            <span className="text-4xl shrink-0">{scenario.icon}</span>
            <div>
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider block">
                {scenario.scenarioTitle}
              </span>
              <h2 className="font-black text-base sm:text-lg text-white leading-snug">
                {scenario.situation}
              </h2>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {scenario.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let btnStyle = 'border border-white/15 bg-navy-950/80 hover:border-brand-purple/60 text-slate-200';

            if (isAnswered) {
              if (opt.isCorrect) {
                btnStyle = 'bg-emerald-950/95 border-2 border-emerald-400 text-emerald-100 font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)]';
              } else if (isSelected && !opt.isCorrect) {
                btnStyle = 'bg-rose-950/95 border-2 border-rose-500 text-rose-100 font-bold animate-shake';
              } else {
                btnStyle = 'opacity-40 border-white/5 bg-navy-950/60';
              }
            }

            return (
              <button
                key={opt.id}
                disabled={isAnswered}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.98] ${btnStyle}`}
              >
                <span className="text-xs sm:text-sm font-semibold leading-snug pr-2">
                  {opt.text}
                </span>

                {isAnswered && opt.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isAnswered && isSelected && !opt.isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Sheet */}
        {isAnswered && chosenOpt && (
          <div className="sismo-card p-4 space-y-2.5 border-brand-purple/50 bg-navy-900/90 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
            <span className={`text-xs font-black uppercase tracking-wider block ${
              chosenOpt.isCorrect ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {chosenOpt.isCorrect ? '✅ ¡DECISIÓN CORRECTA!' : '⚠️ ¡PELIGRO!'}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {chosenOpt.feedback}
            </p>

            <Button
              variant="purple"
              size="md"
              fullWidth
              onClick={handleNext}
              className="mt-1"
            >
              <span>{currentIdx + 1 < SCENARIO_CHOICES.length ? 'Siguiente Situación' : 'Finalizar Desafío (+XP)'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="h-2"></div>
    </div>
  );
};
