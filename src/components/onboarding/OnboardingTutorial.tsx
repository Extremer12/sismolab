import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, Shield, Trophy, AlertCircle, CheckCircle2, PackageCheck, Zap, Activity } from 'lucide-react';
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

  const quickAges = [8, 10, 12, 14, 16, 18, 25, 35, 50];

  return (
    <div className="fixed inset-0 z-50 bg-navy-950 flex flex-col justify-between p-6 sm:p-10 select-none font-sans text-slate-100 animate-in fade-in duration-300 overflow-hidden">
      
      {/* Background Ambient Radial Lighting (No Box, pure depth) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-cyan/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-electric/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

      {/* 1. Top Bar Navigation */}
      <div className="relative z-10 flex items-center justify-between pt-1 max-w-lg mx-auto w-full">
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
              onClick={() => { sound.playClick(); setCurrentSlide(idx); }}
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

        {/* Skip button */}
        {currentSlide < totalSlides - 1 ? (
          <button
            onClick={() => {
              sound.playClick();
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

      {/* 2. Slide Content Area (Spatial & Open, Zero Repetitive Cards) */}
      <div className="relative z-10 my-auto max-w-lg mx-auto w-full text-center space-y-6 py-4">
        
        {/* SLIDE 0: Welcome to SISMO LAB */}
        {currentSlide === 0 && (
          <div className="space-y-6 animate-editorial-1">
            {/* SVG Visual Graphic Container */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-brand-cyan/20 rounded-full blur-2xl animate-pulse" />
              <img
                src="/images/logozioncode-sinfondo.png"
                alt="Zion Code"
                className="w-32 h-32 object-contain relative z-10 drop-shadow-[0_0_25px_rgba(0,184,255,0.4)]"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black text-brand-cyan uppercase tracking-[0.25em] block">
                ZION CODE · ESCUELA POLICÍA FEDERAL ARGENTINA
              </span>
              <h2 className="font-black text-3xl sm:text-4xl text-white tracking-tight uppercase leading-none">
                {language === 'es' ? '¡Bienvenido a SISMO LAB!' : 'Welcome to SISMO LAB!'}
              </h2>
              <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-md mx-auto pt-1">
                {language === 'es'
                  ? 'La plataforma digital interactiva de autoprotección y ciencia sísmica diseñada para aprender jugando y salvar vidas ante un terremoto.'
                  : 'The interactive digital platform designed to build earthquake self-protection skills and save lives through gamified learning.'}
              </p>
            </div>
          </div>
        )}

        {/* SLIDE 1: Age Selection (Fair Scoring System) */}
        {currentSlide === 1 && (
          <div className="space-y-6 animate-editorial-1">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-brand-yellow uppercase tracking-[0.25em] block">
                PASO 02 · CATEGORÍA JUSTA
              </span>
              <h2 className="font-black text-3xl sm:text-4xl text-white tracking-tight uppercase leading-none">
                {language === 'es' ? '¿Cuántos años tenés?' : 'How old are you?'}
              </h2>
              <p className="text-xs text-slate-300 font-medium max-w-xs mx-auto">
                {language === 'es'
                  ? 'Tu edad define la categoría oficial para que la competencia en el ranking escolar sea justa.'
                  : 'Your age sets your official competition category on the leaderboard.'}
              </p>
            </div>

            {/* Tactile Age Dial */}
            <div className="space-y-4 max-w-xs mx-auto">
              <div className="flex items-center justify-center gap-5">
                <button
                  onClick={() => { sound.playClick(); setSelectedAge(prev => Math.max(6, prev - 1)); }}
                  className="w-12 h-12 rounded-full bg-navy-900 border border-white/10 hover:border-brand-cyan text-2xl font-black text-white active:scale-90 transition-all flex items-center justify-center"
                >
                  -
                </button>

                <div className="text-center min-w-[100px]">
                  <span className="font-black text-5xl text-brand-cyan tabular-nums block leading-none drop-shadow-[0_0_20px_rgba(0,184,255,0.5)]">
                    {selectedAge}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 block">
                    {language === 'es' ? 'AÑOS' : 'YEARS'}
                  </span>
                </div>

                <button
                  onClick={() => { sound.playClick(); setSelectedAge(prev => Math.min(99, prev + 1)); }}
                  className="w-12 h-12 rounded-full bg-navy-900 border border-white/10 hover:border-brand-cyan text-2xl font-black text-white active:scale-90 transition-all flex items-center justify-center"
                >
                  +
                </button>
              </div>

              {/* Mode indicator pill */}
              <div className={`py-2 px-4 rounded-full text-xs font-black uppercase tracking-wider ${
                selectedAge < 13
                  ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/40'
                  : 'bg-purple-500/15 text-purple-300 border border-purple-500/40'
              }`}>
                {selectedAge < 13
                  ? (language === 'es' ? 'Modo Niños Asignado (6 a 12 años)' : 'Kids Mode Assigned (6-12 yrs)')
                  : (language === 'es' ? 'Modo Jóvenes y Adultos Asignado (+13)' : 'Youth & Adults Mode Assigned (+13)')}
              </div>

              {/* Quick Age Chips */}
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {quickAges.map((age) => (
                  <button
                    key={age}
                    onClick={() => { sound.playClick(); setSelectedAge(age); }}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      selectedAge === age
                        ? 'bg-brand-cyan text-navy-950 font-black shadow-[0_0_12px_rgba(0,184,255,0.6)] scale-105'
                        : 'bg-navy-900 border border-white/10 text-slate-300 hover:border-white/30'
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
          <div className="space-y-6 animate-editorial-1">
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-brand-gold/15 rounded-full blur-2xl animate-pulse" />
              <div className="w-24 h-24 rounded-full bg-navy-900 border border-brand-gold/50 flex items-center justify-center text-brand-gold shadow-[0_0_30px_rgba(245,184,61,0.3)]">
                <PackageCheck className="w-12 h-12" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black text-brand-yellow uppercase tracking-[0.25em] block">
                PASO 03 · ENTRENAMIENTO PRÁCTICO
              </span>
              <h2 className="font-black text-3xl sm:text-4xl text-white tracking-tight uppercase leading-none">
                {language === 'es' ? 'Misiones & Reflejos en 4s' : 'Missions & 4s Reflexes'}
              </h2>
              <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-md mx-auto pt-1">
                {language === 'es'
                  ? 'Armá tu mochila de emergencia de 72 horas, asegurá peligros hogareños y entrená decisiones en 4 segundos ante una sacudida real.'
                  : 'Pack your 72-hour survival go-bag, secure hazard points and train quick decision-making under earthquake shaking.'}
              </p>
            </div>
          </div>
        )}

        {/* SLIDE 3: Leaderboard Rules */}
        {currentSlide === 3 && (
          <div className="space-y-6 animate-editorial-1">
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-purple-500/15 rounded-full blur-2xl animate-pulse" />
              <div className="w-24 h-24 rounded-full bg-navy-900 border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                <Trophy className="w-12 h-12" />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-black text-purple-300 uppercase tracking-[0.25em] block">
                PASO 04 · REGLAS DE PUNTUACIÓN
              </span>
              <h2 className="font-black text-3xl sm:text-4xl text-white tracking-tight uppercase leading-none">
                {language === 'es' ? 'Reglas del Ranking' : 'Leaderboard Rules'}
              </h2>
              
              <div className="space-y-2 text-left text-xs max-w-sm mx-auto pt-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-slate-200">
                    {language === 'es'
                      ? 'Los puntos oficiales del ranking escolar se suman compitiendo en el modo correspondiente a tu edad.'
                      : 'Official ranking points are scored in the category matching your age.'}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                  <p className="text-slate-300">
                    {language === 'es'
                      ? 'Los mayores de 13 años pueden jugar el Modo Niños para practicar o explorar, pero sin sumar puntos al ranking oficial para mantener la equidad.'
                      : 'Players 13+ can practice Kids Mode freely, but without official ranking score inflation.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 3. Bottom Action Button (Clean Pill Design) */}
      <div className="relative z-10 max-w-lg mx-auto w-full pt-2">
        <button
          onClick={handleNext}
          className="w-full h-14 rounded-full bg-gradient-to-r from-brand-electric via-brand-cyan to-brand-electric text-navy-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(0,184,255,0.4)] hover:scale-[1.01] active:scale-[0.98] transition-all"
        >
          <span>
            {currentSlide === totalSlides - 1
              ? (language === 'es' ? '¡Comenzar Desafío!' : 'Start Challenge!')
              : (language === 'es' ? 'Siguiente' : 'Next')}
          </span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

    </div>
  );
};
