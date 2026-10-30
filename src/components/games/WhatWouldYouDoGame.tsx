import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Sparkles, ArrowRight, Flame, ShieldAlert, AlertTriangle } from 'lucide-react';
import { ScreenId, ScenarioChoice, UserMode } from '../../types';
import { getRandomScenarios } from '../../services/gamesService';
import { Button } from '../ui/Button';
import { sound } from '../../lib/sound';
import { useTheme } from '../../theme/ThemeContext';
import { GameIntroCountdown } from './GameIntroCountdown';
import { GameResultScreen } from './GameResultScreen';

interface WhatWouldYouDoGameProps {
  userMode?: UserMode;
  onFinishGame: (earnedScore: number, correctCount: number, totalCount: number, gameId?: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const WhatWouldYouDoGame: React.FC<WhatWouldYouDoGameProps> = ({
  userMode = 'kids',
  onFinishGame,
  onNavigate
}) => {
  const { isDark } = useTheme();
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [scenarios, setScenarios] = useState<ScenarioChoice[]>(() => getRandomScenarios(4, userMode));

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [earnedScore, setEarnedScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const scenario = scenarios[currentIdx] || scenarios[0];
  const progressPercent = ((currentIdx + 1) / scenarios.length) * 100;

  const handleSelectOption = (optId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optId);
    setIsAnswered(true);

    const chosen = scenario.options.find(o => o.id === optId);
    if (chosen?.isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const points = 120 + (newStreak > 1 ? 30 * (newStreak - 1) : 0);
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
    if (currentIdx + 1 < scenarios.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      setGameState('result');
    }
  };

  const handleReplay = () => {
    setScenarios(getRandomScenarios(4, userMode));
    setCurrentIdx(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setEarnedScore(0);
    setCorrectCount(0);
    setStreak(0);
    setMaxStreak(0);
    setGameState('intro');
  };

  const chosenOpt = scenario.options.find(o => o.id === selectedOptionId);

  return (
    <div
      className={`relative min-h-screen select-none font-sans flex flex-col justify-between p-4 sm:p-5 pb-24 max-w-md mx-auto overflow-x-hidden transition-colors duration-200 ${
        isDark ? 'bg-navy-950 text-slate-100 bg-cover bg-center bg-fixed' : 'bg-[#F8FAFC] text-slate-900'
      }`}
      style={isDark ? { backgroundImage: `url('/images/fondoinicio.png')` } : undefined}
    >
      {isDark && <div className="fixed inset-0 bg-navy-950/85 pointer-events-none z-0" />}

      {/* 1. INTRO COUNTDOWN */}
      {gameState === 'intro' && (
        <GameIntroCountdown
          title="¿QUÉ HARÍAS?"
          category="DECISIÓN EN CRISIS · MISIÓN 04"
          subtitle="Protocolos de autoprotección ante situaciones reales"
          instructions="Tomá decisiones críticas en situaciones de emergencia en la escuela, centro comercial, calle y hogar."
          icon="📍"
          rewardXp={500}
          onStart={() => setGameState('playing')}
        />
      )}

      {/* 2. RESULT SCREEN */}
      {gameState === 'result' && (
        <GameResultScreen
          gameTitle="¿Qué Harías?"
          earnedScore={earnedScore}
          correctCount={correctCount}
          totalCount={scenarios.length}
          maxStreak={maxStreak}
          onReplay={handleReplay}
          onContinue={() => onFinishGame(earnedScore, correctCount, scenarios.length, 'game-what-would-you-do')}
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
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isDark
                    ? 'bg-navy-900/90 border border-brand-purple/50 text-purple-300 hover:bg-navy-800'
                    : 'bg-white border border-purple-200 text-purple-700 shadow-sm hover:bg-purple-50'
                }`}
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

              <div className={`flex items-center gap-1 px-3 py-1 rounded-2xl border ${
                isDark ? 'bg-navy-900/90 border-brand-gold/40' : 'bg-white border-amber-200 shadow-xs'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span className={`font-black text-xs tabular-nums ${isDark ? 'text-brand-yellow' : 'text-amber-800 font-black'}`}>
                  +{earnedScore} pts
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className={`w-full h-2.5 rounded-full overflow-hidden p-0.5 border ${
              isDark ? 'bg-navy-900 border-white/10' : 'bg-slate-200 border-slate-300'
            }`}>
              <div
                className="h-full bg-gradient-to-r from-brand-purple to-brand-cyan rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Center Scenario Content */}
          <div className="relative z-10 my-auto space-y-3.5 py-2">
            <div className={`sismo-card p-5 space-y-2.5 border-2 ${
              isDark ? 'border-brand-purple/50 bg-navy-950/85 backdrop-blur-xl shadow-glow-purple/20' : 'border-purple-200 bg-white shadow-sm'
            }`}>
              <div className="flex items-center gap-3">
                <span className="text-4xl shrink-0 filter drop-shadow">{scenario.icon}</span>
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-wider block ${
                    isDark ? 'text-purple-400' : 'text-purple-700'
                  }`}>
                    {scenario.scenarioTitle}
                  </span>
                  <h2 className={`font-black text-base sm:text-lg leading-snug ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {scenario.situation}
                  </h2>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {scenario.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let btnStyle = isDark
                  ? 'border border-white/15 bg-navy-950/80 hover:border-brand-purple/60 text-slate-200'
                  : 'border border-slate-200 bg-white hover:border-purple-300 text-slate-800 shadow-xs';

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
              <div className={`sismo-card p-4 space-y-2.5 border backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 ${
                isDark ? 'border-brand-purple/50 bg-navy-900/90 text-slate-300' : 'border-purple-200 bg-white text-slate-700 shadow-md'
              }`}>
                <span className={`text-xs font-black uppercase tracking-wider block ${
                  chosenOpt.isCorrect ? (isDark ? 'text-emerald-400' : 'text-emerald-700') : (isDark ? 'text-rose-400' : 'text-rose-700')
                }`}>
                  {chosenOpt.isCorrect ? '✅ ¡DECISIÓN CORRECTA!' : '⚠️ ¡PELIGRO!'}
                </span>
                <p className={`text-xs leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {chosenOpt.feedback}
                </p>

                <Button
                  variant="purple"
                  size="md"
                  fullWidth
                  onClick={handleNext}
                  className="mt-1"
                >
                  <span>{currentIdx + 1 < scenarios.length ? 'Siguiente Situación' : 'Ver Resultados (+XP)'}</span>
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
