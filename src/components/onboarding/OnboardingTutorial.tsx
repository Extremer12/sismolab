import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, Shield, Trophy, AlertCircle, CheckCircle2, PackageCheck, User, Loader2 } from 'lucide-react';
import { UserMode, UserProfile } from '../../types';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import { isNicknameAvailable } from '../../services/authService';

interface OnboardingTutorialProps {
  user: UserProfile;
  onComplete: (nickname: string, age: number, mode: UserMode) => void;
  onClose?: () => void;
}

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({
  user,
  onComplete,
  onClose
}) => {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedAge, setSelectedAge] = useState<number>(user.age || 12);
  const [nickname, setNickname] = useState<string>(user.nickname || '');
  const [nickStatus, setNickStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [nickError, setNickError] = useState<string>('');

  const totalSlides = 4;
  const isEs = language === 'es';

  // Debounced Nickname Verification
  useEffect(() => {
    const clean = nickname.trim();
    if (!clean) {
      setNickStatus('invalid');
      setNickError(isEs ? 'Ingresá tu nombre o apodo para jugar' : 'Enter your name or nickname to play');
      return;
    }
    if (clean.length < 3) {
      setNickStatus('invalid');
      setNickError(isEs ? 'Debe tener al menos 3 caracteres' : 'Must have at least 3 characters');
      return;
    }
    if (clean.length > 18) {
      setNickStatus('invalid');
      setNickError(isEs ? 'Máximo 18 caracteres' : 'Max 18 characters');
      return;
    }

    setNickStatus('checking');
    setNickError('');

    const timer = setTimeout(async () => {
      const res = await isNicknameAvailable(clean, user.id);
      if (res.available) {
        setNickStatus('available');
        setNickError('');
      } else {
        setNickStatus('taken');
        setNickError(res.error || (isEs ? 'Este nombre ya está en uso' : 'This name is already taken'));
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [nickname, user.id, isEs]);

  const handleNext = async () => {
    sound.playClick();

    // Validation for Slide 1 (Nickname & Age)
    if (currentSlide === 1) {
      const clean = nickname.trim();
      if (!clean || clean.length < 3) {
        setNickStatus('invalid');
        setNickError(isEs ? 'Por favor escribe tu nombre (mínimo 3 letras)' : 'Please enter your name (min 3 letters)');
        return;
      }

      setNickStatus('checking');
      const res = await isNicknameAvailable(clean, user.id);
      if (!res.available) {
        setNickStatus('taken');
        setNickError(res.error || (isEs ? 'Este nombre ya está en uso. ¡Elegí otro!' : 'Name already taken. Pick another!'));
        sound.playWrong();
        return;
      }
    }

    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    sound.playClick();
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleFinish = async () => {
    const clean = nickname.trim() || (isEs ? 'Explorador' : 'Explorer');
    sound.playWinFanfare();
    const assignedMode: UserMode = selectedAge < 13 ? 'kids' : 'adult';
    onComplete(clean, selectedAge, assignedMode);
  };

  const quickAges = [8, 10, 12, 14, 16, 18, 25, 35, 50];

  return (
    <div className="fixed inset-0 z-50 bg-navy-950 flex flex-col justify-between p-6 sm:p-10 select-none font-sans text-slate-100 animate-in fade-in duration-300 overflow-y-auto">
      
      {/* Ambient Depth Lights */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-cyan/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-electric/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

      {/* 1. Top Bar Navigation */}
      <div className="relative z-10 flex items-center justify-between pt-1 max-w-lg mx-auto w-full shrink-0">
        {currentSlide > 0 ? (
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-navy-900 border border-white/10 hover:border-brand-cyan flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95"
            aria-label="Anterior"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-10" />
        )}

        {/* Step Progress Dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (idx > currentSlide && currentSlide === 1 && nickStatus !== 'available') return;
                sound.playClick();
                setCurrentSlide(idx);
              }}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === currentSlide
                  ? 'w-8 bg-brand-cyan shadow-[0_0_12px_rgba(0,184,255,0.8)]'
                  : idx < currentSlide
                  ? 'w-2 bg-brand-cyan/60'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Skip button (only allowed after slide 1 where nickname is chosen) */}
        {currentSlide > 1 && currentSlide < totalSlides - 1 ? (
          <button
            onClick={handleFinish}
            className="text-xs font-black uppercase text-slate-400 hover:text-brand-cyan transition-colors px-2 py-1"
          >
            {isEs ? 'Omitir' : 'Skip'}
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* 2. Slide Content Area */}
      <div className="relative z-10 my-auto max-w-lg mx-auto w-full text-center space-y-5 py-3">
        
        {/* SLIDE 0: Welcome to SISMO LAB */}
        {currentSlide === 0 && (
          <div className="space-y-5 animate-editorial-1">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-brand-cyan/20 rounded-full blur-2xl animate-pulse" />
              <img
                src="/images/logozioncode-sinfondo.png"
                alt="Zion Code"
                className="w-28 h-28 object-contain relative z-10 drop-shadow-[0_0_25px_rgba(0,184,255,0.4)]"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black text-brand-cyan uppercase tracking-[0.25em] block">
                ZION CODE · ESCUELA POLICÍA FEDERAL ARGENTINA
              </span>
              <h2 className="font-black text-3xl sm:text-4xl text-white tracking-tight uppercase leading-none">
                {isEs ? '¡Bienvenido a SISMO LAB!' : 'Welcome to SISMO LAB!'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-md mx-auto pt-1">
                {isEs
                  ? 'La plataforma digital interactiva de autoprotección y ciencia sísmica diseñada para aprender jugando y salvar vidas ante un terremoto.'
                  : 'The interactive digital platform designed to build earthquake self-protection skills and save lives through gamified learning.'}
              </p>
            </div>
          </div>
        )}

        {/* SLIDE 1: Nickname & Age Customization (Unique Nickname Enforcement) */}
        {currentSlide === 1 && (
          <div className="space-y-4 animate-editorial-1 text-left">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black text-brand-yellow uppercase tracking-[0.25em] block">
                {isEs ? 'PASO 02 · TU PERFIL DE EXPLORADOR' : 'STEP 02 · YOUR EXPLORER PROFILE'}
              </span>
              <h2 className="font-black text-2xl sm:text-3xl text-white tracking-tight uppercase leading-none">
                {isEs ? 'Personalizá tu Jugador' : 'Customize Your Player'}
              </h2>
            </div>

            {/* A. Nickname Input Card */}
            <div className="sismo-card p-4 rounded-2xl border border-brand-cyan/40 bg-navy-900/90 space-y-2 shadow-lg">
              <label className="text-[11px] font-black uppercase tracking-wider text-brand-cyan flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>{isEs ? 'Nombre o Apodo de Juego:' : 'Player Nickname:'}</span>
              </label>

              <div className="relative flex items-center">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value.slice(0, 18))}
                  placeholder={isEs ? 'Escribe tu nombre único...' : 'Enter your unique nickname...'}
                  className={`w-full h-12 px-4 rounded-xl bg-navy-950 text-white font-black text-base border-2 transition-all outline-none pr-11 ${
                    nickStatus === 'available'
                      ? 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : nickStatus === 'taken' || nickStatus === 'invalid'
                      ? 'border-rose-500'
                      : 'border-white/20 focus:border-brand-cyan'
                  }`}
                  autoFocus
                />

                <div className="absolute right-3.5 flex items-center">
                  {nickStatus === 'checking' && (
                    <Loader2 className="w-5 h-5 text-brand-cyan animate-spin" />
                  )}
                  {nickStatus === 'available' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                  {(nickStatus === 'taken' || (nickStatus === 'invalid' && nickname.length > 0)) && (
                    <AlertCircle className="w-5 h-5 text-rose-400" />
                  )}
                </div>
              </div>

              {/* Status Message */}
              <div className="min-h-[18px]">
                {nickStatus === 'available' && (
                  <span className="text-[10px] font-extrabold text-emerald-400 flex items-center gap-1">
                    ✓ {isEs ? '¡Nombre disponible!' : 'Nickname available!'}
                  </span>
                )}
                {nickError && (
                  <span className="text-[10px] font-extrabold text-rose-400 flex items-center gap-1">
                    ⚠️ {nickError}
                  </span>
                )}
                {nickStatus === 'idle' && !nickError && (
                  <span className="text-[10px] text-slate-400">
                    {isEs ? 'Elige un nombre único para que nadie te copie en el ranking.' : 'Pick a unique name for the leaderboard.'}
                  </span>
                )}
              </div>
            </div>

            {/* B. Age Selection Card */}
            <div className="sismo-card p-4 rounded-2xl border border-brand-gold/40 bg-navy-900/90 space-y-3 shadow-lg text-center">
              <span className="text-[11px] font-black uppercase tracking-wider text-brand-yellow block">
                {isEs ? '¿Cuántos años tenés?' : 'How old are you?'}
              </span>

              {/* Stepper */}
              <div className="flex items-center justify-center gap-5">
                <button
                  type="button"
                  onClick={() => { sound.playClick(); setSelectedAge(prev => Math.max(5, prev - 1)); }}
                  className="w-11 h-11 rounded-full bg-navy-950 border border-white/15 hover:border-brand-cyan text-xl font-black text-white active:scale-90 transition-all flex items-center justify-center shadow-sm"
                >
                  -
                </button>

                <div className="min-w-[80px]">
                  <span className="font-black text-4xl text-brand-cyan tabular-nums block leading-none drop-shadow-[0_0_15px_rgba(0,184,255,0.5)]">
                    {selectedAge}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mt-0.5">
                    {isEs ? 'AÑOS' : 'YEARS'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => { sound.playClick(); setSelectedAge(prev => Math.min(99, prev + 1)); }}
                  className="w-11 h-11 rounded-full bg-navy-950 border border-white/15 hover:border-brand-cyan text-xl font-black text-white active:scale-90 transition-all flex items-center justify-center shadow-sm"
                >
                  +
                </button>
              </div>

              {/* Assigned Category Badge */}
              <div className={`py-1.5 px-3 rounded-full text-[11px] font-black uppercase tracking-wider inline-block ${
                selectedAge < 13
                  ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/40 shadow-glow-cyan/20'
                  : 'bg-purple-500/15 text-purple-300 border border-purple-500/40 shadow-sm'
              }`}>
                {selectedAge < 13
                  ? (isEs ? '🧒 Categoría Niños (6 a 12 años)' : '🧒 Kids Category (6-12 yrs)')
                  : (isEs ? '🔬 Categoría Jóvenes y Adultos (+13)' : '🔬 Youth & Adults (+13)')}
              </div>

              {/* Quick Age Chips */}
              <div className="flex flex-wrap justify-center gap-1 pt-1">
                {quickAges.map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => { sound.playClick(); setSelectedAge(age); }}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold transition-all ${
                      selectedAge === age
                        ? 'bg-brand-cyan text-navy-950 shadow-glow-cyan scale-105'
                        : 'bg-navy-950 border border-white/10 text-slate-300 hover:border-white/30'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 2: Missions, Kit and 4s Reflexes */}
        {currentSlide === 2 && (
          <div className="space-y-5 animate-editorial-1">
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-brand-gold/15 rounded-full blur-2xl animate-pulse" />
              <div className="w-20 h-20 rounded-full bg-navy-900 border border-brand-gold/50 flex items-center justify-center text-brand-gold shadow-[0_0_30px_rgba(245,184,61,0.3)]">
                <PackageCheck className="w-10 h-10" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black text-brand-yellow uppercase tracking-[0.25em] block">
                {isEs ? 'PASO 03 · ENTRENAMIENTO PRÁCTICO' : 'STEP 03 · PRACTICAL TRAINING'}
              </span>
              <h2 className="font-black text-2xl sm:text-3xl text-white tracking-tight uppercase leading-none">
                {isEs ? 'Misiones & Reflejos en 4s' : 'Missions & 4s Reflexes'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-md mx-auto pt-1">
                {isEs
                  ? 'Armá tu mochila de emergencia de 72 horas, descubrí peligros hogareños y entrená decisiones en 4 segundos ante una sacudida real.'
                  : 'Pack your 72-hour survival go-bag, secure hazard points and train quick decision-making under earthquake shaking.'}
              </p>
            </div>
          </div>
        )}

        {/* SLIDE 3: Leaderboard Rules */}
        {currentSlide === 3 && (
          <div className="space-y-5 animate-editorial-1">
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-purple-500/15 rounded-full blur-2xl animate-pulse" />
              <div className="w-20 h-20 rounded-full bg-navy-900 border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                <Trophy className="w-10 h-10" />
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="text-[10px] font-black text-purple-300 uppercase tracking-[0.25em] block">
                {isEs ? 'PASO 04 · REGLAS DE PUNTUACIÓN' : 'STEP 04 · LEADERBOARD RULES'}
              </span>
              <h2 className="font-black text-2xl sm:text-3xl text-white tracking-tight uppercase leading-none">
                {isEs ? 'Reglas del Ranking' : 'Leaderboard Rules'}
              </h2>
              
              <div className="space-y-2 text-left text-xs max-w-sm mx-auto pt-1">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-slate-200">
                    {isEs
                      ? 'Los puntos oficiales del ranking escolar se suman compitiendo en el modo correspondiente a tu edad.'
                      : 'Official ranking points are scored in the category matching your age.'}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                  <p className="text-slate-300">
                    {isEs
                      ? 'Al rejugar una misión, solo sumás puntos a tu perfil si superás tu récord anterior.'
                      : 'When replaying a mission, you only gain extra points if you beat your personal best.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 3. Bottom Action Button */}
      <div className="relative z-10 max-w-lg mx-auto w-full pt-2 shrink-0">
        <button
          onClick={handleNext}
          className="w-full h-14 rounded-full bg-gradient-to-r from-brand-electric via-brand-cyan to-brand-electric text-navy-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(0,184,255,0.4)] hover:scale-[1.01] active:scale-[0.98] transition-all"
        >
          <span>
            {currentSlide === totalSlides - 1
              ? (isEs ? '¡Comenzar Desafío!' : 'Start Challenge!')
              : (isEs ? 'Siguiente' : 'Next')}
          </span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

    </div>
  );
};
