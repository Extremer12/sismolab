import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ChevronDown, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { ScreenId } from '../../types';
import { sound } from '../../lib/sound';

interface HistoryPageProps {
  onNavigate: (screen: ScreenId) => void;
}

interface SlideEvent {
  id: string;
  year: string;
  title: string;
  location: string;
  dateStr: string;
  stats: string;
  description: string;
  imagePath: string;
  isCurrentEra?: boolean;
}

const HISTORICAL_SLIDES: SlideEvent[] = [
  {
    id: '1894',
    year: '1894',
    title: 'EL TERREMOTO HISTÓRICO',
    location: 'San Juan Colonial',
    dateStr: '27 de Octubre de 1894',
    stats: 'Magnitud ~7.5 • Intensidad IX • Gran Alcance',
    description: 'El mayor sismo registrado en la historia argentina. La casi totalidad de las construcciones de adobe sufrieron daños, dando inicio a los primeros debates de ingeniería sísmica.',
    imagePath: '/images/history_1894.png'
  },
  {
    id: '1944',
    year: '1944',
    title: 'PUNTO DE INFLEXIÓN & SOLIDARIDAD',
    location: 'Ciudad de San Juan',
    dateStr: '15 de Enero de 1944',
    stats: 'Magnitud 7.0 • Intensidad IX • Profundidad 11 km',
    description: 'Marcó el renacimiento de San Juan. A partir de las ruinas nació el primer código de construcción antisísmica del país y la planificación de una ciudad segura y moderna.',
    imagePath: '/images/history_1944.png'
  },
  {
    id: '1977',
    year: '1977',
    title: 'EL TERREMOTO DE CAUCETE',
    location: 'Sierra de Pie de Palo',
    dateStr: '23 de Noviembre de 1977',
    stats: 'Magnitud 7.4 • Intensidad IX • Caucete',
    description: 'Un evento de gran magnitud que confirmó la efectividad de las nuevas estructuras sismorresistentes y consolidó la creación del INPRES para el monitoreo nacional.',
    imagePath: '/images/history_1977.png'
  },
  {
    id: '2021',
    year: '2021',
    title: 'PRUEBA DE RESISTENCIA MODERNA',
    location: 'Pocito, San Juan',
    dateStr: '18 de Enero de 2021',
    stats: 'Magnitud 6.4 • Intensidad VII • Profundidad 8 km',
    description: 'A pesar del fuerte movimiento nocturno, las estructuras construidas bajo normas INPRES demostraron su eficacia salvando vidas y minimizando daños estructurales.',
    imagePath: '/images/history_2021.png'
  },
  {
    id: '2026',
    year: '2026',
    title: 'SAN JUAN HOY: CAPITAL DE LA PREVENCIÓN',
    location: 'San Juan, Actualidad',
    dateStr: 'Presente & Futuro',
    stats: 'Monitoreo Digital • Normas INPRES • Educación Ciudadana',
    description: 'San Juan es un referente internacional en resiliencia urbana. A través de la ciencia, la educación de las nuevas generaciones y la tecnología de SISMO LAB, seguimos preparados.',
    imagePath: '/images/2026.png',
    isCurrentEra: true
  }
];

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  const [activeIdx, setActiveIdx] = useState(0); // 0 = Intro slide, 1..5 = Historical years
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [waitingForScrollAtIntro, setWaitingForScrollAtIntro] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isFirstSlideChange = useRef(true);
  const activeIdxRef = useRef(0);
  const waitingForScrollRef = useRef(false);
  const hasTriggeredIntroPause = useRef(false);
  const hasResumedAfterIntro = useRef(false);

  // Keep refs updated for event listeners without causing audio re-instantiation
  useEffect(() => {
    activeIdxRef.current = activeIdx;
  }, [activeIdx]);

  useEffect(() => {
    waitingForScrollRef.current = waitingForScrollAtIntro;
  }, [waitingForScrollAtIntro]);

  // Initialize and keep playing the audio in the background seamlessly (ONLY ONCE ON MOUNT)
  useEffect(() => {
    const audio = new Audio('/sonidos/historia.m4a');
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleEnded = () => {
      setIsPlayingAudio(false);
    };

    // Timeupdate listener for exact timeline synchronization
    const handleTimeUpdate = () => {
      if (!audioRef.current) return;
      const time = audioRef.current.currentTime;

      // 1. At 23 seconds: Pause audio during intro, require user to slide down
      if (time >= 23 && time < 25 && !hasTriggeredIntroPause.current) {
        if (activeIdxRef.current === 0) {
          hasTriggeredIntroPause.current = true;
          audioRef.current.pause();
          setIsPlayingAudio(false);
          setWaitingForScrollAtIntro(true);
        }
      }

      // 2. At 35 seconds: Transition to Slide 2 (1944)
      if (time >= 35 && time < 58) {
        if (activeIdxRef.current < 2 && hasResumedAfterIntro.current) {
          scrollToSlide(2);
        }
      }

      // 3. At 58 seconds: Transition to Slide 3 (1977)
      if (time >= 58 && time < 76) {
        if (activeIdxRef.current < 3 && hasResumedAfterIntro.current) {
          scrollToSlide(3);
        }
      }

      // 4. At 1:16 (76s): Transition to Slide 4 (2021)
      if (time >= 76 && time < 93) {
        if (activeIdxRef.current < 4 && hasResumedAfterIntro.current) {
          scrollToSlide(4);
        }
      }

      // 5. At 1:33 (93s): Transition to Slide 5 (2026 / Presente & Futuro)
      if (time >= 93) {
        if (activeIdxRef.current < 5 && hasResumedAfterIntro.current) {
          scrollToSlide(5);
        }
      }
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    // Auto-attempt playback on component mount
    audio.play().then(() => {
      setIsPlayingAudio(true);
    }).catch(() => {
      // Browsers with strict autoplay policy will play on first touch/click
      setIsPlayingAudio(false);
    });

    const handleFirstUserInteraction = () => {
      if (audioRef.current && audioRef.current.paused && !waitingForScrollRef.current) {
        audioRef.current.play().then(() => {
          setIsPlayingAudio(true);
        }).catch(() => {});
      }
      window.removeEventListener('pointerdown', handleFirstUserInteraction);
      window.removeEventListener('scroll', handleFirstUserInteraction);
    };

    window.addEventListener('pointerdown', handleFirstUserInteraction, { once: true });
    window.addEventListener('scroll', handleFirstUserInteraction, { once: true });

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      window.removeEventListener('pointerdown', handleFirstUserInteraction);
      window.removeEventListener('scroll', handleFirstUserInteraction);
      audioRef.current = null;
    };
  }, []);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(() => {});
    }
  };

  // Play projector slide sound when scrolling between historical years (slides 1..5)
  useEffect(() => {
    if (activeIdx === 0) return;
    if (isFirstSlideChange.current) {
      isFirstSlideChange.current = false;
      return;
    }
    sound.playProjectorSlide();
  }, [activeIdx]);

  // Resume audio when user progresses to historical slides (slide >= 1)
  const handleSlideProgression = (newIndex: number) => {
    if (newIndex >= 1) {
      setWaitingForScrollAtIntro(false);
      hasResumedAfterIntro.current = true;
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlayingAudio(true);
        }).catch(() => {});
      }
    }
  };

  // Handle scroll snap to detect current active slide index (0 = Intro, 1..5 = Years)
  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollPos = containerRef.current.scrollTop;
    const slideHeight = containerRef.current.clientHeight;
    const newIdx = Math.round(scrollPos / slideHeight);
    if (newIdx !== activeIdx && newIdx >= 0 && newIdx <= HISTORICAL_SLIDES.length) {
      setActiveIdx(newIdx);
      handleSlideProgression(newIdx);
    }
  };

  const scrollToSlide = (index: number) => {
    if (!containerRef.current) return;
    sound.playClick();
    const slideHeight = containerRef.current.clientHeight;
    containerRef.current.scrollTo({
      top: index * slideHeight,
      behavior: 'smooth'
    });
    handleSlideProgression(index);
  };

  return (
    <div className="relative h-screen w-screen bg-navy-950 text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      {/* 1. Minimalist Floating Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4 sm:p-5 flex items-center justify-between pointer-events-none">
        <button
          onClick={() => { sound.playClick(); onNavigate('home'); }}
          className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white pointer-events-auto active:scale-95 transition-all backdrop-blur-md"
          aria-label="Volver a Inicio"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Subtle Audio Toggle Pill */}
          <button
            onClick={toggleAudio}
            className={`px-3 py-1.5 rounded-full border flex items-center gap-2 transition-all backdrop-blur-md active:scale-95 ${
              isPlayingAudio
                ? 'bg-brand-cyan/20 border-brand-cyan/60 text-brand-cyan shadow-glow-cyan/30'
                : 'bg-black/40 border-white/20 text-slate-400'
            }`}
            title={isPlayingAudio ? 'Silenciar narración' : 'Activar narración de audio'}
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-4 h-4 text-brand-cyan animate-pulse" />
                <div className="flex gap-0.5 items-end h-2.5">
                  <span className="w-0.5 bg-brand-cyan rounded-full animate-bounce" style={{ height: '100%', animationDelay: '0ms' }}></span>
                  <span className="w-0.5 bg-brand-cyan rounded-full animate-bounce" style={{ height: '60%', animationDelay: '150ms' }}></span>
                  <span className="w-0.5 bg-brand-cyan rounded-full animate-bounce" style={{ height: '85%', animationDelay: '300ms' }}></span>
                </div>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {waitingForScrollAtIntro ? 'Pausa' : 'Audio'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Floating Timeline Navigation Dots (Right Side) */}
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5 pointer-events-auto">
        {/* Intro Dot (Index 0) */}
        <button
          onClick={() => scrollToSlide(0)}
          className="group flex items-center gap-2 justify-end transition-all"
          aria-label="Ir a la Introducción"
        >
          <span className={`text-[9px] font-black tracking-wider transition-all duration-300 ${
            activeIdx === 0 ? 'text-brand-cyan opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'
          }`}>
            INTRO
          </span>
          <div className={`rounded-full transition-all duration-300 ${
            activeIdx === 0
              ? 'w-2.5 h-6 bg-brand-cyan shadow-[0_0_10px_rgba(0,184,255,0.8)]'
              : 'w-2 h-2 bg-white/40 group-hover:bg-white/80'
          }`} />
        </button>

        {/* Years Dots (Index 1..5) */}
        {HISTORICAL_SLIDES.map((event, idx) => {
          const slideIndex = idx + 1;
          const isActive = slideIndex === activeIdx;

          return (
            <button
              key={event.id}
              onClick={() => scrollToSlide(slideIndex)}
              className="group flex items-center gap-2 justify-end transition-all"
              aria-label={`Ir a ${event.year}`}
            >
              <span className={`text-[9px] font-black tracking-wider transition-all duration-300 ${
                isActive ? 'text-brand-cyan opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'
              }`}>
                {event.year}
              </span>
              <div
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-2.5 h-6 bg-brand-cyan shadow-[0_0_10px_rgba(0,184,255,0.8)]'
                    : 'w-2 h-2 bg-white/40 group-hover:bg-white/80'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* 3. Fullscreen Vertical Scroll Snap Stream */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* =========================================================================
            SLIDE 0: MINIMALIST CINEMATIC INTRO WITH SLOW FADE ANIMATIONS
           ========================================================================= */}
        <div className="relative w-full h-screen snap-start flex flex-col justify-between p-6 sm:p-8 pb-16 overflow-hidden">
          {/* Uiverse Stars Background */}
          <div className="stars-container pointer-events-none">
            <div id="stars" />
            <div id="stars2" />
            <div id="stars3" />
          </div>

          {/* Top spacing with Slow Fade Badge */}
          <div className="pt-12 text-center animate-intro-badge">
            <span className="text-[11px] font-black text-brand-cyan uppercase tracking-[0.35em] drop-shadow-[0_2px_10px_rgba(34,211,238,0.5)]">
              INPRES · SAN JUAN
            </span>
          </div>

          {/* Giant Minimalist Typography Title (Slow Entrance Animations) */}
          <div className="relative z-20 my-auto text-center space-y-4 max-w-md mx-auto">
            <div className="animate-intro-title">
              <h1 className="font-black text-5xl sm:text-7xl text-white tracking-tight uppercase leading-none drop-shadow-[0_8px_40px_rgba(0,0,0,0.95)]">
                MEMORIA & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-sky-300 to-brand-electric">
                  RESILIENCIA
                </span>
              </h1>
            </div>

            <div className="animate-intro-desc">
              <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] max-w-sm mx-auto">
                Un viaje por los sismos que forjaron la ingeniería, la ciencia y el coraje de nuestra provincia.
              </p>
            </div>
          </div>

          {/* Bottom spacing (Clean & Minimalist, no redundant text) */}
          <div className="relative z-20 h-6"></div>
        </div>

        {/* =========================================================================
            SLIDES 1..5: HISTORICAL PHOTO SLIDES (Pure Minimalist Overlaid Typography)
           ========================================================================= */}
        {HISTORICAL_SLIDES.map((event, idx) => {
          const slideIndex = idx + 1;
          const isActive = slideIndex === activeIdx;

          return (
            <div
              key={event.id}
              className="relative w-full h-screen snap-start flex flex-col justify-end p-6 sm:p-8 pb-20 overflow-hidden"
            >
              {/* Fullscreen Historical Image with Ken Burns slow zoom */}
              <div
                className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[12000ms] ease-out pointer-events-none z-0 ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                style={{ backgroundImage: `url('${event.imagePath}')` }}
              />

              {/* Dark Gradient Vignette for perfect text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/55 z-0 pointer-events-none" />

              {/* Minimalist Typographic Layout (No boxes) */}
              <div className={`relative z-20 space-y-3 max-w-md mx-auto w-full transition-all duration-700 transform ${
                isActive ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}>
                {/* Year Marker */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-3">
                    <span className={`font-black text-6xl sm:text-7xl tracking-tighter block leading-none font-mono drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] ${
                      event.isCurrentEra ? 'text-brand-electric' : 'text-brand-cyan'
                    }`}>
                      {event.year}
                    </span>
                    {event.isCurrentEra && (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan font-black text-[9px] uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" /> PRESENTE
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] font-black text-brand-gold tracking-[0.2em] uppercase drop-shadow-md">
                    📍 {event.location} · {event.dateStr}
                  </div>
                </div>

                {/* Event Title & Technical Stats */}
                <div className="space-y-1">
                  <h2 className="font-black text-xl sm:text-2xl text-white tracking-tight uppercase leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                    {event.title}
                  </h2>

                  <p className="text-xs font-bold text-slate-300 drop-shadow-md">
                    {event.stats}
                  </p>
                </div>

                {/* Narrative Description (Directly over the image) */}
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] max-w-sm">
                  {event.description}
                </p>

                {/* Next Slide Arrow Indicator */}
                {slideIndex < HISTORICAL_SLIDES.length && (
                  <div className="pt-2 text-center">
                    <button
                      onClick={() => scrollToSlide(slideIndex + 1)}
                      className="mx-auto w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-95 transition-all animate-bounce shadow-lg"
                      aria-label="Siguiente hito"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          4. MINIMALIST CENTERED FULLSCREEN OVERLAY AT 23 SECONDS (No generic emojis/icons)
         ========================================================================= */}
      {waitingForScrollAtIntro && (
        <div
          onClick={() => scrollToSlide(1)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500 cursor-pointer select-none"
        >
          <div className="space-y-8 max-w-sm mx-auto flex flex-col items-center">
            {/* Pure minimalist animated vertical indicator line */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-brand-cyan to-transparent animate-pulse" />
              <ChevronDown className="w-6 h-6 text-brand-cyan animate-bounce stroke-[2.5]" />
            </div>

            {/* Minimalist Typographic Instruction */}
            <div className="space-y-3">
              <h3 className="font-black text-2xl sm:text-3xl text-white uppercase tracking-[0.25em] leading-tight">
                DESLIZÁ HACIA ABAJO
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wider uppercase">
                Para continuar con el relato histórico
              </p>
            </div>

            {/* Subtle animated touch pill */}
            <div className="pt-2">
              <span className="inline-block px-5 py-2 rounded-full border border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan text-[11px] font-bold tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(0,184,255,0.25)]">
                TOCÁ O DESLIZÁ
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
