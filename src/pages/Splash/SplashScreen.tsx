import React, { useState, useEffect } from 'react';
import { sound } from '../../lib/sound';
import { signInWithGoogle } from '../../services/authService';
import { useLanguage, LanguageToggle } from '../../i18n/LanguageContext';
import { UserProfile } from '../../types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  user?: UserProfile;
  onLoginSuccess: (nickname: string) => void;
  onContinue?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ user, onLoginSuccess, onContinue }) => {
  const { t, language } = useLanguage();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [interactiveOffset, setInteractiveOffset] = useState({ x: 0, y: 0 });

  const hasExistingSession = Boolean(user && (user.auth_user_id || user.has_completed_onboarding || user.total_score > 0));

  // Interactive mouse move parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 24;
    const y = (e.clientY / innerHeight - 0.5) * 24;
    setInteractiveOffset({ x, y });
  };

  // Device orientation parallax for mobile
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const x = Math.min(20, Math.max(-20, e.gamma * 0.6));
        const y = Math.min(20, Math.max(-20, (e.beta - 45) * 0.6));
        setInteractiveOffset({ x, y });
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  const handleGoogleAuth = async () => {
    sound.playClick();
    setIsLoggingIn(true);
    const res = await signInWithGoogle();
    if (res.error) {
      alert(language === 'es' ? `Error al conectar con Google: ${res.error}` : `Error connecting with Google: ${res.error}`);
    }
    setIsLoggingIn(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between p-6 sm:p-8 select-none font-sans"
    >
      {/* LAYER 1: Deep Background Image with Continuous Ken Burns Parallax Drift & Mouse Reaction */}
      <div
        className="absolute -inset-12 bg-cover bg-center animate-bg-parallax will-change-transform"
        style={{
          backgroundImage: `url('/images/fondologin.webp')`,
          transform: `translate(${interactiveOffset.x * -1.2}px, ${interactiveOffset.y * -1.2}px)`,
          transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      />

      {/* LAYER 2: Cinematic Vignette & Radial Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/75 via-navy-900/35 to-navy-950/90 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#061426_90%)] pointer-events-none" />

      {/* LAYER 3: Floating Cosmic Depth Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-brand-cyan/10 blur-2xl animate-particle-1" />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full bg-brand-electric/10 blur-3xl animate-particle-2" />
        <div className="absolute bottom-1/3 left-1/3 w-28 h-28 rounded-full bg-brand-purple/15 blur-2xl animate-particle-3" />
      </div>

      {/* LAYER 4: Top Brand Indicator with Language Toggle */}
      <div
        className="relative z-20 pt-4 flex items-center justify-between will-change-transform max-w-sm mx-auto w-full"
        style={{
          transform: `translate(${interactiveOffset.x * 0.4}px, ${interactiveOffset.y * 0.4}px)`,
          transition: 'transform 0.35s ease-out',
        }}
      >
        <span className="text-[11px] font-black text-brand-cyan uppercase tracking-[0.25em] drop-shadow-[0_2px_10px_rgba(34,211,238,0.5)]">
          {t.splash.tagline}
        </span>

        <LanguageToggle compact />
      </div>

      {/* LAYER 5: Center Focal Typography with Breathing Aura & 3D Layering */}
      <div
        className="relative z-20 my-auto text-center space-y-3 will-change-transform py-4"
        style={{
          transform: `translate(${interactiveOffset.x * 0.8}px, ${interactiveOffset.y * 0.8}px)`,
          transition: 'transform 0.35s ease-out',
        }}
      >
        {/* Glowing Aura Behind Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-electric/15 rounded-full blur-3xl animate-aura-breath pointer-events-none" />

        <div className="relative space-y-1.5">
          <h1 className="font-black text-5xl sm:text-6xl md:text-7xl text-white tracking-tight leading-none uppercase drop-shadow-[0_6px_35px_rgba(0,0,0,0.9)]">
            SISMO <span className="text-brand-electric">LAB</span>
          </h1>

          <p className="text-lg sm:text-xl text-brand-cyan font-extrabold tracking-wide drop-shadow-[0_2px_15px_rgba(34,211,238,0.4)]">
            {t.splash.subtitle}
          </p>
        </div>
      </div>

      {/* LAYER 6: Bottom Action Panel */}
      <div
        className="relative z-20 pb-6 max-w-sm mx-auto w-full space-y-3 will-change-transform"
        style={{
          transform: `translate(${interactiveOffset.x * 0.5}px, ${interactiveOffset.y * 0.5}px)`,
          transition: 'transform 0.35s ease-out',
        }}
      >
        <div className="space-y-2.5">
          {/* If user already has an active session or profile, show direct Resume Button */}
          {hasExistingSession && onContinue && (
            <button
              onClick={() => {
                sound.playClick();
                onContinue();
              }}
              className="relative overflow-hidden w-full h-14 bg-gradient-to-r from-brand-electric to-brand-cyan hover:from-brand-blue hover:to-brand-electric text-navy-950 font-black rounded-pill flex items-center justify-between px-6 text-base shadow-glow-cyan transition-all active:scale-[0.98] border border-cyan-300/40 group mb-2"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{user?.avatar_emoji || '🦅'}</span>
                <span className="font-black text-sm tracking-wide">
                  {language === 'es' ? `Continuar como ${user?.nickname}` : `Continue as ${user?.nickname}`}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
            </button>
          )}

          {/* Primary Google Login Button with Shimmer Sheen */}
          <button
            onClick={handleGoogleAuth}
            disabled={isLoggingIn}
            className={`relative overflow-hidden w-full h-14 bg-white hover:bg-slate-100 text-navy-950 font-black rounded-pill flex items-center justify-center gap-3 text-base shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all active:scale-[0.98] border border-white/60 group ${
              hasExistingSession ? 'opacity-90 hover:opacity-100 text-xs h-11' : ''
            }`}
          >
            {/* Shimmer Light Reflection Sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer pointer-events-none" />

            <svg className="w-5 h-5 shrink-0 relative z-10" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span className="relative z-10">
              {isLoggingIn
                ? t.splash.loggingIn
                : hasExistingSession
                ? (language === 'es' ? 'Cambiar de Cuenta con Google' : 'Switch Google Account')
                : t.splash.googleLogin}
            </span>
          </button>
        </div>

        {/* Footer Credit */}
        <p className="text-[10px] text-slate-400 text-center font-medium pt-1">
          {t.splash.developedBy}
        </p>
      </div>
    </div>
  );
};

