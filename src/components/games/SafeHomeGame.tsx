import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, CheckCircle2, Sparkles, ArrowRight, Flame, Wrench, Activity, ShieldAlert, Check } from 'lucide-react';
import { ScreenId, SafeHomeHazard, UserMode } from '../../types';
import { SAFE_HOME_HAZARDS } from '../../services/gamesService';
import { Button } from '../ui/Button';
import { sound } from '../../lib/sound';
import { GameIntroCountdown } from './GameIntroCountdown';
import { GameResultScreen } from './GameResultScreen';
import { RoomIllustrationSvg } from './RoomIllustrationSvg';

interface SafeHomeGameProps {
  userMode?: UserMode;
  onFinishGame: (earnedScore: number, securedCount: number, totalCount: number, gameId?: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const SafeHomeGame: React.FC<SafeHomeGameProps> = ({
  userMode = 'kids',
  onFinishGame,
  onNavigate
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [hazards, setHazards] = useState<SafeHomeHazard[]>(SAFE_HOME_HAZARDS);
  const [selectedHazard, setSelectedHazard] = useState<SafeHomeHazard | null>(null);
  const [earnedScore, setEarnedScore] = useState<number>(0);
  const [isShakingRoom, setIsShakingRoom] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);

  const securedCount = hazards.filter(h => h.isSecured).length;
  const isAllSecured = securedCount === hazards.length;
  const safetyPercentage = Math.round((securedCount / hazards.length) * 100);

  const handleSimulateEarthquake = () => {
    sound.playEarthquakeRumble(2.0);
    setIsShakingRoom(true);
    setTimeout(() => setIsShakingRoom(false), 2000);
  };

  const handleTapHazard = (hazard: SafeHomeHazard) => {
    setSelectedHazard(hazard);

    if (!hazard.isSecured) {
      sound.playFixHazard();
      const newStreak = streakCount + 1;
      setStreakCount(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      setHazards(prev => prev.map(h => h.id === hazard.id ? { ...h, isSecured: true } : h));
      const points = 100 + (newStreak > 1 ? 25 * (newStreak - 1) : 0);
      setEarnedScore(prev => prev + points);
    } else {
      sound.playClick();
    }
  };

  const handleFinish = () => {
    setGameState('result');
  };

  const handleReplay = () => {
    setHazards(SAFE_HOME_HAZARDS.map(h => ({ ...h, isSecured: false })));
    setSelectedHazard(null);
    setEarnedScore(0);
    setStreakCount(0);
    setMaxStreak(0);
    setGameState('intro');
  };

  const finalBonus = isAllSecured ? 200 : 0;
  const finalTotalScore = earnedScore + finalBonus;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 flex flex-col justify-between p-4 sm:p-5 pb-24 max-w-md mx-auto overflow-x-hidden"
      style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
    >
      <div className="fixed inset-0 bg-navy-950/85 pointer-events-none z-0" />

      {/* 1. INTRO COUNTDOWN */}
      {gameState === 'intro' && (
        <GameIntroCountdown
          title="CASA SEGURA"
          category="PREVENCIÓN Y HOGAR · MISIÓN 03"
          subtitle="Identificación y mitigación de riesgos no estructurales"
          instructions="Inspeccioná la habitación sanjuanina y tocá los 8 elementos vulnerables (espejo, muebles altos, TV, vidrios, gas, pasillos) para fijarlos con normas INPRES."
          icon="🏠"
          rewardXp={600}
          onStart={() => setGameState('playing')}
        />
      )}

      {/* 2. RESULT SCREEN */}
      {gameState === 'result' && (
        <GameResultScreen
          gameTitle="Habitación Segura"
          earnedScore={finalTotalScore}
          correctCount={securedCount}
          totalCount={hazards.length}
          maxStreak={maxStreak}
          speedBonus={finalBonus}
          onReplay={handleReplay}
          onContinue={() => onFinishGame(finalTotalScore, securedCount, hazards.length, 'game-safe-home')}
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

              {/* Safety Percentage Badge */}
              <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-navy-900/90 border border-brand-cyan/50 text-brand-cyan font-black text-xs shadow-glow-cyan/20">
                <ShieldCheck className="w-4 h-4 text-brand-cyan" />
                <span>{safetyPercentage}% Sismorresistente</span>
              </div>

              <div className="flex items-center gap-1.5 bg-navy-900/90 px-3 py-1 rounded-2xl border border-brand-gold/40">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span className="font-black text-xs text-brand-yellow tabular-nums">+{earnedScore} pts</span>
              </div>
            </div>

            {/* Title & Earthquake Simulator Button */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <h1 className="font-black text-lg text-white uppercase tracking-tight">
                  HABITACIÓN SEGURA
                </h1>
                <p className="text-[11px] text-slate-300">
                  Asegurá {hazards.length - securedCount} riesgo(s) pendientes
                </p>
              </div>

              <button
                onClick={handleSimulateEarthquake}
                disabled={isShakingRoom}
                className="px-3.5 py-1.5 rounded-full bg-rose-950/90 border border-rose-500 text-rose-300 font-black text-[11px] uppercase flex items-center gap-1.5 hover:bg-rose-900 active:scale-95 transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              >
                <Activity className={`w-4 h-4 ${isShakingRoom ? 'animate-spin text-white' : 'animate-pulse text-rose-400'}`} />
                <span>{isShakingRoom ? '¡TERREMOTO!' : 'Simular Sismo'}</span>
              </button>
            </div>
          </div>

          {/* Detailed Architectural Room SVG Canvas */}
          <div className="relative z-10 my-auto py-1">
            <RoomIllustrationSvg
              hazards={hazards}
              selectedHazardId={selectedHazard?.id || null}
              isShaking={isShakingRoom}
              onSelectHazard={handleTapHazard}
            />
          </div>

          {/* Bottom Sheet Feedback or Instructions */}
          <div className="relative z-10 space-y-2.5">
            {selectedHazard ? (
              <div className="sismo-card p-3.5 space-y-1.5 border-brand-cyan/40 bg-navy-900/90 backdrop-blur-xl animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{selectedHazard.icon}</span>
                    <div>
                      <h3 className="font-black text-xs sm:text-sm text-white">
                        {selectedHazard.name}
                      </h3>
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Objeto Asegurado (+100 pts)
                      </span>
                    </div>
                  </div>
                  <Wrench className="w-4 h-4 text-brand-cyan shrink-0 animate-bounce" />
                </div>

                <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                  💡 <strong className="text-brand-cyan">Solución INPRES:</strong> {selectedHazard.solution}
                </p>
              </div>
            ) : (
              <div className="sismo-card p-3 text-center text-xs text-slate-300 font-medium bg-navy-900/80 border-white/10">
                Tocá los iconos ⚠️ en la habitación para asegurar objetos antes del temblor.
              </div>
            )}

            {/* Action Button */}
            <Button
              variant={isAllSecured ? 'primary' : 'secondary'}
              size="md"
              fullWidth
              onClick={handleFinish}
            >
              <span>{isAllSecured ? '¡CASA 100% SEGURA! (Ver Resultados)' : `Guardar Avance (${securedCount}/${hazards.length})`}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
