import React, { useState, useEffect } from 'react';
import { ArrowLeft, Timer, CheckCircle2, XCircle, Sparkles, ArrowRight, ShieldCheck, Flame, Backpack, Check, AlertCircle } from 'lucide-react';
import { ScreenId, EmergencyKitItem, UserMode } from '../../types';
import { EMERGENCY_KIT_ITEMS } from '../../services/gamesService';
import { Button } from '../ui/Button';
import { sound } from '../../lib/sound';
import { GameIntroCountdown } from './GameIntroCountdown';
import { GameResultScreen } from './GameResultScreen';

interface EmergencyKitGameProps {
  userMode?: UserMode;
  onFinishGame: (earnedScore: number, correctCount: number, totalCount: number, gameId?: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const EmergencyKitGame: React.FC<EmergencyKitGameProps> = ({
  userMode = 'kids',
  onFinishGame,
  onNavigate
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);

  const essentialItems = EMERGENCY_KIT_ITEMS.filter(i => i.isEssential);
  const correctSelected = selectedIds.filter(id => {
    const item = EMERGENCY_KIT_ITEMS.find(i => i.id === id);
    return item?.isEssential;
  }).length;

  const wrongSelected = selectedIds.filter(id => {
    const item = EMERGENCY_KIT_ITEMS.find(i => i.id === id);
    return !item?.isEssential;
  }).length;

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing' || isFinished) return;

    if (timeLeft <= 0) {
      handleEvaluate();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished, gameState]);

  const handleToggleItem = (item: EmergencyKitItem) => {
    if (isFinished) return;

    if (selectedIds.includes(item.id)) {
      sound.playClick();
      setSelectedIds(prev => prev.filter(id => id !== item.id));
    } else {
      if (item.isEssential) {
        sound.playPackItem();
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > maxStreak) setMaxStreak(newStreak);
      } else {
        sound.playWrong();
        setStreak(0);
      }
      setSelectedIds(prev => [...prev, item.id]);
    }
  };

  const handleEvaluate = () => {
    setIsFinished(true);
    sound.playWinFanfare();
  };

  const calculateFinalScore = () => {
    const baseScore = correctSelected * 60;
    const penalty = wrongSelected * 30;
    const speedBonus = timeLeft > 10 ? 100 : timeLeft > 5 ? 50 : 0;
    const perfectBonus = correctSelected === essentialItems.length ? 150 : 0;
    return Math.max(50, baseScore - penalty + speedBonus + perfectBonus);
  };

  const handleReplay = () => {
    setSelectedIds([]);
    setTimeLeft(30);
    setIsFinished(false);
    setStreak(0);
    setMaxStreak(0);
    setGameState('intro');
  };

  const finalScore = calculateFinalScore();

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 flex flex-col justify-between p-4 sm:p-5 pb-24 max-w-md mx-auto overflow-x-hidden"
      style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
    >
      <div className="fixed inset-0 bg-navy-950/85 pointer-events-none z-0" />

      {/* 1. INTRO COUNTDOWN */}
      {gameState === 'intro' && (
        <GameIntroCountdown
          title="MOCHILA DE 72 HORAS"
          category="PREVENCIÓN SÍSMICA · MISIÓN 04"
          subtitle="Autonomía y supervivencia post-terremoto"
          instructions="Tenés 30 segundos para empacar todos los elementos vitales (agua, linterna, radio, botiquín, silbato, etc.) evitando los distractores pesados o peligrosos."
          icon="🎒"
          rewardXp={500}
          timeLimitSec={30}
          onStart={() => setGameState('playing')}
        />
      )}

      {/* 2. RESULT SCREEN */}
      {gameState === 'result' && (
        <GameResultScreen
          gameTitle="Kit de Emergencia"
          earnedScore={finalScore}
          correctCount={correctSelected}
          totalCount={essentialItems.length}
          maxStreak={maxStreak}
          speedBonus={timeLeft > 10 ? 100 : 0}
          onReplay={handleReplay}
          onContinue={() => onFinishGame(finalScore, correctSelected, essentialItems.length, 'game-emergency-kit')}
        />
      )}

      {/* 3. ACTIVE GAME PLAYING */}
      {gameState === 'playing' && (
        <>
          {/* Header */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() => { sound.playClick(); onNavigate(userMode === 'kids' ? 'kids' : 'adults'); }}
                className="w-10 h-10 rounded-full bg-navy-900/90 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan hover:bg-navy-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Countdown Timer */}
              <div className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full font-black text-xs border ${
                timeLeft <= 8 ? 'bg-rose-950/90 border-rose-500 text-rose-400 animate-pulse' : 'bg-navy-900/90 border-brand-cyan/40 text-brand-cyan'
              }`}>
                <Timer className="w-4 h-4" />
                <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}s</span>
              </div>

              {/* Packed Counter Pill */}
              <div className="flex items-center gap-1.5 bg-navy-900/90 px-3 py-1 rounded-2xl border border-brand-gold/40">
                <Backpack className="w-4 h-4 text-brand-gold" />
                <span className="font-black text-xs text-brand-yellow">
                  {correctSelected}/{essentialItems.length} Vitales
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center pt-0.5">
              <h1 className="font-black text-lg text-white uppercase tracking-tight">
                ARMÁ LA MOCHILA DE 72H
              </h1>
              <p className="text-[11px] text-slate-300 font-medium">
                Tocá los elementos indispensables para la supervivencia familiar.
              </p>
            </div>
          </div>

          {/* Grid of Items */}
          <div className="relative z-10 my-auto grid grid-cols-2 gap-2.5 py-2 max-h-[60vh] overflow-y-auto pr-1">
            {EMERGENCY_KIT_ITEMS.map((item) => {
              const isSelected = selectedIds.includes(item.id);

              let borderStyle = 'border-white/10 bg-navy-950/80 hover:border-brand-cyan/50';
              if (isSelected) {
                if (isFinished) {
                  borderStyle = item.isEssential
                    ? 'bg-emerald-950/95 border-2 border-emerald-400 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-rose-950/95 border-2 border-rose-500 text-rose-100 animate-shake';
                } else {
                  borderStyle = 'bg-brand-blue/30 border-2 border-brand-cyan shadow-glow-cyan/30 scale-102';
                }
              }

              return (
                <button
                  key={item.id}
                  disabled={isFinished}
                  onClick={() => handleToggleItem(item)}
                  className={`sismo-card p-3 rounded-2xl flex flex-col justify-between text-left transition-all active:scale-[0.97] min-h-[95px] ${borderStyle}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl filter drop-shadow">{item.icon}</span>
                    {isSelected && (
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shadow-md ${
                        isFinished && !item.isEssential ? 'bg-rose-500 text-white' : 'bg-brand-cyan text-navy-950'
                      }`}>
                        {isFinished && !item.isEssential ? '✗' : '✓'}
                      </span>
                    )}
                  </div>

                  <div className="pt-1">
                    <h3 className="font-bold text-xs text-white leading-tight">
                      {item.name}
                    </h3>
                    {isFinished && (
                      <p className={`text-[10px] font-medium leading-snug mt-1 ${item.isEssential ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {item.reason}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="relative z-10 space-y-2 pt-1">
            {!isFinished ? (
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={handleEvaluate}
              >
                <span>¡Cerrar Mochila y Evaluar!</span>
                <ShieldCheck className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="gold"
                size="md"
                fullWidth
                onClick={() => setGameState('result')}
              >
                <span>Ver Puntuación Final (+XP)</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
