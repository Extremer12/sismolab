import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb, Flame, ArrowRight, Timer, Delete, Sparkles } from 'lucide-react';
import { ScreenId, UserMode, NumericQuestion } from '../../types';
import { getRandomNumericQuestions } from '../../services/gamesService';
import { Button } from '../ui/Button';
import { sound } from '../../lib/sound';
import { GameIntroCountdown } from './GameIntroCountdown';
import { GameResultScreen } from './GameResultScreen';
import { useLanguage } from '../../i18n/LanguageContext';

interface WhatIsSeismicGameProps {
  userMode: UserMode;
  onFinishGame: (earnedScore: number, correctCount: number, totalCount: number, gameId?: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const WhatIsSeismicGame: React.FC<WhatIsSeismicGameProps> = ({
  userMode,
  onFinishGame,
  onNavigate
}) => {
  const { language } = useLanguage();
  const timerLimit = userMode === 'kids' ? 25 : 20;

  // Game States: 'intro' | 'playing' | 'result'
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [activeQuestions, setActiveQuestions] = useState<NumericQuestion[]>(() => getRandomNumericQuestions(5, userMode));

  const [currentIdx, setCurrentIdx] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [earnedScore, setEarnedScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalSpeedBonus, setTotalSpeedBonus] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(timerLimit);
  const [speedBonusAwarded, setSpeedBonusAwarded] = useState(0);

  const question = activeQuestions[currentIdx] || activeQuestions[0];
  const progressPercent = ((currentIdx + 1) / activeQuestions.length) * 100;

  // Countdown timer per question
  useEffect(() => {
    if (gameState !== 'playing' || isAnswered) return;

    if (questionTimer <= 0) {
      handleSubmitAnswer(true);
      return;
    }

    const timer = setInterval(() => {
      setQuestionTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [questionTimer, isAnswered, gameState]);

  // Physical keyboard support (numbers 0-9, Backspace, Enter)
  useEffect(() => {
    if (gameState !== 'playing' || isAnswered) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        if (inputValue.length < 8) {
          sound.playClick();
          setInputValue(prev => prev + e.key);
        }
      } else if (e.key === 'Backspace') {
        sound.playClick();
        setInputValue(prev => prev.slice(0, -1));
      } else if (e.key === 'Enter') {
        if (inputValue.trim().length > 0) {
          handleSubmitAnswer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isAnswered, inputValue]);

  // Handle on-screen keypad tap
  const handleDigitTap = (digit: string) => {
    if (isAnswered) return;
    if (inputValue.length < 8) {
      sound.playClick();
      setInputValue(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    if (isAnswered) return;
    sound.playClick();
    setInputValue(prev => prev.slice(0, -1));
  };

  const handleSubmitAnswer = (isTimeout: boolean = false) => {
    if (isAnswered) return;
    setIsAnswered(true);

    const cleanInput = inputValue.trim();
    const target = question.targetValue.trim();
    const alternates = question.acceptedValues || [];
    const correct = !isTimeout && (cleanInput === target || alternates.includes(cleanInput));

    setIsCorrect(correct);

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const baseScore = question.points || 100;
      const speedBonus = questionTimer > (timerLimit / 2) ? Math.round(questionTimer * (userMode === 'kids' ? 3 : 5)) : 0;
      const streakBonus = newStreak > 1 ? 25 * (newStreak - 1) : 0;
      const roundScore = baseScore + speedBonus + streakBonus;

      setSpeedBonusAwarded(speedBonus);
      setTotalSpeedBonus(prev => prev + speedBonus);
      setEarnedScore(prev => prev + roundScore);
      setCorrectCount(prev => prev + 1);

      if (newStreak >= 2) {
        sound.playComboStreak(newStreak);
      } else {
        sound.playCorrect();
      }
    } else {
      setStreak(0);
      setSpeedBonusAwarded(0);
      sound.playWrong();
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIdx + 1 < activeQuestions.length) {
      setCurrentIdx(prev => prev + 1);
      setInputValue('');
      setIsAnswered(false);
      setIsCorrect(false);
      setShowHint(false);
      setQuestionTimer(timerLimit);
      setSpeedBonusAwarded(0);
    } else {
      setGameState('result');
    }
  };

  const handleRestart = () => {
    setActiveQuestions(getRandomNumericQuestions(5, userMode));
    setCurrentIdx(0);
    setInputValue('');
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
    setEarnedScore(0);
    setCorrectCount(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalSpeedBonus(0);
    setQuestionTimer(timerLimit);
    setGameState('intro');
  };

  // 1. Game Intro Countdown
  if (gameState === 'intro') {
    return (
      <GameIntroCountdown
        title={language === 'es' ? 'Código Sísmico & Memoria' : 'Seismic Code & History'}
        category={language === 'es' ? 'Precisión Numérica' : 'Numeric Precision'}
        subtitle={language === 'es' ? 'Ingresá el número o año exacto de cada dato clave' : 'Enter the exact number or year of each key fact'}
        instructions={language === 'es' ? 'Usá el teclado táctil o físico para escribir la respuesta correcta antes de que acabe el tiempo.' : 'Use the on-screen keypad or physical keyboard to type the correct answer before time runs out.'}
        icon="🔢"
        rewardXp={500}
        timeLimitSec={timerLimit}
        onStart={() => setGameState('playing')}
      />
    );
  }

  // 2. Game Result Screen
  if (gameState === 'result') {
    return (
      <GameResultScreen
        gameTitle={language === 'es' ? 'Código Sísmico & Memoria' : 'Seismic Code & History'}
        earnedScore={earnedScore}
        correctCount={correctCount}
        totalCount={activeQuestions.length}
        maxStreak={maxStreak}
        speedBonus={totalSpeedBonus}
        onReplay={handleRestart}
        onContinue={() => onFinishGame(earnedScore, correctCount, activeQuestions.length, 'game-what-is')}
      />
    );
  }

  // 3. Main Numeric Game Screen
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 pb-12 max-w-lg mx-auto font-sans select-none overflow-x-hidden">
      
      {/* Top Header: Back button, Category Pill, Timer & Flame Streak */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => { sound.playClick(); onNavigate('home'); }}
            className="w-10 h-10 rounded-full bg-navy-900 border border-white/10 hover:border-brand-cyan/40 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Center Category Badge */}
          <div className="px-3.5 py-1 rounded-full bg-navy-900 border border-brand-cyan/30 text-brand-cyan font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-cyan/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{question.category}</span>
          </div>

          {/* Timer & Streak Badges */}
          <div className="flex items-center gap-2">
            {streak > 1 && (
              <div className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs flex items-center gap-1 animate-bounce">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{streak}x</span>
              </div>
            )}

            <div className={`px-3 py-1 rounded-full font-black text-xs tabular-nums flex items-center gap-1 border transition-colors ${
              questionTimer <= 5
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse'
                : 'bg-navy-900 border-white/10 text-brand-cyan'
            }`}>
              <Timer className="w-3.5 h-3.5" />
              <span>{questionTimer}s</span>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-black uppercase text-slate-400 px-1">
            <span>{language === 'es' ? 'Pregunta' : 'Question'} {currentIdx + 1} / {activeQuestions.length}</span>
            <span className="text-brand-yellow">★ {earnedScore} pts</span>
          </div>
          <div className="h-1.5 w-full bg-navy-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-electric via-brand-cyan to-brand-cyan transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question & Digit Input Center Stage */}
      <div className="my-auto space-y-4 py-2 text-center">
        
        {/* Unit indicator chip */}
        {question.unit && (
          <div className="inline-block px-3 py-0.5 rounded-full bg-navy-900 border border-brand-cyan/40 text-brand-cyan font-black text-[10px] uppercase tracking-widest">
            {language === 'es' ? `INGRESA EL VALOR EN [ ${question.unit} ]` : `ENTER VALUE IN [ ${question.unit} ]`}
          </div>
        )}

        {/* Question Text */}
        <h2 className="font-black text-xl sm:text-2xl text-white tracking-tight leading-snug px-1 max-w-md mx-auto">
          {question.question}
        </h2>

        {/* Interactive Numeric Value Display (Large Digital Dial) */}
        <div className="relative py-1">
          <div className={`mx-auto max-w-xs h-16 rounded-2xl bg-navy-900/90 border-2 transition-all flex items-center justify-center px-4 gap-2 ${
            isAnswered
              ? isCorrect
                ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.4)]'
                : 'border-rose-500 bg-rose-950/40 text-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.4)]'
              : inputValue.length > 0
              ? 'border-brand-cyan text-brand-cyan shadow-[0_0_20px_rgba(0,184,255,0.3)]'
              : 'border-white/15 text-slate-400'
          }`}>
            <span className="font-mono font-black text-3xl sm:text-4xl tracking-widest tabular-nums">
              {inputValue || (language === 'es' ? '____' : '____')}
            </span>
            {!isAnswered && (
              <span className="w-0.5 h-7 bg-brand-cyan animate-pulse" />
            )}
          </div>
        </div>

        {/* Hint toggle button */}
        {!isAnswered && (
          <div className="pt-0.5">
            {!showHint ? (
              <button
                onClick={() => { sound.playClick(); setShowHint(true); }}
                className="text-xs font-bold text-slate-400 hover:text-brand-yellow transition-colors inline-flex items-center gap-1.5"
              >
                <Lightbulb className="w-3.5 h-3.5 text-brand-yellow" />
                <span>{language === 'es' ? '¿Necesitás una pista?' : 'Need a hint?'}</span>
              </button>
            ) : (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-medium max-w-sm mx-auto animate-in fade-in">
                💡 {question.hint}
              </div>
            )}
          </div>
        )}

        {/* Feedback on Answer Submission */}
        {isAnswered && (
          <div className={`p-3.5 rounded-2xl border text-left text-xs space-y-1.5 max-w-sm mx-auto animate-in fade-in zoom-in-95 ${
            isCorrect
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
          }`}>
            <div className="flex items-center justify-between font-black uppercase">
              <div className="flex items-center gap-1.5">
                {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                <span>{isCorrect ? (language === 'es' ? '¡Exacto!' : 'Correct!') : (language === 'es' ? 'Respuesta Incorrecta' : 'Incorrect Answer')}</span>
              </div>
              <span className="text-white font-mono text-sm">
                {question.targetValue} {question.unit}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              {question.explanation}
            </p>
          </div>
        )}

      </div>

      {/* Bottom Area: Tactile Number Pad (While Playing) or Next Button (When Answered) */}
      <div className="pt-2 max-w-sm mx-auto w-full">
        {!isAnswered ? (
          <div className="space-y-2">
            {/* 3x4 Tactile Keypad */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDigitTap(digit)}
                  className="h-12 sm:h-13 rounded-2xl bg-navy-900 border border-white/10 hover:border-brand-cyan text-xl font-mono font-black text-white active:scale-95 transition-all shadow-sm hover:bg-navy-850"
                >
                  {digit}
                </button>
              ))}

              {/* Backspace */}
              <button
                onClick={handleBackspace}
                className="h-12 sm:h-13 rounded-2xl bg-navy-900/80 border border-white/10 hover:border-rose-500/40 text-slate-300 hover:text-rose-400 flex items-center justify-center active:scale-95 transition-all"
                aria-label="Borrar dígito"
              >
                <Delete className="w-5 h-5" />
              </button>

              {/* Zero */}
              <button
                onClick={() => handleDigitTap('0')}
                className="h-12 sm:h-13 rounded-2xl bg-navy-900 border border-white/10 hover:border-brand-cyan text-xl font-mono font-black text-white active:scale-95 transition-all shadow-sm hover:bg-navy-850"
              >
                0
              </button>

              {/* Submit OK Button */}
              <button
                onClick={() => handleSubmitAnswer()}
                disabled={inputValue.length === 0}
                className={`h-12 sm:h-13 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center active:scale-95 transition-all ${
                  inputValue.length > 0
                    ? 'bg-gradient-to-r from-brand-electric to-brand-cyan text-navy-950 shadow-glow-cyan'
                    : 'bg-navy-900/50 border border-white/5 text-slate-600 cursor-not-allowed'
                }`}
              >
                {language === 'es' ? 'Confirmar' : 'Confirm'}
              </button>
            </div>
          </div>
        ) : (
          /* Next Question Button */
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleNext}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            <span>{currentIdx + 1 < activeQuestions.length ? (language === 'es' ? 'Siguiente Pregunta' : 'Next Question') : (language === 'es' ? 'Ver Resultados' : 'View Results')}</span>
          </Button>
        )}
      </div>

    </div>
  );
};
