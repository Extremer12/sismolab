import React, { useEffect, useState } from 'react';
import { Trophy, Star, Sparkles, RotateCcw, ArrowRight, Flame, Zap, Award, CheckCircle2 } from 'lucide-react';
import { sound } from '../../lib/sound';

export interface GameResultScreenProps {
  gameTitle: string;
  earnedScore: number;
  correctCount: number;
  totalCount: number;
  maxStreak?: number;
  speedBonus?: number;
  onReplay: () => void;
  onContinue: () => void;
}

export const GameResultScreen: React.FC<GameResultScreenProps> = ({
  gameTitle,
  earnedScore,
  correctCount,
  totalCount,
  maxStreak = 0,
  speedBonus = 0,
  onReplay,
  onContinue
}) => {
  const [starsVisible, setStarsVisible] = useState<number>(0);

  // Calculate star count: 3 stars if >= 85%, 2 stars if >= 60%, 1 star otherwise
  const accuracy = totalCount > 0 ? correctCount / totalCount : 1;
  const starsEarned = accuracy >= 0.85 ? 3 : accuracy >= 0.55 ? 2 : 1;

  useEffect(() => {
    sound.playWinFanfare();

    // Trigger star pop animations sequentially
    const t1 = setTimeout(() => {
      setStarsVisible(1);
      sound.playStarEarned(1);
    }, 400);

    const t2 = setTimeout(() => {
      if (starsEarned >= 2) {
        setStarsVisible(2);
        sound.playStarEarned(2);
      }
    }, 850);

    const t3 = setTimeout(() => {
      if (starsEarned >= 3) {
        setStarsVisible(3);
        sound.playStarEarned(3);
      }
    }, 1300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [starsEarned]);

  const getTitleMessage = () => {
    if (starsEarned === 3) return '¡DESEMPEÑO IMPECABLE!';
    if (starsEarned === 2) return '¡EXCELENTE TRABAJO!';
    return '¡BUEN INTENTO!';
  };

  const getSubtitleMessage = () => {
    if (starsEarned === 3) return 'Demostraste un dominio total de la sismología sanjuanina.';
    if (starsEarned === 2) return '¡Estás muy cerca de la puntuación perfecta!';
    return 'Repasá los conceptos y volvé a intentarlo para subir al podio.';
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/95 backdrop-blur-2xl flex flex-col justify-between p-5 select-none font-sans text-slate-100 max-w-md mx-auto animate-in fade-in duration-300">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Badge */}
      <div className="relative z-10 pt-4 text-center">
        <span className="px-4 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-brand-yellow font-black text-[11px] uppercase tracking-[0.25em] inline-block shadow-glow-gold/30">
          DESAFÍO COMPLETADO
        </span>
      </div>

      {/* Center Cinematic Result */}
      <div className="relative z-10 my-auto text-center space-y-4 py-2">
        {/* Animated 3 Stars */}
        <div className="flex justify-center items-end gap-3 pb-1">
          {/* Star 1 */}
          <div className={`transition-all duration-300 ${starsVisible >= 1 ? 'scale-100 opacity-100 text-brand-yellow drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]' : 'scale-50 opacity-20 text-slate-600'}`}>
            <Star className="w-12 h-12 fill-current rotate-[-12deg]" />
          </div>

          {/* Star 2 (Protagonist Middle Star) */}
          <div className={`transition-all duration-300 -mb-2 ${starsVisible >= 2 ? 'scale-125 opacity-100 text-brand-yellow drop-shadow-[0_0_25px_rgba(250,204,21,0.9)]' : 'scale-75 opacity-20 text-slate-600'}`}>
            <Star className="w-16 h-16 fill-current" />
          </div>

          {/* Star 3 */}
          <div className={`transition-all duration-300 ${starsVisible >= 3 ? 'scale-100 opacity-100 text-brand-yellow drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]' : 'scale-50 opacity-20 text-slate-600'}`}>
            <Star className="w-12 h-12 fill-current rotate-[12deg]" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1">
          <h2 className="font-black text-2xl sm:text-3xl text-white uppercase tracking-tight leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            {getTitleMessage()}
          </h2>
          <p className="text-xs text-slate-300 font-medium px-4 leading-relaxed">
            {getSubtitleMessage()}
          </p>
        </div>

        {/* XP Big Display */}
        <div className="sismo-card p-4 rounded-3xl border-2 border-brand-gold/60 bg-gradient-to-b from-amber-950/40 via-navy-950/90 to-navy-950/95 shadow-[0_8px_30px_rgba(245,184,61,0.25)] space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-left">
              <div className="w-10 h-10 rounded-2xl bg-brand-gold/20 border border-brand-gold/50 flex items-center justify-center text-brand-yellow shadow-glow-gold/30">
                <Sparkles className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-black text-brand-gold uppercase tracking-wider block">
                  XP GANADO
                </span>
                <span className="font-extrabold text-xs text-white">
                  {gameTitle}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-black text-3xl text-brand-yellow tabular-nums drop-shadow-md">
                +{earnedScore}
              </span>
              <span className="text-xs font-bold text-brand-gold block">PUNTOS</span>
            </div>
          </div>

          {/* Breakdown Stats 3 Columns */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-navy-900/80 p-2.5 rounded-2xl border border-white/10 space-y-0.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
              <span className="font-black text-sm text-white tabular-nums block">
                {correctCount}/{totalCount}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Aciertos
              </span>
            </div>

            <div className="bg-navy-900/80 p-2.5 rounded-2xl border border-white/10 space-y-0.5">
              <Flame className="w-4 h-4 text-orange-400 mx-auto fill-orange-400" />
              <span className="font-black text-sm text-white tabular-nums block">
                x{Math.max(1, maxStreak)}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Racha Máx.
              </span>
            </div>

            <div className="bg-navy-900/80 p-2.5 rounded-2xl border border-white/10 space-y-0.5">
              <Zap className="w-4 h-4 text-brand-cyan mx-auto" />
              <span className="font-black text-sm text-white tabular-nums block">
                +{speedBonus}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Bonus Veloz
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions (Replay + Next/Ranking) */}
      <div className="relative z-10 pb-6 w-full space-y-2.5">
        <button
          onClick={() => { sound.playClick(); onContinue(); }}
          className="w-full h-14 rounded-full bg-gradient-to-r from-brand-yellow via-amber-400 to-yellow-500 text-navy-950 font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_6px_30px_rgba(245,184,61,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>Continuar & Guardar Ranking</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button
          onClick={() => { sound.playClick(); onReplay(); }}
          className="w-full h-12 rounded-full bg-navy-900/90 border border-white/20 hover:border-brand-cyan/50 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4 text-brand-cyan" />
          <span>Jugar Otra Ronda (Nuevas Preguntas)</span>
        </button>
      </div>
    </div>
  );
};
