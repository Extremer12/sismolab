import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Timer, Sparkles, ArrowRight, ShieldCheck, Backpack, Check, AlertTriangle, X, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
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

const MAX_BACKPACK_CAPACITY = 12;

export const EmergencyKitGame: React.FC<EmergencyKitGameProps> = ({
  userMode = 'kids',
  onFinishGame,
  onNavigate
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'evaluation' | 'result'>('intro');
  const [shuffledItems, setShuffledItems] = useState<EmergencyKitItem[]>([]);
  const [packedItemIds, setPackedItemIds] = useState<string[]>([]);
  const [isDragOverBackpack, setIsDragOverBackpack] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [activeTab, setActiveTab] = useState<'all' | 'correct' | 'wrong' | 'missed'>('all');

  const draggedItemId = useRef<string | null>(null);
  const backpackRef = useRef<HTMLDivElement>(null);

  // Initialize and shuffle items on start
  useEffect(() => {
    setShuffledItems([...EMERGENCY_KIT_ITEMS].sort(() => Math.random() - 0.5));
  }, []);

  const essentialItems = EMERGENCY_KIT_ITEMS.filter(i => i.isEssential);
  const packedItems = EMERGENCY_KIT_ITEMS.filter(i => packedItemIds.includes(i.id));
  const availableItems = shuffledItems.filter(i => !packedItemIds.includes(i.id));

  const correctPackedItems = packedItems.filter(i => i.isEssential);
  const wrongPackedItems = packedItems.filter(i => !i.isEssential);
  const missedVitalItems = essentialItems.filter(i => !packedItemIds.includes(i.id));

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      handleEvaluate();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  // Pack item
  const handlePackItem = (item: EmergencyKitItem) => {
    if (gameState !== 'playing') return;
    if (packedItemIds.includes(item.id)) {
      // Unpack if already in backpack
      handleUnpackItem(item.id);
      return;
    }
    if (packedItemIds.length >= MAX_BACKPACK_CAPACITY) {
      sound.playWrong();
      return;
    }

    sound.playPackItem();
    setPackedItemIds(prev => [...prev, item.id]);
  };

  // Unpack item from backpack
  const handleUnpackItem = (itemId: string) => {
    sound.playClick();
    setPackedItemIds(prev => prev.filter(id => id !== itemId));
  };

  // HTML5 & Touch Drag and Drop handlers
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
    if (item && !packedItemIds.includes(item.id) && packedItemIds.length < MAX_BACKPACK_CAPACITY) {
      sound.playPackItem();
      setPackedItemIds(prev => [...prev, item.id]);
    }
    draggedItemId.current = null;
  };

  // Touch drag support for mobile
  const handleTouchEndItem = (e: React.TouchEvent, item: EmergencyKitItem) => {
    const touch = e.changedTouches[0];
    if (!touch || !backpackRef.current) return;

    const backpackRect = backpackRef.current.getBoundingClientRect();
    if (
      touch.clientX >= backpackRect.left &&
      touch.clientX <= backpackRect.right &&
      touch.clientY >= backpackRect.top &&
      touch.clientY <= backpackRect.bottom
    ) {
      // Dropped inside backpack!
      if (!packedItemIds.includes(item.id) && packedItemIds.length < MAX_BACKPACK_CAPACITY) {
        sound.playPackItem();
        setPackedItemIds(prev => [...prev, item.id]);
      }
    }
  };

  const handleEvaluate = () => {
    sound.playWinFanfare();
    setGameState('evaluation');
  };

  const calculateFinalScore = () => {
    const baseScore = correctPackedItems.length * 60;
    const penalty = wrongPackedItems.length * 30;
    const speedBonus = timeLeft > 15 ? 100 : timeLeft > 5 ? 50 : 0;
    const perfectBonus = correctPackedItems.length === essentialItems.length && wrongPackedItems.length === 0 ? 200 : 0;
    return Math.max(50, baseScore - penalty + speedBonus + perfectBonus);
  };

  const finalScore = calculateFinalScore();

  const handleReplay = () => {
    setShuffledItems([...EMERGENCY_KIT_ITEMS].sort(() => Math.random() - 0.5));
    setPackedItemIds([]);
    setTimeLeft(45);
    setGameState('intro');
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 flex flex-col justify-between p-4 sm:p-5 pb-24 max-w-md mx-auto overflow-x-hidden"
      style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
    >
      <div className="fixed inset-0 bg-navy-950/85 pointer-events-none z-0" />

      {/* 1. INTRO SCREEN */}
      {gameState === 'intro' && (
        <GameIntroCountdown
          title="MOCHILA DE 72 HORAS"
          category="PREVENCIÓN SÍSMICA · MISIÓN 04"
          subtitle="Empacá los 12 artículos que consideres indispensables"
          instructions="Arrastrá o tocá los elementos para meterlos en la mochila. Podés guardar hasta 12 objetos. Al finalizar, el sistema evaluará cuáles eran vitales y cuáles representaban riesgos."
          icon="🎒"
          rewardXp={500}
          timeLimitSec={45}
          onStart={() => setGameState('playing')}
        />
      )}

      {/* 2. RESULT SUMMARY */}
      {gameState === 'result' && (
        <GameResultScreen
          gameTitle="Mochila de Emergencia"
          earnedScore={finalScore}
          correctCount={correctPackedItems.length}
          totalCount={essentialItems.length}
          maxStreak={correctPackedItems.length}
          speedBonus={timeLeft > 10 ? 100 : 0}
          onReplay={handleReplay}
          onContinue={() => onFinishGame(finalScore, correctPackedItems.length, essentialItems.length, 'game-emergency-kit')}
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
                timeLeft <= 10 ? 'bg-rose-950/90 border-rose-500 text-rose-400 animate-pulse' : 'bg-navy-900/90 border-brand-cyan/40 text-brand-cyan'
              }`}>
                <Timer className="w-4 h-4" />
                <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}s</span>
              </div>

              {/* Capacity Pill */}
              <div className="flex items-center gap-1.5 bg-navy-900/90 px-3 py-1 rounded-2xl border border-brand-gold/40">
                <Backpack className="w-4 h-4 text-brand-gold" />
                <span className="font-black text-xs text-brand-yellow">
                  {packedItemIds.length}/{MAX_BACKPACK_CAPACITY}
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center pt-0.5">
              <h1 className="font-black text-lg text-white uppercase tracking-tight">
                ARMÁ TU MOCHILA DE 72 HORAS
              </h1>
              <p className="text-[11px] text-slate-300">
                Guardá hasta 12 objetos vitales para la emergencia
              </p>
            </div>
          </div>

          {/* Central Backpack Drop Target Area */}
          <div className="relative z-10 my-auto py-2 flex flex-col items-center">
            <div
              ref={backpackRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full max-w-[340px] p-4 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-xl ${
                isDragOverBackpack
                  ? 'bg-brand-cyan/25 border-brand-cyan shadow-[0_0_35px_rgba(34,211,238,0.7)] scale-105'
                  : packedItemIds.length === MAX_BACKPACK_CAPACITY
                  ? 'bg-emerald-950/70 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : 'bg-gradient-to-b from-navy-900/90 via-navy-950/95 to-navy-950 border-brand-cyan/40 shadow-xl'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-5xl sm:text-6xl filter drop-shadow">🎒</span>
                <div className="text-left">
                  <span className="font-black text-sm text-white uppercase tracking-wide block">
                    Mochila de 72 Horas
                  </span>
                  <span className="text-[11px] text-brand-cyan font-bold block">
                    {packedItemIds.length} de {MAX_BACKPACK_CAPACITY} objetos guardados
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">
                    Tocá un objeto adentro para sacarlo
                  </span>
                </div>
              </div>

              {/* Items packed inside backpack */}
              <div className="w-full min-h-[52px] mt-3 pt-2 border-t border-white/10 flex flex-wrap items-center justify-center gap-1.5">
                {packedItems.length === 0 ? (
                  <span className="text-xs text-slate-400 font-medium py-2">
                    Mochila vacía. Arrastrá o tocá los objetos de abajo.
                  </span>
                ) : (
                  packedItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleUnpackItem(item.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-navy-800/90 border border-brand-cyan/40 text-xs text-slate-100 hover:border-rose-400 hover:bg-rose-950/80 active:scale-95 transition-all group shadow-sm"
                      title="Quitar de la mochila"
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span className="font-bold text-[10px] truncate max-w-[80px]">{item.name.split(' ')[0]}</span>
                      <X className="w-3 h-3 text-slate-400 group-hover:text-rose-300" />
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Available Items Deck (Mixed & Shuffled) */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
              <span>ARTÍCULOS DISPONIBLES ({availableItems.length}):</span>
              <span className="text-brand-cyan text-[10px]">TOCÁ O ARRASTRÁ</span>
            </div>

            {/* Scrollable grid of items */}
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1 py-1 scrollbar-none">
              {availableItems.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onTouchEnd={(e) => handleTouchEndItem(e, item)}
                  onClick={() => handlePackItem(item)}
                  className="p-2 rounded-2xl border border-white/15 bg-navy-950/90 hover:border-brand-cyan hover:bg-navy-900 active:scale-95 transition-all flex flex-col items-center justify-center text-center cursor-pointer group shadow-md"
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

            {/* Action Finalize Button */}
            <div className="pt-1">
              <Button
                variant={packedItemIds.length >= 8 ? 'primary' : 'secondary'}
                size="md"
                fullWidth
                onClick={handleEvaluate}
              >
                <span>¡Cerrar Mochila y Evaluar! ({packedItemIds.length}/{MAX_BACKPACK_CAPACITY})</span>
                <ShieldCheck className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* 4. EVALUATION & REVIEW PHASE */}
      {gameState === 'evaluation' && (
        <div className="relative z-10 space-y-3 animate-in fade-in duration-200 my-auto">
          {/* Header Summary */}
          <div className="sismo-card p-4 rounded-3xl border-brand-cyan/40 bg-navy-950/95 text-center space-y-2 shadow-2xl">
            <h2 className="font-black text-xl text-white uppercase tracking-tight">
              EVALUACIÓN DE LA MOCHILA
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              Revisión técnica de los objetos seleccionados según normas INPRES
            </p>

            {/* Score Pill & Counts */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50">
                <span className="font-black text-base text-emerald-300 block">{correctPackedItems.length}</span>
                <span className="text-[9px] font-bold text-emerald-400 uppercase">Correctos</span>
              </div>
              <div className="p-2 rounded-xl bg-rose-950/80 border border-rose-500/50">
                <span className="font-black text-base text-rose-300 block">{wrongPackedItems.length}</span>
                <span className="text-[9px] font-bold text-rose-400 uppercase">Riesgos</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/50">
                <span className="font-black text-base text-amber-300 block">{missedVitalItems.length}</span>
                <span className="text-[9px] font-bold text-amber-400 uppercase">Faltantes</span>
              </div>
            </div>
          </div>

          {/* Detailed Item List Breakdown */}
          <div className="space-y-2 max-h-[46vh] overflow-y-auto pr-1">
            {/* 1. Correct Items */}
            {correctPackedItems.map((item) => (
              <div key={item.id} className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 flex items-start gap-3">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-emerald-200 truncate">{item.name}</h4>
                    <span className="text-[10px] font-black text-emerald-400 shrink-0 ml-1">+60 pts</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-snug mt-0.5">{item.reason}</p>
                </div>
              </div>
            ))}

            {/* 2. Wrong / Distractor Items */}
            {wrongPackedItems.map((item) => (
              <div key={item.id} className="p-3 rounded-2xl bg-rose-950/70 border border-rose-500/50 flex items-start gap-3">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-rose-200 truncate">{item.name}</h4>
                    <span className="text-[10px] font-black text-rose-400 shrink-0 ml-1">-30 pts</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-snug mt-0.5">{item.reason}</p>
                </div>
              </div>
            ))}

            {/* 3. Missed Vital Items */}
            {missedVitalItems.map((item) => (
              <div key={item.id} className="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-start gap-3 opacity-80">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-amber-200 truncate">{item.name} (Faltante)</h4>
                    <span className="text-[10px] font-bold text-amber-400 shrink-0 ml-1">Vital</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-snug mt-0.5">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Button to Result Screen */}
          <Button
            variant="gold"
            size="md"
            fullWidth
            onClick={() => setGameState('result')}
          >
            <span>Ver Puntuación Final (+{finalScore} XP)</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
