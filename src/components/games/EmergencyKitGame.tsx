import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Timer, Sparkles, ArrowRight, ShieldCheck, Check, X, RotateCcw, Hand } from 'lucide-react';
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

// Fisher-Yates uniform shuffle
function getShuffledKitItems(): EmergencyKitItem[] {
  const array = [...EMERGENCY_KIT_ITEMS];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const EmergencyKitGame: React.FC<EmergencyKitGameProps> = ({
  userMode = 'kids',
  onFinishGame,
  onNavigate
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'evaluation' | 'result'>('intro');
  const [shuffledItems, setShuffledItems] = useState<EmergencyKitItem[]>(() => getShuffledKitItems());
  const [packedItemIds, setPackedItemIds] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(45);

  // Dragging state
  const [draggingItem, setDraggingItem] = useState<EmergencyKitItem | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [isOverBackpack, setIsOverBackpack] = useState<boolean>(false);
  const [backpackBouncing, setBackpackBouncing] = useState<boolean>(false);

  const backpackRef = useRef<HTMLDivElement>(null);

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

  // Re-shuffle items
  const handleShuffleAvailable = () => {
    sound.playClick();
    setShuffledItems(getShuffledKitItems());
  };

  const handleStartGame = () => {
    setShuffledItems(getShuffledKitItems());
    setPackedItemIds([]);
    setTimeLeft(45);
    setGameState('playing');
  };

  // Pack item helper
  const packItemById = (item: EmergencyKitItem) => {
    if (packedItemIds.includes(item.id) || packedItemIds.length >= MAX_BACKPACK_CAPACITY) {
      sound.playWrong();
      return;
    }

    sound.playPackItem();
    setPackedItemIds(prev => [...prev, item.id]);
    setBackpackBouncing(true);
    setTimeout(() => setBackpackBouncing(false), 400);
  };

  // Remove packed item from backpack
  const handleUnpackItem = (itemId: string) => {
    sound.playClick();
    setPackedItemIds(prev => prev.filter(id => id !== itemId));
  };

  // POINTER-BASED REAL-TIME DRAGGING (100% Mobile Touch & Desktop Mouse Compatible)
  const handlePointerDown = (e: React.PointerEvent, item: EmergencyKitItem) => {
    e.preventDefault();
    setDraggingItem(item);
    setDragPos({ x: e.clientX, y: e.clientY });
    setIsOverBackpack(false);
  };

  useEffect(() => {
    if (!draggingItem) return;

    const handlePointerMove = (e: PointerEvent) => {
      setDragPos({ x: e.clientX, y: e.clientY });

      if (backpackRef.current) {
        const rect = backpackRef.current.getBoundingClientRect();
        const over = (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );
        setIsOverBackpack(over);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (backpackRef.current) {
        const rect = backpackRef.current.getBoundingClientRect();
        const over = (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );

        if (over && draggingItem) {
          packItemById(draggingItem);
        }
      }

      setDraggingItem(null);
      setDragPos(null);
      setIsOverBackpack(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [draggingItem, packedItemIds]);

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
    setShuffledItems(getShuffledKitItems());
    setPackedItemIds([]);
    setTimeLeft(45);
    setGameState('intro');
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 flex flex-col justify-between p-4 sm:p-5 pb-24 max-w-md mx-auto overflow-x-hidden touch-none"
      style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
    >
      <div className="fixed inset-0 bg-navy-950/85 pointer-events-none z-0" />

      {/* 1. INTRO SCREEN */}
      {gameState === 'intro' && (
        <GameIntroCountdown
          title="MOCHILA DE 72 HORAS"
          category="PREVENCIÓN SÍSMICA · MISIÓN 04"
          subtitle="Arrastrá hasta 12 artículos indispensables"
          instructions="Mantené presionado y arrastrá los objetos directamente hacia la mochila de emergencia. Al finalizar, evaluaremos cuáles eran vitales y cuáles un riesgo."
          icon="🎒"
          rewardXp={500}
          timeLimitSec={45}
          onStart={handleStartGame}
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
          <div className="relative z-10 space-y-1">
            <div className="flex items-center justify-between">
              <button
                type="button"
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
              <div className="flex items-center gap-1.5 bg-navy-900/90 px-3 py-1 rounded-2xl border border-brand-cyan/40 shadow-glow-cyan/20">
                <span className="font-black text-xs text-brand-cyan">
                  🎒 {packedItemIds.length}/{MAX_BACKPACK_CAPACITY}
                </span>
              </div>
            </div>

            {/* Instruction Tip */}
            <div className="text-center flex items-center justify-center gap-1.5 text-xs text-brand-cyan font-black uppercase tracking-wider pt-1">
              <Hand className="w-4 h-4 animate-bounce" />
              <span>Arrastrá los objetos hacia la mochila</span>
            </div>
          </div>

          {/* Central 3D Backpack Drop Zone (No background box) */}
          <div className="relative z-10 my-auto py-1 flex flex-col items-center justify-center">
            <div
              ref={backpackRef}
              className={`relative flex flex-col items-center justify-center transition-all duration-300 ${
                isOverBackpack
                  ? 'scale-115 filter drop-shadow-[0_0_35px_rgba(34,211,238,0.9)]'
                  : backpackBouncing
                  ? 'scale-110 filter drop-shadow-[0_0_25px_rgba(16,185,129,0.9)]'
                  : 'filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]'
              }`}
            >
              {/* 3D Backpack Image */}
              <img
                src="/images/kit/mochila.png"
                alt="Mochila de Emergencia 72H"
                className="w-36 h-36 sm:w-40 sm:h-40 object-contain pointer-events-none transition-transform"
              />

              {/* Capacity Indicator Floating Badge */}
              <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-navy-950/90 border border-brand-cyan/60 text-brand-cyan font-black text-[11px] shadow-lg">
                {packedItemIds.length}/{MAX_BACKPACK_CAPACITY} OBJETOS
              </div>
            </div>

            {/* Packed Items Miniature Drawer */}
            {packedItems.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4 max-w-xs">
                {packedItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleUnpackItem(item.id)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-navy-950/90 border border-brand-cyan/40 text-xs text-slate-100 hover:border-rose-400 active:scale-95 transition-all group shadow-sm cursor-pointer"
                    title="Quitar"
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-3.5 h-3.5 object-contain pointer-events-none" />
                    ) : (
                      <span className="text-xs pointer-events-none">{item.icon}</span>
                    )}
                    <X className="w-2.5 h-2.5 text-slate-400 group-hover:text-rose-300" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Floating Transparent Item Tray (No heavy background boxes) */}
          <div className="relative z-10 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 px-1">
              <span>ARTÍCULOS ({availableItems.length}):</span>
              <button
                type="button"
                onClick={handleShuffleAvailable}
                className="px-2 py-0.5 rounded-lg bg-navy-900/90 border border-brand-cyan/30 text-[10px] text-brand-cyan hover:bg-navy-800 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <span>🔀 Mezclar</span>
              </button>
            </div>

            {/* Transparent Items Shelf */}
            <div className="grid grid-cols-3 gap-2.5 max-h-44 overflow-y-auto pr-1 py-1 scrollbar-none">
              {availableItems.map((item) => (
                <div
                  key={item.id}
                  onPointerDown={(e) => handlePointerDown(e, item)}
                  className="flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing group p-1 transition-transform active:scale-95 touch-none select-none"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] group-hover:scale-110 transition-transform pointer-events-none"
                    />
                  ) : (
                    <span className="text-4xl filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] group-hover:scale-110 transition-transform pointer-events-none">
                      {item.icon}
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-slate-200 leading-tight mt-1 line-clamp-2 pointer-events-none drop-shadow">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Finalize Button */}
            <div className="pt-1">
              <Button
                variant={packedItemIds.length >= 8 ? 'primary' : 'secondary'}
                size="md"
                fullWidth
                onClick={handleEvaluate}
              >
                <span>¡CERRAR Y EVALUAR! ({packedItemIds.length}/{MAX_BACKPACK_CAPACITY})</span>
                <ShieldCheck className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* FLOATING GHOST ITEM UNDER FINGER/POINTER WHILE DRAGGING */}
          {draggingItem && dragPos && (
            <div
              className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-in zoom-in-75 duration-75"
              style={{ left: `${dragPos.x}px`, top: `${dragPos.y}px` }}
            >
              {draggingItem.image ? (
                <img
                  src={draggingItem.image}
                  alt={draggingItem.name}
                  className="w-16 h-16 object-contain filter drop-shadow-[0_0_20px_rgba(34,211,238,0.9)]"
                />
              ) : (
                <span className="text-5xl filter drop-shadow-[0_0_20px_rgba(34,211,238,0.9)]">
                  {draggingItem.icon}
                </span>
              )}
              <span className="mt-1 px-2 py-0.5 rounded-full bg-navy-950/90 border border-brand-cyan text-[10px] font-black text-white shadow-xl">
                {draggingItem.name}
              </span>
            </div>
          )}
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

            {/* Counts */}
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

          {/* Item Breakdown */}
          <div className="space-y-2 max-h-[46vh] overflow-y-auto pr-1">
            {correctPackedItems.map((item) => (
              <div key={item.id} className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 flex items-start gap-3">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-8 h-8 object-contain shrink-0" />
                ) : (
                  <span className="text-2xl shrink-0">{item.icon}</span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-emerald-200 truncate">{item.name}</h4>
                    <span className="text-[10px] font-black text-emerald-400 shrink-0 ml-1">+60 pts</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-snug mt-0.5">{item.reason}</p>
                </div>
              </div>
            ))}

            {wrongPackedItems.map((item) => (
              <div key={item.id} className="p-3 rounded-2xl bg-rose-950/70 border border-rose-500/50 flex items-start gap-3">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-8 h-8 object-contain shrink-0" />
                ) : (
                  <span className="text-2xl shrink-0">{item.icon}</span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-rose-200 truncate">{item.name}</h4>
                    <span className="text-[10px] font-black text-rose-400 shrink-0 ml-1">-30 pts</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-snug mt-0.5">{item.reason}</p>
                </div>
              </div>
            ))}

            {missedVitalItems.map((item) => (
              <div key={item.id} className="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-start gap-3 opacity-80">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-8 h-8 object-contain shrink-0" />
                ) : (
                  <span className="text-2xl shrink-0">{item.icon}</span>
                )}
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
