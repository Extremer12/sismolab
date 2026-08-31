import React from 'react';
import { X, Sparkles, Timer, Flame, Trophy, ShieldCheck, Zap, HelpCircle, CheckCircle2 } from 'lucide-react';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';

interface GameInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameInfoModal: React.FC<GameInfoModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const handleClose = () => {
    sound.playClick();
    onClose();
  };

  const isEs = language === 'es';

  return (
    <div className="fixed inset-0 z-[100] bg-navy-950/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 select-none font-sans text-slate-100 max-w-md mx-auto animate-in fade-in duration-200 overflow-y-auto">
      {/* Background glow ambiance */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-cyan/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between pt-2 pb-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-brand-cyan/20 border border-brand-cyan/50 flex items-center justify-center text-brand-cyan shadow-glow-cyan/20">
            <HelpCircle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest block">
              {isEs ? 'SISTEMA OFICIAL' : 'OFFICIAL GUIDE'}
            </span>
            <h2 className="font-black text-lg text-white leading-none uppercase">
              {isEs ? '¿Cómo Jugar y Sumar Puntos?' : 'How to Play & Score Points'}
            </h2>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="w-9 h-9 rounded-full bg-navy-900 border border-white/15 hover:border-brand-cyan/60 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Center Content - 4 Simple Cards */}
      <div className="relative z-10 my-auto py-4 space-y-3.5">
        
        {/* 1. ¿Cómo se juega? */}
        <div className="sismo-card p-4 rounded-2xl border border-brand-cyan/40 bg-navy-900/90 space-y-2 shadow-lg">
          <div className="flex items-center gap-2 text-brand-cyan">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <h3 className="font-black text-xs uppercase tracking-wider text-white">
              {isEs ? '1. Cómo Jugar las Misiones' : '1. How to Play Missions'}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isEs
              ? 'Leé cada situación y elegí la acción segura antes de que se acabe el tiempo. En la mochila arrastrá insumos vitales y en reflejos reaccioná en 4 segundos.'
              : 'Read each scenario and pick the safest action before time runs out. In the emergency bag drag vital items and in reflexes react within 4 seconds.'}
          </p>
        </div>

        {/* 2. Sistema de Puntos (XP) */}
        <div className="sismo-card p-4 rounded-2xl border border-brand-gold/40 bg-navy-900/90 space-y-2.5 shadow-lg">
          <div className="flex items-center gap-2 text-brand-yellow">
            <Sparkles className="w-4 h-4 shrink-0" />
            <h3 className="font-black text-xs uppercase tracking-wider text-white">
              {isEs ? '2. ¿Cómo se Ganan Puntos (XP)?' : '2. How are Points (XP) Earned?'}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="bg-navy-950/80 p-2.5 rounded-xl border border-white/10 space-y-1">
              <div className="flex items-center gap-1 text-emerald-400 font-extrabold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isEs ? 'Acierto Base' : 'Base Score'}</span>
              </div>
              <p className="text-slate-300 text-[10px] leading-tight">
                {isEs ? '+100 a +150 pts por respuesta correcta.' : '+100 to +150 pts per correct answer.'}
              </p>
            </div>

            <div className="bg-navy-950/80 p-2.5 rounded-xl border border-white/10 space-y-1">
              <div className="flex items-center gap-1 text-brand-cyan font-extrabold">
                <Zap className="w-3.5 h-3.5" />
                <span>{isEs ? 'Velocidad' : 'Speed Bonus'}</span>
              </div>
              <p className="text-slate-300 text-[10px] leading-tight">
                {isEs ? 'Responder rápido otorga bonus de velocidad.' : 'Answering fast awards speed bonuses.'}
              </p>
            </div>

            <div className="bg-navy-950/80 p-2.5 rounded-xl border border-white/10 space-y-1">
              <div className="flex items-center gap-1 text-orange-400 font-extrabold">
                <Flame className="w-3.5 h-3.5 fill-orange-400" />
                <span>{isEs ? 'Racha de Fuego' : 'Streak Combo'}</span>
              </div>
              <p className="text-slate-300 text-[10px] leading-tight">
                {isEs ? 'Acertar seguidas activa multiplicador de combo.' : 'Consecutive hits trigger combo multipliers.'}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Subir en el Ranking */}
        <div className="sismo-card p-4 rounded-2xl border border-purple-400/40 bg-navy-900/90 space-y-2 shadow-lg">
          <div className="flex items-center gap-2 text-purple-300">
            <Trophy className="w-4 h-4 shrink-0 text-brand-gold" />
            <h3 className="font-black text-xs uppercase tracking-wider text-white">
              {isEs ? '3. ¿Cómo Subir en el Ranking?' : '3. Climbing the Leaderboard'}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isEs
              ? 'Cada misión completada suma puntos a tu perfil. Al rejugar una misión, ¡solo sumás puntos si superás tu propio récord personal!'
              : 'Every completed mission adds XP to your profile. When replaying a mission, you only gain extra points if you beat your personal best!'}
          </p>
        </div>

        {/* 4. Juego Justo & Práctica */}
        <div className="sismo-card p-4 rounded-2xl border border-emerald-400/30 bg-navy-900/90 space-y-1.5 shadow-lg">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <h3 className="font-black text-xs uppercase tracking-wider text-white">
              {isEs ? '4. Juego Justo y Separación de Edades' : '4. Fair Play & Age Balance'}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isEs
              ? 'Para cuidar el ranking escolar, los mayores de 12 años pueden practicar las misiones infantiles libremente pero sin alterar el ranking de los más chicos.'
              : 'To protect the kids leaderboard, players 13+ can freely explore kids missions in Practice Mode without affecting the children rankings.'}
          </p>
        </div>

      </div>

      {/* Bottom Dismiss Button */}
      <div className="relative z-10 pt-2 pb-3 shrink-0">
        <button
          onClick={handleClose}
          className="w-full h-13 py-3.5 rounded-full bg-gradient-to-r from-brand-electric via-brand-cyan to-cyan-300 text-navy-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_6px_25px_rgba(0,184,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>{isEs ? '¡Entendido, a Jugar!' : 'Got it, Let’s Play!'}</span>
        </button>
      </div>
    </div>
  );
};
