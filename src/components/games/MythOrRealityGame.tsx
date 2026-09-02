import React, { useState, useRef } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Sparkles, ArrowRight, Flame, HelpCircle, ThumbsUp, ThumbsDown, MoveHorizontal } from 'lucide-react';
import { ScreenId, MythStatement, UserMode } from '../../types';
import { getRandomMyths } from '../../services/gamesService';
import { Button } from '../ui/Button';
import { sound } from '../../lib/sound';
import { GameIntroCountdown } from './GameIntroCountdown';
import { GameResultScreen } from './GameResultScreen';

interface MythOrRealityGameProps {
  userMode?: UserMode;
  onFinishGame: (earnedScore: number, correctCount: number, totalCount: number, gameId?: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const MythOrRealityGame: React.FC<MythOrRealityGameProps> = ({
  userMode = 'kids',
  onFinishGame,
  onNavigate
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [statements, setStatements] = useState<MythStatement[]>(() => getRandomMyths(5, userMode));

  const [currentIdx, setCurrentIdx] = useState(0);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [earnedScore, setEarnedScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // Swipe Card Gesture States
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const item = statements[currentIdx] || statements[0];
  const progressPercent = ((currentIdx + 1) / statements.length) * 100;

  // Swipe handlers (Pointer events support both touch and mouse seamlessly)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isAnswered) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isAnswered) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = (e.clientY - dragStartRef.current.y) * 0.3; // dampen Y
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || isAnswered) return;
    setIsDragging(false);

    // Threshold for swipe activation: 75px
    if (dragOffset.x > 75) {
      // Swiped Right -> REALIDAD
      sound.playSwipeCard('right');
      handleAnswer(true);
    } else if (dragOffset.x < -75) {
      // Swiped Left -> MITO
      sound.playSwipeCard('left');
      handleAnswer(false);
    }

    setDragOffset({ x: 0, y: 0 });
  };

  const handleAnswer = (choice: boolean) => {
    if (isAnswered) return;
    setUserChoice(choice);
    setIsAnswered(true);

    const isCorrect = choice === item.isReality;
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const pointsAwarded = 100 + (newStreak > 1 ? 25 * (newStreak - 1) : 0);
      setEarnedScore(prev => prev + pointsAwarded);
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
      setDragOffset({ x: 0, y: 0 });
    } else {
      setGameState('result');
    }
  };

  const handleReplay = () => {
    setStatements(getRandomMyths(5, userMode));
    setCurrentIdx(0);
    setUserChoice(null);
    setIsAnswered(false);
    setEarnedScore(0);
    setCorrectCount(0);
    setStreak(0);
    setMaxStreak(0);
    setDragOffset({ x: 0, y: 0 });
    setGameState('intro');
  };

  const isUserCorrect = userChoice === item.isReality;

  // Swipe Card Rotation & Color Sheen styling
  const rotationDeg = Math.min(25, Math.max(-25, dragOffset.x * 0.15));
  const swipeDirection = dragOffset.x > 30 ? 'right' : dragOffset.x < -30 ? 'left' : null;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 flex flex-col justify-between p-4 sm:p-5 pb-24 max-w-md mx-auto overflow-x-hidden"
      style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
    >
      <div className="fixed inset-0 bg-navy-950/85 pointer-events-none z-0" />

      {/* 1. INTRO COUNTDOWN SCREEN */}
      {gameState === 'intro' && (
        <GameIntroCountdown
          title="MITO O REALIDAD"
          category="CIENCIA SÍSMICA · MISIÓN 05"
          subtitle="Desmentí creencias populares y validá la ciencia INPRES"
          instructions="Deslizá la tarjeta física hacia la IZQUIERDA para MITO ❌ o hacia la DERECHA para REALIDAD ✅. ¡También podés usar los botones táctiles!"
          icon="⚡"
          rewardXp={600}
          onStart={() => setGameState('playing')}
        />
      )}

      {/* 2. RESULT SCREEN */}
      {gameState === 'result' && (
        <GameResultScreen
          gameTitle="Mito o Realidad"
          earnedScore={earnedScore}
          correctCount={correctCount}
          totalCount={statements.length}
          maxStreak={maxStreak}
          onReplay={handleReplay}
          onContinue={() => onFinishGame(earnedScore, correctCount, statements.length, 'game-myth-reality')}
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
            <div className="w-full h-2.5 bg-navy-900 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-brand-electric to-brand-cyan rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Center Swipable Card Area */}
          <div className="relative z-10 my-auto space-y-4 py-2">
            {/* Gesture Hint */}
            {!isAnswered && (
              <div className="flex items-center justify-between px-2 text-[10px] font-black uppercase text-slate-400">
                <span className="flex items-center gap-1 text-rose-400">
                  <span>👈 Deslizá a MITO</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span>REALIDAD a la derecha 👉</span>
                </span>
              </div>
            )}

            {/* Physical Interactive Swipe Card */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{
                transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotationDeg}deg)`,
                transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                touchAction: 'none',
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
              className={`relative sismo-card p-6 sm:p-7 min-h-[220px] rounded-3xl flex flex-col justify-between text-center backdrop-blur-xl border-2 transition-colors ${
                swipeDirection === 'right'
                  ? 'border-emerald-400 bg-emerald-950/90 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                  : swipeDirection === 'left'
                  ? 'border-rose-500 bg-rose-950/90 shadow-[0_0_30px_rgba(244,63,94,0.5)]'
                  : 'border-brand-cyan/40 bg-navy-950/90 shadow-glow-cyan/20'
              }`}
            >
              {/* Category Pill */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest bg-brand-cyan/15 px-3 py-1 rounded-full border border-brand-cyan/30">
                  {item.category}
                </span>

                <span className="text-[10px] font-bold text-slate-400">
                  {currentIdx + 1} de {statements.length}
                </span>
              </div>

              {/* Statement Text */}
              <h2 className="font-black text-lg sm:text-xl text-white leading-snug py-3">
                "{item.statement}"
              </h2>

              {/* Bottom Swipe Badge Overlay during dragging */}
              {swipeDirection && !isAnswered && (
                <div className="absolute inset-0 rounded-3xl flex items-center justify-center pointer-events-none bg-navy-950/40 backdrop-blur-xs">
                  <span className={`px-6 py-2 rounded-2xl font-black text-xl uppercase tracking-wider shadow-2xl border-2 ${
                    swipeDirection === 'right'
                      ? 'bg-emerald-500 text-navy-950 border-white rotate-[-6deg]'
                      : 'bg-rose-500 text-white border-white rotate-[6deg]'
                  }`}>
                    {swipeDirection === 'right' ? '✓ REALIDAD' : '✗ MITO'}
                  </span>
                </div>
              )}

              {/* Swipe Helper Line */}
              {!isAnswered && !isDragging && (
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold opacity-60">
                  <MoveHorizontal className="w-3.5 h-3.5" />
                  <span>Arrastrá la tarjeta o tocá los botones</span>
                </div>
              )}
            </div>

            {/* Quick Action Buttons: MITO vs REALIDAD */}
            {!isAnswered ? (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => handleAnswer(false)}
                  className="h-16 rounded-2xl bg-rose-950/90 hover:bg-rose-900 border-2 border-rose-500 text-rose-100 font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(244,63,94,0.3)] active:scale-[0.97] transition-all hover:scale-105"
                >
                  <ThumbsDown className="w-5 h-5 stroke-[2.5]" />
                  <span>❌ MITO</span>
                </button>

                <button
                  onClick={() => handleAnswer(true)}
                  className="h-16 rounded-2xl bg-emerald-950/90 hover:bg-emerald-900 border-2 border-emerald-400 text-emerald-100 font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.3)] active:scale-[0.97] transition-all hover:scale-105"
                >
                  <ThumbsUp className="w-5 h-5 stroke-[2.5]" />
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
                  <span>{currentIdx + 1 < statements.length ? 'Siguiente Afirmación' : 'Ver Resultados (+XP)'}</span>
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
