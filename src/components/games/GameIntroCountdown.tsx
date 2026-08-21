import React, { useState, useEffect } from 'react';
import { Sparkles, Timer, Zap, Play, Flame } from 'lucide-react';
import { sound } from '../../lib/sound';

interface GameIntroCountdownProps {
  title: string;
  category: string;
  subtitle: string;
  instructions: string;
  icon: string;
  rewardXp: number;
  timeLimitSec?: number;
  onStart: () => void;
}

export const GameIntroCountdown: React.FC<GameIntroCountdownProps> = ({
  title,
  category,
  subtitle,
  instructions,
  icon,
  rewardXp,
  timeLimitSec,
  onStart
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  const startCountdown = () => {
    sound.playClick();
    setIsReady(true);
    setCountdown(3);
    sound.playCountdownBeep();
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 1) {
      const timer = setTimeout(() => {
        setCountdown(prev => (prev !== null ? prev - 1 : null));
        sound.playCountdownBeep();
      }, 900);
      return () => clearTimeout(timer);
    } else if (countdown === 1) {
      const timer = setTimeout(() => {
        setCountdown(0);
        sound.playCountdownGo();
      }, 900);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      const timer = setTimeout(() => {
        onStart();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [countdown, onStart]);

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/95 backdrop-blur-2xl flex flex-col justify-between p-5 select-none font-sans text-slate-100 max-w-md mx-auto animate-in fade-in duration-300">
      {/* Background Ambience Graphic */}
      <div className="absolute inset-0 bg-[radial-gradient(#22D3EE_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Top Bar Category */}
      <div className="relative z-10 pt-4 text-center">
        <span className="px-4 py-1.5 rounded-full bg-brand-cyan/15 border border-brand-cyan/40 text-brand-cyan font-black text-xs uppercase tracking-[0.2em] inline-block shadow-glow-cyan/20">
          {category}
        </span>
      </div>

      {/* Center Dynamic Area (Mission Info OR Giant Countdown) */}
      <div className="relative z-10 my-auto text-center space-y-5 py-4">
        {countdown === null ? (
          <div className="space-y-4 animate-in zoom-in-95 duration-200">
            {/* Pulsing Icon */}
            <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-brand-electric via-navy-900 to-navy-950 border-2 border-brand-cyan flex items-center justify-center text-5xl shadow-glow-cyan/40 animate-bounce">
              <span>{icon}</span>
              <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-brand-gold text-navy-950 font-black text-[10px] uppercase shadow-md">
                ★ +{rewardXp} XP
              </div>
            </div>

            {/* Mission Name & Info */}
            <div className="space-y-1">
              <h1 className="font-black text-2xl sm:text-3xl text-white uppercase tracking-tight leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-brand-cyan font-bold">
                {subtitle}
              </p>
            </div>

            {/* Mission Instructions Card */}
            <div className="sismo-card p-4 text-left border-white/15 bg-navy-900/90 space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                📋 OBJETIVO DEL DESAFÍO:
              </span>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                {instructions}
              </p>

              {timeLimitSec && (
                <div className="flex items-center gap-1.5 text-xs text-brand-yellow font-black pt-1 border-t border-white/10">
                  <Timer className="w-3.5 h-3.5" />
                  <span>Tiempo límite por ronda: {timeLimitSec} segundos</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Giant Cinematic Countdown */
          <div className="space-y-4 py-8 flex flex-col items-center justify-center animate-in zoom-in-50 duration-200">
            <div className="relative w-40 h-40 rounded-full border-4 border-brand-cyan bg-navy-900/90 flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.6)]">
              {countdown > 0 ? (
                <span className="font-black text-7xl sm:text-8xl text-white animate-ping" style={{ animationDuration: '0.9s' }}>
                  {countdown}
                </span>
              ) : (
                <span className="font-black text-4xl sm:text-5xl text-brand-yellow tracking-widest animate-bounce">
                  ¡YA!
                </span>
              )}
            </div>

            <p className="text-sm font-extrabold text-brand-cyan tracking-wider uppercase animate-pulse">
              {countdown > 0 ? '¡PREPARATE!' : '¡DEMOSTRÁ LO QUE SABÉS!'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Start Button */}
      <div className="relative z-10 pb-6 w-full space-y-2">
        {countdown === null && (
          <button
            onClick={startCountdown}
            className="w-full h-14 rounded-full bg-gradient-to-r from-brand-electric via-brand-blue to-brand-cyan text-navy-950 font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_6px_30px_rgba(0,184,255,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Play className="w-5 h-5 fill-navy-950" />
            <span>¡Comenzar Desafío!</span>
          </button>
        )}
      </div>
    </div>
  );
};
