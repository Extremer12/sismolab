import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Sparkles, ArrowRight, Flame, HelpCircle } from 'lucide-react';
import { ScreenId } from '../../types';
import { MYTH_STATEMENTS } from '../../services/gamesService';
import { Button } from '../ui/Button';
import { sound } from '../../lib/sound';

interface MythOrRealityGameProps {
  onFinishGame: (earnedScore: number, correctCount: number, totalCount: number) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const MythOrRealityGame: React.FC<MythOrRealityGameProps> = ({
  onFinishGame,
  onNavigate
}) => {
  // Use first 4 statements for a rapid 40s round
  const statements = MYTH_STATEMENTS.slice(0, 4);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [earnedScore, setEarnedScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);

  const item = statements[currentIdx];
  const progressPercent = ((currentIdx + 1) / statements.length) * 100;

  const handleAnswer = (choice: boolean) => {
    if (isAnswered) return;
    setUserChoice(choice);
    setIsAnswered(true);

    const isCorrect = choice === item.isReality;
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setEarnedScore(prev => prev + 100 + (newStreak > 1 ? 25 * (newStreak - 1) : 0));
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
    if (currentIdx + 1 < statements.length) {
      setCurrentIdx(prev => prev + 1);
      setUserChoice(null);
      setIsAnswered(false);
    } else {
      onFinishGame(earnedScore, correctCount, statements.length);
    }
  };

  const isUserCorrect = userChoice === item.isReality;

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
            className="w-10 h-10 rounded-full bg-navy-900/90 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan hover:bg-navy-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Streak Flame */}
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
            className="h-full bg-gradient-to-r from-brand-electric to-brand-cyan rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Center Statement Card */}
      <div className="relative z-10 my-auto space-y-4 py-2">
        <div className="sismo-card p-6 space-y-3 border-2 border-brand-cyan/40 text-center shadow-glow-cyan/20 bg-navy-950/85 backdrop-blur-xl">
          <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest bg-brand-cyan/15 px-3 py-1 rounded-full border border-brand-cyan/30 inline-block">
            {item.category}
          </span>

          <h2 className="font-black text-lg sm:text-xl text-white leading-relaxed">
            "{item.statement}"
          </h2>
        </div>

        {/* Two Big Action Buttons: MITO vs REALIDAD */}
        {!isAnswered ? (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleAnswer(false)}
              className="h-16 rounded-2xl bg-rose-950/90 hover:bg-rose-900 border-2 border-rose-500 text-rose-100 font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(244,63,94,0.3)] active:scale-[0.97] transition-all hover:scale-105"
            >
              <span>❌ MITO</span>
            </button>

            <button
              onClick={() => handleAnswer(true)}
              className="h-16 rounded-2xl bg-emerald-950/90 hover:bg-emerald-900 border-2 border-emerald-400 text-emerald-100 font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.3)] active:scale-[0.97] transition-all hover:scale-105"
            >
              <span>✅ REALIDAD</span>
            </button>
          </div>
        ) : (
          /* Feedback Card */
          <div className="sismo-card p-4 space-y-2.5 border-brand-cyan/50 bg-navy-900/90 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2">
              {isUserCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <h3 className="font-black text-sm text-white">
                {isUserCorrect ? '¡ACERTASTE! (+100 PTS)' : `ERA ${item.isReality ? 'REALIDAD' : 'MITO'}`}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {item.explanation}
            </p>

            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleNext}
              className="mt-1"
            >
              <span>{currentIdx + 1 < statements.length ? 'Siguiente Afirmación' : 'Finalizar Ronda (+XP)'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="h-2"></div>
    </div>
  );
};
