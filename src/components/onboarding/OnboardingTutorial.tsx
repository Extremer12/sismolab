import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, Sparkles, Shield, User, Trophy, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserMode, UserProfile } from '../../types';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';

interface OnboardingTutorialProps {
  user: UserProfile;
  onComplete: (age: number, mode: UserMode) => void;
  onClose?: () => void;
}

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({
  user,
  onComplete,
  onClose
}) => {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedAge, setSelectedAge] = useState<number>(user.age || 14);

  const totalSlides = 4;

  const handleNext = () => {
    sound.playClick();
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

  const handleFinish = () => {
    sound.playWinFanfare();
    const assignedMode: UserMode = selectedAge < 13 ? 'kids' : 'adult';
    onComplete(selectedAge, assignedMode);
  };

  const quickAges = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 25, 35, 45];

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/98 backdrop-blur-2xl flex flex-col justify-between p-5 sm:p-7 select-none font-sans text-slate-100 animate-in fade-in duration-300">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between pt-1">
        {currentSlide > 0 ? (
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-2xl bg-navy-900 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white"
            aria-label="Anterior"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-10" />
        )}

        {/* Progress Indicator (Android Style Step Dots) */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? 'w-7 bg-brand-cyan shadow-glow-cyan'
                  : idx < currentSlide
                  ? 'w-2 bg-brand-cyan/60'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Skip button */}
        {currentSlide < totalSlides - 1 ? (
          <button
            onClick={() => {
              sound.playClick();
              // Jump straight to age slide if not visited, else finish
              if (currentSlide < 1) {
                setCurrentSlide(1);
              } else {
                handleFinish();
              }
            }}
            className="text-xs font-black uppercase text-slate-400 hover:text-brand-cyan transition-colors px-2 py-1"
          >
            {language === 'es' ? 'Omitir' : 'Skip'}
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Main Slide Carousel Content */}
      <div className="my-auto max-w-md mx-auto w-full space-y-5 text-center py-4">
        
        {/* SLIDE 0: Welcome to SISMO LAB */}
        {currentSlide === 0 && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
            {/* SVG Illustration Container (Ready for animated SVGs) */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-3xl bg-gradient-to-br from-navy-900 via-navy-850 to-blue-950/60 border-2 border-brand-cyan/40 p-4 flex items-center justify-center shadow-[0_0_35px_rgba(0,184,255,0.25)] relative overflow-hidden group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-brand-electric to-brand-cyan opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
              
              {/* Native Android Graphic Icon Slot */}
              <div className="relative z-10 text-center space-y-2">
                <div className="w-20 h-20 rounded-2xl bg-brand-cyan/20 border border-brand-cyan/50 flex items-center justify-center text-4xl mx-auto shadow-glow-cyan">
                  🏛️
                </div>
                <div className="flex justify-center gap-1.5 pt-1">
                  <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-brand-electric" />
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-black text-brand-cyan uppercase tracking-widest">
                INPRES & ZION CODE
              </span>
              <h2 className="font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
                {language === 'es' ? '¡Bienvenido a SISMO LAB!' : 'Welcome to SISMO LAB!'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-sm mx-auto">
                {language === 'es'
                  ? 'La plataforma interactiva de prevención y ciencia sísmica diseñada para aprender jugando y salvar vidas ante un terremoto.'
                  : 'The interactive earthquake science and preparedness platform designed to save lives while learning through gaming.'}
              </p>
            </div>
          </div>
        )}

        {/* SLIDE 1: Age Selection (Crucial for Fair Mode Points) */}
        {currentSlide === 1 && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-3xl bg-brand-yellow/20 border border-brand-yellow/50 flex items-center justify-center text-4xl mx-auto shadow-glow-gold">
              🎂
            </div>

            <div className="space-y-1">
              <h2 className="font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
                {language === 'es' ? '¿Cuántos años tenés?' : 'How old are you?'}
              </h2>
              <p className="text-xs text-slate-300 font-medium max-w-xs mx-auto">
                {language === 'es'
                  ? 'Esto define tu categoría de juego para competir justamente en el ranking escolar.'
                  : 'This sets your competitive category on the leaderboard.'}
              </p>
            </div>

            {/* Age Number Display */}
            <div className="sismo-card p-4 border-brand-cyan/40 bg-navy-900/90 max-w-xs mx-auto space-y-3">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setSelectedAge(prev => Math.max(6, prev - 1))}
                  className="w-11 h-11 rounded-2xl bg-navy-950 border border-white/10 hover:border-brand-cyan text-xl font-black text-white active:scale-90 transition-all"
                >
                  -
                </button>
                <div className="text-center">
                  <span className="font-black text-4xl text-brand-cyan tabular-nums block leading-none">
                    {selectedAge}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1 block">
                    {language === 'es' ? 'AÑOS DE EDAD' : 'YEARS OLD'}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedAge(prev => Math.min(99, prev + 1))}
                  className="w-11 h-11 rounded-2xl bg-navy-950 border border-white/10 hover:border-brand-cyan text-xl font-black text-white active:scale-90 transition-all"
                >
                  +
                </button>
              </div>

              {/* Assigned Mode Badge */}
              <div className={`p-2.5 rounded-xl border text-xs font-black uppercase tracking-wide flex items-center justify-center gap-2 ${
                selectedAge < 13
                  ? 'bg-brand-cyan/15 border-brand-cyan text-brand-cyan'
                  : 'bg-brand-purple/20 border-brand-purple text-purple-300'
              }`}>
                <span>{selectedAge < 13 ? '🧒 Modo Niños Asignado (6-12)' : '🔬 Modo Jóvenes y Adultos Asignado (+13)'}</span>
              </div>
            </div>

            {/* Quick Age Chip Selector */}
            <div className="flex flex-wrap justify-center gap-1.5 max-w-xs mx-auto pt-1">
              {quickAges.map((age) => (
                <button
                  key={age}
                  onClick={() => setSelectedAge(age)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    selectedAge === age
                      ? 'bg-brand-cyan text-navy-950 font-black shadow-glow-cyan scale-105'
                      : 'bg-navy-900 border border-white/10 text-slate-300 hover:border-white/30'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SLIDE 2: Missions, Emergency Go-Bag and 4-Second Reflexes */}
        {currentSlide === 2 && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
            {/* SVG Illustration Container (Ready for animated SVGs) */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-3xl bg-gradient-to-br from-navy-900 via-navy-850 to-amber-950/40 border-2 border-brand-gold/40 p-4 flex items-center justify-center shadow-[0_0_35px_rgba(245,184,61,0.25)] relative overflow-hidden">
              <div className="relative z-10 text-center space-y-2">
                <div className="w-20 h-20 rounded-2xl bg-brand-gold/20 border border-brand-gold/50 flex items-center justify-center text-4xl mx-auto shadow-glow-gold">
                  🎒
                </div>
                <div className="flex justify-center gap-2 text-2xl">
                  <span>⚡</span>
                  <span>🏠</span>
                  <span>💡</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-black text-brand-yellow uppercase tracking-widest">
                {language === 'es' ? 'ENTRENAMIENTO REAL' : 'REAL TRAINING'}
              </span>
              <h2 className="font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
                {language === 'es' ? 'Misiones & Reflejos en 4s' : 'Missions & 4s Reflexes'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-sm mx-auto">
                {language === 'es'
                  ? 'Armá tu mochila de supervivencia de 72 horas, asegurá peligros en el hogar y aprendé qué hacer al instante si tiembla.'
                  : 'Pack your 72-hour emergency go-bag, secure home hazards and train quick survival decisions during shaking.'}
              </p>
            </div>
          </div>
        )}

        {/* SLIDE 3: Leaderboard Rules and Fair Play */}
        {currentSlide === 3 && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
            {/* SVG Illustration Container (Ready for animated SVGs) */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-3xl bg-gradient-to-br from-navy-900 via-navy-850 to-purple-950/40 border-2 border-brand-purple/40 p-4 flex items-center justify-center shadow-[0_0_35px_rgba(168,85,247,0.25)] relative overflow-hidden">
              <div className="relative z-10 text-center space-y-2">
                <div className="w-20 h-20 rounded-2xl bg-brand-purple/20 border border-brand-purple/50 flex items-center justify-center text-4xl mx-auto shadow-glow-purple">
                  🏆
                </div>
                <div className="flex justify-center items-center gap-1.5 text-xs font-black text-brand-yellow">
                  <span>★ #1 PODIO SAN JUAN ★</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-black text-purple-300 uppercase tracking-widest">
                {language === 'es' ? 'SISTEMA DE PUNTOS OFICIAL' : 'OFFICIAL SCORING SYSTEM'}
              </span>
              <h2 className="font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
                {language === 'es' ? 'Reglas del Ranking' : 'Leaderboard Rules'}
              </h2>
              
              <div className="bg-navy-900/90 p-3 rounded-2xl border border-white/10 text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-slate-200">
                    {language === 'es'
                      ? 'Los puntos oficiales del ranking se suman en el modo asignado a tu edad.'
                      : 'Official ranking points are scored in the mode matching your age category.'}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                  <p className="text-slate-300">
                    {language === 'es'
                      ? 'Los adultos (+13) pueden jugar el Modo Niños para practicar o enseñar a sus hijos, pero sin sumar puntos oficiales de ranking.'
                      : 'Adults (13+) can play Kids Mode for practice or teaching, but without official ranking score inflation.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Floating Action Bar */}
      <div className="max-w-md mx-auto w-full pt-2">
        <button
          onClick={handleNext}
          className="w-full h-14 rounded-full bg-gradient-to-r from-brand-electric via-brand-cyan to-brand-electric text-navy-950 font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(0,184,255,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>
            {currentSlide === totalSlides - 1
              ? (language === 'es' ? '¡Comenzar Desafío!' : 'Start Challenge!')
              : (language === 'es' ? 'Siguiente' : 'Next')}
          </span>
          <ChevronRight className="w-5 h-5 stroke-[3]" />
        </button>
      </div>

    </div>
  );
};
