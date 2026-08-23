import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Timer, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Flame, Backpack, Check, AlertTriangle, HelpCircle, PackageCheck, Zap } from 'lucide-react';
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
  const [packedItemIds, setPackedItemIds] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isDragOverBackpack, setIsDragOverBackpack] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(35);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [earnedScore, setEarnedScore] = useState<number>(0);

  const draggedItemId = useRef<string | null>(null);

  const essentialItems = EMERGENCY_KIT_ITEMS.filter(i => i.isEssential);
  const packedItems = EMERGENCY_KIT_ITEMS.filter(i => packedItemIds.includes(i.id));
  const availableItems = EMERGENCY_KIT_ITEMS.filter(i => !packedItemIds.includes(i.id));

  const correctPackedCount = packedItems.filter(i => i.isEssential).length;
  const isAllEssentialPacked = correctPackedCount === essentialItems.length;

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing' || isFinished) return;

    if (timeLeft <= 0) {
      handleFinishGame();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished, gameState]);

  // Handle packing an item into the backpack
  const handlePackItem = (item: EmergencyKitItem) => {
    if (isFinished || packedItemIds.includes(item.id)) return;

    if (item.isEssential) {
      sound.playPackItem();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const points = 75 + (newStreak > 1 ? 25 * (newStreak - 1) : 0);
      setEarnedScore(prev => prev + points);
      setPackedItemIds(prev => [...prev, item.id]);
      setFeedbackMessage({ text: `✓ ${item.name} empacado (+${points} XP)`, isError: false });
    } else {
      sound.playWrong();
      setStreak(0);
      setFeedbackMessage({ text: `⚠️ ${item.reason}`, isError: true });
    }

    // Clear feedback after 3.5s
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, item: EmergencyKitItem) => {
    draggedItemId.current = item.id;
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverBackpack(true);
  };

  const handleDragLeave = () => {
    setIsDragOverBackpack(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverBackpack(false);
    const itemId = draggedItemId.current || e.dataTransfer.getData('text/plain');
    if (!itemId) return;

    const item = EMERGENCY_KIT_ITEMS.find(i => i.id === itemId);
    if (item) {
      handlePackItem(item);
    }
    draggedItemId.current = null;
  };

  const handleFinishGame = () => {
    setIsFinished(true);
    sound.playWinFanfare();
  };

  const handleReplay = () => {
    setPackedItemIds([]);
    setFeedbackMessage(null);
    setTimeLeft(35);
    setIsFinished(false);
    setStreak(0);
    setMaxStreak(0);
    setEarnedScore(0);
    setGameState('intro');
  };

  const speedBonus = timeLeft > 10 ? 100 : timeLeft > 5 ? 50 : 0;
  const perfectBonus = isAllEssentialPacked ? 200 : 0;
  const finalTotalScore = earnedScore + speedBonus + perfectBonus;

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
          category="PREVENCIÓN SÍSMICA · MISIÓN 03"
          subtitle="Empacá los insumos vitales para la supervivencia"
          instructions="Arrastrá hacia la mochila (o tocá) todos los artículos de primera necesidad (agua, linterna, radio, botiquín, etc.) evitando los objetos innecesarios o peligrosos."
          icon="🎒"
          rewardXp={500}
          timeLimitSec={35}
          onStart={() => setGameState('playing')}
        />
      )}

      {/* 2. RESULT SCREEN */}
      {gameState === 'result' && (
        <GameResultScreen
          gameTitle="Mochila de Emergencia"
          earnedScore={finalTotalScore}
          correctCount={correctPackedCount}
          totalCount={essentialItems.length}
          maxStreak={maxStreak}
          speedBonus={speedBonus + perfectBonus}
          onReplay={handleReplay}
          onContinue={() => onFinishGame(finalTotalScore, correctPackedCount, essentialItems.length, 'game-emergency-kit')}
        />
      )}

      {/* 3. ACTIVE GAME PLAYING */}
      {gameState === 'playing' && (
        <>
          {/* Header Controls */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() => { sound.playClick(); onNavigate(userMode === 'kids' ? 'kids' : 'adults'); }}
                className="w-10 h-10 rounded-full bg-navy-900/90 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan hover:bg-navy-800 active:scale-95 transition-all"
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

              {/* Score Badge */}
              <div className="flex items-center gap-1.5 bg-navy-900/90 px-3 py-1 rounded-2xl border border-brand-gold/40">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span className="font-black text-xs text-brand-yellow tabular-nums">+{earnedScore} pts</span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center pt-0.5">
              <h1 className="font-black text-lg text-white uppercase tracking-tight">
                ARMÁ LA MOCHILA DE 72 HORAS
              </h1>
              <p className="text-[11px] text-slate-300">
                Arrastrá o tocá los elementos para guardarlos dentro
              </p>
            </div>
          </div>

          {/* Centerpiece: Interactive Backpack Drop Target */}
          <div className="relative z-10 my-auto py-2 flex flex-col items-center">
            {/* The Central Backpack Canvas */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full max-w-[320px] p-5 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-xl ${
                isDragOverBackpack
                  ? 'bg-brand-cyan/20 border-brand-cyan shadow-[0_0_35px_rgba(34,211,238,0.6)] scale-105'
                  : isAllEssentialPacked
                  ? 'bg-emerald-950/80 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                  : 'bg-gradient-to-b from-navy-900/90 via-navy-950/95 to-navy-950 border-brand-cyan/40 shadow-xl'
              }`}
            >
              {/* Backpack Icon & Animation */}
              <div className="relative">
                <span className={`text-6xl sm:text-7xl block filter drop-shadow-lg transition-transform ${isDragOverBackpack ? 'scale-110' : ''}`}>
                  🎒
                </span>
                {streak >= 2 && (
                  <div className="absolute -top-2 -right-3 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-orange-950 border border-orange-500 text-orange-400 font-black text-[10px] shadow-md">
                    <Flame className="w-3 h-3 fill-orange-500" /> x{streak}
                  </div>
                )}
              </div>

              {/* Progress Count */}
              <div className="mt-2 space-y-0.5">
                <span className="font-black text-sm text-white uppercase tracking-wider block">
                  {correctPackedCount} de {essentialItems.length} Elementos Vitales
                </span>
                <span className="text-[10px] text-brand-cyan font-bold uppercase tracking-widest block">
                  {isAllEssentialPacked ? '¡MOCHILA 100% COMPLETA!' : 'SOLTÁ LOS ARTÍCULOS AQUÍ'}
                </span>
              </div>

              {/* Packed Item Miniatures Grid inside Backpack */}
              {packedItems.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 pt-2.5 border-t border-white/10 w-full">
                  {packedItems.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-xs font-bold text-emerald-200 animate-in zoom-in-50"
                      title={item.name}
                    >
                      <span>{item.icon}</span>
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Live Interactive Feedback Banner */}
            {feedbackMessage && (
              <div className={`mt-2.5 px-3.5 py-1.5 rounded-xl text-xs font-bold max-w-sm text-center animate-in fade-in duration-200 ${
                feedbackMessage.isError
                  ? 'bg-rose-950/90 border border-rose-500/80 text-rose-200 shadow-md'
                  : 'bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 shadow-md'
              }`}>
                {feedbackMessage.text}
              </div>
            )}
          </div>

          {/* Available Items Deck (Draggable or Tappable) */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
              <span>ARTÍCULOS DISPONIBLES:</span>
              <span className="text-brand-cyan text-[10px]">TOCÁ O ARRASTRÁ</span>
            </div>

            {/* Horizontal Scrollable Shelf of Available Items */}
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1 py-1">
              {availableItems.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onClick={() => handlePackItem(item)}
                  className="p-2.5 rounded-2xl border border-white/15 bg-navy-950/90 hover:border-brand-cyan/60 hover:bg-navy-900/90 active:scale-95 transition-all flex flex-col items-center justify-center text-center cursor-pointer group shadow-md"
                >
                  <span className="text-2xl sm:text-3xl filter drop-shadow group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-[10px] font-bold text-slate-200 leading-tight mt-1 line-clamp-2">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Finalize Button */}
            <div className="pt-1">
              <Button
                variant={isAllEssentialPacked ? 'primary' : 'secondary'}
                size="md"
                fullWidth
                onClick={() => setGameState('result')}
              >
                <span>{isAllEssentialPacked ? '¡MOCHILA LISTA! (Ver Puntuación +XP)' : `Evaluar Mochila (${correctPackedCount}/${essentialItems.length})`}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
