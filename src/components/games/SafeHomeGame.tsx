import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, CheckCircle2, Sparkles, ArrowRight, Flame, Wrench, Activity } from 'lucide-react';
import { ScreenId, SafeHomeHazard } from '../../types';
import { SAFE_HOME_HAZARDS } from '../../services/gamesService';
import { Button } from '../ui/Button';
import { sound } from '../../lib/sound';

interface SafeHomeGameProps {
  onFinishGame: (earnedScore: number, securedCount: number, totalCount: number) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const SafeHomeGame: React.FC<SafeHomeGameProps> = ({
  onFinishGame,
  onNavigate
}) => {
  const [hazards, setHazards] = useState<SafeHomeHazard[]>(SAFE_HOME_HAZARDS);
  const [selectedHazard, setSelectedHazard] = useState<SafeHomeHazard | null>(null);
  const [earnedScore, setEarnedScore] = useState<number>(0);
  const [isShakingRoom, setIsShakingRoom] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(0);

  const securedCount = hazards.filter(h => h.isSecured).length;
  const isAllSecured = securedCount === hazards.length;

  const handleSimulateEarthquake = () => {
    sound.playEarthquakeRumble(1.8);
    setIsShakingRoom(true);
    setTimeout(() => setIsShakingRoom(false), 1800);
  };

  const handleTapHazard = (hazard: SafeHomeHazard) => {
    setSelectedHazard(hazard);

    if (!hazard.isSecured) {
      sound.playFixHazard();
      const newStreak = streakCount + 1;
      setStreakCount(newStreak);

      setHazards(prev => prev.map(h => h.id === hazard.id ? { ...h, isSecured: true } : h));
      setEarnedScore(prev => prev + 100 + (newStreak > 1 ? 25 * (newStreak - 1) : 0));
    } else {
      sound.playClick();
    }
  };

  const handleFinish = () => {
    sound.playWinFanfare();
    onFinishGame(earnedScore + (isAllSecured ? 150 : 0), securedCount, hazards.length);
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

          <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500 text-emerald-400 font-black text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>{securedCount} de {hazards.length} Asegurados</span>
          </div>

          <div className="flex items-center gap-1.5 bg-navy-900/90 px-3 py-1 rounded-2xl border border-brand-gold/40">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span className="font-black text-xs text-brand-yellow">+{earnedScore} pts</span>
          </div>
        </div>

        {/* Title and Earthquake Simulator Button */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h1 className="font-black text-lg text-white uppercase tracking-tight">
              HABITACIÓN SEGURA
            </h1>
            <p className="text-[11px] text-slate-300">
              Tocá y asegurá los objetos antes del sismo.
            </p>
          </div>

          <button
            onClick={handleSimulateEarthquake}
            disabled={isShakingRoom}
            className="px-3 py-1.5 rounded-full bg-rose-950/90 border border-rose-500 text-rose-300 font-black text-[10px] uppercase flex items-center gap-1 hover:bg-rose-900 active:scale-95 transition-all shadow-[0_0_12px_rgba(244,63,94,0.3)]"
          >
            <Activity className="w-3.5 h-3.5 animate-pulse text-rose-400" />
            <span>{isShakingRoom ? '¡TEMBLOR!' : 'Simular Sismo'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Room Canvas */}
      <div className={`relative z-10 my-auto w-full h-72 rounded-3xl bg-gradient-to-b from-slate-900 via-navy-900 to-navy-950 border-2 border-brand-cyan/40 overflow-hidden shadow-2xl flex items-center justify-center transition-transform ${
        isShakingRoom ? 'animate-shake' : ''
      }`}>
        {/* Room Architectural Grid & Perspective */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#22D3EE_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute bottom-0 w-full h-16 bg-navy-950/90 border-t border-white/10"></div>

        {/* Hazard Interactive Nodes */}
        {hazards.map((hazard) => {
          return (
            <button
              key={hazard.id}
              onClick={() => handleTapHazard(hazard)}
              style={{ left: `${hazard.x}%`, top: `${hazard.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                hazard.isSecured
                  ? 'bg-emerald-950/95 border-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105'
                  : 'bg-navy-900/95 border-2 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse hover:scale-110'
              }`}
            >
              <span className="text-2xl">{hazard.icon}</span>
              <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full mt-0.5 shadow-sm ${
                hazard.isSecured ? 'bg-emerald-500 text-navy-950' : 'bg-rose-500 text-white'
              }`}>
                {hazard.isSecured ? '✓ FIJADO' : '⚠️ ASEGURAR'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Sheet Feedback or Instructions */}
      <div className="relative z-10 space-y-2.5">
        {selectedHazard ? (
          <div className="sismo-card p-3.5 space-y-1.5 border-brand-cyan/40 bg-navy-900/90 backdrop-blur-xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedHazard.icon}</span>
                <div>
                  <h3 className="font-black text-xs sm:text-sm text-white">
                    {selectedHazard.name}
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    ✓ Objeto Asegurado (+100 pts)
                  </span>
                </div>
              </div>
              <Wrench className="w-4 h-4 text-brand-cyan shrink-0" />
            </div>

            <p className="text-[11px] text-slate-300 font-medium">
              💡 Solución INPRES: {selectedHazard.solution}
            </p>
          </div>
        ) : (
          <div className="sismo-card p-3 text-center text-xs text-slate-300 font-medium bg-navy-900/80 border-white/10">
            Tocá los 6 objetos peligrosos para fijarlos y proteger la habitación.
          </div>
        )}

        {/* Action Button */}
        <Button
          variant={isAllSecured ? 'primary' : 'secondary'}
          size="md"
          fullWidth
          onClick={handleFinish}
        >
          <span>{isAllSecured ? '¡CASA 100% SEGURA! (Finalizar +XP)' : `Guardar Avance (${securedCount}/${hazards.length})`}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
