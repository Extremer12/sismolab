import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, CheckCircle2, Sparkles, ArrowRight, Flame, Wrench, Activity, Search, Check, AlertTriangle, ShieldAlert } from 'lucide-react';
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

  const handleSelectHazard = (hazard: SafeHomeHazard) => {
    sound.playClick();
    setSelectedHazard(hazard);
  };

  const handleFixHazard = (hazard: SafeHomeHazard) => {
    if (hazard.isSecured) return;

    sound.playFixHazard();
    const newStreak = streakCount + 1;
    setStreakCount(newStreak);
    if (newStreak > maxStreak) setMaxStreak(newStreak);

    setHazards(prev => prev.map(h => h.id === hazard.id ? { ...h, isSecured: true } : h));
    setSelectedHazard(prev => prev && prev.id === hazard.id ? { ...prev, isSecured: true } : prev);

    const points = 100 + (newStreak > 1 ? 25 * (newStreak - 1) : 0);
    setEarnedScore(prev => prev + points);
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

  const finalBonus = isAllSecured ? 250 : 0;
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
          title="HABITACIÓN SEGURA"
          category="PREVENCIÓN Y HOGAR · MISIÓN 02"
          subtitle="Identificación y anclaje de objetos vulnerables"
          instructions="Inspeccioná la habitación sanjuanina. Tocá los diferentes objetos y muebles para evaluar su vulnerabilidad y aplicar las medidas de seguridad INPRES."
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
          {/* Top Bar Controls */}
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
                <span>{securedCount}/{hazards.length} Asegurados ({safetyPercentage}%)</span>
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
                  INSPECCIÓN DEL HOGAR
                </h1>
                <p className="text-[11px] text-slate-300">
                  Tocá los elementos de la habitación para inspeccionarlos
                </p>
              </div>

              <button
                onClick={handleSimulateEarthquake}
                disabled={isShakingRoom}
                className="px-3.5 py-1.5 rounded-full bg-rose-950/90 border border-rose-500 text-rose-300 font-black text-[11px] uppercase flex items-center gap-1.5 hover:bg-rose-900 active:scale-95 transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              >
                <Activity className={`w-4 h-4 ${isShakingRoom ? 'animate-spin text-white' : 'animate-pulse text-rose-400'}`} />
                <span>{isShakingRoom ? '¡TERREMOTO!' : 'Probar Sismo'}</span>
              </button>
            </div>
          </div>

          {/* Detailed Architectural Room SVG Canvas */}
          <div className="relative z-10 my-auto py-1">
            <RoomIllustrationSvg
              hazards={hazards}
              selectedHazardId={selectedHazard?.id || null}
              isShaking={isShakingRoom}
              onSelectHazard={handleSelectHazard}
            />

            {/* Quick Item Selector Chips */}
            <div className="flex gap-1.5 overflow-x-auto py-2 scrollbar-none">
              {hazards.map((h) => (
                <button
                  key={h.id}
                  onClick={() => handleSelectHazard(h)}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold shrink-0 flex items-center gap-1.5 transition-all active:scale-95 ${
                    selectedHazard?.id === h.id
                      ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan shadow-glow-cyan/30'
                      : h.isSecured
                      ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                      : 'bg-navy-900/80 border-white/10 text-slate-300 hover:border-white/30'
                  }`}
                >
                  <span>{h.icon}</span>
                  <span>{h.name.split(' ')[0]}</span>
                  {h.isSecured && <Check className="w-3 h-3 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Inspection Bottom Sheet */}
          <div className="relative z-10 space-y-2.5">
            {selectedHazard ? (
              <div className="sismo-card p-4 space-y-3 border-brand-cyan/40 bg-navy-950/90 backdrop-blur-xl animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{selectedHazard.icon}</span>
                    <div>
                      <h3 className="font-black text-sm text-white">
                        {selectedHazard.name}
                      </h3>
                      <span className={`text-[10px] font-bold flex items-center gap-1 ${
                        selectedHazard.isSecured ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {selectedHazard.isSecured ? (
                          <>
                            <Check className="w-3 h-3 stroke-[3]" /> Asegurado con Norma INPRES
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3" /> Requiere Intervención
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {streakCount >= 2 && !selectedHazard.isSecured && (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-950 border border-orange-500 text-orange-400 text-[10px] font-black">
                      <Flame className="w-3 h-3 fill-orange-500" /> x{streakCount}
                    </div>
                  )}
                </div>

                {/* Risk Description */}
                <div className="bg-navy-900/80 p-2.5 rounded-xl border border-white/10 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-100 block mb-0.5 font-bold">Riesgo en sismo:</strong>
                  {selectedHazard.hazardDescription}
                </div>

                {/* Solution / Action */}
                {!selectedHazard.isSecured ? (
                  <div className="space-y-2">
                    <div className="text-[11px] text-brand-cyan font-medium leading-relaxed bg-brand-cyan/10 p-2 rounded-xl border border-brand-cyan/30">
                      🛠️ <strong className="text-white">Solución Recomendada:</strong> {selectedHazard.solution}
                    </div>

                    <button
                      onClick={() => handleFixHazard(selectedHazard)}
                      className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-navy-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
                    >
                      <Wrench className="w-4 h-4 text-navy-950 stroke-[2.5]" />
                      <span>Aplicar Medida INPRES (+100 XP)</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2 font-medium">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Elemento asegurado correctamente. No se volcará ni desprenderá durante la sacudida.</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="sismo-card p-3.5 text-center text-xs text-slate-300 font-medium bg-navy-900/80 border-white/10 flex items-center justify-center gap-2">
                <Search className="w-4 h-4 text-brand-cyan shrink-0 animate-pulse" />
                <span>Tocá cualquier elemento de la habitación para diagnosticar su riesgo sísmico.</span>
              </div>
            )}

            {/* Action Button */}
            <Button
              variant={isAllSecured ? 'primary' : 'secondary'}
              size="md"
              fullWidth
              onClick={handleFinish}
            >
              <span>{isAllSecured ? '¡CASA 100% SEGURA! (Ver Resultados +XP)' : `Finalizar Inspección (${securedCount}/${hazards.length})`}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
