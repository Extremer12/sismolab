import React, { useState, useEffect } from 'react';
import { Download, X, Share2, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSTips, setShowIOSTips] = useState(false);

  useEffect(() => {
    // Check if already installed / running in standalone mode
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    
    if (isStandaloneMode) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIOSDevice);

    // Check if user previously dismissed banner in this session
    const dismissed = sessionStorage.getItem('pwa_prompt_dismissed');
    if (dismissed) return;

    // Android / Desktop Chrome PWA prompt listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If iOS and not installed, show after 3 seconds
    if (isIOSDevice && !isStandaloneMode) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSTips(true);
      return;
    }

    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsVisible(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (isStandalone || !isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto animate-in slide-in-from-bottom-5 duration-300">
      <div className="relative bg-navy-900/95 backdrop-blur-xl border border-brand-cyan/30 rounded-2xl p-4 shadow-2xl shadow-cyan-950/60 flex flex-col gap-3">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <img
            src="/images/icono.png"
            alt="SISMO LAB"
            className="w-12 h-12 rounded-xl shadow-md border border-brand-cyan/20 object-cover"
          />
          <div className="flex-1 pr-6">
            <h4 className="font-extrabold text-white text-sm tracking-tight flex items-center gap-1.5">
              Instalá SISMO LAB
              <span className="text-[10px] uppercase font-black tracking-widest bg-brand-cyan/20 text-brand-cyan px-2 py-0.5 rounded-full">
                App Móvil
              </span>
            </h4>
            <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
              Jugá sin conexión, pantalla completa y acceso rápido.
            </p>
          </div>
        </div>

        {showIOSTips ? (
          <div className="bg-navy-950/80 rounded-xl p-3 border border-white/10 text-xs text-slate-200 flex flex-col gap-1.5 animate-in fade-in">
            <p className="font-bold text-brand-cyan flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" /> Pasos para instalar en iPhone/iPad:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
              <li>Tocá el botón <strong>Compartir</strong> <Share2 className="inline w-3 h-3 text-brand-cyan" /> en Safari.</li>
              <li>Deslizá hacia abajo y seleccioná <strong>"Agregar a Inicio"</strong>.</li>
            </ol>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-gradient-to-r from-brand-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-black text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
            >
              {isIOS ? (
                <>
                  <Smartphone className="w-4 h-4" />
                  ¿Cómo Instalar en iPhone?
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Instalar en el Teléfono
                </>
              )}
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-200 rounded-xl transition-colors"
            >
              Ahora no
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
