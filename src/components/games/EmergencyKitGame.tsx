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
const VISIBLE_SLOTS_COUNT = 4;

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
  const [visibleSlots, setVisibleSlots] = useState<(EmergencyKitItem | null)[]>([]);
  const [waitingDeck, setWaitingDeck] = useState<EmergencyKitItem[]>([]);
  const [packedItemIds, setPackedItemIds] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(45);

  // Dragging state (Hardware-accelerated)
  const [activeDragItem, setActiveDragItem] = useState<EmergencyKitItem | null>(null);
  const [isOverBackpack, setIsOverBackpack] = useState<boolean>(false);
  const [backpackBouncing, setBackpackBouncing] = useState<boolean>(false);

  const backpackRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const dragContextRef = useRef<{
    item: EmergencyKitItem;
    slotIdx: number;
    startX: number;
    startY: number;
    hasMoved: boolean;
    backpackRect: DOMRect | null;
  } | null>(null);

  const essentialItems = EMERGENCY_KIT_ITEMS.filter(i => i.isEssential);
  const packedItems = EMERGENCY_KIT_ITEMS.filter(i => packedItemIds.includes(i.id));

  const correctPackedItems = packedItems.filter(i => i.isEssential);
  const wrongPackedItems = packedItems.filter(i => !i.isEssential);
  const missedVitalItems = essentialItems.filter(i => !packedItemIds.includes(i.id));

  // Initialize deck and slots
  const initGameDeck = () => {
    const allShuffled = getShuffledKitItems();
    const slots = allShuffled.slice(0, VISIBLE_SLOTS_COUNT);
    const rest = allShuffled.slice(VISIBLE_SLOTS_COUNT);
    setVisibleSlots(slots);
    setWaitingDeck(rest);
    setPackedItemIds([]);
    setTimeLeft(45);
  };

  const handleStartGame = () => {
    initGameDeck();
    setGameState('playing');
  };

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

  // Pack an item from a slot into the backpack and replenish the slot immediately
  const packItemFromSlot = (item: EmergencyKitItem, slotIdx: number) => {
    if (packedItemIds.includes(item.id) || packedItemIds.length >= MAX_BACKPACK_CAPACITY) {
      sound.playWrong();
      return;
    }

    sound.playPackItem();
    setPackedItemIds(prev => [...prev, item.id]);
    setBackpackBouncing(true);
    setTimeout(() => setBackpackBouncing(false), 350);

    // Replenish this specific slot with the next card from the deck
    setWaitingDeck(prevDeck => {
      if (prevDeck.length > 0) {
        const nextItem = prevDeck[0];
        const remainingDeck = prevDeck.slice(1);
        setVisibleSlots(prevSlots => {
          const newSlots = [...prevSlots];
          newSlots[slotIdx] = nextItem;
          return newSlots;
        });
        return remainingDeck;
      } else {
        setVisibleSlots(prevSlots => {
          const newSlots = [...prevSlots];
          newSlots[slotIdx] = null;
          return newSlots;
        });
        return prevDeck;
      }
    });
  };

  // Skip an item from a slot: sends it to the back of the waiting queue and pulls the next one
  const handleSkipSlotItem = (slotIdx: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const currentItem = visibleSlots[slotIdx];
    if (!currentItem) return;

    sound.playClick();
    setWaitingDeck(prevDeck => {
      if (prevDeck.length > 0) {
        const nextItem = prevDeck[0];
        const updatedDeck = [...prevDeck.slice(1), currentItem];
        setVisibleSlots(prevSlots => {
          const newSlots = [...prevSlots];
          newSlots[slotIdx] = nextItem;
          return newSlots;
        });
        return updatedDeck;
      }
      return prevDeck;
    });
  };

  // Rotate all 4 visible slots with the deck
  const handleRotateAllSlots = () => {
    sound.playClick();
    const activeItems = visibleSlots.filter((item): item is EmergencyKitItem => item !== null);
    if (waitingDeck.length === 0 && activeItems.length <= 1) return;

    const fullPool = [...waitingDeck, ...activeItems];
    const newSlots: (EmergencyKitItem | null)[] = fullPool.slice(0, VISIBLE_SLOTS_COUNT);
    const newDeck = fullPool.slice(VISIBLE_SLOTS_COUNT);
    while (newSlots.length < VISIBLE_SLOTS_COUNT) {
      newSlots.push(null);
    }
    setVisibleSlots(newSlots);
    setWaitingDeck(newDeck);
  };

  // Unpack an item back to waiting queue
  const handleUnpackItem = (itemId: string) => {
    sound.playClick();
    const itemToRestore = EMERGENCY_KIT_ITEMS.find(i => i.id === itemId);
    setPackedItemIds(prev => prev.filter(id => id !== itemId));

    if (itemToRestore) {
      // Check if there's an empty slot to fill first
      setVisibleSlots(prevSlots => {
        const emptyIdx = prevSlots.findIndex(s => s === null);
        if (emptyIdx !== -1) {
          const newSlots = [...prevSlots];
          newSlots[emptyIdx] = itemToRestore;
          return newSlots;
        } else {
          setWaitingDeck(prev => [itemToRestore, ...prev]);
          return prevSlots;
        }
      });
    }
  };

  // ==========================================
  // ZERO-LAG 60FPS POINTER DRAG & TAP HANDLER
  // ==========================================
  const handlePointerDownItem = (e: React.PointerEvent, item: EmergencyKitItem, slotIdx: number) => {
    // Only capture primary mouse button or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const backpackRect = backpackRef.current?.getBoundingClientRect() || null;
    dragContextRef.current = {
      item,
      slotIdx,
      startX: e.clientX,
      startY: e.clientY,
      hasMoved: false,
      backpackRect
    };

    setActiveDragItem(item);
    if (ghostRef.current) {
      ghostRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      ghostRef.current.style.opacity = '0';
    }
  };

  useEffect(() => {
    if (!activeDragItem) return;

    const onPointerMove = (e: PointerEvent) => {
      const ctx = dragContextRef.current;
      if (!ctx) return;

      const dx = Math.abs(e.clientX - ctx.startX);
      const dy = Math.abs(e.clientY - ctx.startY);

      if (!ctx.hasMoved && (dx > 8 || dy > 8)) {
        ctx.hasMoved = true;
        if (ghostRef.current) {
          ghostRef.current.style.opacity = '1';
        }
      }

      if (ctx.hasMoved && ghostRef.current) {
        ghostRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

        if (ctx.backpackRect) {
          const rect = ctx.backpackRect;
          const over = (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
          );
          setIsOverBackpack(over);
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const ctx = dragContextRef.current;
      if (ctx) {
        if (!ctx.hasMoved) {
          // TAP detected! Instant pack!
          packItemFromSlot(ctx.item, ctx.slotIdx);
        } else if (ctx.backpackRect) {
          // DRAG DROP detected!
          const rect = ctx.backpackRect;
          const over = (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
          );
          if (over) {
            packItemFromSlot(ctx.item, ctx.slotIdx);
          }
        }
      }

      dragContextRef.current = null;
      setActiveDragItem(null);
      setIsOverBackpack(false);
      if (ghostRef.current) {
        ghostRef.current.style.opacity = '0';
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [activeDragItem, packedItemIds]);

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
    initGameDeck();
    setGameState('intro');
  };

  // Count of total remaining items not yet packed
  const totalUnpackedCount = visibleSlots.filter(s => s !== null).length + waitingDeck.length;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 flex flex-col justify-between p-3.5 sm:p-5 pb-20 max-w-md mx-auto overflow-x-hidden"
      style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
    >
      <div className="fixed inset-0 bg-navy-950/85 pointer-events-none z-0" />

      {/* 1. INTRO SCREEN */}
      {gameState === 'intro' && (
        <GameIntroCountdown
          title="MOCHILA DE 72 HORAS"
          category="PREVENCIÓN SÍSMICA · MISIÓN 02"
          subtitle="Empacá hasta 12 artículos indispensables"
          instructions="Tocá o arrastrá los objetos hacia la mochila. Cada vez que guardes uno, aparecerá el siguiente. Al finalizar, evaluaremos cuáles eran vitales y cuáles un riesgo."
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
                className="w-10 h-10 rounded-full bg-navy-900/90 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan hover:bg-navy-800 active:scale-95 transition-all cursor-pointer"
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
            <div className="text-center flex items-center justify-center gap-1.5 text-xs text-brand-cyan font-black uppercase tracking-wider pt-0.5">
              <Hand className="w-3.5 h-3.5 animate-bounce" />
              <span>Tocá o arrastrá hacia la mochila</span>
            </div>
          </div>

          {/* Central 3D Backpack Drop Zone */}
          <div className="relative z-10 my-auto py-1 flex flex-col items-center justify-center">
            <div
              ref={backpackRef}
              className={`relative flex flex-col items-center justify-center transition-all duration-200 ${
                isOverBackpack
                  ? 'scale-115 filter drop-shadow-[0_0_35px_rgba(34,211,238,1)]'
                  : backpackBouncing
                  ? 'scale-110 filter drop-shadow-[0_0_25px_rgba(16,185,129,1)]'
                  : 'filter drop-shadow-[0_12px_25px_rgba(0,0,0,0.8)]'
              }`}
            >
              {/* 3D Backpack Image */}
              <img
                src="/images/kit/mochila.png"
                alt="Mochila de Emergencia 72H"
                className="w-32 h-32 sm:w-36 sm:h-36 object-contain pointer-events-none transition-transform"
              />

              {/* Capacity Floating Badge */}
              <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-navy-950/95 border border-brand-cyan text-brand-cyan font-black text-[11px] shadow-lg">
                {packedItemIds.length}/{MAX_BACKPACK_CAPACITY} EMPACADOS
              </div>
            </div>

            {/* Packed Items Miniature Drawer */}
            {packedItems.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-1 mt-3.5 max-w-xs max-h-16 overflow-y-auto pr-1">
                {packedItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleUnpackItem(item.id)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-navy-950/95 border border-brand-cyan/40 text-[11px] text-slate-100 hover:border-rose-400 active:scale-95 transition-all group shadow-sm cursor-pointer"
                    title="Quitar de la mochila"
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-3 h-3 object-contain pointer-events-none" />
                    ) : (
                      <span className="text-[11px] pointer-events-none">{item.icon}</span>
                    )}
                    <span className="truncate max-w-[65px] text-[10px] pointer-events-none">{item.name}</span>
                    <X className="w-2.5 h-2.5 text-slate-400 group-hover:text-rose-300 pointer-events-none" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DYNAMIC 4-SLOT TRAY (No cramped scroll box) */}
          <div className="relative z-10 space-y-2">
            {/* Header info */}
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
                <span className="uppercase text-brand-cyan font-black tracking-wider">
                  Objetos por clasificar ({totalUnpackedCount})
                </span>
              </div>

              {waitingDeck.length > 0 && (
                <button
                  type="button"
                  onClick={handleRotateAllSlots}
                  className="px-2.5 py-1 rounded-lg bg-navy-900/90 border border-brand-cyan/40 text-[11px] text-brand-cyan hover:bg-navy-800 flex items-center gap-1 transition-all active:scale-95 cursor-pointer font-bold shadow-sm"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Rotar (+{waitingDeck.length})</span>
                </button>
              )}
            </div>

            {/* 4 Crisp Dynamic Slots Grid */}
            <div className="grid grid-cols-2 gap-2">
              {visibleSlots.map((item, idx) => {
                if (!item) {
                  return (
                    <div
                      key={`empty-slot-${idx}`}
                      className="h-24 rounded-2xl border-2 border-dashed border-white/10 bg-navy-950/40 flex items-center justify-center text-slate-500 text-xs font-bold"
                    >
                      <span>✓ Clasificado</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id}
                    onPointerDown={(e) => handlePointerDownItem(e, item, idx)}
                    className="relative p-2 rounded-2xl bg-gradient-to-b from-navy-900/95 to-navy-950/95 border border-brand-cyan/40 shadow-lg flex flex-col items-center justify-between text-center cursor-pointer hover:border-brand-cyan hover:scale-[1.02] active:scale-95 transition-all group touch-none select-none"
                  >
                    {/* Item Visual */}
                    <div className="w-12 h-12 flex items-center justify-center pointer-events-none mt-0.5">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <span className="text-3xl filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform">
                          {item.icon}
                        </span>
                      )}
                    </div>

                    {/* Item Name */}
                    <span className="text-[11px] font-black text-slate-100 leading-tight mt-1 line-clamp-1 pointer-events-none">
                      {item.name}
                    </span>

                    {/* Action Buttons Row */}
                    <div className="w-full flex items-center gap-1 mt-1 pt-1 border-t border-white/5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          packItemFromSlot(item, idx);
                        }}
                        className="flex-1 py-1 rounded-lg bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Empacar</span>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </button>

                      {waitingDeck.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => handleSkipSlotItem(idx, e)}
                          className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 font-bold text-[10px] transition-colors cursor-pointer"
                          title="Pasar al final"
                        >
                          <span>↷</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Finalize Button */}
            <div className="pt-1">
              <Button
                variant={packedItemIds.length >= 6 ? 'primary' : 'secondary'}
                size="md"
                fullWidth
                onClick={handleEvaluate}
              >
                <span>¡CERRAR Y EVALUAR! ({packedItemIds.length}/{MAX_BACKPACK_CAPACITY})</span>
                <ShieldCheck className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* HARDWARE-ACCELERATED GHOST ELEMENT (Rendered via transform, 0ms lag) */}
          <div
            ref={ghostRef}
            className="fixed pointer-events-none z-50 -top-8 -left-8 flex flex-col items-center transition-opacity duration-75"
            style={{ opacity: 0 }}
          >
            {activeDragItem && (
              <>
                {activeDragItem.image ? (
                  <img
                    src={activeDragItem.image}
                    alt={activeDragItem.name}
                    className="w-16 h-16 object-contain filter drop-shadow-[0_0_25px_rgba(34,211,238,1)]"
                  />
                ) : (
                  <span className="text-5xl filter drop-shadow-[0_0_25px_rgba(34,211,238,1)]">
                    {activeDragItem.icon}
                  </span>
                )}
                <span className="mt-1 px-2.5 py-0.5 rounded-full bg-navy-950/95 border border-brand-cyan text-[10px] font-black text-white shadow-2xl">
                  {activeDragItem.name}
                </span>
              </>
            )}
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
