import React, { useState, useEffect } from 'react';
import { ArrowLeft, Timer, CheckCircle2, XCircle, Sparkles, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { ScreenId, EmergencyKitItem } from '../../types';
import { EMERGENCY_KIT_ITEMS } from '../../services/gamesService';
import { Button } from '../ui/Button';
import { sound } from '../../lib/sound';

interface EmergencyKitGameProps {
  onFinishGame: (earnedScore: number, correctCount: number, totalCount: number) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const EmergencyKitGame: React.FC<EmergencyKitGameProps> = ({
  onFinishGame,
  onNavigate
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);

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
    if (isFinished) return;

    if (timeLeft <= 0) {
      handleComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const handleToggleItem = (item: EmergencyKitItem) => {
    if (isFinished) return;

    if (selectedIds.includes(item.id)) {
      sound.playClick();
      setSelectedIds(prev => prev.filter(id => id !== item.id));
    } else {
      if (item.isEssential) {
        sound.playPackItem();
        setStreak(prev => prev + 1);
      } else {
        sound.playWrong();
        setStreak(0);
      }
      setSelectedIds(prev => [...prev, item.id]);
    }
  };

  const handleComplete = () => {
    setIsFinished(true);
    sound.playWinFanfare();
  };

  const handleFinishAndSave = () => {
    const baseScore = correctSelected * 60;
    const penalty = wrongSelected * 30;
    const speedBonus = timeLeft > 10 ? 100 : 0;
    const perfectBonus = correctSelected === essentialItems.length ? 150 : 0;

    const finalScore = Math.max(50, baseScore - penalty + speedBonus + perfectBonus);
    onFinishGame(finalScore, correctSelected, essentialItems.length);
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 flex flex-col justify-between p-4 sm:p-5 pb-24 max-w-md mx-auto"
      style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
    >
      <div className="fixed inset-0 bg-navy-950/80 pointer-events-none z-0" />

      {/* Header */}
      <div className="relative z-10 space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => { sound.playClick(); onNavigate('home'); }}
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

          <div className="flex items-center gap-1 bg-navy-900/90 px-3 py-1 rounded-2xl border border-brand-gold/40">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span className="font-black text-xs text-brand-yellow">
              {correctSelected}/{essentialItems.length} Vitales
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center pt-1">
          <h1 className="font-black text-lg text-white uppercase tracking-tight">
            ARMÁ LA MOCHILA DE 72H
          </h1>
          <p className="text-xs text-slate-300 font-medium">
            Tocá solo los elementos indispensables para sobrevivir tras un sismo.
          </p>
        </div>
      </div>

      {/* Grid of Items */}
      <div className="relative z-10 my-auto grid grid-cols-2 gap-2.5 py-2">
        {EMERGENCY_KIT_ITEMS.map((item) => {
          const isSelected = selectedIds.includes(item.id);

          let borderStyle = 'border-white/10 bg-navy-950/80 hover:border-brand-cyan/50';
          if (isSelected) {
            if (isFinished) {
              borderStyle = item.isEssential
                ? 'bg-emerald-950/95 border-2 border-emerald-400 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-rose-950/95 border-2 border-rose-500 text-rose-100 animate-shake';
            } else {
              borderStyle = 'bg-brand-blue/30 border-2 border-brand-cyan shadow-glow-cyan/30 scale-105';
            }
          }

          return (
            <button
              key={item.id}
              disabled={isFinished}
              onClick={() => handleToggleItem(item)}
              className={`sismo-card p-3 rounded-2xl flex flex-col justify-between text-left transition-all active:scale-[0.97] min-h-[90px] ${borderStyle}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{item.icon}</span>
                {isSelected && (
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] ${
                    isFinished && !item.isEssential ? 'bg-rose-500 text-white' : 'bg-brand-cyan text-navy-950'
                  }`}>
                    {isFinished && !item.isEssential ? '✗' : '✓'}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-xs text-white leading-tight">
                  {item.name}
                </h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="relative z-10 space-y-2">
        {!isFinished ? (
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={handleComplete}
          >
            <span>¡Cerrar Mochila y Evaluar!</span>
            <ShieldCheck className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="gold"
            size="md"
            fullWidth
            onClick={handleFinishAndSave}
          >
            <span>Guardar Puntos en el Ranking</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
